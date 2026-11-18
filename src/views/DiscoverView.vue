<template>
    <main class="discover">
        <section class="discover_hero">
            <h2>Discover</h2>

            <p> Find your next adventure.</p>          
        </section>

        <div class="discover-search">
            <input v-model="searchQuery" type="search" placeholder="Search games.." aria-label="Search games"/>

            <Search :size="20" aria-hidden="true" class="search-icon"/>
        </div>
        
        <div class="genre-filters">
            <button v-for="genre in availableGenres"
                    :key="genre"
                    type="button"
                    class="genre-chip"
                    :class="{ 'is-active': activeGenres.includes(genre) }"
                    :aria-pressed="activeGenres.includes(genre)"
                    @click="toggleGenre(genre)"
            >
                {{ genre }}
            </button>
        </div>

        <section class="library-collection" aria-label="Game collection">
            <GameCard 
                v-for="game in discoverGames" 
                :key="game.id" 
                :game="game" 
                view="discover" 
                @toggle-library="handleToggleLibrary" 
                @open-details="openGameDetail"
            />
            
            <GameDetail v-if="isGameDetailOpen"
                        :game="selectedGame"
                        view="discover"
                        @close="isGameDetailOpen = false" 
                        @toggle-library="handleToggleLibrary"
            />

            <div v-if="filteredGames.length === 0 && hasActiveFilters" class="library-empty">
                <h3>No games found</h3>
                <p style="color: var(--color-text-secondary);">No games match your search and filter criteria.</p>
            </div>
        </section>
       
    </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import GameCard from '@/components/GameCard.vue';
import GameDetail from '@/components/GameDetail.vue';
import { games, availableGenres } from '@/data/games.js' ;
import { toggleLibrary, isInLibrary } from '@/data/library';

const searchQuery = ref('');
const activeGenres = ref([]);
const selectedGame = ref(null);
const isGameDetailOpen = ref(false);

const filteredGames = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    return games.filter(game => {
        const matchesSearch = !query || game.title.toLowerCase().includes(query);

        const matchesGenre =
            activeGenres.value.length === 0 ||
            activeGenres.value.some(genre => game.genres.includes(genre));

        return matchesSearch && matchesGenre;
    });
})

const hasActiveFilters = computed(() =>  
activeGenres.value.length > 0 || searchQuery.value.trim() !== ''
);

const discoverGames = computed(() => {
    return filteredGames.value.map(game => ({
        ...game,
        isInLibrary: isInLibrary(game.id)
    }))
})

function openGameDetail(game) {
    selectedGame.value = game;
    isGameDetailOpen.value = true;
}

function handleToggleLibrary(game) {
    toggleLibrary(game);
}

function toggleGenre(genre) {
  const index = activeGenres.value.indexOf(genre)
  if (index === -1) {
    activeGenres.value.push(genre)
  } else {
    activeGenres.value.splice(index, 1)
  }
}
</script>

<style scoped>
.discover {
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
    width: 100%;
    max-width: 1800px;
}

/* Hero */

.discover_hero {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
}

.discover_hero h2 {
    color: white;
    margin: 0;
    font-weight: 400;
    letter-spacing: -1px;
}

.discover_hero p {
    margin: 16px 0 32px;
    margin: 0 0 20px;
    color: var(--color-text-secondary)
}

/* Search */

.discover-search {
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

.discover-search:focus-within {
    border: 1px solid var(--color-surface-border-focus);
    box-shadow: var(--box-shadow);
}

.search-icon {
    flex-shrink: 0;
    color: #A9A1B8;
}

.discover-search input {
    flex: 1;
    min-width: 0;
    padding: 0;

    background: transparent;
    border: none;
    outline: none;

    color: white;
    font: inherit;
}

.discover-search input::placeholder {
    color: #A9A1B8;
}

/* Game collection */

.library-collection {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
}

/* Genre filters */

.genre-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.genre-chip {
    padding: 8px 16px;
    border: 1px solid var(--color-surface-border);
    border-radius: 20px;
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-size: 13px;
    transition: all 0.2s ease;
}

.genre-chip.is-active {
    background: var(--color-surface-border-focus);
    border-color: var(--color-surface-border-focus);
    color: white;
}

.library-empty {
    grid-column: 1 / -1;
    display: flex;
    color: white;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    min-height: 500px;
}

@media (max-width: 600px) {
    .discover {
        padding: 16px;
    }

    .library-collection {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 16px;
    }
}
</style>