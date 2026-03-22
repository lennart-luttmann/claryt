import { getFeatureFlag } from "$/background/storage_cache";

function feed_watchdog() {
    if (!getFeatureFlag("feed_watchdog")) {
        return;
    }
    document.querySelectorAll("ytm-shorts-lockup-view-model-v2").forEach((el) => el.closest("ytd-rich-shelf-renderer")?.remove());
}
feed_watchdog();

let timeout: number | undefined;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(feed_watchdog, 200);
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
