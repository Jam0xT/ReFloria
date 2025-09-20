import * as crypto from 'crypto';
import { encodeMsg, wsMap, UserData } from "@/src/room/networking";

import { gameServerWebsocket } from "@/src/index";

const hardCodedMaxPlayerCount = 16; // GG

export class Room {
    static rooms: Record<string, Room> = {};

    static create(nickName : string, creatorUserData: UserData) {
        const room = new Room();
        room.addPlayer(creatorUserData.webSocketID, nickName);
        Room.rooms[room.id] = room;
        creatorUserData.roomID = room.id;
        wsMap[creatorUserData.webSocketID].send(encodeMsg({
            type: "createdRoom",
            value: {}
        }))
        room.broadcastUpdate(creatorUserData.webSocketID);
        return true;
    }

    static destroy(roomID: string) {
        delete Room.rooms[roomID];
    }

    static join(roomID: string, nickName: string, joinerUserData: UserData) {
        const room = Room.rooms[roomID];
        if (!room)
            return false;
        const players = room.players;
        if ((joinerUserData.webSocketID in players) || room.isFull)
            return false;
        room.addPlayer(joinerUserData.webSocketID,nickName);
        joinerUserData.roomID = room.id;
        wsMap[joinerUserData.webSocketID].send(encodeMsg({
            type: "joinedRoom",
            value: {}
        }))
        room.broadcastUpdate(joinerUserData.webSocketID);
        return true;
    }

    static leave(roomID: string, leaverUserData: UserData) {
        const room = Room.rooms[roomID];
        if (!room)
            return false;
        const players = room.players;
        if (!(leaverUserData.webSocketID in players))
            return false;
        room.removePlayer(leaverUserData.webSocketID);
        if ( room.isEmpty )
            Room.destroy(room.id);
        leaverUserData.roomID = '';
        if (wsMap[leaverUserData.webSocketID]) {
            wsMap[leaverUserData.webSocketID].send(encodeMsg({
                type: 'leftRoom',
                value: {}
            }))
        }
        room.broadcastUpdate(leaverUserData.webSocketID);
        return true;
    }

    static toggleReady(roomId: string, changerUserData: UserData) {
        const room = Room.rooms[roomId];
        if (!room)
            return false;
        const players = room.players;
        const player = players[changerUserData.webSocketID];
        if (!player)
            return false;
        player.isReady = !player.isReady;
        if (player.isReady)
            room.readyPlayerCount ++;
        else
            room.readyPlayerCount --;
        if (room.readyPlayerCount === Object.keys(room._players).length)
            room.startGame();
        room.broadcastUpdate(changerUserData.webSocketID);
        return true;
    }

    static getNewID(): string {
        const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fixedIDLen = 6;
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        let val = arr[0];
        let id = '';
        while (val > 0) {
            id += charList[val % charList.length];
            val = (val - val % charList.length) / charList.length;
        }
        while (id.length < fixedIDLen) {
            id += '0';
        }
        return id;
    }

    static getNewGameID(): string {
        const gameIDLength = 12;
        let newGameID = '';
        const charSet = 'abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRST0123456789';
        for(let i = 0; i < 12; i ++ ) {
            newGameID += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return newGameID;
    }

    constructor() {
        this._maxPlayerCount = hardCodedMaxPlayerCount;
        this._id = Room.getNewID();
        this._players = {};
    }

    private readonly _maxPlayerCount: number;//总人数
    get maxPlayerCount() {return this._maxPlayerCount;}

    private readonly _players: Record<string, Player>;
    get players() { return this._players; }

    private readonly _id: string;
    get id() {return this._id;}

    private _isFull!: boolean;
    get isFull() {return this._isFull;}
    set isFull(isFull: boolean) {this._isFull = isFull;}

    private _isEmpty!: boolean;
    get isEmpty() {return this._isEmpty;}
    set isEmpty(isEmpty: boolean) {this._isEmpty = isEmpty;}

    private readyPlayerCount: number = 0;

    startGame() {
        const newGameID = Room.getNewGameID();
        console.log(`start game ${newGameID}`);
        const msg = JSON.stringify({
            gameID: newGameID,
            playerCount: Object.keys(this._players).length,
        });
        console.log(msg);
        gameServerWebsocket.send(msg);
        for (let webSocketID in this._players) {
            wsMap[webSocketID].send(encodeMsg({
                type: "start",
                value: {
                    gameID: newGameID,
                }
            }));
        }
    }

    getData(): RoomData {
        return {
            maxPlayerCount: this._maxPlayerCount,
            currentPlayerCount: Object.keys(this.players).length,
            roomID: this._id,
            players: Object.values(this._players).map(
                (player) => {return player.getData();}),
        };
    }

    addPlayer(WebSocketID: string, nickName: string) {
        const currentPlayerCount = Object.keys(this.players).length;
        console.log(currentPlayerCount);
        if ( currentPlayerCount < this.maxPlayerCount ) {
            if ( currentPlayerCount === this.maxPlayerCount - 1 ) {
                this.isFull = true;
            }
            this.players[WebSocketID] = new Player({
                webSocketID: WebSocketID,
                nickName: nickName,
                isReady: false,
            });
            this.isEmpty = false;
            return true;
        }
        return false;
    }

    removePlayer(WebSocketID: string) {
        const player = this.players[WebSocketID];
        if (!player)
            return false;
        const currentPlayerCount = Object.keys(this.players).length;
        if ( currentPlayerCount === 1 ) {
            this.isEmpty = true;
        }
        delete this.players[WebSocketID];
        this.isFull = false;
        return true;
    }

    broadcastUpdate(subjectWebSocketID?: string) {
        for (let webSocketID in this.players) {
            wsMap[webSocketID].send(encodeMsg({
                type: "update",
                value: {
                    roomData: this.getData(),
                    // subject: subjectWebSocketID ? this.players[subjectWebSocketID] : null,
                }
            }))
        }
    }
}

class Player {
    webSocketID: string;
    nickName: string;
    isReady: boolean;
    constructor(props: {
        webSocketID: string;
        nickName: string;
        isReady: boolean;
    }) {
        this.webSocketID = props.webSocketID;
        this.nickName = props.nickName;
        this.isReady = props.isReady
    }

    public getData(): PlayerData {
        return {
            nickName: this.nickName,
            isReady: this.isReady,
        };
    }
}

export interface RoomData {
    roomID: string;
    players: PlayerData[];
    currentPlayerCount: number;
    maxPlayerCount: number;
}

interface PlayerData {
    nickName: string;
    isReady: boolean;
}