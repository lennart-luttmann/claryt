<script lang="ts">
    import { slide } from "svelte/transition";
    import features from "$/features.json";

    /** Prefix used to mark feature flags in chrome storage. */
    const FEATURE_FLAG_PREFIX = "feature_flag.";

    /** Length of chrome storage feature flag prefix. */
    const FEATURE_FLAG_PREFIX_LENGTH = "feature_flag.".length;

    let feature_flag_cache: Record<string, boolean> = {};
    let expanded_flag: string | null = null;
    let hovered_flag: string | null = null;

    // Cache feature flag values.
    chrome.storage.sync.get().then((storage_feature_flags) => {
        feature_flag_cache = Object.fromEntries(
            Object.entries(storage_feature_flags)
                .filter(([key]) => key.startsWith(FEATURE_FLAG_PREFIX))
                .map(([key, value]) => [key.substring(FEATURE_FLAG_PREFIX_LENGTH), value]),
        );
    });

    /** Update the stored value of a flag with the cache. */
    function sync_feature_storage(flag: string) {
        console.log(`Switched toggle state for flag [${flag}] to [${feature_flag_cache[flag]}].`);
        chrome.storage.sync.set({ [FEATURE_FLAG_PREFIX + flag]: feature_flag_cache[flag] });
    }

    /** Toggle  descriptor dropdown on a feature. */
    function toggle_description(flag: string) {
        expanded_flag = expanded_flag === flag ? null : flag;
    }
</script>

<div class="container">
    <h1 class="title">ClarYT Dashboard</h1>

    {#each features as feature, i}
        {#if i > 0}<hr class="separator" />{/if}
        <div class="feature-row">
            <span class="feature-name">
                {feature.name}
                <button
                    class="info-btn"
                    class:active={expanded_flag === feature.flag}
                    class:hovered={hovered_flag === feature.flag}
                    on:click={() => toggle_description(feature.flag)}
                    on:mouseenter={() => (hovered_flag = feature.flag)}
                    on:mouseleave={() => (hovered_flag = null)}
                    aria-label="More info">i</button
                >
            </span>
            <input
                type="checkbox"
                bind:checked={feature_flag_cache[feature.flag]}
                disabled={feature_flag_cache[feature.flag] === undefined}
                on:change={() => sync_feature_storage(feature.flag)}
            />
        </div>
        {#if expanded_flag === feature.flag}
            <p class="feature-desc" transition:slide={{ duration: 200 }}>
                {feature.desc}
            </p>
        {/if}
    {/each}
</div>

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        color-scheme: light dark;
    }

    :global(body) {
        background: light-dark(#ffffff, #212121);
        color: light-dark(#0f0f0f, #f1f1f1);
    }

    * {
        font-size: 14px;
        line-height: 26px;
        flex-wrap: nowrap;
    }

    .container {
        margin: 0;
        overflow: hidden;
        padding: 20px 24px;
        min-width: 320px;
    }

    .title {
        white-space: nowrap;
        font-size: 20px;
        font-weight: 600;
        line-height: 1;
        margin: 0 0 12px 0;
    }

    .separator {
        border: none;
        border-top: 1px solid light-dark(#e0e0e0, #3f3f3f);
        margin: 0;
    }

    .feature-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0 8px 0;
        gap: 24px;
    }

    .feature-name {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .info-btn {
        background: none;
        border: 1.5px solid light-dark(#aaa, #666);
        border-radius: 50%;
        padding: 0;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 11px;
        line-height: 1;
        color: light-dark(#aaa, #666);
        transition:
            color 0.15s,
            border-color 0.15s;
    }

    .info-btn.active,
    .info-btn.hovered {
        color: #ff0000;
        border-color: #ff0000;
    }

    .feature-desc {
        font-size: 12px;
        line-height: 18px;
        color: light-dark(#606060, #aaaaaa);
        margin: -4px 0 8px 0;
    }

    input[type="checkbox"] {
        appearance: none;
        width: 18px;
        height: 18px;
        min-width: 18px;
        border-radius: 50%;
        border: 2px solid light-dark(#ccc, #555);
        cursor: pointer;
        transition:
            background 0.15s,
            border-color 0.15s;
    }

    input[type="checkbox"]:checked {
        background: #ff0000;
        border-color: #ff0000;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='white' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 65%;
    }

    input[type="checkbox"]:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
</style>
