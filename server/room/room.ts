import { v4 as getuid } from 'uuid';
import {roomOptions,playerInRoom} from '../../types/type'
class Room
{
    isPublic : boolean;//是否公开
    area : string;//区域
    totalPlayer : number;//总人数
    playerPerTeam : number;//各队伍人数
    players : Record<string,playerInRoom>;
    id : string;
    constructor(options: roomOptions)
    {
        this.area = options.area;
        this.totalPlayer = options.totalPlayer;
        this.playerPerTeam = options.playerPerTeam;
        this.isPublic = options.isPublic ?? true;
        this.id =makeRoomId();
        this.players = {};
    }
}
let roomList :Record<string, Room> = {};//通过id找到对应房间
let idList : Record<string, boolean> = {};
function randomLetter() : string
{
    let a : number = Math.floor(Math.random()*36);
    return a.toString(36);
}
function makeRoomId() : string
{
    let id : string = "";
    for(let i = 1;i <= 6;i++)
        id += randomLetter();
    while(idList[id] != null)
    {
        id = "";
        for(let i = 1;i <= 6;i++)
            id += randomLetter();
    }
    return id;
}
export function createRoom(options: roomOptions,creator : string) : Room
{
    let nowRoom: Room = new Room(options);
    nowRoom.players[creator] = {id : creator,name : creator,isReady :false};
    roomList[nowRoom.id] = nowRoom;
    return nowRoom;
}
export function joinRoom(id : string,joiner : string) : Room | null
{
    if(roomList[id] == undefined)
        return null;
    let nowRoom : Room = roomList[id];
    if((joiner in nowRoom.players) || Object.keys(nowRoom.players).length == nowRoom.totalPlayer)
        return null;
    nowRoom.players[joiner] = {id : joiner,name : joiner,isReady :false};
    return nowRoom;
}
export function leaveRoom(id : string,leaver : string) : any
{
    if(roomList[id]==undefined)
        return false;
    let nowRoom : Room = roomList[id];
    if(!(leaver in nowRoom.players))
        return false;
    delete nowRoom.players[leaver];
    if(Object.keys(nowRoom.players).length == 0)
    {
        delete roomList[id];
        return true;
    }
    return nowRoom;
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