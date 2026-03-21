function feedwatcher() {
    document
        .querySelectorAll("ytm-shorts-lockup-view-model-v2")
        .forEach((el) => el.closest("ytd-rich-shelf-renderer")?.remove());
}
feedwatcher();

let timeout;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(feedwatcher, 200);
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
