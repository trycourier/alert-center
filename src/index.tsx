import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }}
    >
      <ChakraProvider>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN || ""}
          clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ""}
          redirectUri={window.location.origin}
        >
          <App />
        </Auth0Provider>
      </ChakraProvider>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById("root")
);
