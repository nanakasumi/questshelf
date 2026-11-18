<template>
     <section class="library-stats" aria-label="Game statistics">
            <article class="stat-card">
                <p class="stat-card_value">{{ totalGames }}</p>
                <p class="stat-card_label">Total</p>
            </article>

            <article class="stat-card">
                <p class="stat-card_value playing">{{ currentlyPlayingTotal }}</p>
                <p class="stat-card_label">Playing</p>
            </article>

            <article class="stat-card">
                <p class="stat-card_value completed">{{ completedGamesTotal }}</p>
                <p class="stat-card_label">Completed</p>
            </article>

            <article class="stat-card">
                <p class="stat-card_value backlog">{{ backlogGamesTotal }}</p>
                <p class="stat-card_label">Backlog</p>
            </article>

             <article class="stat-card">
                <p class="stat-card_value total-hours">{{ totalHoursPlayed }}</p>
                <p class="stat-card_label">Total hours</p>
            </article>
        </section>
</template>

<script setup>
import { computed } from 'vue';
import { library } from '@/data/library.js';

const totalGames = computed (() => library.length)

const currentlyPlayingTotal = computed(() =>
    library.filter(game => game.status === 'playing').length
)

const completedGamesTotal = computed(() =>
    library.filter(game => game.status === 'completed').length
)

const backlogGamesTotal = computed (() => 
    library.filter(game => game.status === 'backlog').length
)

const totalHoursPlayed = computed (() => 
    library.reduce((total,game) => total + (game.hoursPlayed ?? 0),0)
)
</script>

<style>
.library-stats {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 16px;
}

.stat-card {
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
    text-align: center;
}

.stat-card_label {
    margin: 0 0 22px;
    font-size: 15px;
    color: var(--color-text-secondary);
}

.stat-card_value {
    margin: 12px 0 6px;
    font-size: 24px;
}

.stat-card_value.playing {
    color: var(--color-playing);
}

.stat-card_value.completed {
    color: var(--color-completed);
}

.stat-card_value.backlog {
    color: var(--color-backlog);
}

.stat-card_value.total-hours {
    color: var(--color-total-hours);
}


@media (max-width: 1100px) {
    .library-stats {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 650px) {
   .library-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }

    .stat-card:last-child {
        grid-column: 1 / -1;
    }
}
</style>