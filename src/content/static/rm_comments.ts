/**
 * Hides the comment section under videos.
 */

import CSS_NOSIZE from "./common/nosize.css?raw";
import register_ui_hider from "./common/register_ui_hider";

(() => {
    /**
     * Name of the feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_comments";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register comment hider.
    const hider = document.createElement("style");
    hider.textContent = `#comments ${CSS_NOSIZE}`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
