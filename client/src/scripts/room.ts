import { roomOptions } from "@/src/type";
import {encode, decode} from "@/src/compress";
import {ref} from "vue";
import {client} from "@/src/clientData";
import {global} from "@/src/stores/global";

const store = global()

export const presentRoom = {
    // 模拟数据 - 实际应从服务器获取
    client: {
        isHost: ref(true),
        isReady: ref(false)
    },
    id: ref(''),
    serverArea: ref('AS'),
    playersPerTeam: ref('2'),
    teamNumber: ref('2'),
    publicStatus: ref('Public'),
    nowPlayers: ref(2),
    maxPlayers: ref(4),
    players: ref([
        {name: 'Player 1', ready: true},
        {name: 'Player 2', ready: false}
    ]),
    ws: new WebSocket('ws://localhost:9001/ws'),

    create() {
        let msg : {type:string,options:roomOptions} = {
            type : "createRoom",
            options : {
                isPublic: this.publicStatus.value,
                area : this.serverArea.value,
                totalPlayer : Number(this.playersPerTeam.value) * Number(this.teamNumber.value),
                playerPerTeam : Number(this.playersPerTeam.value)
            },
        }
        this.ws.send(encode(msg));
    },

    join() {
        let msg: {type:string,id:string} = {
            type : "joinRoom",
            id : this.id.value
        }
        this.ws.send(encode(msg));
    },

    leave() {
        let msg : {type:string,id : string} = {
            type : "leaveRoom",
            id : this.id.value
        }
        this.ws.send(encode(msg));
    },

    changeReadyStatus() {
        let msg: { type: string, id: string } = {
            type: "changeReadyStatus",
            id: this.id.value
        }
        this.ws.send(encode(msg));
    },

    startGame() {

    }
}

presentRoom.ws.onmessage = (event) => {
    const data = decode(event.data);
    switch (data.type) {
        case "setId":
            client.playerName = data.options.id
            break
        case "createdRoom":
            let room = data.options.room; /* UNUSED PARAMETER */
            store.hide_createRoom(null,() => {
                store.show_room();
            });
            break
        case "joinedRoom":
            let room = data.options.room /* UNUSED PARAMETER */
            store.hide_joinRoom(null,() => {
                store.show_room();
            });
            break
        case "leftRoom":
            presentRoom.id = null
            store.hide_room(null, () => {
                store.show_start();
            });
            break
        case "updateRoomStatus":
            let room = data.options.room; /* UNUSED PARAMETER */
            store.update_room();
            break
        case "changedRoomPublicStatus":
            // let msg: {type : string ; id : string} = {
            //     type : "deleteRoom",
            //     id : player.getRoomId()
            // }
            // ws.send(JSON.stringify(msg));
            break
        case "deletedRoom":
            // console.log("COMPLETED!");
            // ws.close();
            break
        default:
            console.log("???");
    }
}