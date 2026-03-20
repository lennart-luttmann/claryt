<script lang="ts">
    import features from "../features.json";

    let FEATURE_STATES: Record<string, boolean> = {};

    chrome.storage.sync.get(
        features.map((f) => f.flag),
        (result) => {
            console.debug("Retrieved feature states from storage: ", result);
            FEATURE_STATES = result as Record<string, boolean>;
        },
    );

    function updateFeatureStorage(flag: string) {
        console.log(
            `Switched toggle state for flag [${flag}] to [${FEATURE_STATES[flag]}].`,
        );
        chrome.storage.sync.set({ [flag]: FEATURE_STATES[flag] });
    }
</script>

<header class="header">
    <h1 class="title">YouTube Longs Dashboard</h1>
</header>

{#each features as feature}
    <div class="feature-toggle-container">
        {feature.name}
        <input
            type="checkbox"
            bind:checked={FEATURE_STATES[feature.flag]}
            disabled={FEATURE_STATES[feature.flag] === undefined}
            on:change={() => updateFeatureStorage(feature.flag)}
        />
    </div>
{/each}

<style>
    .feature-toggle-container {
        display: flex;
    }
</style>
