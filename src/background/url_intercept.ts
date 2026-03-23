/**
 * Background service that automatically redirects away from any youtube shorts link.
 */

import { asyncGetFeatureFlag } from "./storage_cache";

/** Regex to detect YouTube shorts URLs. */
const SHORT_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/shorts(\/|$)/;

/** URL to redirect to. */
const YOUTUBE_HOMEPAGE_URL = "https://www.youtube.com";

// Register listener for url updates.
chrome.tabs.onUpdated.addListener(async (tab_id, change_info, _) => {
    // Check whether feature flag is enabled.
    if (!(await asyncGetFeatureFlag("url_intercept"))) {
        console.debug("The URL updated but url_intercept is disabled.");
        return;
    }

    // Log event.
    const url = change_info.url;
    console.debug(`Detected url change in tab ${tab_id} to url ${url}.`);

    // Ensure target url exists.
    if (!url) {
        return;
    }

    // Redirect to Youtube homepage if url is a shorts url.
    if (SHORT_URL_REGEX.test(url)) {
        console.debug("Detected shorts url. Redirecting...");
        chrome.tabs.update(tab_id, { url: YOUTUBE_HOMEPAGE_URL });
    }
});
