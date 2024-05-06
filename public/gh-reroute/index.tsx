import { convertUrlToQueryStringPath } from "../../website/utils/gh_route_utils";

// Hide the default 404 page content and just show a blank screen.
// The content should only be shown if the browser doesn't support JavaScript.
document.body.innerHTML = "";

// This script is used in the 404.html page to redirect the browser to the correct URL.
// Convert the current URL to a query string path and redirect the browser.
const location = window.location;
const locationUrl = new URL(location.toString());
const newUrl = convertUrlToQueryStringPath(locationUrl, 1);
location.replace(newUrl);
console.log("Redirecting to " + newUrl.toString());
