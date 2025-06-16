import {roomOptions,playerInRoom} from '../type'
export class Room
{
    private _isPublic : boolean;//是否公开
    private _area : string;//区域
    private _totalPlayer : number;//总人数
    private _playerPerTeam : number;//各队伍人数
    private _players : Record<string,playerInRoom>;
    private _id : string;
    get id()
    {
        return this._id;
    }
    get players()
    {
        return this._players;
    }
    get area()
    {
        return this._area;
    }
    get isPublic()
    {
        return this._isPublic;
    }
    get totalPlayer()
    {
        return this._totalPlayer;
    }
    get playerPerTeam()
    {
        return this._playerPerTeam;
    }
    data ()
    {
        return {
            isPublic : this._isPublic,
            totalPlayer : this._totalPlayer,
            nowPlayer : Object.keys(this.players).length,
            id : this._id,
            players : this._players,
        };
    }
    constructor(options: roomOptions)
    {
        this._area = options.area;
        this._totalPlayer = options.totalPlayer;
        this._playerPerTeam = options.playerPerTeam;
        this._isPublic = options.isPublic ?? true;
        this._id =Room.makeId();
        this._players = {};
    }
    static roomList :Record<string, Room> = {};
    static randomLetter() : string
    {
        let a : number = Math.floor(Math.random()*36);
        return a.toString(36);
    }
    static makeId() : string
    {
        let id : string = "";
        for(let i = 1;i <= 6;i++)
            id += Room.randomLetter();
        while(Room.roomList[id] != null)
        {
            id = "";
            for(let i = 1;i <= 6;i++)
                id += Room.randomLetter();
        }
        return id;
    }
    static create(options: roomOptions,creator : string) : Room
    {
        let nowRoom: Room = new Room(options);
        nowRoom._players[creator] = {id : creator,name : creator,isReady :false};
        Room.roomList[nowRoom.id] = nowRoom;
        return nowRoom;
    }
    static join(id : string,joiner : string) : Room | null
    {
        if(Room.roomList[id] == undefined)
            return null;
        let nowRoom : Room = Room.roomList[id];
        if((joiner in nowRoom._players) || Object.keys(nowRoom._players).length == nowRoom._totalPlayer)
            return null;
        nowRoom._players[joiner] = {id : joiner,name : joiner,isReady :false};
        return nowRoom;
    }
    static leave(id : string,leaver : string) : Room | boolean
    {
        if(Room.roomList[id]==undefined)
            return false;
        let nowRoom : Room = Room.roomList[id];
        if(!(leaver in nowRoom._players))
            return false;
        delete nowRoom._players[leaver];
        if(Object.keys(nowRoom._players).length == 0)
        {
            delete Room.roomList[id];
            return true;
        }
        return nowRoom;
    }
    static changeReadyStatus(id : string,changer : string) : Room | null
    {
        if(Room.roomList[id]==undefined)
            return null;
        let nowRoom : Room = Room.roomList[id];
        if(!(changer in nowRoom._players))
            return null;
        nowRoom._players[changer].isReady = !nowRoom._players[changer].isReady;
        return nowRoom;
    }
    static delete(id : string) : boolean
    {
        if(Room.roomList[id] != undefined)
        {
            delete Room.roomList[id];
            return true;
        }
        return false;
    }
    static changePublicStatus(id : string) : number
    {
        if(Room.roomList[id] != undefined)
        {
            Room.roomList[id]._isPublic=!Room.roomList[id]._isPublic;
            return Room.roomList[id]._isPublic?1:0;
        }
        return -1;
    }
}