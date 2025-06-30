import Entity from '@/game/object/Entity';
import { Loop } from '@/game/Time';
import { Curse } from '@/game/object/component/Curse';
import {Effect} from "@/game/object/component/Effect";

class Game {
    public static games: Record<string, Game> = {};

    // Game is ready when all game resources are read.
    private static _isReady = false;
    public static get isReady() {return Game._isReady;}

    public static readResources() {
        console.log('Reading Curse resources.')
        Curse.readResources()
            .then(() => {
                console.log('Successfully read Curse resources.');
                console.log('Reading Effect resources.');
                return Effect.readResources();
            })
            .finally(() => {
                console.log('All game resources are read.');
                Game._isReady = true;
            })
            .catch((err: unknown) => {
                console.error(`Error reading game resources: ${err}`);
            });
    }

    public static create(gameID: string, options: GameOptions) {
        if (!Game.isReady) {
            console.log('Attempting to create Game before resources are read.')
            return null;
        }
        const game = new Game(options);
        Game.games[gameID] = game;
        return game;
    }

    private constructor(options: GameOptions) {
        this._mainLoop = new Loop(this.tick.bind(this), options.ticksPerSecond);
    }

    public readonly entities: Entity[] = [];

    private readonly _mainLoop: Loop;

    public startMainLoop() {
        if (!this._initialized) {
            console.error('Game: Attempt to start Main Loop before initialization.');
            return null;
        }
        this._mainLoop.start().then(() => {console.log('Main Loop ended.');});
        return this;
    }

    public endMainLoop() {
        if (!this._mainLoop.started) {
            throw new Error('Game: Attempt to end Main Loop before it is started.');
        }
        console.log('Attempting to end Main Loop.');
        this._mainLoop.end();
    }

    private _initialized = false;

    public init() {
        this._initialized = true;
        return this;
    }

    private tick() {
        Entity.resolveCollisions(this);
    }
}

interface GameOptions {
    ticksPerSecond: number;
}

export {
    Game,
    GameOptions,
};