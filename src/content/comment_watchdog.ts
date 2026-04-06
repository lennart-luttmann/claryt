/**
 * The role of the comment watchdog is to remove the comment section from longform video pages.
 */

(() => {
    /**
     * Error message thrown when extension context is invalidated.
     */
    const EXTENSION_CONTEXT_INVALIDATED_ERROR = "Extension context invalidated.";

    /**
     * Selectors used to detect comment section renderers.
     */
    const COMMENT_SECTION_SELECTOR = "ytd-item-section-renderer.ytd-comments";

    /**
     * Regex to detect YouTube watch URLs.
     */
    const WATCH_URL_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/;
    /**
     * Hides comment section from current html page.
     */
    function comment_watchdog() {
        // Assert runtime is still valid.
        if (!chrome.runtime?.id) {
            return;
        }

        // Check for dashboard flag state.
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

            // Catch invalidated extension context.
            .catch((error) => {
                if (!(error instanceof Error) || error.message !== EXTENSION_CONTEXT_INVALIDATED_ERROR) {
                    throw error;
                }
            });
    }
    comment_watchdog();

    // Run observer.
    let comment_watchdog_timeout: number | undefined;
    const comment_watchdog_observer = new MutationObserver(() => {
        clearTimeout(comment_watchdog_timeout);
        comment_watchdog_timeout = setTimeout(comment_watchdog, 200);
    });
    comment_watchdog_observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Run the watchdog if the state of the feature flag toggle changes.
    chrome.storage.sync.onChanged.addListener((changes) => {
        if (!!changes["feature_flag.comment_watchdog"]?.newValue) {
            comment_watchdog();
        }
    });
})();
