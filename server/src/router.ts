import { App, WebSocket } from 'uWebSockets.js';
import { v4 as getUUID_v4 } from 'uuid';
import Config from './config';
import { Game } from './game/game';

const app = App();
const wsMap: Record<string, WebSocket<UserData>> = {}; // WebSocketID -> WebSocket<UserData>

export function startRouter(config: Config) {
    app.get('/', (res, req) => {
        res.end('ok');
    }).ws('/api', {
        open: (ws) => {
            console.log('Connected to the room api.');
        },
        message: (ws, message) => {
            const parsedMsg = JSON.parse(Buffer.from(message).toString('utf-8'));
            console.log(`Created Game with msg ${JSON.stringify(parsedMsg)}`);
            Game.create(parsedMsg.gameID, {}, parsedMsg.playerCount);
        },
        close: (ws, code, message) => {
            console.log('Disconnected from room api.');
        }
    }).ws<UserData>('/game', {
        open: (ws) => {
            const userData = ws.getUserData();
            const newWebSocketID = getNewWebSocketID();
            wsMap[newWebSocketID] = ws;
            userData.webSocketID = newWebSocketID;
            console.log(`A new WebSocket connection has been established with ${newWebSocketID}!`);
        },
        message: (ws, message) => {
            const userData = ws.getUserData();
            let parsedMsg: any = Buffer.from(message).toString('utf-8');
            console.log(`Received and parsed message from ${userData.webSocketID}: ${parsedMsg}`);
            // process the parsedMsg
            if (!userData.gameID) {
                // when the client first connects to the server
                const gameID = parsedMsg as string;
                userData.gameID = gameID;
                console.log(gameID);
                const response = Game.games[gameID].assignPlayer(userData.webSocketID);
                if (response) {
                    ws.send(JSON.stringify({
                        type: 'init',
                        value: response,
                    }));
                }
                return ;
            }
            parsedMsg = JSON.parse(parsedMsg);

        },
        close: (ws, code, message) => {
            const userData = ws.getUserData();
            console.log(`WebSocket connection with ${userData.webSocketID} closed.`);
        }
    }).listen(config.port, (token) => {
        if (token) {
            console.log(`Listening on port ${config.port}`);
        } else {
            console.log(`Failed to listen to port ${config.port}`);
        }
    });
}

export function sendMessage(webSocketID: string, msg: ArrayBuffer) {
    wsMap[webSocketID].send(msg);
    return true;
}

function getNewWebSocketID() {
    return getUUID_v4();
}

export interface UserData {
    webSocketID: string,
    gameID: string,
}