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

    public map!: string[][]; // abandoned. will delete soon

    // chunk id -> chunk; chunk id = y * w + x; top left(0, 0); bottom right(w, h)
    public chunks: Record<number, Chunk> = {};

    private _width!: number;
    private _height!: number;
    private _chunkSize: number;
    private _widthChunks!: number;
    private _heightChunks!: number;

    public entities: Record<number, Entity> = {};
    private _prevEntityID: number = 0;
    public game: Game;
    public tickCount: number = 0;

    private constructor(game: Game, worldConfig: WorldConfig) {
        this.game = game;
        this._chunkSize = this.game.config.chunkSize;
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

    public getInitialDataPackage(): InitialDataPackage {
        const result: InitialDataPackage = {
            chunkSize: this._chunkSize,
            widthChunks: this._widthChunks,
            heightChunks: this._heightChunks,
            worldMapBiome: [],
        };
        for (let i = 0; i < this._heightChunks; i ++) {
            for (let j = 0; j < this._widthChunks; j ++) {
                const chunkID = i * this._widthChunks + j;
                result.worldMapBiome[chunkID] = this.chunks[chunkID].biome;
            }
        }
        return result;
    }

    public getStreamDataPackage(entityID: number): StreamDataPackage {
        const subjectPos = this.entities[entityID].hitbox.position;

        const result: StreamDataPackage = {
            timeStamp: Date.now(),
            x: subjectPos.x,
            y: subjectPos.y,
            entities: {},
        };

        const chunkX = Math.floor(result.x / this._chunkSize);
        const chunkY =  Math.floor(result.y / this._chunkSize);
        const maxLoadRadiusChunks = Math.ceil(this.game.config.unloadRadius / this._chunkSize);

        for (let i = Math.max(0, chunkX - maxLoadRadiusChunks); i <= Math.min(this._widthChunks - 1, chunkX + maxLoadRadiusChunks); i++) {
            for (let j = Math.max(0, chunkY - maxLoadRadiusChunks); j <= Math.min(this._heightChunks - 1, chunkY + maxLoadRadiusChunks); j++) {
                const chunkCenter = new Vec2(
                    i * this._chunkSize + this._chunkSize / 2,
                    j * this._chunkSize + this._chunkSize / 2,
                );
                const distance = chunkCenter.sub(subjectPos).magnitude;
                if (distance < this.game.config.unloadRadius) {
                    this.chunks[j * this._widthChunks + i].entityIDs.forEach(entityID => {
                        const entity = this.entities[entityID];
                        result.entities[entityID] = {
                            x: entity.hitbox.position.x,
                            y: entity.hitbox.position.y,
                            type: entity.type,
                            id: entityID,
                        };
                    });
                }
            }
        }

        return result;
    }

    public getChunkIDByPosition(position: Vec2): number {
        const x = Math.floor(position.x / this.game.config.chunkSize);
        const y = Math.floor(position.y / this.game.config.chunkSize);
        return y * this._widthChunks + x;
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
        this.chunks[this.getChunkIDByPosition(position)].entityIDs.push(newEntityID);
        if (entityType == EntityType.player) {
            console.log('spawned player');
            this.game.unassignedPlayerEntityID.push(newEntityID);
        }
    }

    public getRandomPosition(): Vec2 {
        return new Vec2(random(0, this._width), random(0, this._height));
    }
}

type StreamDataPackage = {
    timeStamp: number;
    x: number;
    y: number;
    entities: Record<number, EntityStreamData>;
}

type EntityStreamData = {
    type: EntityType;
    id: number;
    x: number;
    y: number;
}

type InitialDataPackage = {
    chunkSize: number;
    widthChunks: number;
    heightChunks: number;
    worldMapBiome: BiomeType[];
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
    StreamDataPackage,
    InitialDataPackage,
}