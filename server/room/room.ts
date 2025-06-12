import { v4 as getuid } from 'uuid';
export interface RoomOptions {
    isPublic?: boolean;
    area : string;
    totalPlayer : number;
    playerPerTeam : number;
}
class Room
{
    isPublic : boolean;//是否公开
    area : string;//区域
    totalPlayer : number;//总人数
    playerPerTeam : number;//各队伍人数
    id : string;
    constructor(options: RoomOptions)
    {
        this.area = options.area;
        this.totalPlayer = options.totalPlayer;
        this.playerPerTeam = options.playerPerTeam;
        this.isPublic = options.isPublic ?? true;
        this.id = getuid();
    }
}
let roomList :Record<string, Room> = {};//通过uuid找到对应房间
export function createRoom(options: RoomOptions) : string
{
    let nowRoom: Room = new Room(options);
    roomList[nowRoom.id] = nowRoom;
    return nowRoom.id;
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