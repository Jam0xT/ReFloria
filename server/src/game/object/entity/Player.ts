import Entity from '@/game/object/Entity';
import { Effect, Effectable } from "@/game/object/component/Effect";
import { Curse, Cursable } from "@/game/object/component/Curse";
import Hitbox from "@/game/object/Hitbox";
import { Vec2, Circle } from '@/game/Math';

class Player extends Entity
    implements Effectable, Cursable {

    public curseLevels: number[] = [];

    constructor(playerOptions: PlayerOptions) {
        super({
            hitbox: new Hitbox({
                position: playerOptions.position,
                shape: new Circle(1), // NO MAGIC NUMBER
            }),
        })
    }
}

interface PlayerOptions {
    position: Vec2;
}