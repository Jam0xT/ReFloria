import { Entity, PhysicalAttributes } from '@/game/object/entity';
import { Effect, Effectable } from "@/game/object/component/Effect";
import { Curse, Cursable } from "@/game/object/component/Curse";
import Hitbox from "@/game/object/hitbox";
import { Vec2, Circle } from '@/game/math';

class Player extends Entity
    implements Effectable, Cursable {

    public curseLevels: number[] = [];

    constructor(playerOptions: PlayerOptions) {
        super({
            hitbox: new Hitbox({
                position: playerOptions.position,
                radius: 1, // NO MAGIC NUMBER
            }),
            physicalAttributes: {}
        })
    }
}

interface PlayerOptions {
    position: Vec2;
}