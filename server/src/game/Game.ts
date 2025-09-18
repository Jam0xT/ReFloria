import { Loop } from '@/game/Time';
import { Curse } from '@/game/object/component/Curse';
import { Effect } from "@/game/object/component/Effect";
import { World } from '@/game/World';
import { defaultGameConfig, GameConfig } from "@/game/config/game";

class Game {
    public static games: Record<string, Game> = {};

    public static create(gameID: string, config: GameConfig) {
        Object.keys(defaultGameConfig).forEach(key => {
            config[key] ??= defaultGameConfig[key];
        })
        const game = new Game(config);
        Game.games[gameID] = game;
        return game;
    }

    private constructor(gameConfig: GameConfig) {
        this.world = World.create({
            mapID: 'default',
        });
        const tick = this.world.tick.bind(this.world);
        this._mainLoop = new Loop(tick, 1000 / gameConfig.ticksPerSecond!);
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

export {
    Game,
};