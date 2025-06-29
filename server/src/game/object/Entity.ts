/*
定义：我们称一个控制碰撞箱对碰撞事件产生物理反应的对象为实体。
 */
import { Vec2 } from '@/game/Math';
import Hitbox from '@/game/object/Hitbox';
import Game from '@/game/Game'

abstract class Entity {
    protected readonly _hitbox: Hitbox;
    public get hitbox(): Hitbox {
        return this._hitbox;
    }

    private readonly _velocity: Vec2;
    public get  velocity(): Vec2 {
        return this._velocity;
    }

    protected constructor(entityOptions: EntityOptions) {
        this._hitbox = entityOptions.hitbox;
        this._velocity = Vec2.zero();
    }

    // somehow detect all the collisions and put them in a CollisionInstance[]
    public static detectCollisions(game: Game): CollisionInstance[] {
        const entities = game.entities;
        return [];
    }

    public resolveCollision(entity: Entity) {

    }
}

type CollisionInstance = [Entity, Entity];

interface EntityOptions {
    hitbox: Hitbox;
}

export default Entity;