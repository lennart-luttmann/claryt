import features from "../features.json";

/** Injected constant that shows whether the project was compiled in build or in dev mode.*/
declare const __DEV_MODE__: boolean;

// Load feature defaults to storage.
chrome.runtime.onInstalled.addListener(({ reason }) => {
    // Check event reason.
    if (reason != "install" && (!__DEV_MODE__ || reason != "update")) {
        return;
    }

    // Construct storage initializer.
    let storage_init: Record<string, boolean> = {};
    features.forEach((feature) => {
        storage_init[feature.flag] = feature.enabled;
    });

    // Initialize storage.
    chrome.storage.sync.set(storage_init);
});
