import { roomOptions } from "@/src/type";
import {encode, decode} from "@/src/compress";
import {ref} from "vue";
import config from "@/src/config";
import {client} from "@/src/clientData";

export const presentRoom = {
    // 模拟数据 - 实际应从服务器获取
    client: {
        isHost: ref(true),
        isReady: ref(false)
    },
    id: ref(''),
    nickName : ref('flower'),
    region: ref('AS'),
    playersPerTeam: ref(2),
    teamNumber: ref(2),
    publicStatus: ref('Public'),
    nowPlayers: ref(-1),
    maxPlayers: ref(4),
    players: ref([
        {name: 'Nerd1', isReady: true},
        {name: 'Nerd2', isReady: false}
    ]),
    ws: new WebSocket(`ws://${config.API}/room`),
    update(options) : void {
        const nowRoom = options.room;
        const me = options.me;
        if(!nowRoom)
        {
            this.id.value="Nerd No Room";
            return ;
        }
        this.id.value=nowRoom.id;
        this.region.value = nowRoom.region;
        this.playersPerTeam.value = nowRoom.playersPerTeam;
        this.teamNumber.value = nowRoom.totalPlayer/nowRoom.playersPerTeam;
        this.publicStatus.value = nowRoom.isPublic;
        this.nowPlayers.value = nowRoom.nowPlayer;
        this.maxPlayers.value = nowRoom.totalPlayer;
        this.players.value=[];
        for(let id in nowRoom.players){
            this.players.value.push({name : nowRoom.players[id].name,isReady : nowRoom.players[id].isReady});
        }
        this.client.name = me.name
        this.client.isReady = me.isReady

    },

    create() {
        let msg : {type:string,options:roomOptions} = {
            type : "createRoom",
            options : {
                isPublic: this.publicStatus.value,
                area : this.region.value,
                totalPlayer : Number(this.playersPerTeam.value) * Number(this.teamNumber.value),
                playerPerTeam : Number(this.playersPerTeam.value)
            },
            nickName : this.nickName.value
        }
        this.ws.send(encode(msg));
    },

    join() {
        let msg: {type:string,id:string} = {
            type : "joinRoom",
            id : this.id.value,
            nickName : this.nickName.value
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
