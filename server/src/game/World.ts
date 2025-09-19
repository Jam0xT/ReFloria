import { DamageInstance, Entity } from "@/game/object/Entity";
import { selectFromWeightedPool } from "@/game/Math";
import { worldMaps, WorldMapID } from '@/game/config/worldMap';

class World {
    public static create(worldOptions: WorldOptions): World {
        return new World(worldOptions);
    }

    private static _newSeed() {
        // to be implemented
        return 'idkseed';
    }

    private readonly _seed: string;
    public map!: string[][];
    public readonly entities: Entity[] = [];
    public readonly damageInstances: DamageInstance[] = [];

    private constructor(worldOptions: WorldOptions) {
        this._seed = worldOptions.seed || World._newSeed();
        this._generateMap(worldOptions.worldMapID);
    }

    private _generateMap(mapID: WorldMapID) {
        // const mapConfig = worldMaps[mapID];
        // const gridWidth = Math.ceil(mapConfig.width / mapConfig.biome_size);
        // const gridHeight = Math.ceil(mapConfig.height / mapConfig.biome_size);
        // const algo = mapConfig.generator.algorithm;
        // switch (algo) {
        //     case 'random':
        //         for (let i = 0; i < gridHeight; i ++) {
        //             for (let j = 0; j < gridWidth; j ++) {
        //                 this.map[i][j] = selectFromWeightedPool(mapConfig.generator.pool);
        //             }
        //         }
        //         break;
        //     default:
        //         console.log(`Invalid algorithm '${algo}'`);
        //         break;
        // }
    }
    
    public tick() {

    }
}

interface WorldOptions {
    seed?: string; // 目前这个种子不会有任何用处。
    worldMapID: WorldMapID; // 地图id
}

interface MapConfig {
    width: number;
    height: number;
    biome_size: number;
    generator: {
        pool: Record<string, number>,
        algorithm: string
    }
}

export {
    World,
    WorldOptions,
}