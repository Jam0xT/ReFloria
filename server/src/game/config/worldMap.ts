import { BiomeID } from './biome';

type WorldMapID = 'default';

const worldMaps:Record<WorldMapID, WorldMap> = {
    'default': {
        widthChunks: 100,
        heightChunks: 100,
        generator: {
            pool: {
                'garden': 1,
                'desert': 1,
                'ocean': 2,
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
    pool: Partial<Record<BiomeID, number>>;
    algorithm: 'random';
}

export {
    worldMaps,
    WorldMapID,
}