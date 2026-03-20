function feedwatcher(){
    const items = document.querySelectorALL("ytd-rich-item-renderer, ytd-video-renderer, ytd-reel-shelf-renderer");

    shelf.forEach(el=> {
        if (el.querySelector(""'a[href*="/shorts/"]') || el.querySelector('ytd-thumbnail-overlay-time-status-renderer')){
            el.remove();
        }
    });
}
feedwatcher();


let timeout;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(feedwatcher, 200);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
