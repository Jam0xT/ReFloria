import { roomOptions } from "@/src/type";
import {encode, decode} from "@/src/compress";
import {ref} from "vue";
import config from "@/src/config";

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
    ws: new WebSocket(`ws://${config.API}/room`),

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
