import { global } from './stores/global';

type onMessageFn = (event) => any;

type onOpenFn = () => any;

type onCloseFn = () => any;

export const nw = new class {
    public ws = new WebSocket('ws://localhost:9001/ws');
    private onOpenFns: onOpenFn[] = [];
    private onMessageFns: onMessageFn[] = []
    private onCloseFns: onCloseFn[] = [];

    constructor() {
        this.ws.onopen = () => {
            this.onOpenFns.forEach(fn => fn())
        }
        this.ws.onmessage = (event) => {
            this.onMessageFns.forEach(fn => fn(event))
        }
        this.ws.onclose = () => {
            this.onCloseFns.forEach(fn => fn())
        }
    }

    onOpen(listener: onOpenFn) {
        this.onOpenFns.push(listener);
    }
    onMessage(listener: onMessageFn) {
        this.onMessageFns.push(listener);
    }
    onClose(listener: onCloseFn) {
        this.onCloseFns.push(listener);
    }
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        this.ws.send(data)
    }
}

// let store
nw.onOpen(() => {
    console.log('Connected to WebSocket server');
    store = global();
})

nw.onClose(() => {
    console.log('Connection closed');
})
