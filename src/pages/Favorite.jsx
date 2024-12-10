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
        <div className="p-4 pt-24 bg-yellow-100 min-h-screen">
            <div className="relative mb-8">  
                <h2 className="text-3xl font-bold text-gray-800 text-center">찜한 포켓몬</h2>  
                {favorites.length > 0 && (
                    <button
                        onClick={clearFavorites}
                        className="absolute top-0 right-0 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
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
                            className="border border-gray-200 p-6 flex flex-col items-center cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-yellow-50 relative group"
                            onClick={() => handlePokemonClick(pokemon.id)}
                        >
                            <Heart
                                onClick={(e) => handleFavoriteClick(e, pokemon)}
                                className="absolute top-3 right-3 text-red-500 fill-current transition-all duration-300 hover:scale-110"
                            />
                            <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                className="w-24 h-24 transition-transform duration-300 group-hover:scale-110"
                            />
                            <p className="mt-4 font-bold text-gray-700 text-lg">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favorite;