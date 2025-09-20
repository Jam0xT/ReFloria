import { World } from './World';
import { Vec2 } from '@/src/math';

export class Game {
    private _ws: WebSocket;

    public container: HTMLElement;

    public world: World;

    constructor() {}

    connect(gameID: string) {
        this._ws = new WebSocket('ws://localhost:9001/game');
        this._ws.onopen = (event: Event) => {
            this._ws.send(gameID);
        }
        this._ws.onmessage = (event: Event) => {
            const msg = JSON.parse(event.data);
            switch (msg.type) {
                case "init":
                    this.world = new World(this);
                    this.world.setMap(msg.value.map);
                    this.world.setCameraPosition(
                        new Vec2(
                            msg.value.position.x,
                            msg.value.position.y,
                        )
                    );
                    this.startRender();
                    break;
                default:
                    console.log('Unknown msg type from game server.');
            }
        }
    }

    setContainer(container: HTMLElement) {
        this.container = container;
    }

    startRender() {
        this.world.startRender();
    }
}

export const game = new Game();
