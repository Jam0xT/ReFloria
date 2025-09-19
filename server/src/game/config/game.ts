import { WorldMapID } from '@/game/config/worldMap';

const defaultGameConfig: GameConfig = {
    ticksPerSecond: 25,
    chunkSize: 100,
    worldMapID: 'default',
}

interface GameConfig {
    ticksPerSecond: number;
    chunkSize: number;
    worldMapID: WorldMapID;
}

export {
    defaultGameConfig,
    GameConfig,
}