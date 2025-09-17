import { encode, decode } from "@/src/compress";
import { ref } from "vue";

export const roomManager = {
    client: {
        isHost: ref(true),
        isReady: ref(false)
    },
    roomID: ref(''),
    nickName : ref(''),
    playersPerTeam: ref(2),
    teamNumber: ref(2),
    publicStatus: ref('Public'),
    nowPlayers: ref(-1),
    maxPlayers: ref(4),
    players: ref([
        {name: 'Nerd1', isReady: true},
        {name: 'Nerd2', isReady: false}
    ]),
    ws: new WebSocket(`ws://${window.location.hostname}:3000/room`),

    update(options) : void {
        const nowRoom = options.room;
        const me = options.me;
        if(!nowRoom)
        {
            this.roomID.value="Nerd No Room";
            return ;
        }
        this.roomID.value=nowRoom.id;
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
        let msg = {
            type: "createRoom",
            nickName : this.nickName.value
        }
        this.ws.send(encode(msg));
    },

    join() {
        let msg = {
            type : "joinRoom",
            id : this.id.value,
            nickName : this.nickName.value
        }
        this.ws.send(encode(msg));
    },

    leave() {
        let msg = {
            type : "leaveRoom",
            id : this.roomID.value
        }
        this.ws.send(encode(msg));
    },

    toggleReady() {
        let msg = {
            type: "toggleReady",
            id: this.roomID.value
        }
        this.ws.send(encode(msg));
    },

    startGame() {

    }
}
