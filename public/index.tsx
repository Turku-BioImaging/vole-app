import React, { lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { decodeGitHubPagesUrl, isEncodedPathUrl, tryRemoveHashRouting } from "../website/utils/gh_route_utils";

import StyleProvider from "../src/aics-image-viewer/components/StyleProvider";

import "./App.css";

// Components
const AppWrapper = lazy(() => import("../website/components/AppWrapper"));
const ErrorPage = lazy(() => import("../website/components/ErrorPage"));
const LandingPage = lazy(() => import("../website/components/LandingPage"));

// vars filled at build time using webpack DefinePlugin
console.log(`vole-app ${VOLEAPP_BUILD_ENVIRONMENT} build`);
console.log(`vole-app Version ${VOLEAPP_VERSION}`);
console.log(`vole-app Basename ${VOLEAPP_BASENAME}`);
console.log(`vole-core Version ${VOLECORE_VERSION}`);

const basename = VOLEAPP_BASENAME;

// Decode URL path if it was encoded for GitHub pages or uses hash routing.
const locationUrl = new URL(window.location.toString());
if (locationUrl.hash !== "" || isEncodedPathUrl(locationUrl)) {
  const decodedUrl = tryRemoveHashRouting(decodeGitHubPagesUrl(locationUrl));
  const newRelativePath = decodedUrl.pathname + decodedUrl.search + decodedUrl.hash;
  console.log("Redirecting to " + newRelativePath);
  // Replaces the query string path with the original path now that the
  // single-page app has loaded. This lets routing work as normal below.
  window.history.replaceState(null, "", newRelativePath);
}

// TODO these components are now lazy loaded. Should they get `Suspense`s around them? What should we fall back to?
const routes = [
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "viewer",
    element: <AppWrapper />,
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(routes, { basename: basename });

const root = createRoot(document.getElementById("cell-viewer")!);
root.render(
  <StyleProvider>
    <RouterProvider router={router} />
  </StyleProvider>
);
