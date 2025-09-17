import { WebSocket } from 'uWebSockets.js';
import { v4 as getUUID_v4 } from "uuid";
import { Room } from "@/src/room/room";

export const wsMap: Record<string, WebSocket<UserData>> = {}; // WebSocketID -> WebSocket<UserData>

export function onOpenWebSocket(ws: WebSocket<UserData>) {
    const userData = ws.getUserData();
    const newWebSocketID = getNewWebSocketID();
    wsMap[newWebSocketID] = ws;
    userData.webSocketID = newWebSocketID;
    console.log(`A new WebSocket connection has been established with ${newWebSocketID}!`);
}

export function onMessage(ws: WebSocket<UserData>, msg: ArrayBuffer) {
    const userData = ws.getUserData();
    const parsedMsg = decodeMsg(msg);
    console.log(`Received and parsed message from ${userData.webSocketID}: ${parsedMsg}`);
    console.log(parsedMsg.type);
    switch (parsedMsg.type) {
        case 'create': {
            Room.create(parsedMsg.value.nickName!, userData);
            break;
        }
        case 'join': {
            Room.join(
                parsedMsg.value.roomID!,
                parsedMsg.value.nickName!,
                userData
            );
            break;
        }
        case 'leave': {
            Room.leave(parsedMsg.value.roomID!, userData);
            break;
        }
        case 'toggleReady': {
            Room.toggleReady(parsedMsg.value.roomID!, userData);
            break;
        }
        default: {
            console.log(`Unknown message: ${parsedMsg}`);
        }
    }
}

export function onCloseWebSocket(ws: WebSocket<UserData>) {
    const userData = ws.getUserData();
    const roomID = userData.roomID;
    delete wsMap[userData.webSocketID];
    Room.leave(roomID, userData);
    console.log(`WebSocket connection with ${userData.webSocketID} closed.`);
}

function getNewWebSocketID() {
    return getUUID_v4();
}

export function encodeMsg(msg: RoomMsgToSend) {
    return JSON.stringify(msg);
}

export function decodeMsg(msg: ArrayBuffer): RoomMsgToReceive {
    return JSON.parse(Buffer.from(msg).toString('utf-8'));
}

interface RoomMsgToReceive {
    type: string;
    value: {
        nickName?: string;
        roomID?: string;
    };
}

interface RoomMsgToSend {
    type: string;
    value: {

    };
}

export interface UserData {
    webSocketID: string,
    roomID: string,
}