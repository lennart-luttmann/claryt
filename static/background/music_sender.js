const YTMUSIC_HOMEPAGE_URL = "https://www.music.youtube.com";

function murect() {
    const murector = () => {
        document.querySelector('a[title="Music"]')?.remove();

        new MutationObserver(murector).observe(document.body, {
            childList: true,
            subtree: true,
        });
        murector();
        window.addEventListener("yt-navigate-finish", murector);
    };
}
