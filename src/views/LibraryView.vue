<template>
    <main class="library-page">
        <LibraryStats />

        <div class="library-tabs" aria-label="Filter games by status" role="group">
            <button v-for="tab in statusTabs" 
                    :key="tab.value" 
                    type="button" 
                    class="library-tab" 
                    :class="[{ 'is-active': activeStatus === tab.value }, `library-tab--${tab.value}`]"
                    :aria-pressed="activeStatus === tab.value"
                    @click="activeStatus = tab.value"
            >
                {{ tab.label }}
            </button>
        </div>

        <div class="library-search">
            <input v-model="searchQuery" type="search" placeholder="Search games.." aria-label="Search games"/>

            <Search :size="20" aria-hidden="true" class="search-icon"/>
        </div>

        <div class="library-controls">
            <GameSort v-model="sortOption"></GameSort>

            <div class="library-filter-wrapper">
                <button type="button" 
                        class="library-filter-button" 
                        :aria-expanded="showFilters"
                        aria-controls="library-filter-panel"
                        @click="showFilters =!showFilters"
                >
                    <SlidersHorizontal :size="18" />
                    <span>Filter</span>
                </button>

                <div v-if="showFilters" id="library-filter-panel" class="filter-popup" role="group" aria-label="Filter games">
                    <div class="filter-header">
                        <h3>Filter games</h3>
                        
                        <button type="button" aria-label="Close filters" @click="showFilters = false">
                            <X :size="18" />
                        </button>
                    </div>
                    
                    <h4>Genre</h4>
                    <div class="filter-genres">  
                        <label v-for="genre in availableGenres" :key="genre" class="filter-checkbox">
                            <input type="checkbox" :value="genre" v-model="selectedGenres"/>
                            {{ genre }}
                        </label>
                    </div>

                    <div class="filter-section">
                        <h4>Rating</h4>

                        <div class="rating-filter">
                            <button v-for="star in 5" 
                                    :key="star" 
                                    type="button"
                                    :aria-label="`${star} ${star === 1 ? 'Star' : 'Stars'}`"
                                    :aria-pressed="ratingFilter === star"
                                    @click="ratingFilter = ratingFilter === star ? 0 : star"
                            >
                                <Star :size="22" :class="{ 'is-selected': star <= ratingFilter }" aria-hidden="true"/>
                            </button>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h4>Playtime</h4>

                        <div class="playtime-dropdown-wrapper">
                            <button class="playtime-dropdown" 
                                    type="button" 
                                    :aria-expanded="showPlaytimeOptions" 
                                    aria-controls="playtime-options"
                                    @click="showPlaytimeOptions = !showPlaytimeOptions"
                            >
                                <span>{{ currentPlaytimeLabel }}</span>
                           
                                <ChevronDown :size="16" aria-hidden="true" class="sort-chevron" :class="{ 'is-open': playtimeFilter !== 'all'}"/>
                            </button>

                            <div v-if="showPlaytimeOptions" class="sort-dropdown" id="playtime-options"> 
                                <button v-for="option in playtimeOptions" 
                                        :key="option.value" 
                                        type="button"
                                        class="sort-option" 
                                        :class="{ 'is-selected': playtimeFilter === option.value }"
                                        :aria-pressed="playtimeFilter === option.value"
                                        @click="selectPlaytimeOption(option.value)"
                                >
                                    <span>{{ option.label }}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="filter-section">
                        <h4>Other</h4>

                        <label class="filter-checkbox">
                            <input type="checkbox" v-model="favoritesOnly"/>
                            Favorites only
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <section class="library-collection" aria-label="Game collection">
            <GameCard v-for="game in filteredGames" :key="game.id" :game="game" @toggle-favorite="toggleFavorite" @open-details="openGameDetail"/>

            <GameDetail v-if="selectedGame && isGameDetailOpen"
                        :game="selectedGame"
                        view="library"
                        @close="isGameDetailOpen = false" 
                        @toggle-favorite="toggleFavorite"
                        @update-status="updateGameStatus"
                        @update-rating="updateGameRating"
                        @update-hours="updateGameHours"
                        @update-notes="updateGameNotes"
                        @remove-from-library="handleRemoveFromLibrary"
            />

            <div v-if="isLibraryEmpty" class="library-empty">
                <h3>Your library is empty</h3>
                <p style="color: var(--color-text-secondary);">Add games to your library and start building your collection.</p>
                <button class="discover-btn" @click="router.push('/')">Discover games</button>
            </div>

            <div v-else-if="filteredGames.length === 0 && hasActiveFilters" class="library-empty">
                <h3>No games found</h3>
                <p style="color: var(--color-text-secondary);">No games match your search and filter criteria.</p>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown, Search, SlidersHorizontal, X, Star } from 'lucide-vue-next';
import LibraryStats from '@/components/LibraryStats.vue';
import GameCard from '@/components/GameCard.vue';
import GameSort from '@/components/GameSort.vue';
import { library, toggleFavorite, availableGenres, removeFromLibrary } from '@/data/library.js';
import GameDetail from '@/components/GameDetail.vue';

const router = useRouter();

const activeStatus = ref('all');
const sortOption = ref('title-asc');
const showFilters = ref(false);
const searchQuery = ref('');
const selectedGenres = ref([]);
const ratingFilter = ref(0);
const playtimeFilter = ref('all');
const favoritesOnly = ref(false);
const showPlaytimeOptions = ref(false);
const selectedGame = ref(null);
const isGameDetailOpen = ref(false);

const filteredGames = computed (() => {
    let result = [...library];

    if(activeStatus.value !== 'all') {
        result = result.filter(
            game => game.status === activeStatus.value
        );
    }

    const query = searchQuery.value.trim().toLowerCase();

    if(query) {
        result = result.filter(game =>
            game.title.toLowerCase().includes(query)
        );
    }

    if(selectedGenres.value.length > 0) {
        result = result.filter(game => 
            selectedGenres.value.some(genre => 
                game.genres.includes(genre)
            )
        );
    }

    if(ratingFilter.value > 0) {
        result = result.filter(game => game.rating === ratingFilter.value);
    }

    if(playtimeFilter.value === 'under-10') {
        result = result.filter(game => game.hoursPlayed < 10);
    }

    if(playtimeFilter.value === '10-50') {
        result = result.filter(game => game.hoursPlayed >= 10 && game.hoursPlayed < 50)
    }

    if(playtimeFilter.value === '50-plus') {
        result = result.filter(game => game.hoursPlayed >= 50)
    }

    if(favoritesOnly.value){
        result = result.filter(game => game.isFavorite)
    }

    result.sort((a, b) => {
        switch (sortOption.value) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            
            case 'title-desc':
                return b.title.localeCompare(a.title);
            
            case 'hours-desc':
                return (b.hoursPlayed ?? 0) - (a.hoursPlayed ?? 0);
            
            default:
                return 0;
        }
    })
    return result;
})

const playtimeOptions = [
    { label: 'Any playtime', value: 'all'},
    { label: 'Under 10 hours', value: 'under-10'},
    { label: '10-50 hours', value: '10-50'},
    { label: '50+ hours', value: '50-plus'},
]

const statusTabs = [
    { label: 'All games', value: 'all' },
    { label: 'Playing', value: 'playing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Backlog', value: 'backlog' },
]

const currentPlaytimeLabel = computed(() => {
    return playtimeOptions.find(
        option => option.value === playtimeFilter.value
    )?.label ?? 'Any playtime';
});

function selectPlaytimeOption(value) {
    playtimeFilter.value = value;
    showPlaytimeOptions.value = false;
}

function openGameDetail(game) {
    selectedGame.value = game;
    isGameDetailOpen.value = true;
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

const hasActiveFilters = computed(() =>  
    activeStatus.value !== 'all' ||
    searchQuery.value !== '' || 
    selectedGenres.value.length > 0 || 
    ratingFilter.value > 0 || 
    playtimeFilter.value !== 'all' || 
    favoritesOnly.value
);

const isLibraryEmpty = computed(() => library.length === 0);

function handleRemoveFromLibrary(gameId) {
    removeFromLibrary(gameId);
    selectedGame.value = null;
}
</script>

<style scoped>
.library-page {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    color: white;
}

/* Navigation */

.library-tabs {
    display: flex;
    padding: 30px 0 20px;
    width: 718px;
    max-width: 100%;
}

.library-tab {
    position: relative;
    flex: 1;
    padding: 0 0 12px;
    border: none;
    background: transparent;
    color: white;
}

.library-tab.is-active::after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
}

.library-tab--playing.is-active::after {
    background: var(--color-playing);
}

.library-tab--completed.is-active::after {
    background: var(--color-completed);
}

.library-tab--backlog.is-active::after {
    background: var(--color-backlog);
}

/* Search */

.library-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    width: 720px;
    max-width: 100%;
    height: 59px;
    padding: 0 16px;
    box-sizing: border-box;
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
}

.library-search:focus-within {
    border: 1px solid var(--color-surface-border-focus);
    box-shadow: var(--box-shadow);
}

.search-icon {
    flex-shrink: 0;
    color: #A9A1B8;
}

.library-search input {
    flex: 1;
    min-width: 0;
    padding: 0;

    background: transparent;
    border: none;
    outline: none;

    color: white;
    font: inherit;
}

.library-search input::placeholder {
    color: #A9A1B8;
}

/* Controls */

.library-controls {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 20px;
}

/* Sort */

.library-filter-button {
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
    background:  var(--color-surface);
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

/* Filter */

.library-filter-wrapper {
    position: relative;
}

.filter-popup {
    position: absolute;
    margin-top: 8px;
    z-index: 20;
    padding: 20px;
    width: 320px;
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    background: var(--color-surface);
    border: 1px solid var(--color-surface-border);
    border-radius:  12px;
    box-shadow: var(--box-shadow);
    color:white;
}

.filter-popup h4 {
    margin: 16px 0 8px;
    font-weight: 400;
    color: #EAE6F2;
}

.filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.filter-header h3 {
    margin: 0;
    font-weight: 400;
}

.filter-header button {
    display: flex;
    background: transparent;
    border: none;
    color: white;
}

.filter-genres {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
}

.filter-checkbox input {
    accent-color: #7652A8;
}

.rating-filter {
    display: flex;
    gap: 8px;
}

.rating-filter button {
    display: flex;
    padding: 2px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
}

.rating-filter button .is-selected {
    color: var(--color-star);
    fill: var(--color-star);
}

.playtime-dropdown-wrapper {
    position: relative;
}

.playtime-dropdown {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--color-surface-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text-secondary);
}

.playtime-dropdown:hover {
    border-color: var(--color-surface-border-focus);
}

.playtime-chevron {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
    pointer-events: none;
}

/* Game collection */

.library-collection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    margin-top: 24px;
}

.library-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    min-height: 500px;
}

.discover-btn {
    margin-top: 25px;
    padding: 12px 10px;
    border-radius: 4px;
    background: var(--color-surface-border-focus);
    color: white;
    border: none;
}

@media (max-width: 768px) {
    .library-page {
        padding: 16px;
    }

    .library-search {
        width: 100%;
        height: 48px;
    }

    .library-filter-wrapper {
        position: static;
    }

    .filter-popup {
        left: 0;
        right: 0;
        width: auto;
        max-width: none;
    }

    .library-collection {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
    }

    .library-empty {
        min-height: 320px;
    }
}
</style>
