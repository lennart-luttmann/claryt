/**
 * This content script removes unwanted elements like the comment section from Youtube watch pages.
 */

import { error_invalid_context_ignore } from "$/util/error_util";
import { CSS_NOSIZE } from "$/util/style_util";

(() => {
    /**
     * Timeout duration of the watchdog observer in milliseconds.
     */
    const OBSERVER_TIMEOUT = 2000;

    /**
     * Name of the remove watch-next feature flag.
     */
    const RM_WATCH_NEXT_FEATURE_FLAG = "feature_flag.rm_watch_next";

    /**
     * Name of the remove comment feature flag.
     */
    const RM_COMMENTS_FEATURE_FLAG = "feature_flag.rm_comments";

    // Construct watch-next hider.
    const watch_next_hider = document.createElement("style");
    watch_next_hider.textContent = `#secondary:has(.ytd-watch-next-secondary-results-renderer) ${CSS_NOSIZE}`;

    // Construct comment hider.
    const comment_hider = document.createElement("style");
    comment_hider.textContent = `#comments ${CSS_NOSIZE}`;

    /**
     * Hide or show the watch-next sction via style injection.
     */
    function manage_watch_next_hider() {
        try {
            // Remove or restore watch-next.
            chrome.storage.sync
                .get(RM_WATCH_NEXT_FEATURE_FLAG)
                .then((feature_flag) => {
                    if (!!feature_flag[RM_WATCH_NEXT_FEATURE_FLAG]) {
                        document.documentElement.appendChild(watch_next_hider);
                    } else if (document.documentElement.contains(watch_next_hider)) {
                        document.documentElement.removeChild(watch_next_hider);
                    }
                })
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    /**
     * Hide or show the comment section via style injection.
     */
    function manage_comment_hider() {
        try {
            // Remove or restore comment section.
            chrome.storage.sync
                .get(RM_COMMENTS_FEATURE_FLAG)
                .then((feature_flag) => {
                    if (!!feature_flag[RM_COMMENTS_FEATURE_FLAG]) {
                        document.documentElement.appendChild(comment_hider);
                    } else if (document.documentElement.contains(comment_hider)) {
                        document.documentElement.removeChild(comment_hider);
                    }
                })
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    // Run on startup.
    manage_watch_next_hider();
    manage_comment_hider();

    // Run on quiet video load.
    window.addEventListener("yt-navigate-finish", () => {
        manage_watch_next_hider();
        manage_comment_hider();
    });

    // Build observers.
    let watch_next_hider_observer_timeout: number | undefined;
    let comment_hider_observer_timeout: number | undefined;
    const watch_next_hider_observer = new MutationObserver(() => {
        clearTimeout(watch_next_hider_observer_timeout);
        watch_next_hider_observer_timeout = setTimeout(manage_watch_next_hider, OBSERVER_TIMEOUT);
    });
    const comment_hider_observer = new MutationObserver(() => {
        clearTimeout(comment_hider_observer_timeout);
        comment_hider_observer_timeout = setTimeout(manage_comment_hider, OBSERVER_TIMEOUT);
    });

    // Start observers and run on dashboard state change.
    try {
        watch_next_hider_observer.observe(watch_next_hider, { attributes: true, characterData: true });
        comment_hider_observer.observe(comment_hider, { attributes: true, characterData: true });
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (RM_WATCH_NEXT_FEATURE_FLAG in changes) {
                manage_watch_next_hider();
            }
            if (RM_COMMENTS_FEATURE_FLAG in changes) {
                manage_comment_hider();
            }
        });
    } catch (error) {
        error_invalid_context_ignore(error);
    }
})();
