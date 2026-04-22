/**
 * This content script removes unwanted elements like the comment section from Youtube watch pages.
 */

import { error_invalid_context_ignore } from "$/util/error_util";

(() => {
    /**
     * Selector used to detect the watch next section of the yt watch page.
     */
    const WATCH_NEXT_SELECTOR = "ytd-watch-next-secondary-results-renderer";

    /**
     * Selectors used to detect comment section renderers.
     */
    const COMMENT_SECTION_SELECTOR = "ytd-item-section-renderer.ytd-comments";

    /**
     * Regex to detect YouTube watch URLs.
     */
    const WATCH_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/watch(\/|\?|$)/;

    /**
     * Checks whether the current url is a YouTube watch url.
     */
    function check_is_ytwatch() {
        const url = window.location.href;
        return !!url && WATCH_URL_REGEX.test(url);
    }

    /**
     * Hides comment section from current html page.
     */
    function watchdog() {
        try {
            // Remove watch-next.
            chrome.storage.sync
                .get("feature_flag.rm_watch_next")
                .then((feature_flag) => {
                    if (check_is_ytwatch() && !!feature_flag["feature_flag.rm_watch_next"]) {
                        document.querySelectorAll(WATCH_NEXT_SELECTOR).forEach((element) => {
                            element.remove();
                        });
                    }
                })
                .catch(error_invalid_context_ignore);

            // Remove comment section.
            chrome.storage.sync
                .get("feature_flag.rm_comments")
                .then((feature_flag) => {
                    if (check_is_ytwatch() && !!feature_flag["feature_flag.rm_comments"]) {
                        document.querySelectorAll(COMMENT_SECTION_SELECTOR).forEach((element) => {
                            element.remove();
                        });
                    }
                })
                .catch(error_invalid_context_ignore);
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    }

    // Run on startup.
    watchdog();

    // Build observer.
    let watchdog_timeout: number | undefined;
    const watchdog_observer = new MutationObserver(() => {
        if (!chrome.runtime?.id) {
            watchdog_observer.disconnect();
            return;
        }

        clearTimeout(watchdog_timeout);
        watchdog_timeout = setTimeout(watchdog, 200);
    });
    try {
        watchdog_observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Run observer if dashboard state changes.
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (chrome.runtime?.id && !!changes["feature_flag.comment_watchdog"]?.newValue) {
                watchdog();
            }
        });
    } catch (error) {
        error_invalid_context_ignore(error);
    }
})();
