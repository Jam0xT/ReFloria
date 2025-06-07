interface Config {
    gameServerList: GameServer[];
}

interface GameServer {
    region: string;
    ip: string;
}

const config: Config = {
    gameServerList: [
        {
            region: 'LCH',
            ip: '127.0.0.1',
        },
    ],
}

export default config;