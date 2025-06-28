import {WebSocket} from 'uWebSockets.js';
import {UserData} from "@/src/room/userData";

export const wsMap: Record<string, WebSocket<UserData>> = {}; // WebSocketID -> WebSocket<UserData>


