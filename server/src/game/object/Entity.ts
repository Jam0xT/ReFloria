/*
An Entity is what collides with and applies physics to other entities.
 */
import { Vec2 } from '@/game/Math';
import Hitbox from '@/game/object/Hitbox';
import { Game } from '@/game/Game'

abstract class Entity {
    protected readonly _hitbox: Hitbox;
    public get hitbox(): Hitbox {
        return this._hitbox;
    }

    private readonly _velocity: Vec2;
    public get velocity(): Vec2 {
        return this._velocity;
    }

    protected constructor(entityOptions: EntityOptions) {
        this._hitbox = entityOptions.hitbox;
        this._velocity = Vec2.zero();
    }

    /*
    more notes...
    when (two) entities (A, B) collide, 2 things should happen:
    1. physics should be applied, since all entities are involved in the physics system
    2. two DamageInstance s should be created, one pointing toward B, the other toward A.
        all entities can be damaged, though some of them might be invulnerable and won't actually take damage
     */
    public static resolveCollisions(game: Game) {
        const entities = game.entities;

        type CollisionInstance = [Entity, Entity];
        const collisions: CollisionInstance[] = [];

        // do some magic, get all the collisions and put them in a CollisionInstance[]

        collisions.forEach(collision => {
            // apply some physics
        });
    }
}

interface EntityOptions {
    hitbox: Hitbox;
    physicalAttributes: PhysicalAttributes;

    // a ghost entity will not be involved in ANY collision, e.g. player in spectator mode
    isGhost: boolean;
}

interface PhysicalAttributes {
    // just to name a few but some of them might be actually useless
    mass: number;
    movement_friction: number;
    knockback: number;
    elasticity: number;
}

class DamageInstance {
    public static create(game: Game, source: Entity, target: Entity) {

    }
    private constructor() {}
}

export {
    Entity,
    PhysicalAttributes,
    DamageInstance,
}