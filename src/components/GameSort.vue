<template>
    <div class="library-sort-wrapper">
        <button
            type="button"
            class="library-sort"
            :aria-expanded="showSortOptions"
            aria-controls="sort-options"
            @click="showSortOptions = !showSortOptions"
        >
            <ArrowDownWideNarrow :size="18" aria-hidden="true"/>

            <span class="library-sort_label">Sort:</span>

            <span class="library-sort_value">
                {{ currentSortLabel }}
            </span>

            <ChevronDown
                :size="16"
                class="sort-chevron"
                :class="{ 'is-open': showSortOptions }"
                aria-hidden="true"
            />
        </button>

        <div v-if="showSortOptions" 
            class="sort-dropdown" 
            id="sort-options" 
            role="group"
            aria-label="Sort options"
        >
            <button
                v-for="option in sortOptions"
                :key="option.value"
                type="button"
                class="sort-option"
                :class="{ 'is-selected': modelValue === option.value }"
                :aria-pressed="modelValue === option.value"
                @click="selectSortOption(option.value)"
            >
                <span>{{ option.label }}</span>

                <Check
                    v-if="modelValue === option.value"
                    :size="16"
                    aria-hidden="true"
                />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
    ArrowDownWideNarrow,
    ChevronDown,
    Check
} from 'lucide-vue-next';

const props = defineProps({
    modelValue: {
        type: String,
        default: 'title-asc'
    }
});

const emit = defineEmits(['update:modelValue']);

const showSortOptions = ref(false);

const sortOptions = [
    { label: 'Title (A-Z)', value: 'title-asc' },
    { label: 'Title (Z-A)', value: 'title-desc' },
    { label: 'Hours played', value: 'hours-desc' },
];

const currentSortLabel = computed(() => {
    return sortOptions.find(
        option => option.value === props.modelValue
    )?.label ?? 'Title (A-Z)';
});

function selectSortOption(value) {
    emit('update:modelValue', value);
    showSortOptions.value = false;
}
</script>


<style scoped>
.library-sort-wrapper {
    position: relative;
}

.library-sort {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--color-surface-border);
    background: var(--color-surface);
    color: var(--color-text-secondary);
}

.sort-chevron {
    transition: transform 0.2s ease;
}

.sort-chevron.is-open {
    transform: rotate(180deg);
}

.sort-dropdown {
    position: absolute;
    margin-top: 8px;
    left: 0;
    z-index: 10;
    padding: 6px;
    width: 100%;
    box-sizing: border-box;
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
    box-shadow: var(--box-shadow);
}

.sort-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--color-text-secondary);
}

.sort-option:hover {
    background: var(--color-surface-border);
    color: white;
}

.sort-option.is-selected {
    color: var(--color-surface-border-focus);
}

.sort-option:focus-visible,
.library-sort:focus-visible {
    outline: 2px solid var(--color-surface-border-focus);
    outline-offset: 2px;
}
</style>
