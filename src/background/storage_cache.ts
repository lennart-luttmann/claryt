import features from "$/features.json";

/** Prefix used to mark feature flags in chrome storage. */
const FEATURE_FLAG_PREFIX = "feature_flag.";

// Extract default keys and initial values.
const default_feature_flag_states: Record<string, boolean> = Object.fromEntries(
    features.map((f) => ["feature_flag." + f.flag, f.enabled]),
);

// Set default values in storage.
const feature_flag_storage_init_promise = chrome.storage.sync.get().then((storage_feature_flags) => {
    console.debug("Retrieved stored feature flag states: ", storage_feature_flags);
    const stored: Record<string, boolean> =
        Object.fromEntries(Object.entries(storage_feature_flags).filter(([key]) => key.startsWith(FEATURE_FLAG_PREFIX))) ?? {};
    chrome.storage.sync.set({ ...default_feature_flag_states, ...stored });
});

/** Get the current state of a feature flag.*/
async function async_get_feature_flag(flag: string): Promise<boolean> {
    await feature_flag_storage_init_promise;
    return (await chrome.storage.sync.get(FEATURE_FLAG_PREFIX + flag))[FEATURE_FLAG_PREFIX + flag] ?? false;
}

export { async_get_feature_flag, feature_flag_storage_init_promise };
