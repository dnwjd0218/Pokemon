import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFavoriteStore from '../store/FavoriteStore';
import { Heart } from 'lucide-react';

function Favorite() {
    const navigate = useNavigate();
    const { favorites, toggleFavorite, clearFavorites } = useFavoriteStore();

    const handleFavoriteClick = (e, pokemon) => {
        e.stopPropagation();
        toggleFavorite(pokemon);
    };

    const handlePokemonClick = (pokemonId) => {
        navigate(`/detail/${pokemonId}`);
    };

    return (
<div className="p-4 pt-24 bg-gradient-to-b from-yellow-50 to-yellow-100 min-h-screen">
    <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">찜한 포켓몬</h2>
            {favorites.length > 0 && (
                <button 
                    onClick={clearFavorites}
                    className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                    전체 삭제
                </button>
            )}
        </div>
            {favorites.length === 0 ? (
                <p className="text-center text-gray-500 my-4">찜한 포켓몬이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {favorites.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="border p-4 flex flex-col items-center cursor-pointer hover:bg-yellow-200 bg-white shadow-lg relative"
                            onClick={() => handlePokemonClick(pokemon.id)}
                        >
                            <Heart
                                onClick={(e) => handleFavoriteClick(e, pokemon)}
                                className="absolute top-2 right-2 text-red-500 fill-current"
                            />
                            <img src={pokemon.image} alt={pokemon.name} className="w-20 h-20" />
                            <p className="mt-2 font-bold text-gray-500">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
}

export default Favorite;