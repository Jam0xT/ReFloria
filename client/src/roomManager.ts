import { encode, decode, RoomMsgToSend, RoomMsgToReceive } from "@/src/compress";
import { ref } from "vue";
import { global } from "@/src/stores/global";

export const roomManager = {
    ws: new WebSocket(`ws://${window.location.hostname}:3000/room`),

    isHost: ref(false),

    roomID: ref(''),
    nickName : ref(''),
    currentPlayerCount: ref(-1),
    maxPlayerCount: ref(4),
    players: ref([]),

    init() {
        const store = global();

        roomManager.ws.onmessage = (event) => {
            const msg: RoomMsgToReceive = decode(event.data);
            switch (msg.type) {
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
                case "update":
                    roomManager.update(msg.value);
                    break;
                case "start":
                    console.log(store.show_game);
                    store.hide_room(null, () => {
                        store.show_game();
                    })
                    // startGame(msg.value.gameID);
                    break;
                default:
                    console.log("Unknown message type received.");
            }
        }
    },

    update(value) {
        const roomData: RoomData = value.roomData;
        if(!value.roomData) {
            console.log('wtf no data');
            return ;
        }
        this.roomID.value = roomData.roomID;
        this.currentPlayerCount.value = roomData.currentPlayerCount;
        this.maxPlayerCount.value = roomData.maxPlayerCount;
        this.players.value = [];
        roomData.players.forEach(playerData => {
            this.players.value.push({
                nickName: playerData.nickName,
                isReady: playerData.isReady,
            });
        });
    },

    create() {
        let msg: RoomMsgToSend = {
            type: "create",
            value: {
                nickName : this.nickName.value
            }
        }
        this.ws.send(encode(msg));
    },

    join() {
        let msg: RoomMsgToSend = {
            type: "join",
            value: {
                roomID: this.roomID.value,
                nickName: this.nickName.value
            }
        }
        this.ws.send(encode(msg));
    },

    leave() {
        let msg: RoomMsgToSend = {
            type: "leave",
            value: {
                roomID: this.roomID.value
            }
        }
        this.ws.send(encode(msg));
    },

    toggleReady() {
        let msg: RoomMsgToSend = {
            type: "toggleReady",
            value: {
                roomID: this.roomID.value
            }
        }
        this.ws.send(encode(msg));
    },
}

export interface RoomData {
    roomID: string;
    players: PlayerData[];
    currentPlayerCount: number;
    maxPlayerCount: number;
}

interface PlayerData {
    nickName: string;
    isReady: boolean;
}
