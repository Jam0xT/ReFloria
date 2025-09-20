import { DamageInstance, Entity } from "@/game/object/entity";
import { selectFromWeightedPool, Vec2, random } from "@/game/math";
import { worldMaps, WorldMapID } from '@/game/config/worldMap';
import { EntityType } from "@/game/config/entity";
import { Game } from '@/game/game';

class World {
    public static create(game: Game, worldOptions: WorldConfig): World {
        return new World(game, worldOptions);
    }

    private static _newSeed() {
        // to be implemented
        return 'idkseed';
    }

    private _seed: string;
    public map!: string[][];
    private _width!: number;
    private _height!: number;

    public entities: Record<number, Entity> = {};
    private _prevEntityID: number = 0;
    public damageInstances: DamageInstance[] = [];
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
        this.map = [];
        switch (algo) {
            case 'random':
                for (let i = 0; i < mapConfig.heightChunks; i ++) {
                    this.map[i] = [];
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

interface WorldConfig {
    seed?: string; // 目前这个种子不会有任何用处
    worldMapID: WorldMapID;
}

export {
    World,
}