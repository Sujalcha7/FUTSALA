import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ChakraProvider>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ChakraProvider>
        </BrowserRouter>
    </React.StrictMode>
);
