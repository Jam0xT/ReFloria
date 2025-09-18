const defaultGameConfig: GameConfig = {
    ticksPerSecond: 25,
}

interface GameConfig {
    [key: string]: any;
    ticksPerSecond?: number;
}

export {
    defaultGameConfig,
    GameConfig,
}