export const games = [
    {
    id: 1,
    title: 'Cyberpunk 2077',
    cover: '/images/cyberpunk-2077.jpg',
    rating: 5,
    hoursPlayed: 68,
    status: 'playing',
    isFavorite: true,
    genres: ['RPG', 'Action', 'Open World', 'Sci-Fi', 'Cyberpunk'],
    releaseYear: 2020,
    developer: 'CD Projekt RED',
    description: 'Immerse yourself in Night City, a sprawling metropolis obsessed with power, glamour, and body modification. Play as V, a mercenary on a dangerous journey to find a unique implant that holds the key to immortality.',
  },
    {
    id: 2,
    title: 'The Witcher 3: Wild Hunt',
    cover: '/images/the-witcher-3.jpg',
    rating: 4,
    hoursPlayed: 15,
    status: 'completed',
    isFavorite: false,
    genres: ['RPG', 'Action', 'Open World', 'Fantasy', 'Adventure'],
    releaseYear: 2015,
    developer: 'CD Projekt RED',
    description: 'Step into the shoes of Geralt of Rivia, a monster hunter searching for his adopted daughter in a war-torn fantasy world. Explore vast landscapes, take on dangerous contracts, and make choices that shape the fate of those around you.',
  },
  {
    id: 3,
    title: 'Persona 3 Reload',
    cover: '/images/persona-3-reload.jpg',
    rating: 4,
    hoursPlayed: 42,
    status: 'playing',
    isFavorite: true,
    genres: ['RPG', 'JRPG', 'Fantasy'],
    releaseYear: 2024,
    developer: 'Atlus',
    description: 'Experience life as a transfer student who discovers the mysterious Dark Hour, a hidden period between days. Join the Specialized Extracurricular Execution Squad and fight supernatural creatures while balancing school life and friendships.',
  },
  {
    id: 4,
    title: 'Alice: Madness Returns',
    cover: '/images/alice-madness-returns.jpg',
    rating: 4,
    hoursPlayed: 120,
    status: 'playing',
    isFavorite: false,
    genres: ['Action', 'Adventure', 'Horror'],
    releaseYear: 2011,
    developer: 'Spicy Horse',
    description: 'Return to a twisted version of Wonderland as Alice, who is struggling with the trauma of her past. Explore surreal environments, battle bizarre enemies, and uncover the dark secrets hidden within her memories.'
  },
];

export const availableGenres = [
    'Action',
    'Adventure',
    'Horror',
    'Survival',
    'Sci-Fi',
    'Cyberpunk',
    'Fantasy',
    'JRPG',
    'MMORPG',
    'Open World',
    'RPG',
    'Story Rich',
];

import { reactive, watch } from "vue";

function loadLibrary() {
  try {
    const savedLibrary = localStorage.getItem('questshelf-library');

    if (savedLibrary) {
      const parsedLibrary = JSON.parse(savedLibrary);

      if (Array.isArray(parsedLibrary)) {
        return parsedLibrary;
      }
    }
  } catch (error) {
    console.error('Could not load saved library:', error);
  }

  return games.map(game => ({
    ...game,
  }));
}


export const library = reactive(loadLibrary());

watch(
    library,
    (newLibrary) => {
        localStorage.setItem(
            'questshelf-library',
            JSON.stringify(newLibrary)
        );
    },
    { deep: true }
);

export function addToLibrary(game) {
  if(isInLibrary(game.id)) return

  library.push({
    ...game,
    isInLibrary: true,
    status: 'backlog',
    rating: 0,
    hoursPlayed: 0,
    isFavorite: false,
    notes: ''
  })
}

export function removeFromLibrary(gameId) {
  const index = library.findIndex(game => game.id === gameId)

  if(index !== -1){
    library.splice(index, 1)
  }
}

export function isInLibrary(gameId) {
  return library.some(game => game.id === gameId)
}

export function toggleLibrary(game) {
  if(isInLibrary(game.id)) {
    removeFromLibrary(game.id)
  } else {
    addToLibrary(game)
  }
}

export function toggleFavorite(game) {
  game.isFavorite = !game.isFavorite;
}