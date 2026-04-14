/**
 * The role of the feed watchdog is to remove shorts from the youtube homepage feed.
 */

import { error_invalid_context_ignore } from "$/util/error_util";

(() => {
    function feed_watchdog() {
        try {
            // Check dashboard flag state.
            chrome.storage.sync
                .get("feature_flag.feed_watchdog")
                .then((feature_flag) => {
                    if (!feature_flag["feature_flag.feed_watchdog"]) return;

                    // Remove shorts from html.
                    document
                        .querySelectorAll("ytm-shorts-lockup-view-model-v2")
                        .forEach((el) => el.closest("ytd-rich-shelf-renderer")?.remove());
                })

                // Catch invalidated context errors.
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    // Run on startup.
    feed_watchdog();

    // Start observer.
    let timeout: number | undefined;
    const observer = new MutationObserver(() => {
        if (!chrome.runtime?.id) {
            observer.disconnect();
            return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(feed_watchdog, 200);
    });
    try {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Run the watchdog if the state of the feature flag toggle changes.
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (chrome.runtime?.id && !!changes["feature_flag.feed_watchdog"]?.newValue) {
                feed_watchdog();
            }
        });

        // Catch invalidated context errors.
    } catch (error) {
        error_invalid_context_ignore(error);
    }
})();
