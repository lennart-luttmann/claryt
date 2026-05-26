/**
 * Hides Shorts from the video feed.
 */

import register_ui_hider from "./common/register_ui_hider";
import CSS_NOSIZE from "./common/nosize.css?raw";

(() => {
    /**
     * Name of the remove shorts feed feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_shorts_feed";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register shorts feed hider.
    const hider = document.createElement("style");
    hider.textContent = `
/* Hides Shorts from the feed. */
.ytd-rich-shelf-renderer:has(ytm-shorts-lockup-view-model-v2),
grid-shelf-view-model:has(ytm-shorts-lockup-view-model-v2)
${CSS_NOSIZE}
`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
