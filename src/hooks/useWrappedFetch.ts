import { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useToast } from "@chakra-ui/react";

/**
 * A custom hook that wraps the native `fetch` function, automatically
 * authorizes the requests, parses the responses, along with handling
 * the request errors.
 */
const useWrappedFetch = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const showToast = useToast();

  const wrappedFetch = useCallback(
    async (...[input, info]: Parameters<typeof fetch>) => {
      try {
        // Get the token if the user is authenticated
        const token = isAuthenticated ? await getAccessTokenSilently() : null;

        const response = await fetch(input, {
          ...info,
          headers: {
            // Add authorization header if an access token is available
            ...(token ? { authorization: `Bearer ${token}` } : {}),
            // If there's any body, add the content-type header
            ...(info?.body ? { "content-type": "application/json" } : {}),
            // Pass the rest of the header untouched
            ...info?.headers,
          },
        });

        // Throw an error if the response status is not in the 2xx range
        if (!response.ok) {
          const body = await response.json();
          throw new Error(body.error || "Request Error");
        }

        // Automatically parse the response as JSON if the content-type is JSON
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          return response.json();
        }

        // Parse as text otherwise
        return response.text();
      } catch (error) {
        // Show an error toast if the request failed
        showToast({
          title: "Error",
          description: error instanceof Error ? error.message : undefined,
          status: "error",
          isClosable: true,
          containerStyle: { fontSize: 14 },
        });

        // Throw the error to let the caller handle it
        throw error;
      }
    },
    [isAuthenticated, getAccessTokenSilently, showToast]
  );

  return wrappedFetch;
};

export default useWrappedFetch;
