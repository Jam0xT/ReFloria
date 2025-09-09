import { DamageInstance, Entity } from "@/game/object/Entity";

class World {
    public static create(worldOptions: WorldOptions): World {
        return new World(worldOptions);
    }

    private static _newSeed() {
        // to be implemented
        return 'idkseed';
    }

    public static async readMapResources() {

    }

    private static _mapResources: Record<string, MapConfig> = {};

    private constructor(worldOptions: WorldOptions) {
        this._seed = worldOptions.seed || World._newSeed();
        this._generateMap(worldOptions.mapID);
    }

    private readonly _seed: string;

    public readonly entities: Entity[] = [];
    public readonly damageInstances: DamageInstance[] = [];

    private _generateMap(mapID: string) {
        const mapConfig = World._mapResources[mapID];
        const algo = mapConfig.generator.algorithm;
        switch (algo) {
            case 'random':

                break;
            default:
                console.log(`Invalid algorithm '${algo}'`);
                break;
        }
    }
    
    public tick() {

    }
}

interface WorldOptions {
    seed?: string; // 目前这个种子不会有任何用处。
    mapID: string; // 地图id
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