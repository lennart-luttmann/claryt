/**
 * Hides sponsored content from the feed. Not needed with an ad blocker.
 */

import CSS_NOSIZE from "./common/nosize.css?raw";
import register_ui_hider from "./common/register_ui_hider";

(() => {
    /**
     * Name of the remove shorts feed feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_sponsored_content";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register shorts feed hider.
    const hider = document.createElement("style");
    hider.textContent = `
/* Hides sponsored content from the feed. */
ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
ytd-ad-slot-renderer
${CSS_NOSIZE}
`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
