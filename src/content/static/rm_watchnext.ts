/**
 * Hides the watch next video recommendations next to videos.
 */

import register_ui_hider from "./common/register_ui_hider";
import CSS_NOSIZE from "./common/nosize.css?raw";

(() => {
    /**
     * Name of the remove watch-next feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_watch_next";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register hider.
    const hider = document.createElement("style");
    hider.textContent = `#secondary:has(.ytd-watch-next-secondary-results-renderer) ${CSS_NOSIZE}`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
