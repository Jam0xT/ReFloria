enum BiomeType {
    garden,
    desert,
    ocean,
}

const biomes:Record<BiomeType, Biome> = {
    [BiomeType.garden]: {
        color: '#55b56f',
    },
    [BiomeType.desert]: {
        color: '#e6dd6c',
    },
    [BiomeType.ocean]: {
        color: '#4f90db',
    }
}

type Biome = {
    color: string;
}

export {
    biomes,
    BiomeType,
}