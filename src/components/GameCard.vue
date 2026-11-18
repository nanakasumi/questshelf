<template>
    <article class="game-card" @click="$emit('open-details', game)">
        <div class="game-card_cover">
            <img :src="game.cover" :alt="`Cover von ${game.title}`" class="game-card_img" loading="lazy" decoding="async"/>

            <button 
                v-if="view !== 'discover'" 
                class="game-card_favorite" 
                :class="{ 'isFavorite': game.isFavorite }"
                :aria-label="game.isFavorite ? 'Remove from favorites' : 'Add to favorites'"
                :aria-pressed="game.isFavorite"
                @click.stop="$emit('toggle-favorite', game)"
            >
                <Heart size="20" :fill="game.isFavorite ? 'currentColor' : 'none'"/>
            </button>

            <span v-if="view === 'library'" class="game-card_status" :class="`game-card_status--${game.status}`">
                {{ statusLabel }}
            </span>
        </div>
        
        <div class="game-card_content"> 
            <h3>
                <button class="game-card_title-btn" @click.stop="$emit('open-details', game)">
                    {{ game.title }}
                </button>
            </h3>

            <template v-if="view === 'discover'">
                <div class="game-card_meta">
                    <p>{{ game.developer }} <span class="game-card_dot"></span> {{ game.releaseYear }}</p>
                </div>

                <button class="game-card_library-btn" :class="{ 'is-added': game.isInLibrary }" @click.stop="$emit('toggle-library', game)">
                    <Check v-if="game.isInLibrary" class="is-added-check" :size="16"/>
                    <Plus v-else :size="16"/>

                    {{ game.isInLibrary ? 'In Library' : 'Add to Library' }}
                </button>
            </template>

            <template v-else>
                <div class="game-card_rating" >
                    <Star v-for="star in 5" :key="star" :size="18" :class="{ 'is-selected': star <= game.rating }"/>
                </div>

                <p>{{ game.hoursPlayed }}h played</p>
            </template>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';
import { Heart, Star, Check, Plus } from 'lucide-vue-next';

const props = defineProps({
    game: {
        type: Object,
        required: true
    },
    view: {
        type: String,
        default: 'library'
    }
})

defineEmits(['toggle-library', 'toggle-favorite', 'open-details'])

const statusLabel = computed (() => {
    const labels = {
        playing: 'Playing',
        completed: 'Completed',
        backlog: 'Backlog'
    }

    return labels[props.game.status] ?? 'Unknown'
})
</script>

<style>
.game-card {
    background: var(--color-surface);
    border: 1px solid var( --color-surface-border);
    border-radius: 8px;
    color: white;
    overflow: hidden;
}

.game-card:hover {
    border:1px solid var(--color-surface-border-focus);
    box-shadow: var(--box-shadow);
    cursor: pointer;
}

.game-card_title-btn {
    display: block;
    width: 100%;
    padding: 0;
    background: transparent;
    border: none;
    color: inherit;
    font: inherit;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.game-card:focus-visible {
    outline: 2px solid var(--color-surface-border-focus);
    outline-offset: 3px;
}

.game-card_cover {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
}

.game-card_img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Status */

.game-card_status {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 1;
    padding: 5px 9px;
    border-radius: 8px;
    font-size: 12px;
}

.game-card_status--playing {
    background: rgb(0 200 179 / 26%);
    color: #00C8B3;
    border: 1px solid #00C8B3;
}

.game-card_status--completed {
    background: rgb(52 199 89 / 26%);
    color: #34C759;
    border: 1px solid #34C759;
}

.game-card_status--backlog {
    background: rgb(255 141 40 / 26%);
    color: #FF8D28;
    border: 1px solid #FF8D28;
}

.game-card_favorite {
    position: absolute;
    background: transparent;
    border: none;
    color: gray;
    top: 10px;
    right: 10px;
    z-index: 1;
}

/* Content */

.game-card_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 14px;
}

.game-card_content h3 {
    margin: 0;
    font-weight: 400;
}

.game-card_content p {
    margin: 0;
    font-size: 14px;
    color: var(--color-text-secondary);
}

.game-card_rating {
    display: flex;
    align-items: center;
    gap: 4px;
}

.game-card_rating svg {
    color: var(--color-text-secondary);
}

.game-card_rating svg.is-selected {
    color: var(--color-star);
    fill: var(--color-star);
}

.isFavorite {
    color: #FF2D55;
}

/* Discover view styles*/

.game-card_library-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    background: transparent;
    border: none;
    font-size: 16px;
    color: white;
}

.is-added-check {
    color: #34C759;
}

.game-card_meta {
    display: flex;
    align-items: center;
    gap: 6px;
}

.game-card_dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    background: currentColor;
    border-radius: 50%;
    margin: 0 8px;
    vertical-align: middle;
}

@media (max-width: 640px) {
    .game-card_library-btn {
        font-size: 14px;
    }

    .game-card_content p{
        font-size: 12px;
    }

    .game-card_content h3{
        font-size: 16px;
    }
}
</style>