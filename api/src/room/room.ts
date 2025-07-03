import * as crypto from 'crypto';
import { UserData } from './userData'
import {wsMap} from "@/src/room/wsMap";
import {encodeMsg} from "@/src/room/networking";

export class Room {
    private readonly _region: string;//区域
    get region() {return this._region;}

    private readonly _maxPlayerCount: number;//总人数
    get maxPlayerCount() {return this._maxPlayerCount;}

    private readonly _maxPlayerCountPerTeam: number;//各队伍人数
    get maxPlayerCountPerTeam() {return this._maxPlayerCountPerTeam;}

    private readonly _players: Record<string, Player>;
    get players() { return this._players; }

    private readonly _id: string;
    get id() {return this._id;}

    private _isPublic: boolean;//是否公开
    get isPublic() {return this._isPublic;}
    set isPublic(isPublic: boolean) {this._isPublic = isPublic;}

    private _isFull!: boolean;
    get isFull() {return this._isFull;}
    set isFull(isFull: boolean) {this._isFull = isFull;}

    private _isEmpty!: boolean;
    get isEmpty() {return this._isEmpty;}
    set isEmpty(isEmpty: boolean) {this._isEmpty = isEmpty;}

    static rooms: Record<string, Room> = {};

    data() {
        return {
            isPublic: this._isPublic,
            totalPlayer: this._maxPlayerCount,
            nowPlayer: Object.keys(this.players).length,
            id: this._id,
            players: this._players,
            region: this._region,
            playersPerTeam: this._maxPlayerCountPerTeam,
        };
    }

    constructor(options: roomOptions) {
        this._region = options.region;
        this._maxPlayerCount = options.totalPlayer;
        this._maxPlayerCountPerTeam = options.playerPerTeam;
        this._isPublic = options.isPublic ?? true;
        this._id = Room.getNewID();
        this._players = {};
    }

    addPlayer(WebSocketID: string) {
        const currentPlayerCount = Object.keys(this.players).length;
        console.log(currentPlayerCount);
        if ( currentPlayerCount < this.maxPlayerCount ) {
            if ( currentPlayerCount === this.maxPlayerCount - 1 ) {
                this.isFull = true;
            }
            this.players[WebSocketID] = new Player({
                webSocketID: WebSocketID,
                name: WebSocketID,
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
                type : "updateRoomStatus",
                options : {
                    room: this.data(),
                    me: subjectWebSocketID ? this.players[subjectWebSocketID] : null,
                }
            }))
        }
    }

    static create(options: roomOptions, creatorUserData: UserData) {
        const room = new Room(options);
        room.addPlayer(creatorUserData.webSocketID);
        Room.rooms[room.id] = room;
        creatorUserData.roomID = room.id;
        wsMap[creatorUserData.webSocketID].send(encodeMsg({
            type: "createdRoom",
            options: {}
        }))
        room.broadcastUpdate(creatorUserData.webSocketID);
        return true;
    }

    static destroy(roomID: string) {
        delete Room.rooms[roomID];
    }

    static join(roomID: string, joinerUserData: UserData) {
        const room = Room.rooms[roomID];
        if (!room)
            return false;
        const players = room.players;
        if ((joinerUserData.webSocketID in players) || room.isFull)
            return false;
        room.addPlayer(joinerUserData.webSocketID);
        joinerUserData.roomID = room.id;
        wsMap[joinerUserData.webSocketID].send(encodeMsg({
            type: "joinedRoom",
            options: {}
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
                options: {}
            }))
        }
        room.broadcastUpdate(leaverUserData.webSocketID);
        return true;
    }

    static changeReadyStatus(roomId: string, changerUserData: UserData) {
        const room = Room.rooms[roomId];
        if (!room)
            return false;
        const players = room.players;
        const player = players[changerUserData.webSocketID];
        if (!player)
            return false;
        player.isReady = !player.isReady;
        room.broadcastUpdate(changerUserData.webSocketID);
        return true;
    }

    static changePublicStatus(roomID: string) {
        const room = Room.rooms[roomID];
        if (!room)
            return false;
        room.isPublic = !room.isPublic;
        room.broadcastUpdate();
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
}

interface roomOptions {
    isPublic?: boolean;
    region: string;
    totalPlayer: number;
    playerPerTeam: number;
}

class Player {
    webSocketID: string;
    name: string;
    isReady: boolean;
    constructor(props: {
        webSocketID: string;
        name: string;
        isReady: boolean;
    }) {
        this.webSocketID = props.webSocketID;
        this.name = props.name;
        this.isReady = props.isReady
    }

}