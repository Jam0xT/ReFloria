import { Loop } from '@/game/time';
import { World } from '@/game/world';
import { defaultGameConfig, GameConfig } from "@/game/config/game";
import { deepmergeInto } from "deepmerge-ts";

class Game {
    public static games: Record<string, Game> = {}; // gameID -> Game

    public static create(gameID: string, config: Partial<GameConfig>, playerCount: number) {
        const finalConfig = structuredClone(defaultGameConfig);
        deepmergeInto(finalConfig, config);
        const game = new Game(finalConfig);
        Game.games[gameID] = game;
        game._setUpPlayerEntity(playerCount);
        return game;
    }

    public readonly world: World;
    private readonly _mainLoop: Loop;
    public readonly config: GameConfig;
    private _playerEntityIDByWebSocketID: Record<string, number> = {}; // websocket id -> entity id
    public unassignedPlayerEntityID: number[] = [];

    private constructor(gameConfig: GameConfig) {
        this.config = gameConfig;
        this.world = World.create(this, {
            worldMapID: this.config.worldMapID,
        });
        const tick = this.world.tick.bind(this.world);
        this._mainLoop = new Loop(tick, 1000 / this.config.ticksPerSecond!);
    }

    public assignPlayer(webSocketID: string): InitialMsg | false {
        if (this.unassignedPlayerEntityID.length <= 0) {
            console.log('Not enough player entities.');
            return false;
        }
        const newPlayerEntityID = this.unassignedPlayerEntityID.pop()!;
        this._playerEntityIDByWebSocketID[webSocketID] = newPlayerEntityID;
        return {
            map: this.world.map,
            position: {
                x: this.world.entities[newPlayerEntityID].hitbox.position.x,
                y: this.world.entities[newPlayerEntityID].hitbox.position.y,
            }
        };
    }

    private _setUpPlayerEntity(playerCount: number) {
        console.log(playerCount, this.config.maxTeamSize);
        const teamCount = Math.ceil(playerCount / this.config.maxTeamSize);
        console.log(`teamCount: ${teamCount}`);
        for (let i = 0; i < teamCount; i++) {
            this.world.spawnEntityGroup('player', this.config.maxTeamSize,
                this.world.getRandomPosition(), this.config.teamSpreadRadius);
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

type InitialMsg = {
    map: string[][];
    position: {
        x: number;
        y: number;
    };
}

export {
    Game,
};