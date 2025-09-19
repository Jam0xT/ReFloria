import { DamageInstance, Entity } from "@/game/object/Entity";
import { selectFromWeightedPool } from "@/game/Math";
import { worldMaps, WorldMapID } from '@/game/config/worldMap';

class World {
    public static create(worldOptions: WorldConfig): World {
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

    private constructor(worldConfig: WorldConfig) {
        this._seed = worldConfig.seed || World._newSeed();
        this._generateMap(worldConfig.worldMapID);
    }

    private _generateMap(mapID: WorldMapID) {
        const mapConfig = worldMaps[mapID];
        const algo = mapConfig.generator.algorithm;
        switch (algo) {
            case 'random':
                for (let i = 0; i < mapConfig.heightChunks; i ++) {
                    for (let j = 0; j < mapConfig.widthChunks; j ++) {
                        this.map[i][j] = selectFromWeightedPool(mapConfig.generator.pool);
                    }
                }
                break;
            default:
                console.log(`Invalid algorithm '${algo}'`);
                break;
        }
    }
    
    public tick() {

    }
}

interface WorldConfig {
    seed?: string; // 目前这个种子不会有任何用处。
    worldMapID: WorldMapID; // 地图id
}

export {
    World,
}