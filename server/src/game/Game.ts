import { Loop } from '@/game/Time';
import { World } from '@/game/World';
import { defaultGameConfig, GameConfig } from "@/game/config/game";

class Game {
    public static games: Record<string, Game> = {};

    public static create(gameID: string, config: Partial<GameConfig>) {
        config = {...defaultGameConfig, ...config}; // merge the config to defaultConfig so that any undefined value falls back to default
        const game = new Game(config as GameConfig);
        Game.games[gameID] = game;
        return game;
    }

    public readonly world: World;

    private readonly _mainLoop: Loop;

    private _initialized = false;

    private constructor(gameConfig: GameConfig) {
        this.world = World.create({
            worldMapID: gameConfig.worldMapID,
        });
        const tick = this.world.tick.bind(this.world);
        this._mainLoop = new Loop(tick, 1000 / gameConfig.ticksPerSecond!);
    }

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

    public init() {
        this._initialized = true;
        return this;
    }
}

export {
    Game,
};