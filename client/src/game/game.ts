import { World } from './World';
import { Vec2 } from '@/src/math';

export class Game {
    private _ws: WebSocket;

    public container: HTMLElement;

    public world: World = new World(this);

    constructor() {}

    connect(gameID: string) {
        this._ws = new WebSocket('ws://localhost:9001/game');
        this._ws.onopen = (event: Event) => {
            this._ws.send(gameID);
        }
        this._ws.onmessage = (event: Event) => {
            const buffer: ArrayBuffer = event.data;
            let byteOffset = 0;
            const header = new Uint8Array(buffer, byteOffset, 1);
            byteOffset += 8;
            switch (header[0]) {
                case PackageHeader.initial:
                    const chunkSize = new Uint32Array(buffer, byteOffset, 1);
                    this.world.chunkSize = chunkSize[0];
                    byteOffset += 8;

                    const widthChunks = new Uint32Array(buffer, byteOffset, 1);
                    this.world.widthChunks = widthChunks[0];
                    const heightChunks = new Uint32Array(buffer, byteOffset, 1);
                    this.world.heightChunks = heightChunks[0];
                    byteOffset += 8;

                    for (let i = 0; i < widthChunks * heightChunks; i++) {
                        const biomeType = new Uint8Array(buffer, byteOffset, 1);
                        this.world.worldMapBiome[i] = biomeType[0];
                        byteOffset += 1;
                    }

                    this.startRender();
                    break;
                case PackageHeader.stream:
                    break;
                default:
                    console.log('unknown header ', header[0]);
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

enum PackageHeader {
    initial,
    stream,
}