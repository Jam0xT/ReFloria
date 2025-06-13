import { v4 as getuid } from 'uuid';
import {roomOptions} from '../../types/type'
class Room
{
    isPublic : boolean;//是否公开
    area : string;//区域
    totalPlayer : number;//总人数
    playerPerTeam : number;//各队伍人数
    players : Set<string>;
    id : string;
    static players: Set<string>;
    constructor(options: roomOptions)
    {
        this.area = options.area;
        this.totalPlayer = options.totalPlayer;
        this.playerPerTeam = options.playerPerTeam;
        this.isPublic = options.isPublic ?? true;
        this.id = getuid();
        this.players = new Set();
    }
}
let roomList :Record<string, Room> = {};//通过uuid找到对应房间
export function createRoom(options: roomOptions,creator : string) : Room
{
    let nowRoom: Room = new Room(options);
    nowRoom.players.add(creator);
    roomList[nowRoom.id] = nowRoom;
    return nowRoom;
}
export function leaveRoom(id : string,leaver : string) : boolean
{
    if(roomList[id]==undefined)
        return false;
    let nowRoom : Room = roomList[id];
    if(!nowRoom.players.has(leaver))
        return false;
    nowRoom.players.delete(leaver);
    if(nowRoom.players.size == 0)
        delete roomList[id];
    return true;
}
export function deleteRoom(id : string) : boolean
{
    if(roomList[id] != undefined)
    {
        delete roomList[id];
        return true;
    }
    return false;
}
export function changeRoomPublicStatus(id : string) : number
{
    if(roomList[id] != undefined)
    {
        roomList[id].isPublic=!roomList[id].isPublic;
        return roomList[id].isPublic?1:0;
    }
    return -1;
}