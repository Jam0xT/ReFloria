import { Loop } from '@/game/time';
import { World, StreamDataPackage } from '@/game/world';
import { defaultGameConfig, GameConfig } from "@/game/config/game";
import { sendMessage } from "@/router";
import { deepmergeInto } from "deepmerge-ts";
import { EntityType } from "@/game/config/entity";

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
        const tick = () => {
            this.world.tick.bind(this.world);
            Object.keys(this._playerEntityIDByWebSocketID).forEach(wsID => {
                const pkg = this.world.getStreamDataPackage(this._playerEntityIDByWebSocketID[wsID]);
                sendMessage(wsID, this._streamDataPackageToArrayBuffer(pkg));
            });
        };
        this._mainLoop = new Loop(tick, 1000 / this.config.ticksPerSecond!);
    }

    private _streamDataPackageToArrayBuffer(pkg: StreamDataPackage): ArrayBuffer {
        const totalByteLength = 8 + 8 + 8 + Object.keys(pkg.entities).length * (4 + 2 + 8 + 8);

        const buffer = new ArrayBuffer(totalByteLength);
        let byteOffset = 0;

        // [8*0, 8*1)
        const timeStamp = new BigUint64Array(buffer, byteOffset, 1);
        timeStamp[0] = BigInt(pkg.timeStamp);
        byteOffset += 8;

        // [8*1, 8*2)
        const x = new Float64Array(buffer, byteOffset, 1);
        x[0] = pkg.x;
        byteOffset += 8;

        // [8*2, 8*3)
        const y = new Float64Array(buffer, byteOffset, 1);
        y[0] = pkg.y;
        byteOffset += 8;

        Object.values(pkg.entities).forEach(entity => {
            // entity id (uint32) + type (uint16) + x (float64) + y(float64)
            // 4 + 2 + 8 + 8
            const entityIDUint32 = new Uint32Array(buffer, byteOffset, 1);
            entityIDUint32[0] = entity.id;
            const entityType = new Uint16Array(buffer, byteOffset + 4, 1);
            entityType[0] = entity.type;
            const entityX = new Float64Array(buffer, byteOffset + 8, 1);
            entityX[0] = entity.x;
            const entityY = new Float64Array(buffer, byteOffset + 16, 1);
            entityY[0] = entity.y;
            byteOffset += 24;
        });

        return buffer;
    }

    public assignPlayer(webSocketID: string): InitialMsg | false {
        if (this.unassignedPlayerEntityID.length <= 0) {
            console.log('Not enough player entities.');
            return false;
        }
        const newPlayerEntityID = this.unassignedPlayerEntityID.pop()!;
        this._playerEntityIDByWebSocketID[webSocketID] = newPlayerEntityID;
        return false; // should return the map
    }

    private _setUpPlayerEntity(playerCount: number) {
        console.log(playerCount, this.config.maxTeamSize);
        const teamCount = Math.ceil(playerCount / this.config.maxTeamSize);
        console.log(`teamCount: ${teamCount}`);
        for (let i = 0; i < teamCount; i++) {
            this.world.spawnEntityGroup(EntityType.player, this.config.maxTeamSize,
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