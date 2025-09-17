import { WebSocket } from 'uWebSockets.js';
import {UserData} from "@/src/room/userData";
import {v4 as getUUID_v4} from "uuid";
import {wsMap} from "@/src/room/wsMap";
import {Room} from "@/src/room/room";

export function onOpenWebSocket(ws: WebSocket<UserData>) {
    const userData = ws.getUserData();
    const newWebSocketID = getNewWebSocketID();
    wsMap[newWebSocketID] = ws;
    userData.webSocketID = newWebSocketID;
    console.log(`A new WebSocket connection has been established with ${newWebSocketID}!`);
    let msg: RoomMsg = {
        type : "setId",
        options: {id : newWebSocketID}
    }
    ws.send(encodeMsg(msg));
}

export function onMessage(ws: WebSocket<UserData>, msg: ArrayBuffer) {
    const userData = ws.getUserData();
    const parsedMsg: any = decodeMsg(msg)
    console.log(`Received and parsed message from ${userData.webSocketID}: ${parsedMsg}`);
    console.log(parsedMsg.type);
    switch (parsedMsg.type) {
        case 'createRoom': {
            Room.create(parsedMsg.options, parsedMsg.nickName, userData);
            break;
        }
        case 'joinRoom': {
            Room.join(parsedMsg.id, parsedMsg.nickName, userData);
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

export function encodeMsg(msg: RoomMsg) {
    return JSON.stringify(msg);
}

export function decodeMsg(msg: ArrayBuffer): RoomMsg {
    return JSON.parse(Buffer.from(msg).toString('utf-8'));
}

interface RoomMsg {
    type : string;
    options : Object;
}