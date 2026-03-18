const SHORT_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/shorts(\/|$)/;
const YOUTUBE_HOMEPAGE_URL = "https://www.youtube.com";

chrome.tabs.onUpdated.addListener((tab_id, change_info, _) => {
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
