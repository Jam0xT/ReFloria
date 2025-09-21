import { BiomeType } from './biome';

type WorldMapID = 'default';

const worldMaps:Record<WorldMapID, WorldMap> = {
    'default': {
        widthChunks: 100,
        heightChunks: 100,
        generator: {
            pool: {
                [BiomeType.garden]: 1,
                [BiomeType.desert]: 1,
                [BiomeType.ocean]: 2,
            },
            algorithm: 'random',
        }
    }
}

type WorldMap = {
    widthChunks: number;
    heightChunks: number;
    generator: WorldMapGenerator;
}

type WorldMapGenerator = {
    pool: Partial<Record<BiomeType, number>>;
    algorithm: 'random';
}

export {
    worldMaps,
    WorldMapID,
}