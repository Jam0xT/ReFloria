import { Loop } from '@/game/Time';
import { Curse } from '@/game/object/component/Curse';
import { Effect } from "@/game/object/component/Effect";
import { World } from '@/game/World';

class Game {
    public static games: Record<string, Game> = {};

    // game is ready when all game resources are read. must be ready before calling Game.create()
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
        if (!Game._isReady) {
            console.log('Attempting to create Game before resources are read.')
            return null;
        }
        const game = new Game(options);
        Game.games[gameID] = game;
        return game;
    }

    private constructor(options: GameOptions) {
        this.world = World.create({});
        const tick = this.world.tick.bind(this.world);
        this._mainLoop = new Loop(tick, 1000 / options.ticksPerSecond);
    }

    public readonly world: World;

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

    // game must be initialized before calling startMainLoop()
    private _initialized = false;

    public init() {
        this._initialized = true;
        return this;
    }
}

interface GameOptions {
    ticksPerSecond: number;
}

export {
    Game,
    GameOptions,
};

/*
alright, I need some more notes on the game's running process
0.
before ANY Game instance is created, we MUST read all the resources from config first.
the resources basically define everything in the game, like how entities behave, what events happen at what timestamp etc.
1.
after Game is ready (all resources are read), the server starts listening to requests from api
2.

 */