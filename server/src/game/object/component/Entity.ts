/*
定义：我们称一个控制碰撞箱对碰撞事件产生物理反应的对象为实体。
 */
import { Vec2 } from '../../Math';
import Hitbox from './Hitbox';

abstract class Entity {
    protected readonly _hitbox: Hitbox;
    public get hitbox(): Hitbox {
        return this._hitbox;
    }

    private readonly _velocity: Vec2;

    protected constructor(entityOptions: EntityOptions) {
        this._hitbox = entityOptions.hitbox;
        this._velocity = Vec2.zero();
    }

    public resolveCollision(entity: Entity) {

    }
}

interface EntityOptions {
    hitbox: Hitbox;
}

export default Entity;