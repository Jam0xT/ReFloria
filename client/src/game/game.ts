export class Game {
    private _ws: WebSocket;

    private _container: HTMLElement;

    constructor() {}

    private get initialized() {
        return (this._container !== null);
    }

    connect(gameID: string) {
        this._ws = new WebSocket('ws://localhost:9001/game');
        this._ws.onopen = (event: Event) => {
            this._ws.send(gameID);
        }
    }

    setContainer(container: HTMLElement) {
        this._container = container;
    }

}

export const game = new Game();
