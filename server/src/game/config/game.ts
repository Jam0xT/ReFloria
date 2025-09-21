import { WorldMapID } from '@/game/config/worldMap';

const defaultGameConfig: GameConfig = {
    ticksPerSecond: 25,
    chunkSize: 100,
    worldMapID: 'default',
    maxTeamSize: 2,
    teamSpreadRadius: 20,
    naturalSpawnCycleTicks: 125,
    activeRadius: 500,
    unloadRadius: 1000,
}

interface GameConfig {
    ticksPerSecond: number;
    chunkSize: number;
    worldMapID: WorldMapID;
    maxTeamSize: number;
    teamSpreadRadius: number;
    naturalSpawnCycleTicks: number;
    activeRadius: number;
    unloadRadius: number;
}

export {
    defaultGameConfig,
    GameConfig,
}