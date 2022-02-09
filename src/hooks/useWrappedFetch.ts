import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@chakra-ui/react";

const useWrappedFetch = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const showToast = useToast();

  const wrappedFetch = useCallback(
    async (...[input, info]: Parameters<typeof fetch>) => {
      try {
        const token = isAuthenticated ? await getAccessTokenSilently() : null;

        const response = await fetch(input, {
          ...info,
          headers: {
            ...(token ? { authorization: `Bearer ${token}` } : {}),
            ...(info?.body ? { "content-type": "application/json" } : {}),
            ...info?.headers,
          },
        });

        if (!response.ok) {
          const body = await response.json();
          throw new Error(body.error || "Request Error");
        }

        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          return response.json();
        }

        return response.text();
      } catch (error) {
        showToast({
          title: "Error",
          description: error instanceof Error ? error.message : undefined,
          status: "error",
          isClosable: true,
          containerStyle: { fontSize: 14 },
        });

        throw error;
      }
    },
    [isAuthenticated, getAccessTokenSilently, showToast]
  );

  return wrappedFetch;
};

export default useWrappedFetch;
