import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import App from "./App";
import theme from "./theme";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Auth0Provider
    domain="cs467-capstone.us.auth0.com"
    clientId="PElCbu5d3AwU8MDQ7gJv2jmVY8Gxf3Cz"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </React.StrictMode>
  </Auth0Provider>
);
