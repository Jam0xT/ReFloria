export class Room {
    private _isPublic: boolean;//是否公开
    private _region: string;//区域
    private _totalPlayer: number;//总人数
    private _playerPerTeam: number;//各队伍人数
    private _players: Record<string, player>;
    private _id: string;
    get id() {return this._id;}
    get players() {return this._players;}
    get region() {return this._region;}
    get isPublic() {return this._isPublic;}
    get totalPlayer() {return this._totalPlayer;}
    get playerPerTeam() {return this._playerPerTeam;}

    // id -> room
    static rooms: Record<string, Room> = {};

    data() {
        return {
            isPublic: this._isPublic,
            totalPlayer: this._totalPlayer,
            nowPlayer: Object.keys(this.players).length,
            id: this._id,
            players: this._players,
        };
    }

    constructor(options: roomOptions) {
        this._region = options.area;
        this._totalPlayer = options.totalPlayer;
        this._playerPerTeam = options.playerPerTeam;
        this._isPublic = options.isPublic ?? true;
        this._id = Room.newID();
        this._players = {};
    }

    static newID(): string {
        function randomLetter(): string {
            let a: number = Math.floor(Math.random() * 36);
            return a.toString(36);
        }
        function randomString(length: number): string {
            let str = "";
            for (let i = 1; i <= length; i++)
                str += randomLetter();
            return str;
        }
        let id = randomString(6);
        while (Room.rooms[id]) {
            id = randomString(6);
        }
        return id;
    }

    static create(options: roomOptions, creator: string): Room {
        let room = new Room(options);
        room._players[creator] = {id: creator, name: creator, isReady: false};
        Room.rooms[room.id] = room;
        return room;
    }

    static join(id: string, joiner: string): Room | null {
        const room = Room.rooms[id];
        if (!room)
            return null;
        if ((joiner in room._players) || Object.keys(room._players).length == room._totalPlayer)
            return null;
        room._players[joiner] = {id: joiner, name: joiner, isReady: false};
        return room;
    }

    static leave(id: string, leaver: string): Room | boolean {
        const room = Room.rooms[id];
        if (!Room.rooms[id])
            return false;
        if (!(leaver in room._players))
            return false;
        delete room._players[leaver];
        if (Object.keys(room._players).length == 0) {
            delete Room.rooms[id];
            return true;
        }
        return room;
    }

    static changeReadyStatus(id: string, changer: string): Room | null {
        if (Room.rooms[id] == undefined)
            return null;
        let nowRoom: Room = Room.rooms[id];
        if (!(changer in nowRoom._players))
            return null;
        nowRoom._players[changer].isReady = !nowRoom._players[changer].isReady;
        return nowRoom;
    }

    static delete(id: string): boolean {
        const room = Room.rooms[id];
        if (room) {
            delete Room.rooms[id];
            return true;
        }
        return false;
    }

    static changePublicStatus(id: string): number {
        if (Room.rooms[id] != undefined) {
            Room.rooms[id]._isPublic = !Room.rooms[id]._isPublic;
            return Room.rooms[id]._isPublic ? 1 : 0;
        }
        return -1;
    }
}

interface roomOptions {
    isPublic?: boolean;
    area: string;
    totalPlayer: number;
    playerPerTeam: number;
}

interface player {
    id: string;
    name: string;
    isReady: boolean;
}