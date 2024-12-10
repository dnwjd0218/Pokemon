import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NameSkeleton = () => (
    <div className="text-4xl font-bold mb-8 text-center text-gray-800">
        <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto" />
    </div>
);

const ImageSkeleton = () => (
    <div className="w-48 h-48 bg-gray-200 rounded-lg animate-pulse mx-auto" />
);

const InfoCardSkeleton = () => (
    <div className="p-6 rounded-xl border border-gray-100 bg-white shadow-md">
        <div className="text-xl font-bold mb-4 text-gray-700">
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="text-gray-600">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2" />
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
            <div className="p-4 pt-24 bg-yellow-100 min-h-screen">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    <NameSkeleton />
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-inner">
                        <ImageSkeleton />
                    </div>
                    <div className="space-y-6">
                        {[...Array(5)].map((_, index) => (
                            <InfoCardSkeleton key={index} />
                        ))}
                    </div>
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
        <div className="p-4 pt-24 bg-yellow-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">{pokemonData.name}</h1>
                <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-inner">
                    <img
                        src={isFront ? pokemonData.frontImage : pokemonData.backImage}
                        alt={pokemonData.name}
                        className="w-48 h-48 mx-auto cursor-pointer transition-all duration-300 hover:scale-110"
                        onClick={() => setIsFront(!isFront)}
                    />
                </div>
                <div className="space-y-6">
                    {infoItems.map((item, idx) =>
                        item && (
                            <div
                                key={idx}
                                className="p-6 rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <h2 className="text-xl font-bold mb-4 text-gray-700">{item.title}</h2>
                                {item.type === "list" ? (
                                    <ul className="list-disc pl-6 space-y-2">
                                        {item.content.map((entry, index) => (
                                            <li key={index} className="text-gray-600">{entry}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-600">{item.content}</div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Detail;