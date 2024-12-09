import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoriteStore = create(persist(
    (set) => ({
        favorites: [],
        toggleFavorite: (pokemon) => set((state) => {
            const isFavorite = state.favorites.some(fav => fav.id === pokemon.id);
            if (isFavorite) {
                return { favorites: state.favorites.filter(fav => fav.id !== pokemon.id) };
            } else {
                return { favorites: [...state.favorites, pokemon] };
            }
        }),
        clearFavorites: () => set({ favorites: [] }),
    }),
    {
        name: 'pokemon-favorites', 
        storage: localStorage, 
    }
));

export default useFavoriteStore;