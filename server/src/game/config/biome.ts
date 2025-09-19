type BiomeID = 'garden' | 'desert' | 'ocean';

const biomes:Record<BiomeID, Biome> = {
    'garden': {

    },
    'desert': {

    },
    'ocean': {

    }
}

interface Biome {

}

export {
    biomes,
    BiomeID,
}