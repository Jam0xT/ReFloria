import { DamageInstance, Entity } from "@/game/object/entity";
import { selectFromWeightedPool, Vec2, random } from "@/game/math";
import { worldMaps, WorldMapID } from '@/game/config/worldMap';
import { BiomeType } from "@/game/config/biome";
import { EntityType } from "@/game/config/entity";
import { Game } from '@/game/game';

class World {
    public static create(game: Game, worldOptions: WorldConfig): World {
        return new World(game, worldOptions);
    }

    public map!: string[][];
    public chunks: Record<number, Chunk> = {}; // chunk id -> chunk
    private _width!: number;
    private _height!: number;
    private _widthChunks!: number;
    private _heightChunks!: number;

    public entities: Record<number, Entity> = {};
    private _prevEntityID: number = 0;
    public game: Game;
    public tickCount: number = 0;

    private constructor(game: Game, worldConfig: WorldConfig) {
        this.game = game;
        this._generateMap(worldConfig.worldMapID);
    }

    private _getNextEntityID(): number {
        this._prevEntityID ++;
        return this._prevEntityID;
    }

    private _generateMap(worldMapID: WorldMapID) {
        const worldMap = worldMaps[worldMapID];
        this._widthChunks = worldMap.widthChunks;
        this._heightChunks = worldMap.heightChunks;
        this._width = this._widthChunks * this.game.config.chunkSize;
        this._height = this._heightChunks * this.game.config.chunkSize;
        const algo = worldMap.generator.algorithm;
        switch (algo) {
            case 'random':
                for (let i = 0; i < this._heightChunks; i ++) {
                    for (let j = 0; j < this._widthChunks; j ++) {
                        this.chunks[i * this._heightChunks + j] = {
                            biome: selectFromWeightedPool<BiomeType>(worldMap.generator.pool),
                            entityIDs: [],
                        }
                    }
                }
                break;
            default:
                console.log(`Invalid algorithm '${algo}'`);
                break;
        }
    }
    
    public tick() {
        this.tickCount ++;
    }

    public spawnEntityGroup(entityType: EntityType, count: number
                            , centerPosition: Vec2, spreadRadius: number) {
        for (let i = 0; i < count; i++) {
            this.spawnEntity(
                entityType,
                centerPosition.add(
                    Vec2.createUnit(random(0, Math.PI * 2))
                        .scale(random(0, spreadRadius))
                )
            );
        }
    }

    public spawnEntity(entityType: EntityType, position: Vec2) {
        console.log('spawned entity');
        const newEntityID = this._getNextEntityID();
        const newEntity = new Entity(entityType, newEntityID, position);
        this.entities[newEntityID] = newEntity;
        if (entityType == 'player') {
            console.log('spawned player');
            this.game.unassignedPlayerEntityID.push(newEntityID); // push the entity id
        }
    }

    public getRandomPosition(): Vec2 {
        return new Vec2(random(0, this._width), random(0, this._height));
    }
}

type Chunk = {
    biome: BiomeType;
    entityIDs: number[];
}

type WorldConfig = {
    worldMapID: WorldMapID;
}

export {
    World,
}