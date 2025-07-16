import { DamageInstance, Entity } from "@/game/object/Entity";

class World {
    public static create(worldOptions: WorldOptions): World {
        return new World(worldOptions);
    }

    private static _newSeed() {
        const seed = 'some magic seed';
        // to be implemented
        return seed;
    }

    private constructor(worldOptions: WorldOptions) {
        this._seed = worldOptions.seed || World._newSeed();
    }

    public readonly entities: Entity[] = [];
    public readonly damageInstances: DamageInstance[] = [];

    private readonly _seed: string;

    public tick() {

    }
}

interface WorldOptions {
    seed?: string;
}

export {
    World,
    WorldOptions,
}