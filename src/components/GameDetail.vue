<template>
        <dialog 
            class="game-detail_popup" 
            ref="dialog" role="dialog" 
            aria-labelledby="game-detail-title" 
            @close="emit('close')"
            @click.self="dialog.close()"
        >
            <div class="game-detail_cover">
                <img :src="game.cover" :alt="`Cover von ${game.title}`" class="game-card_img"/>
                <button class="close_btn" type="button" aria-label="Close game details" @click="emit('close')">
                    <X :size="20"/>
                </button>

                <div class="game-detail_cover-content">
                    <h2 id="game-detail-title">{{ game.title }}</h2>
                    <p>
                        {{ game.developer }}
                        <span class="game-detail_dot"></span>
                        {{ game.releaseYear }}
                    </p>
                </div>         
            </div>

            <div class="game-detail_meta">
                <div class="game-detail_genres">
                    <span v-for="genre in game.genres" :key="genre" class="game-detail_genre">
                        {{ genre }}
                    </span>
                </div>

                <button v-if="view === 'library'" 
                        class="game-detail_favorite" 
                        type="button"
                        :class="{ 'is-favorite' : game.isFavorite}"
                        :aria-pressed="game.isFavorite"
                        @click="emit('toggle-favorite', game)"
                        aria-label="Toggle favorite"
                >
                    <Heart :size="22" :fill="game.isFavorite ? 'currentColor' : 'none'"/>
                </button>
            </div>

            <div v-if="view === 'library'" class="game-detail_status" role="group" aria-label="Game status">
                <button v-for="status in statuses"
                        :key="status.value"
                        type="button"
                        :aria-pressed="game.status === status.value"
                        :class="[
                            'game-detail_status-option',
                            `game-detail_status-option--${status.value}`,
                            { 'is-active': game.status === status.value }
                        ]"
                        @click="emit('update-status', { game, status: status.value })"
                >
                    {{ status.label }}
                </button>
            </div>

            <div v-if="view === 'library'" class="game-detail_container">
                <div class="game-detail_rating">
                    <span>Rating</span>

                    <div class="game-detail_stars">
                        <button v-for="star in 5"
                                :key="star"
                                type="button"
                                @click="emit('update-rating', { game, rating: star })"
                                :aria-label="`Rate ${star} out of 5 stars`"        
                        >
                            <Star :size="22" :class="{ 'is-selected' : star <= game.rating }" :fill="star <= game.rating ? 'currentColor' : 'none'"/>

                        </button>
                    </div>
                </div>

                <div class="game-detail_hours">
                    <label for="hours-played">Hours played</label>

                    <div class="game-detail_hours-input">
                        <input 
                            id="hours-played"
                            type="number"
                            min="0"
                            @keydown="e => ['-','+'].includes(e.key) && e.preventDefault()"
                            :value="game.hoursPlayed"
                            step="0.1"
                            @change="emit('update-hours', {
                                game,
                                hours: Math.max(0, Number($event.target.value) || 0)
                            })"
                       />
                       <span>h</span>
                    </div>
                </div>
            </div>
            
            <div class="game-detail_description">
                <h4>About this game</h4>
                <p>{{ game.description  || 'No description available.' }}</p>
            </div>

            <div v-if="view === 'library'" class="game-detail_notes">
                <h4>My notes</h4>

                <textarea
                    :value="game.notes"
                    placeholder="Add a personal note"
                    aria-label="Add a personal note"
                    rows="5"
                    @input="emit('update-notes', {
                        game,
                        notes: $event.target.value
                    })"
                ></textarea>
            </div>

            <div v-if="view === 'library'" class="game-detail_actions">
                <button
                    class="game-detail_remove-library"
                    @click="emit('remove-from-library', game.id)"
                >
                    <Trash2 :size="18"/>
                    
                    Remove from Library
                </button>
            </div>

            <div v-if="view === 'discover'" class="game-detail_actions">
                <button
                    class="game-detail_add-library"
                    :class="{ 'is-added': isAdded }"
                    @click="emit('toggle-library', game)"
                >
                    <Check v-if="isAdded" class="is-added-check" :size="18"/>
                    <Plus v-else :size="18" />
                    
                    {{ isAdded ? 'Added' : 'Add to Library' }}
                </button>
            </div>
        </dialog>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { isInLibrary } from '@/data/library';
import { X, Heart, Star, Plus, Check, Trash2 } from 'lucide-vue-next';

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

const emit = defineEmits([
    'close', 
    'toggle-favorite', 
    'update-status', 
    'update-rating', 
    'update-hours', 
    'update-notes', 
    'toggle-library',
    'remove-from-library'
]);

const isAdded = computed(() => isInLibrary(props.game.id));

const dialog = ref(null);

onMounted(() => dialog.value.showModal());

const statuses = [
    { label: 'Playing', value: 'playing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Backlog', value: 'backlog' },
]
</script>

<style scoped>
.game-detail_popup::backdrop {
    backdrop-filter: blur(5px);
}

.game-detail_popup {
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;

    padding: 0;
    margin: auto;

    background: var( --color-popup-bg);

    border-radius: 12px;
    border: none;
}

.game-detail_popup button:focus-visible,
.game-detail_popup input:focus-visible,
.game-detail_popup textarea:focus-visible {
    outline: 2px solid var(--color-surface-border-focus);
    outline-offset: 3px;
}

/* Cover & Content */

.game-detail_cover {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.close_btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
    background: transparent;
    border: none;
    color: white;
}

.game-detail_cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        to top,
        rgb(0 0 0 / 85%),
        transparent
    );
}

.game-detail_cover-content {
    position: absolute;
    bottom: 20px;
    left: 24px;
    z-index: 1;
    color: white;
}

.game-detail_cover-content h2 {
    margin: 0 0 6px;
    font-size: 28px;
}

.game-detail_cover-content p {
    margin: 0;
    color: var(--color-text-secondary);
}

.game-detail_dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin: 0 8px 3px;
    border-radius: 50%;
    background: currentColor;
}

.game-detail_meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
}

/* Genres */

.game-detail_genres {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.game-detail_genre {
    padding: 6px 12px;
    border: 1px solid var(--color-surface-border);
    color: var(--color-text-secondary);
    border-radius: 20px;
    background: var(--color-surface);
    font-size: 13px;
}

/* Favorite */

.game-detail_favorite {
    padding: 6px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
}

.game-detail_favorite.is-favorite {
    color: var(--color-heart);
}

/* Status */

.game-detail_status {
    display: flex;
    gap: 10px;
    padding: 0 24px 20px;
}

.game-detail_status-option {
    padding: 6px 12px;
    background: transparent;
    border-radius: 8px;
}

.game-detail_status-option--playing {
    color: var(--color-playing);
    border: 1px solid var(--color-playing);
}

.game-detail_status-option--completed {
    color: var(--color-completed);
    border: 1px solid var(--color-completed);
}

.game-detail_status-option--backlog {
    color: var(--color-backlog);
    border: 1px solid var(--color-backlog);
}

.game-detail_status-option--playing.is-active {
    background: rgba(0 200 179 / 26%);
}

.game-detail_status-option--completed.is-active {
    background: rgba(52 199 89 / 26%);
}

.game-detail_status-option--backlog.is-active {
    background: rgba(255 141 40 / 26%);
}

.game-detail_container {
    display: flex;
    gap: 24px;
    padding: 0 24px 20px;
    color: var(--color-text-secondary);
}

/* Stars */

.game-detail_stars {
    display: flex;
    gap: 6px;
    margin-top: 10px;
}

.game-detail_stars button {
    padding: 0;
    border: none;
    background: none;
    color: var(--color-text-secondary);
}

.game-detail_stars .is-selected {
    color: var(--color-star);
}

/* Hours Input */

.game-detail_hours-input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
}

.game-detail_hours-input input {
    width: 50px;
    border: 1px solid var(--color-surface-border);
    border-radius: 4px;
    outline: none;
    background: transparent;
    color: white;
    font-size: 18px;
}

/* Description */

.game-detail_description {
    padding: 0 24px 20px;
}

.game-detail_description h4 {
    margin-top: 0;
    font-weight: 400;
    margin-bottom: 14px;
    color: var(--color-text-secondary);
}

.game-detail_description p {
    margin: 0;
    color: white;
}

/* Notes */

.game-detail_notes {
    padding: 0 24px 20px;
}

.game-detail_notes h4 {
    margin-top: 0;
    margin-bottom: 14px;
    font-weight: 400;
    color: var(--color-text-secondary);
}

.game-detail_notes textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 100px;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: white;
    line-height: 1.5;
}

.game-detail_notes textarea::placeholder{
    color: var(--color-text-placeholder);
}

.game-detail_notes textarea:focus {
    outline: none;
    border-color: var(--color-surface-border-focus);
    box-shadow: var(--box-shadow);
}

.game-detail_popup::-webkit-scrollbar {
    display: none;
}

.game-detail_actions {
    padding: 0 24px 20px;
}

.game-detail_actions button {
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

.game-detail_remove-library {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    background: transparent;
    border: none;
    font-size: 14px;
    color: var(--color-text-secondary);
}

.game-detail_remove-library:hover {
    color: #ff5555;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

