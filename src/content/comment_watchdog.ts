/**
 * The role of the comment watchdog is to remove the comment section from longform video pages.
 */

import { error_invalid_context_ignore } from "$/util/error_util";

(() => {
    /**
     * Selectors used to detect comment section renderers.
     */
    const COMMENT_SECTION_SELECTOR = "ytd-item-section-renderer.ytd-comments";

    /**
     * Regex to detect YouTube watch URLs.
     */
    const WATCH_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/watch(\/|\?|$)/;

    /**
     * Hides comment section from current html page.
     */
    function comment_watchdog() {
        try {
            // Check for feature flag state.
            chrome.storage.sync
                .get("feature_flag.comment_watchdog")
                .then((feature_flag) => {
                    if (!feature_flag["feature_flag.comment_watchdog"]) {
                        return;
                    }

                    // Check for watch URL
                    const url = window.location.href;
                    if (!url || !WATCH_URL_REGEX.test(url)) {
                        return;
                    }

                    // Remove comments.
                    document.querySelectorAll(COMMENT_SECTION_SELECTOR).forEach((element) => {
                        element.remove();
                    });
                })

                // Catch invalidated context errors.
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    // Run on startup.
    comment_watchdog();

    // Build observer.
    let comment_watchdog_timeout: number | undefined;
    const comment_watchdog_observer = new MutationObserver(() => {
        if (!chrome.runtime?.id) {
            comment_watchdog_observer.disconnect();
            return;
        }

        clearTimeout(comment_watchdog_timeout);
        comment_watchdog_timeout = setTimeout(comment_watchdog, 200);
    });
    try {
        comment_watchdog_observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Run observer if dashboard state changes.
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (chrome.runtime?.id && !!changes["feature_flag.comment_watchdog"]?.newValue) {
                comment_watchdog();
            }
        });

        // Catch invalidated context errors.
    } catch (error) {
        error_invalid_context_ignore(error);
    }
})();
