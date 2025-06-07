import { defineStore } from "pinia";

export const global = defineStore('global', {
    state: () => ({
        hide_loading: null as unknown as Function,

        show_background: null as unknown as Function,
        hide_background: null as unknown as Function,

        show_welcome: null as unknown as Function,
        hide_welcome: null as unknown as Function,
    }),
    actions: {
        first_welcome() {
            this.hide_loading(() => {
                this.show_background();
                this.show_welcome();
            });
        },
    }
});