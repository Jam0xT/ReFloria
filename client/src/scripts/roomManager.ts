import { encode, decode } from "@/src/compress";
import { ref } from "vue";
import { global } from "@/src/stores/global";

export const roomManager = {
    ws: new WebSocket(`ws://${window.location.hostname}:3000/room`),

    client: {
        isHost: ref(true),
        isReady: ref(false)
    },
    roomID: ref(''),
    nickName : ref(''),
    currentPlayerCount: ref(-1),
    maxPlayerCount: ref(4),
    players: ref([
        {name: 'Nerd1', isReady: true},
        {name: 'Nerd2', isReady: false}
    ]),

    init() {
        const store = global();

        roomManager.ws.onmessage = (event) => {
            const data = decode(event.data);
            console.log(data)
            switch (data.type) {
                case "createdRoom":
                    store.hide_createRoom(null, () => {
                        store.show_room();
                    })
                    break;
                case "joinedRoom":
                    store.hide_joinRoom(null,() => {
                        store.show_room();
                    });
                    break;
                case "leftRoom":
                    store.hide_room(null, () => {
                        store.show_start();
                    });
                    break;
                case "updateRoomStatus":
                    roomManager.update(data.options)
                    break;
                default:
                    console.log("Unknown message type received.");
            }
            console.log(typeof roomManager.region);
        }
    },

    update(options) {
        const nowRoom = options.room;
        const me = options.me;
        if(!nowRoom)
        {
            this.roomID.value="Nerd No Room";
            return ;
        }
        this.roomID.value = nowRoom.id;
        this.currentPlayerCount.value = nowRoom.nowPlayer;
        this.maxPlayerCount.value = nowRoom.totalPlayer;
        this.players.value=[];
        for (let id in nowRoom.players) {
            this.players.value.push({name : nowRoom.players[id].name,isReady : nowRoom.players[id].isReady});
        }
        this.client.name = me.name;
        this.client.isReady = me.isReady;
    },

    create() {
        let msg = {
            type: "create",
            value: {
                nickName : this.nickName.value
            }
        }
        this.ws.send(encode(msg));
    },

    join() {
        let msg = {
            type: "join",
            value: {
                roomID: this.roomID.value,
                nickName: this.nickName.value
            }
        }
        this.ws.send(encode(msg));
    },

    leave() {
        let msg = {
            type: "leave",
            value: {
                roomID: this.roomID.value
            }
        }
        this.ws.send(encode(msg));
    },

    toggleReady() {
        let msg = {
            type: "toggleReady",
            value: {
                roomID: this.roomID.value
            }
        }
        this.ws.send(encode(msg));
    },

    startGame() {

    }
}
