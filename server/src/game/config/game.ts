import { WorldMapID } from '@/game/config/worldMap';

const defaultGameConfig: GameConfig = {
    ticksPerSecond: 25,
    chunkSize: 100,
    worldMapID: 'default',
    maxTeamSize: 2,
}

interface GameConfig {
    ticksPerSecond: number;
    chunkSize: number;
    worldMapID: WorldMapID;
    maxTeamSize: 2,
}

export {
    defaultGameConfig,
    GameConfig,
}