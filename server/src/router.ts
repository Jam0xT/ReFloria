import { App, WebSocket } from 'uWebSockets.js';
import { v4 as getUUID_v4 } from 'uuid';
import Config from './config';
import { Room } from '@/room';

const app = App();
const wsMap: Record<string, WebSocket<UserData>> = {}; // WebSocketID -> WebSocket<UserData>

export function startRouter(config: Config) {
    app.get('/', (res, req) => {
        res.end('ok');
    }).ws<UserData>('/ws', {
        open: (ws) => {
            const userData = ws.getUserData();
            const newWebSocketID = getNewWebSocketID();
            wsMap[newWebSocketID] = ws;
            userData.webSocketID = newWebSocketID;
            console.log(`A new WebSocket connection has been established with ${newWebSocketID}!`);
            let msg :{type : string, options : {id : string}} = {
                type : "setId",
                options: {id : newWebSocketID}
            }
            ws.send(JSON.stringify(msg));
        },
        message: (ws, message) => {
            const userData = ws.getUserData();
            const parsedMsg: any = JSON.parse(Buffer.from(message).toString('utf-8'));
            console.log(`Received and parsed message from ${userData.webSocketID}: ${parsedMsg}`);
            switch (parsedMsg.type) {
                case 'createRoom': {
                    Room.create(parsedMsg.options, userData);
                    break;
                }
                case 'joinRoom': {
                    Room.join(parsedMsg.id, userData);
                    // send update message (room, wsid)
                    break;
                }
                case 'leaveRoom': {
                    Room.leave(parsedMsg.id, userData);
                    break;
                }
                case 'changeReadyStatus': {
                    Room.changeReadyStatus(parsedMsg.id, userData);
                    break;
                }
                case 'changeRoomPublicStatus': {
                    Room.changePublicStatus(parsedMsg.id);
                    break;
                }
                default: {
                    console.log(`Unknown message: ${parsedMsg}`);
                }
            }
        },
        close: (ws, code, message) => {
            const userData = ws.getUserData();
            const roomID = userData.roomID;
            Room.leave(roomID, userData);
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

export function sendMessage(webSocketID: string, msg: any) {
    wsMap[webSocketID].send(JSON.stringify(msg));
    return true;
}

function getNewWebSocketID() {
    return getUUID_v4();
}

export interface UserData {
    webSocketID: string,
    roomID: string,
}