<template>
    <section class="library-section">
        <div class="section-header">
            <div class="section-title">
                <h3>{{ title }}</h3>
                <span :class="['status-chip', status]">{{ status.charAt(0).toUpperCase() + status.slice(1) }}</span>
            </div>
            
            <div class="section-action">
                <RouterLink :to="{ name: 'library' }" class="section-action">View all</RouterLink>
                <ArrowRight />
            </div> 
        </div>

        <div v-if="games.length" class="game-grid">
            <GameCard v-for="game in games" :key="game.id" :game="game" @toggle-favorite="toggleFavorite" @open-details="openGameDetail"/>
        </div>

        <div v-else class="empty-state">
            <Gamepad2/>
            <h3>{{ emptyMessages }}</h3>
        </div>

        <GameDetail v-if="selectedGame"
                    :game="selectedGame"
                    view="library"
                    @close="closeGameDetail" 
                    @toggle-favorite="toggleFavorite"
                    @update-status="updateGameStatus"
                    @update-rating="updateGameRating"
                    @update-hours="updateGameHours"
                    @update-notes="updateGameNotes"
                    @remove-from-library="handleRemoveFromLibrary"
        />
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ArrowRight, Gamepad2 } from 'lucide-vue-next';
import GameCard from './GameCard.vue';
import GameDetail from './GameDetail.vue';
import { library, toggleFavorite, removeFromLibrary } from '@/data/library.js';

const props = defineProps({
    title: String,
    status: String,
    games: Array,
    emptyMessages: String
})

const selectedGameId = ref(null);

const selectedGame = computed(() =>
    library.find(g => g.id === selectedGameId.value) ?? null
);

function openGameDetail(game) {
    selectedGameId.value = game.id;
}

function closeGameDetail() {
    selectedGameId.value = null;
}

function updateGameStatus({ game, status}) {
    game.status = status;
}

function updateGameRating({ game, rating }) {
    game.rating = rating;
}

function updateGameHours({ game, hours }) {
    game.hoursPlayed = hours;
}

function updateGameNotes({ game, notes }) {
    game.notes = notes;
}

function handleRemoveFromLibrary(gameId) {
    removeFromLibrary(gameId);
    closeGameDetail();
}
</script>

<style scoped>
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.section-title h3 {
    font-weight: 500;
}

.status-chip {
    padding: 5px 9px;
    border-radius: 8px;
    font-size: 12px;
}

.status-chip.playing {
    background: rgb(0 200 179 / 26%);
    color: #00C8B3;
    border: 1px solid #00C8B3;
}

.status-chip.completed {
    background: rgb(52 199 89 / 26%);
    color: #34C759;
    border: 1px solid #34C759;
}

.status-chip.backlog {
    background: rgb(255 141 40 / 26%);
    color: #FF8D28;
    border: 1px solid #FF8D28;
}

.section-action {
    display: flex;
    align-items: center;
    gap: 8px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
    color: var(--color-text-secondary);
}

.empty-state h3 {
    color: var(--color-text);
    margin: 12px 0 4px;
    font-weight: 400;
}

</style>