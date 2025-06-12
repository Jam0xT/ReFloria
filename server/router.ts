import * as uws from 'uWebSockets.js';
import { v4 as getuid } from 'uuid';
import {HttpRequest, HttpResponse, us_listen_socket} from "uWebSockets.js";
import * as room from './room/room';
const port = 9001;

// 创建 uWebSockets.js 服务器
const app : uws.TemplatedApp = uws.App();
let playerList : Record<string,any> = {};//通过id查找玩家
// 根路由
app.get('/', (res : HttpResponse, req : HttpRequest) :void => {
    res.end('Hello, welcome to the TypeScript server with uWebSockets.js!');
});
app.ws('/ws', {
    // 当 WebSocket 连接打开时触发
    open: (ws) :void => {
        const uid : string =getuid();
        playerList[uid]=ws;
        (ws as any).id=uid;
        console.log(`A new WebSocket connection has been established with ${uid}!`);

        // 向客户端发送一条欢迎消息
        ws.send(JSON.stringify('Welcome to the WebSocket server!'));
    },

    // 当 WebSocket 接收到消息时触发
    message: (ws, message : ArrayBuffer) :void => {
        // 处理接收到的消息，这里我们只是打印它
        let msg : any = Buffer.from(message).toString('utf-8');
        console.log(`Received message from ${(ws as any).id}: ${msg}`);
        msg = JSON.parse(msg);
        if(msg.type == undefined)
            console.log("This message has no type!");
        else if(msg.type == "createRoom")
        {
            let roomId: string = room.createRoom(msg.options);
            let myMsg : {type : string, options : {roomId : string}}={
                type : "createdRoom",
                options : {
                    roomId : roomId
                }
            }
            ws.send(JSON.stringify(myMsg));
            console.log(`User ${(ws as any).id} created room : ${roomId}`);
        }
        else if(msg.type == "deleteRoom")
        {
            let isSuccess: boolean = room.deleteRoom(msg.id);
            if(isSuccess){
                let myMsg : {type : string, options : {}}={
                    type : "deletedRoom",
                    options : {}
                }
                ws.send(JSON.stringify(myMsg));
                console.log(`User ${(ws as any).id} deleted room : ${msg.id}`);
            }
            else
                console.log(`User ${(ws as any).id} failed to delete room : ${msg.id}`);
        }
        else if(msg.type == "changeRoomPublicStatus")
        {
            let status: number = room.changeRoomPublicStatus(msg.id);
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
                console.log(`User ${(ws as any).id} made room : ${msg.id} private`);
            else if(status == 1)
                console.log(`User ${(ws as any).id} made room : ${msg.id} public`);
            else
                console.log(`User ${(ws as any).id} failed to change room : ${msg.id}'s public status`);
        }
    },

    // 当 WebSocket 连接关闭时触发
    close: (ws, code : number, message : ArrayBuffer) :void => {

        console.log(`WebSocket connection with ${(ws as any).id} closed`);
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
