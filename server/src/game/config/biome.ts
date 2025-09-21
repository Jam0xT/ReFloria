enum BiomeType {
    garden,
    desert,
    ocean,
}

const biomes:Record<BiomeType, Biome> = {
    [BiomeType.garden]: {},
    [BiomeType.desert]: {},
    [BiomeType.ocean]: {},
}

type Biome = {

}

export {
    biomes,
    BiomeType,
}