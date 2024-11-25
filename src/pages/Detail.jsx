import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Detail = () => {
    const { id } = useParams();
    const [pokemonData, setPokemonData] = useState({
        name: "",
        frontImage: "",
        backImage: "",
        description: "",
        genus: "",
        abilities: [],
        moves: [],
        nextEvolutionName: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isFront, setIsFront] = useState(true);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setIsLoading(true);
            try {
                // 포켓몬종
                const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
                const speciesData = speciesResponse.data;
                // 포켓몬
                const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
                const pokemonData = pokemonResponse.data;

                const name = speciesData.names.find(el => el.language.name === "ko")?.name || "이름 없음";
                const description = speciesData.flavor_text_entries.find(el => el.language.name === "ko")?.flavor_text.replace(/\n|\f/g, " ") || "설명 없음";
                const genus = speciesData.genera.find(el => el.language.name === "ko")?.genus || "종 정보 없음";
                // 특성
                const abilities = await Promise.all(
                    pokemonData.abilities.map(async abilityInfo => {
                        const abilityResponse = await axios.get(abilityInfo.ability.url);
                        return abilityResponse.data.names.find(el => el.language.name === "ko")?.name || "특성 이름 없음";
                    })
                );
                // 기술
                const moves = await Promise.all(
                    pokemonData.moves.slice(0, 5).map(async moveInfo => {
                        const moveResponse = await axios.get(moveInfo.move.url);
                        return moveResponse.data.names.find(el => el.language.name === "ko")?.name || "기술 이름 없음";
                    })
                );
                // 진화
                const evolutionChainUrl = speciesData.evolution_chain.url;
                const evolutionChainResponse = await axios.get(evolutionChainUrl);
                const evolutionChain = evolutionChainResponse.data.chain;

                const findNextEvolution = async (chain) => {
                    if (chain.evolves_to.length > 0) {
                        const nextEvolutionSpeciesUrl = chain.evolves_to[0].species.url;
                        const nextEvolutionSpeciesResponse = await axios.get(nextEvolutionSpeciesUrl);
                        const nextEvolutionSpeciesData = nextEvolutionSpeciesResponse.data;
                        const nextEvolutionName = nextEvolutionSpeciesData.names.find(el => el.language.name === "ko")?.name || "진화 없음";

                        return nextEvolutionName;
                    }
                    return null;
                };

                const nextEvolutionName = await findNextEvolution(evolutionChain);

                setPokemonData({
                    name,
                    frontImage: pokemonData.sprites.front_default,
                    backImage: pokemonData.sprites.back_default,
                    description,
                    genus,
                    abilities,
                    moves,
                    nextEvolutionName: nextEvolutionName || "진화 없음",
                });
            } catch (error) {
                console.error("포켓몬 정보 오류 발생", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-100">
                <p className="text-2xl font-bold text-gray-500">loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6 bg-yellow-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">{pokemonData.name}</h1>
            <div className="mb-6">
                <img
                    src={isFront ? pokemonData.frontImage : pokemonData.backImage}
                    alt={pokemonData.name}
                    className="w-40 h-40 mx-auto cursor-pointer"
                    onClick={() => setIsFront(!isFront)}
                />
            </div>
            <div className="w-full max-w-lg space-y-4">
                {[
                    { title: "설명", content: pokemonData.description },
                    { title: "종", content: pokemonData.genus },
                    {
                        title: "특성",
                        content: (
                            <ul className="list-disc pl-5">
                                {pokemonData.abilities.map((ability, index) => (
                                    <li key={index}>{ability}</li>
                                ))}
                            </ul>
                        ),
                    },
                    {
                        title: "기술",
                        content: (
                            <ul className="list-disc pl-5">
                                {pokemonData.moves.map((move, index) => (
                                    <li key={index}>{move}</li>
                                ))}
                            </ul>
                        ),
                    },
                    pokemonData.nextEvolutionName !== "진화 없음" && {
                        title: "다음 진화 포켓몬",
                        content: pokemonData.nextEvolutionName,
                    },
                ].map(
                    (item, idx) =>
                        item && (
                            <div
                                key={idx}
                                className="p-4 rounded-lg shadow-md border border-gray-200 bg-white hover:bg-yellow-50"
                            >
                                <h2 className="font-semibold text-lg mb-2 text-gray-500">{item.title}</h2>
                                <p className="text-gray-700">{item.content}</p>
                            </div>
                        )
                )}
            </div>
        </div>
    );
};

export default Detail;
