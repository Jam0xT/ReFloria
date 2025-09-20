import { Vec2 } from '@/game/math';

class Hitbox {
    public position: Vec2;
    public radius: number;

    constructor(position: Vec2, radius: number) {
        this.position = position;
        this.radius = radius;
    }

    // checks if this Hitbox intersects with another Hitbox
    public intersects(hitbox: Hitbox) {
        // to be implemented
        return false;
    }
}

export default Hitbox;