/**
 * The role of the feed watchdog is to remove shorts from the youtube homepage feed.
 */

(() => {
    function feed_watchdog() {
        // Check dashboard flag state.
        chrome.storage.sync.get("feature_flag.feed_watchdog").then((feature_flag) => {
            if (!feature_flag["feature_flag.feed_watchdog"]) {
                return;
            }

            // Remove shorts from html.
            document
                .querySelectorAll("ytm-shorts-lockup-view-model-v2")
                .forEach((el) => el.closest("ytd-rich-shelf-renderer")?.remove());
        });
    }
    feed_watchdog();

    let timeout: number | undefined;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(feed_watchdog, 200);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Run the watchdog if the state of the feature flag toggle changes.
    chrome.storage.sync.onChanged.addListener((changes) => {
        if (!!changes["feature_flag.feed_watchdog"]?.newValue) {
            feed_watchdog();
        }
    });
})();
