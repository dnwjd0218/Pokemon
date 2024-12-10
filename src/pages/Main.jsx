import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSearchStore from '../store/SearchStore';
import useFavoriteStore from '../store/FavoriteStore';
import { Heart } from 'lucide-react';

const PokemonCardSkeleton = () => (
    <div className="border border-gray-200 p-6 flex flex-col items-center bg-white rounded-xl shadow-lg relative">
        <div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 animate-pulse" />
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
    </div>
);

function Main() {
    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [allPokemons, setAllPokemons] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const navigate = useNavigate();
    const searchTerm = useSearchStore((state) => state.searchTerm);
    const { favorites, toggleFavorite } = useFavoriteStore();

    const ITEMS_PER_PAGE = 15;
    const lastPokemonRef = useRef();

    // 검색 포켓몬
    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon-species?limit=1010');
                const results = [];
                for (const pokemon of response.data.results) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const details = await axios.get(pokemon.url);
                        results.push({
                            id: details.data.id,
                            name: details.data.names.find((el) => el.language.name === 'ko')?.name || details.data.name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.data.id}.png`,
                        });
                    } catch (error) {
                        console.error('포켓몬 데이터 로딩 실패 ', error);
                        continue;
                    }
                }

                setAllPokemons(results.sort((a, b) => a.id - b.id));
            } catch (error) {
                console.error('전체 포켓몬 데이터 로딩 오류', error);
            }
        };

        fetchAllPokemon();
    }, []);

    useEffect(() => {
        if (isLoading || !hasMore || searchTerm) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !searchTerm) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1, rootMargin: '20px' }
        );

        if (lastPokemonRef.current) {
            observer.observe(lastPokemonRef.current);
        }

        return () => {
            if (lastPokemonRef.current) {
                observer.unobserve(lastPokemonRef.current);
            }
        };
    }, [isLoading, hasMore, searchTerm]);

    useEffect(() => {
        async function fetchPokemonList() {
            if (searchTerm) return;

            setIsLoading(true);
            try {
                const startIdx = (page - 1) * ITEMS_PER_PAGE;
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species?limit=${ITEMS_PER_PAGE}&offset=${startIdx}`);

                if (startIdx >= response.data.count || response.data.results.length === 0) {
                    setHasMore(false);
                    return;
                }

                const results = [];
                for (const pokemon of response.data.results) {
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const details = await axios.get(pokemon.url);
                        results.push({
                            id: details.data.id,
                            name: details.data.names.find((el) => el.language.name === 'ko')?.name || details.data.name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.data.id}.png`,
                        });
                    } catch (error) {
                        console.error(`포켓몬 로딩 실패 (${pokemon.url}):`, error);
                        continue;
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 500));

                setPokemonList(prev => {
                    const newIds = new Set(results.map(pokemon => pokemon.id));
                    const filteredPrev = prev.filter(pokemon => !newIds.has(pokemon.id));
                    return [...filteredPrev, ...results].sort((a, b) => a.id - b.id);
                });

                if (startIdx + ITEMS_PER_PAGE >= response.data.count) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('포켓몬 목록 로딩 오류:', error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPokemonList();
    }, [page, searchTerm]);

    

    // 검색
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearchLoading(true);
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        if (allPokemons.length > 0) {
            const filtered = allPokemons.filter(pokemon =>
                pokemon.name.toLowerCase().includes(normalizedSearchTerm)
            );
            setSearchResults(filtered);
            setIsSearchLoading(false);
        } else if (pokemonList.length > 0) {
            const filtered = pokemonList.filter(pokemon =>
                pokemon.name.toLowerCase().includes(normalizedSearchTerm)
            );
            setSearchResults(filtered);
            setIsSearchLoading(false);
        }
    }, [searchTerm, allPokemons, pokemonList]);

    const handleFavoriteClick = (e, pokemon) => {
        e.stopPropagation();
        toggleFavorite(pokemon);
    };

    const displayedPokemon = searchTerm.trim() ? searchResults : pokemonList;

    return (
        <div className="p-4 bg-yellow-100 min-h-screen pt-24">
            {displayedPokemon.length === 0 && searchTerm && !isSearchLoading && (
                <p className="text-center text-gray-500 my-4">검색 결과가 없습니다.</p>
            )}
            <div className="grid grid-cols-3 gap-4">
                {displayedPokemon.map((pokemon, index) => {
                    const isFavorite = favorites.some(fav => fav.id === pokemon.id);
                    const isLastItem = !searchTerm && index === pokemonList.length - 1;

                    return (
                        <div
                            key={pokemon.id}
                            ref={isLastItem ? lastPokemonRef : null}
                            className="border border-gray-200 p-6 flex flex-col items-center cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-yellow-50 relative group"
                            onClick={() => navigate(`/detail/${pokemon.id}`)}
                        >
                            <Heart
                                onClick={(e) => handleFavoriteClick(e, pokemon)}
                                className={`absolute top-3 right-3 transition-all duration-300 ${isFavorite ? 'text-red-500 fill-current scale-110' : 'text-gray-300 group-hover:scale-110'
                                    }`}
                            />
                            <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                className="w-24 h-24 transition-transform duration-300 group-hover:scale-110"
                            />
                            <p className="mt-4 font-bold text-gray-700 text-lg">{pokemon.name}</p>
                        </div>
                    );
                })}
                {!searchTerm && isLoading && (
                    <div className="grid grid-cols-3 gap-4 col-span-3">
                        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                            <PokemonCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Main;