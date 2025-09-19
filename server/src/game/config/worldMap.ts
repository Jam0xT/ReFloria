import { BiomeID } from './biome';

type WorldMapID = 'default';

const worldMaps:Record<WorldMapID, WorldMap> = {
    'default': {
        widthChunks: 100,
        heightChunks: 100,
        generator: {
            pool: {
                'garden': 1
            },
            algorithm: 'random',
        }
    }
}

interface WorldMap {
    widthChunks: number;
    heightChunks: number;
    generator: WorldMapGenerator;
}

interface WorldMapGenerator {
    pool: Partial<Record<BiomeID, number>>;
    algorithm: 'random';
}

export {
    worldMaps,
    WorldMapID,
}