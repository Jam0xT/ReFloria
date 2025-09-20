import { Loop } from '@/game/time';
import { World } from '@/game/world';
import { defaultGameConfig, GameConfig } from "@/game/config/game";
import { deepmerge } from "deepmerge-ts";

class Game {
    public static games: Record<string, Game> = {}; // gameID -> Game

    public static create(gameID: string, config: Partial<GameConfig>, playerCount: number) {
        config = deepmerge(defaultGameConfig, config); // merge the config to defaultConfig so that any undefined value falls back to default
        const game = new Game(config as GameConfig);
        Game.games[gameID] = game;
        game._setUpPlayerEntity(playerCount);
        return game;
    }

    public readonly world: World;
    private readonly _mainLoop: Loop;
    public readonly config: GameConfig;
    private _playerEntityIDByWebSocketID: Record<string, string> = {}; // websocket id -> entity id
    public unassignedPlayerEntityID: string[] = [];

    private constructor(gameConfig: GameConfig) {
        this.config = gameConfig;
        this.world = World.create(this, {
            worldMapID: this.config.worldMapID,
        });
        const tick = this.world.tick.bind(this.world);
        this._mainLoop = new Loop(tick, 1000 / this.config.ticksPerSecond!);
    }

    private _setUpPlayerEntity(playerCount: number) {
        const teamCount = Math.ceil(playerCount / this.config.maxTeamSize);
        for (let i = 0; i < teamCount; i++) {
            this.world.spawnEntityGroup('player', this.world.getRandomPosition(), this.config.maxTeamSize);
        }
    }

    public startMainLoop() {
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
}

export {
    Game,
};