/**
 * This script removes unwanted elements like shorts from the homepage video feed and the watch next feed.
 */

import { error_invalid_context_ignore } from "$/util/error_util";
import { CSS_NOSIZE } from "$/util/style_util";

(() => {
    /**
     * Name of the remove shorts feed feature flag.
     */
    const RM_SHORTS_FEED_FEATURE_FLAG = "feature_flag.rm_shorts_feed";

    // Construct shorts feed hider.
    const shorts_feed_hider = document.createElement("style");
    shorts_feed_hider.textContent = `.ytd-rich-shelf-renderer:has(ytm-shorts-lockup-view-model-v2) ${CSS_NOSIZE}`;

    /**
     * Hides or restores shorts in the video feed via style injection.
     */
    function manage_shorts_feed_hider() {
        try {
            chrome.storage.sync
                .get(RM_SHORTS_FEED_FEATURE_FLAG)
                .then((feature_flag) => {
                    if (!!feature_flag[RM_SHORTS_FEED_FEATURE_FLAG]) {
                        document.documentElement.appendChild(shorts_feed_hider);
                    } else if (document.documentElement.contains(shorts_feed_hider)) {
                        document.documentElement.removeChild(shorts_feed_hider);
                    }
                })
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    // Run on startup.
    manage_shorts_feed_hider();

    // Construct observer.
    let shorts_feed_hider_observer_timeout: number | undefined;
    const shorts_feed_hider_observer = new MutationObserver(() => {
        clearTimeout(shorts_feed_hider_observer_timeout);
        shorts_feed_hider_observer_timeout = setTimeout(manage_shorts_feed_hider, 2000);
    });

    // Start observer and run on dashboard state change.
    try {
        shorts_feed_hider_observer.observe(shorts_feed_hider, { attributes: true, characterData: true });
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (RM_SHORTS_FEED_FEATURE_FLAG in changes) {
                manage_shorts_feed_hider();
            }
        });
    } catch (error) {
        error_invalid_context_ignore(error);
    }
})();
