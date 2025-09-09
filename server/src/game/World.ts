import { DamageInstance, Entity } from "@/game/object/Entity";

class World {
    public static create(worldOptions: WorldOptions): World {
        return new World(worldOptions);
    }

    private static _newSeed() {
        // to be implemented
        return 'idkseed';
    }

    private constructor(worldOptions: WorldOptions) {
        this._seed = worldOptions.seed || World._newSeed();
        this._generateMap(worldOptions.mapID);
    }

    private readonly _seed: string;

    public readonly entities: Entity[] = [];
    public readonly damageInstances: DamageInstance[] = [];

    private _generateMap(mapID: string) {

    }
    
    public tick() {

    }
}

interface WorldOptions {
    seed?: string; // 目前这个种子不会有任何用处。
    mapID: string; // 地图id
}

export {
    World,
    WorldOptions,
}