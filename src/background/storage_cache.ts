import features from "$/features.json";

/** Synchronous cache for stored feature flag states. */
let feature_flag_cache: Record<string, boolean> = {};

/** Get the current state of a feature flag.*/
function getFeatureFlag(flag: string): boolean {
    return feature_flag_cache[flag] ?? false;
}

// Sync cache when storage updates.
chrome.storage.sync.onChanged.addListener((changes) => {
    console.debug("Registered change to sync storage: ", changes);
    feature_flag_cache = changes.feature_flags?.newValue ?? {};
});

// Merge stored feature flag states with defaults to account for fresh installed, added features or storage corruption.
const default_feature_flag_states: Record<string, boolean> = Object.fromEntries(features.map((f) => [f.flag, f.enabled]));
const feature_flag_storage_sync_promise = chrome.storage.sync.get("feature_flags", (result) => {
    console.debug("Retrieved stored feature flag states: ", result);
    const stored: Record<string, boolean> = result["feature_flags"] ?? {};
    feature_flag_cache = { ...default_feature_flag_states, ...stored };
    chrome.storage.sync.set({ feature_flags: feature_flag_cache });
});

export { getFeatureFlag, feature_flag_storage_sync_promise };
