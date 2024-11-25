import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSearchStore from '../store/SearchStore';

function Main() {
    const [pokemonList, setPokemonList] = useState([]);
    const [displayedPokemon, setDisplayedPokemon] = useState([]);
    const navigate = useNavigate();
    const searchTerm = useSearchStore((state) => state.searchTerm);

    useEffect(() => {
        async function fetchPokemonList() {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon-species?limit=151');
                const promises = response.data.results.map(async (pokemon) => {
                    const details = await axios.get(pokemon.url);
                    return {
                        id: details.data.id,
                        name: details.data.names.find((el) => el.language.name === 'ko').name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.data.id}.png`,
                    };
                });
                const results = await Promise.all(promises);
                setPokemonList(results);
                setDisplayedPokemon(results);
            } catch (error) {
                console.error('axios 오류', error);
            }
        }

        fetchPokemonList();
    }, []);

    useEffect(() => {
        if (!pokemonList.length) return;

        const filtered = pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        setDisplayedPokemon(filtered);
    }, [searchTerm, pokemonList]);

    return (
        <div className="p-4 bg-yellow-100 min-h-screen">
            {displayedPokemon.length === 0 && searchTerm && (
                <p className="text-center text-gray-500 my-4">검색 결과가 없습니다.</p>
            )}
            <div className="grid grid-cols-3 gap-4">
                {displayedPokemon.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="border p-4 flex flex-col items-center cursor-pointer hover:bg-yellow-200 bg-white shadow-lg"
                        onClick={() => navigate(`/detail/${pokemon.id}`)}
                    >
                        <img src={pokemon.image} alt={pokemon.name} className="w-20 h-20" />
                        <p className="mt-2 font-bold text-gray-500">{pokemon.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Main;
