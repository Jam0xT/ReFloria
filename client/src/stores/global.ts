import { defineStore } from "pinia";

export const global = defineStore('global', {
    state: () => ({
        hide_loading: null as unknown as Function,

        show_background: null as unknown as Function,
        hide_background: null as unknown as Function,

        show_welcome: null as unknown as Function,
        hide_welcome: null as unknown as Function,

        show_start: null as unknown as Function,
        hide_start: null as unknown as Function,

        show_createRoom: null as unknown as Function,
        hide_createRoom: null as unknown as Function,

        show_joinRoom: null as unknown as Function,
        hide_joinRoom: null as unknown as Function,

        show_room: null as unknown as Function,
        update_room: null as unknown as Function,
        hide_room: null as unknown as Function,

        show_auth: null as unknown as Function,
        hide_auth: null as unknown as Function,
    }),
    actions: {
        first_welcome() { // loading -> welcome
            this.hide_loading(() => {
                this.show_background();
                this.show_welcome();
            });
        },
        welcome(hide: (immediate: Function) => any) {
            hide(this.show_welcome)
        },
        auth(hide: (immediate: Function) => any) {
            hide(this.show_auth)
        },
        welcome_to_start() { // welcome -> start
            this.hide_welcome(null, () => {
                this.show_start();
            })
        },
        start_to_create_room() { // start -> createRoom
            this.hide_start(null, () => {
                this.show_createRoom();
            })
        },
        start_to_join_room() { // start -> joinRoom
            this.hide_start(null, () => {
                this.show_joinRoom();
            })
        },
        create_room_to_start() { // createRoom -> start
            this.hide_createRoom(null, () => {
                this.show_start();
            });
        },
        join_room_to_start() { // joinRoom -> start
            this.hide_joinRoom(null, () => {
                this.show_start();
            });
        },
    }
});