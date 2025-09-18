/*
定义：我们称一个拥有几何形状，可以判定与其他几何形状的关系的对象为碰撞箱。
 */
import { Vec2 } from '@/game/Math';

class Hitbox {
    private readonly _position: Vec2;
    public get position() { return this._position; }

    private readonly _radius: number;

    constructor(hitboxOptions: HitboxOptions) {
        this._position = hitboxOptions.position;
        this._radius =  hitboxOptions.radius;
    }

    // checks if this Hitbox intersects with another Hitbox
    public intersects(hitbox: Hitbox) {
        // to be implemented
        return false;
    }
}

interface HitboxOptions {
    position: Vec2;
    radius: number;
}

export default Hitbox;