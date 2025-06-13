import {roomOptions} from '../../types/type'
import * as player from './playerData'
const ws = new WebSocket('ws://localhost:9001/ws');
import { global } from './stores/global';
let store : any;
ws.onopen = () => {
    console.log('Connected to WebSocket server');
    store = global();
}
ws.onmessage = (event) => {
    let data=JSON.parse(event.data);
    if(data.type == "createdRoom") {
        let room = data.options.room;
        player.setRoom(room);
        store.hide_createRoom(null,() => {
            store.show_room();
        });
    }
    else if(data.type == "leftRoom") {
        player.setRoom(null);
        store.hide_room(null, () => {
            store.show_start();
        });
    }
    else if(data.type == "changedRoomPublicStatus") {
        // let msg: {type : string ; id : string} = {
        //     type : "deleteRoom",
        //     id : player.getRoomId()
        // }
        // ws.send(JSON.stringify(msg));
    }
    else if(data.type == "deletedRoom") {
        // console.log("COMPLETED!");
        // ws.close();
    }
    else
        console.log("???");
}
ws.onclose = () => {
    console.log('Connection closed');
};
export function createRoom(roomOptions :roomOptions) :void {
    let msg : {type:string,options:roomOptions} = {
        type : "createRoom",
        options : roomOptions,
    }
    ws.send(JSON.stringify(msg));
}
export function leaveRoom(roomId : string) : void {
    let msg : {type:string,id : string} = {
        type : "leaveRoom",
        id : roomId
    }
    console.log(msg);
    ws.send(JSON.stringify(msg));
}