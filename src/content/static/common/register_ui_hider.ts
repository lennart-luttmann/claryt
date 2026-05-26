import { error_invalid_context_ignore } from "$/util/error_util";

/**
 * Constructs a mutation observer, reruns hider injection on relevant dashboard state change and registered callback with
 * `yt-navigate-finish`.
 */
export default function register_ui_hider(
    hider: HTMLStyleElement,
    flag: string,
    observer_timeout_duration: number,
): MutationObserver {
    // Construct hider injection callback.
    const inject_hider = () => {
        try {
            chrome.storage.sync.get(flag).then((feature_flag) => {
                if (!!feature_flag[flag]) {
                    document.documentElement.appendChild(hider);
                } else if (document.documentElement.contains(hider)) {
                    document.documentElement.removeChild(hider);
                }
            });
        } catch (error) {
            error_invalid_context_ignore(error);
        }
    };

    // Inject hider on startup.
    inject_hider();

    // Construct observer.
    let observer_timeout: number | undefined;
    const observer = new MutationObserver(() => {
        clearTimeout(observer_timeout_duration);
        observer_timeout = setTimeout(inject_hider, 2000);
    });

    // Catch invalidated extension context.
    try {
        // Start observer
        observer.observe(hider, { attributes: true, characterData: true });

        // Rerun on dashboard state change.
        chrome.storage.sync.onChanged.addListener((changes) => {
            if (flag in changes) {
                inject_hider();
            }
        });

        window.addEventListener("yt-navigate-finish", () => {
            inject_hider();
        });
    } catch (error) {
        error_invalid_context_ignore(error);
    }

    return observer;
}
