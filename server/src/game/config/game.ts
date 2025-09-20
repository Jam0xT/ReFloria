import { WorldMapID } from '@/game/config/worldMap';

const defaultGameConfig: GameConfig = {
    ticksPerSecond: 25,
    chunkSize: 100,
    worldMapID: 'default',
    maxTeamSize: 2,
    teamSpreadRadius: 20,
}

interface GameConfig {
    ticksPerSecond: number;
    chunkSize: number;
    worldMapID: WorldMapID;
    maxTeamSize: number;
    teamSpreadRadius: number;
}

export {
    defaultGameConfig,
    GameConfig,
}