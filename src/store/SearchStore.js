import { create } from 'zustand';

const useSearchStore = create((set) => ({
    searchTerm: '',
    setSearchTerm: (term) => set({ searchTerm: term }),
    clearSearch: () => set({ searchTerm: '' }),
}));

export default useSearchStore;
