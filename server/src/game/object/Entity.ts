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
        const entities = game.world.entities;

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

/*
A DamageInstance represents the damage event FROM source entity TO target entity
it only stores information and does nothing else until resolve() is called
 */
class DamageInstance {
    // creates a DamageInstance and puts it in the desired game's damageInstances
    public static create(game: Game, source: Entity, target: Entity) {

    }

    private _source: Entity;
    private _target: Entity;

    private constructor(source: Entity, target: Entity) {
        this._source = source;
        this._target = target;
    }

    public resolve() {}
}

export {
    Entity,
    PhysicalAttributes,
    DamageInstance,
}

/*
perhaps I should remove the Effectable and Cursable interfaces and make all entities Effectable and Cursable
I could just add tags to entities to determine whether one can be affected by specific group of features

each entity has a Behavior object that decides when and how the entity trigger events

a DamageSourceModifier to modify a DamageInstance FROM the current entity (since it acts as the source here), and
a DamageTargetModifier to modify a DamageInstance TO the current entity (since it acts as the target here)

stateful or stateless??
 */