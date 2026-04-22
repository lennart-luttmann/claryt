/**
 * Background service that automatically redirects away from unwanted links.
 */

import { async_get_feature_flag } from "./storage_cache";

/**
 * Regex to detect YouTube shorts URLs.
 */
const SHORTS_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/shorts(\/|\?|$)/;

/**
 * URL to redirect to.
 */
const YOUTUBE_HOMEPAGE_URL = "https://www.youtube.com";

// Register listener for url updates.
chrome.tabs.onUpdated.addListener(async (tab_id, change_info, _) => {
    // Redirect away from Youtube Shorts URLs.
    if (!!(await async_get_feature_flag("url_deny_shorts"))) {
        // Check whether url is null.
        const url = change_info.url;
        if (!url) {
            return;
        }

        // Redirect to homepage.
        if (SHORTS_URL_REGEX.test(url)) {
            console.debug("Detected shorts url. Redirecting...");
            chrome.tabs.update(tab_id, { url: YOUTUBE_HOMEPAGE_URL });
        }
    }
});
