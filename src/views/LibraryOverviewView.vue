<template>
    <main class="page">
        <header class="library_overview_hero">
            <h2>Your games, your collection.</h2>
            <p>Keep track of what you're playing, what you've completed, and what's next.</p>
        </header>

        <LibraryStats />

        <LibrarySection 
            title="Currently Playing" 
            status="playing" 
            :games="currentlyPlayingGames" 
            empty-messages="No games in progress"
        />

        <LibrarySection 
            title="Completed" 
            status="completed" 
            :games="completedGames" 
            empty-messages="No completed games yet"
        />

        <LibrarySection 
            title="Backlog" 
            status="backlog" 
            :games="backlogGames" 
            empty-messages="Your backlog is empty"
        />
    </main>
</template>

<script setup>
import { computed } from 'vue';
import LibraryStats from '@/components/LibraryStats.vue';
import LibrarySection from '@/components/LibrarySection.vue';
import { library } from '@/data/library.js';

const currentlyPlayingGames = computed(() =>
    library.filter(game => game.status === 'playing')
)

const completedGames = computed(() =>
    library.filter(game => game.status === 'completed')
)

const backlogGames = computed(() =>
    library.filter(game => game.status === 'backlog')
)

</script>

<style>
.page {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    color: white;
}

.library_overview_hero {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
}

.library_overview_hero h2 {
    color: var(--color-text);
    font-weight: 400;
    margin: 0;
    font-size: 24px;
    letter-spacing: -1px;
}

.library_overview_hero p {
    color: var(--color-text-secondary);
    margin: 0 0 20px;
}

.game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

@media (max-width: 640px) { 
    .page {
        padding: 16px;
    }

    .game-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
    }
}
</style>
