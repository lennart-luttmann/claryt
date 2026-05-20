/**
 * Hides paid content like movies from the feed.
 */

import CSS_NOSIZE from "./common/nosize.css?raw";
import register_ui_hider from "./common/register_ui_hider";

(() => {
    /**
     * Name of the remove shorts feed feature flag.
     */
    const FEATURE_FLAG = "feature_flag.rm_paid_content";

    /**
     * Duration of observer timeout in milliseconds.
     */
    const OBSERVER_TIMEOUT_DURATION = 2000;

    // Construct and register shorts feed hider.
    const hider = document.createElement("style");
    hider.textContent = `
/* Hides paid content like movies and premium only shows. */
ytd-movie-renderer,
ytd-video-renderer:has(badge-shape.ytBadgeShapePremium),
ytd-video-renderer:has(badge-shape.ytBadgeShapeCommerce)
${CSS_NOSIZE}
`;
    register_ui_hider(hider, FEATURE_FLAG, OBSERVER_TIMEOUT_DURATION);
})();
