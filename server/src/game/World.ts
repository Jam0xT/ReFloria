import { DamageInstance, Entity } from "@/game/object/Entity";
import { selectFromWeightedPool, Vec2, random } from "@/game/Math";
import { worldMaps, WorldMapID } from '@/game/config/worldMap';
import { Game } from '@/game/Game';

class World {
    public static create(game: Game, worldOptions: WorldConfig): World {
        return new World(game, worldOptions);
    }

    private static _newSeed() {
        // to be implemented
        return 'idkseed';
    }

    private readonly _seed: string;
    public map!: string[][];
    private _width!: number;
    private _height!: number;

    public readonly entities: Record<number, Entity> = {};
    private _prevEntityID: number = 0;
    public readonly damageInstances: DamageInstance[] = [];
    public game: Game;

    private constructor(game: Game, worldConfig: WorldConfig) {
        this.game = game;
        this._seed = worldConfig.seed || World._newSeed();
        this._generateMap(worldConfig.worldMapID);
    }

    private _getNextEntityID(): number {
        this._prevEntityID ++;
        return this._prevEntityID;
    }

    private _generateMap(mapID: WorldMapID) {
        const mapConfig = worldMaps[mapID];
        this._width = mapConfig.widthChunks * this.game.config.chunkSize;
        this._height = mapConfig.heightChunks * this.game.config.chunkSize;
        const algo = mapConfig.generator.algorithm;
        switch (algo) {
            case 'random':
                for (let i = 0; i < mapConfig.heightChunks; i ++) {
                    for (let j = 0; j < mapConfig.widthChunks; j ++) {
                        this.map[i][j] = selectFromWeightedPool(mapConfig.generator.pool);
                    }
                }
                break;
            default:
                console.log(`Invalid algorithm '${algo}'`);
                break;
        }
    }
    
    public tick() {

    }

    public spawnEntityGroup(entityType: string, centerPosition: Vec2, count: number) {

    }

    public spawnEntity(entityType: string, position: Vec2) {

        if (entityType == 'player') {
            this.game.unassignedPlayerEntityID.push(); // push the entity id
        }
    }

    public getRandomPosition(): Vec2 {
        return new Vec2(random(0, this._width), random(0, this._height));
    }
}

interface WorldConfig {
    seed?: string; // 目前这个种子不会有任何用处。
    worldMapID: WorldMapID; // 地图id
}

export {
    World,
}