/**
 * Hides post video suggestions.
 */

import CSS_NOSIZE from "./common/nosize.css?raw";
import register_ui_hider from "./common/register_ui_hider";

(() => {
    /**
     * Name of the remove shorts feed feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_postvid_suggestions";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register shorts feed hider.
    const hider = document.createElement("style");
    hider.textContent = `.ytp-fullscreen-grid-stills-container:has(a.ytp-suggestion-set) ${CSS_NOSIZE}`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
