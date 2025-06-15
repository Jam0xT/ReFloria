import * as uws from 'uWebSockets.js';
import { v4 as getuid } from 'uuid';
import {HttpRequest, HttpResponse, us_listen_socket} from "uWebSockets.js";
import {Room} from './room/room';
const port = 9001;

// 创建 uWebSockets.js 服务器
const app : uws.TemplatedApp = uws.App();
let wsMap : Record<string,any> = {};//通过id查找玩家

// 根路由
app.get('/', (res : HttpResponse, req : HttpRequest) :void => {
    res.end('Hello, welcome to the TypeScript server with uWebSockets.js!');
});

app.ws('/ws', {
    // 当 WebSocket 连接打开时触发
    open: (ws) :void => {
        const Ws : any = ws as any;
        const uid : string =getuid();
        wsMap[uid]=ws;
        Ws.id=uid;
        console.log(`A new WebSocket connection has been established with ${uid}!`);
        let msg : {type : string, options : {id : string}}={
            type : "setId",
            options: {id : uid}
        }
        ws.send(JSON.stringify(msg));
    },

    // 当 WebSocket 接收到消息时触发
    message: (ws, message : ArrayBuffer) :void => {
        // 处理接收到的消息，这里我们只是打印它
        const Ws : any = ws as any;
        let msg : any = Buffer.from(message).toString('utf-8');
        console.log(`Received message from ${Ws.id}: ${msg}`);
        msg = JSON.parse(msg);
        if(msg.type == undefined)
            console.log("This message has no type!");
        else if(msg.type == "createRoom")
        {
            let nowRoom = Room.create(msg.options,Ws.id);
            let myMsg : {type : string, options : {room : any}}={
                type : "createdRoom",
                options : {
                    room : nowRoom.data()
                }
            }
            ws.send(JSON.stringify(myMsg));
            Ws.roomId = nowRoom.id;
            console.log(`User ${Ws.id} created room : ${nowRoom.id}`);
        }
        else if(msg.type == "joinRoom")
        {
            let nowRoom = Room.join(msg.id,Ws.id);
            if(nowRoom != null){
                let myMsg : {type : string, options : {room :any}}={
                    type : "joinedRoom",
                    options : {
                        room : nowRoom.data()
                    }
                }
                ws.send(JSON.stringify(myMsg));
                Ws.roomId = nowRoom.id;
                sendUpdateMsgToRoom(nowRoom,Ws.id);
                console.log(`User ${Ws.id} has joined room : ${msg.id}`);
            }
            else
                console.log(`User ${Ws.id} failed to join room : ${msg.id}`);
        }
        else if(msg.type == "leaveRoom")
        {
            let nowRoom = Room.leave(msg.id,Ws.id);
            if(nowRoom != null){
                let myMsg : {type : string, options : {}}={
                    type : "leftRoom",
                    options : {}
                }
                ws.send(JSON.stringify(myMsg));
                delete Ws.roomId;
                if(typeof nowRoom != "boolean")
                    sendUpdateMsgToRoom(nowRoom);
                console.log(`User ${Ws.id} has left room : ${msg.id}`);
            }
            else
                console.log(`User ${Ws.id} failed to leave room : ${msg.id}`);
        }
        else if(msg.type == "changeReadyStatus")
        {
            let nowRoom =Room.changeReadyStatus(msg.id,Ws.id);
            if(nowRoom != null){
                sendUpdateMsgToRoom(nowRoom);
                console.log(`User ${Ws.id} changed his ready status in room: ${msg.id}`);
            }
            else
                console.log(`User ${Ws.id} failed to change his ready status in room: ${msg.id}`);
        }
        // else if(msg.type == "deleteRoom")
        // {
        //     let isSuccess: boolean = room.deleteRoom(msg.id);
        //     if(isSuccess){
        //         let myMsg : {type : string, options : {}}={
        //             type : "deletedRoom",
        //             options : {}
        //         }
        //         ws.send(JSON.stringify(myMsg));
        //         delete Ws.roomId;
        //         console.log(`User ${Ws.id} deleted room : ${msg.id}`);
        //     }
        //     else
        //         console.log(`User ${Ws.id} failed to delete room : ${msg.id}`);
        // }
        else if(msg.type == "changeRoomPublicStatus")
        {
            let status: number = Room.changePublicStatus(msg.id);
            if(status == 0 || status == 1)
            {
                let myMsg : {type : string, options : {publicStatus : boolean}}={
                    type : "changedRoomPublicStatus",
                    options : {
                        publicStatus : status == 1
                    }
                }
                ws.send(JSON.stringify(myMsg));
            }
            if(status == 0)
                console.log(`User ${Ws.id} made room : ${msg.id} private`);
            else if(status == 1)
                console.log(`User ${Ws.id} made room : ${msg.id} public`);
            else
                console.log(`User ${Ws.id} failed to change room : ${msg.id}'s public status`);
        }
    },

    // 当 WebSocket 连接关闭时触发
    close: (ws, code : number, message : ArrayBuffer) :void => {
        const Ws : any = ws as any;
        if(Ws.roomId != undefined)
        {
            let nowRoom = Room.leave(Ws.roomId,Ws.id);
            if(typeof nowRoom != "boolean")
                sendUpdateMsgToRoom(nowRoom);
            console.log(`User ${Ws.id} has left room : ${Ws.roomId}`);
            delete Ws.roomId;
        }
        console.log(`WebSocket connection with ${Ws.id} closed`);
    }
});
// 启动服务器并监听指定端口
app.listen(port, (token :false|us_listen_socket) : void => {
    if (token) {
        console.log(`Server running at http://localhost:${port}`);
    } else {
        console.log('Failed to start server');
    }
});
function sendUpdateMsgToRoom(nowRoom : any,expectUser? : string) : void {
    for(let player in nowRoom.players)
    {
        if(nowRoom.players[player].id == expectUser)
            continue;
        let playerWs = wsMap[nowRoom.players[player].id];
        let myMsg : {type : string, options : {room :any}}={
            type : "updateRoomStatus",
            options : {
                room : nowRoom.data()
            }
        }
        playerWs.send(JSON.stringify(myMsg));
    }
}
