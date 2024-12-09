import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NameSkeleton = () => (
    <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-6 mx-auto" />
);

const ImageSkeleton = () => (
    <div className="w-40 h-40 bg-gray-200 rounded-lg animate-pulse mx-auto mb-6" />
);

const InfoCardSkeleton = () => (
    <div className="p-4 rounded-lg shadow-md border border-gray-200 bg-white space-y-2">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
    </div>
);

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

                const findNextEvolution = async (chain, currentId) => {
                    const chainId = parseInt(chain.species.url.split('/').slice(-2, -1)[0]);
                    
                    if (chainId === currentId && chain.evolves_to.length > 0) {
                        const nextEvolutionSpeciesUrl = chain.evolves_to[0].species.url;
                        const nextEvolutionSpeciesResponse = await axios.get(nextEvolutionSpeciesUrl);
                        const nextEvolutionSpeciesData = nextEvolutionSpeciesResponse.data;
                        return nextEvolutionSpeciesData.names.find(el => el.language.name === "ko")?.name || "진화 없음";
                    }

                    if (chain.evolves_to.length > 0) {
                        const nextEvolution = await findNextEvolution(chain.evolves_to[0], currentId);
                        if (nextEvolution) return nextEvolution;
                    }

                    return null;
                };

                const nextEvolutionName = await findNextEvolution(evolutionChain, parseInt(id));

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
            <div className="flex flex-col items-center p-6 bg-yellow-100 min-h-screen">
                <NameSkeleton />
                <ImageSkeleton />
                <div className="w-full max-w-lg space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <InfoCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    const infoItems = [
        { title: "설명", content: pokemonData.description, type: "text" },
        { title: "종", content: pokemonData.genus, type: "text" },
        {
            title: "특성",
            content: pokemonData.abilities,
            type: "list"
        },
        {
            title: "기술",
            content: pokemonData.moves,
            type: "list"
        },
        pokemonData.nextEvolutionName !== "진화 없음" && {
            title: "다음 진화 포켓몬",
            content: pokemonData.nextEvolutionName,
            type: "text"
        },
    ];

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
                {infoItems.map((item, idx) =>
                    item && (
                        <div
                            key={idx}
                            className="p-4 rounded-lg shadow-md border border-gray-200 bg-white hover:bg-yellow-50"
                        >
                            <h2 className="font-semibold text-lg mb-2 text-gray-500">{item.title}</h2>
                            {item.type === "list" ? (
                                <ul className="list-disc pl-5">
                                    {item.content.map((entry, index) => (
                                        <li key={index} className="text-gray-700">{entry}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-gray-700">{item.content}</div>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Detail;