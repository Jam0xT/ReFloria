import Entity from '@/game/object/Entity';
import { Loop } from '@/game/Time';

interface GameOptions {
    ticksPerSecond: number;
}


class Game {
    public readonly entities: Entity[] = [];

    private readonly _mainLoop: Loop;

    private _initialized = false;

    constructor(gameOptions: GameOptions) {
        this._mainLoop = new Loop(this.tick.bind(this), gameOptions.ticksPerSecond);
    }

    public init() {
        this._initialized = true;
    }

    public startMainLoop() {
        if (!this._initialized) {
            throw new Error('Game: Attempt to start Main Loop before initialization.');
        }
        this._mainLoop.start().then(() => {console.log('Main Loop ended.');});
    }

    public endMainLoop() {
        if (!this._mainLoop.started) {
            throw new Error('Game: Attempt to end Main Loop before it is started.');
        }
        console.log('Attempting to end Main Loop.');
        this._mainLoop.end();
    }

    private tick() {

    }

    private resolveCollisions() {}
}

export default Game;