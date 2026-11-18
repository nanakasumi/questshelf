import { describe, it, expect, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { library, isInLibrary, addToLibrary, removeFromLibrary, toggleFavorite, toggleLibrary } from '@/data/library';
import { games } from '@/data/games';

describe('Library', () => {
    beforeEach(() => {
        library.splice(0, library.length, ...games.map(game => ({ ...game })));
        localStorage.clear();
    });

    it('saves the library to localStorage', async () => {
        const game = { id: 99, title: 'Test Game', genres: [] };

        addToLibrary(game);

        await nextTick();

        const savedLibrary = JSON.parse(
            localStorage.getItem('questshelf-library')
        );

        expect(savedLibrary.some(game => game.id === 99)).toBe(true);
    });

    it('adds a game to the library', () => {
        const game = {
        id: 99,
        title: 'Test Game',
        genres: []
        };

        addToLibrary(game);

        expect(isInLibrary(99)).toBe(true);
    });

    it('does not add a game twice', () => {
        const game = {
            id: 99,
            title: 'Test Game',
            genres: []
        };

        addToLibrary(game);
        addToLibrary(game);

        expect(library.filter(game => game.id === 99)).toHaveLength(1);
    });

    it('removes a game from the library', () => {
        const game = {
            id: 99,
            title: 'Test Game',
            genres: []
        };

        addToLibrary(game);
        removeFromLibrary(99);

        expect(isInLibrary(99)).toBe(false);
    });

    it('toggles favorite status', () => {
        const game = {
            id: 99,
            title: 'Test Game',
            isFavorite: false,
            genres: []
        };

        toggleFavorite(game);
        expect(game.isFavorite).toBe(true);

        toggleFavorite(game);
        expect(game.isFavorite).toBe(false);
    });

    it('adds and removes a game when toggling library', () => { 
        const game = {
            id: 99,
            title: 'Test Game',
            genres: []
        };

        toggleLibrary(game);
        expect(isInLibrary(99)).toBe(true);

        toggleLibrary(game);
        expect(isInLibrary(99)).toBe(false);
    })
});