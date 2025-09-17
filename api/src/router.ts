import { App } from 'uWebSockets.js'

import {UserData} from "@/src/room/userData";
import * as Room from "@/src/room/networking";

const app = App({});

export default function startRouter(port: number) {
    app.ws<UserData>('/room', {
        open: Room.onOpenWebSocket,
        message: Room.onMessage,
        close: Room.onCloseWebSocket
    })
    app.listen(port, (token) => {
        if (token) {
            console.log(`APIs Listening to port: ${port}.`);
        }
        else {
            console.log(`Failed to listen to port: ${port}.`);
        }
    });
}
