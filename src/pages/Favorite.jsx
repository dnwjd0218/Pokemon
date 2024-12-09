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
        <div className="p-4 bg-yellow-100 min-h-screen">
            <div className="flex items-center mb-4 relative">
                <h2 className="text-2xl font-bold text-gray-700 flex-grow text-center">찜한 포켓몬</h2>
                {favorites.length > 0 && (
                    <button
                        onClick={clearFavorites}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 absolute right-0"
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
    );
}

export default Favorite;