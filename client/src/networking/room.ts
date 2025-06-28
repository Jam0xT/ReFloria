import { nw } from "@/src/networking";
import * as player from "@/src/playerData";

export function createRoom(roomOptions :roomOptions) :void {
    let msg : {type:string,options:roomOptions} = {
        type : "createRoom",
        options : roomOptions,
    }
    nw.send(JSON.stringify(msg));
}
export function joinRoom(roomId : string) :void  {
    let msg: {type:string,id:string} = {
        type : "joinRoom",
        id : roomId
    }
    nw.send(JSON.stringify(msg));
}
export function leaveRoom(roomId : string) : void {
    let msg : {type:string,id : string} = {
        type : "leaveRoom",
        id : roomId
    }
    nw.send(JSON.stringify(msg));
}

export function changeReadyStatus(roomId : string) : void {
    let msg : {type:string,id:string} = {
        type : "changeReadyStatus",
        id : roomId
    }
    nw.send(JSON.stringify(msg));
}