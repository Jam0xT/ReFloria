import { Game } from './game';
import { EntityType } from './config/entity';

export class State {
    public static RENDER_DELAY = 50;

    public game: Game;

    public pkgArray: StreamDataPackage[] = [];

    public initialServerTimeStamp: number;

    public initialLocalTimeStamp: number;

    constructor(game: Game) {
        this.game = game;
    }

    init() {
        this.initialServerTimeStamp = Date.now();
    }

    // process a new arraybuffer stream data package
    process(buffer: ArrayBuffer) {
        const newPackage: StreamDataPackage = {
            timeStamp: -1,
            x: -1,
            y: -1,
            entities: {}
        };
        const totalByteLength = buffer.length;
        let byteOffset = 8;

        const timeStamp = new BigUint64Array(buffer, byteOffset, 1);
        byteOffset += 8;

        newPackage.timeStamp = timeStamp[0];

        const x = new Float64Array(buffer, byteOffset, 1);
        byteOffset += 8;
        const y = new Float64Array(buffer, byteOffset, 1);
        byteOffset += 8;

        newPackage.x = x[0];
        newPackage.y = y[0];

        for (;byteOffset < totalByteLength;) {
            const entityID = new Uint32Array(buffer, byteOffset, 1);
            const entityType = new Uint16Array(buffer, byteOffset + 4, 1);
            const entityX = new Float64Array(buffer, byteOffset + 8, 1);
            const entityY = new Float64Array(buffer, byteOffset + 16, 1);
            byteOffset += 24;

            newPackage.entities[entityID] = {
                type: entityType[0],
                id: entityID[0],
                x: entityX[0],
                y: entityY[0],
            };
        }

        this.pkgArray.push(newPackage);
        if (!this.initialServerTimeStamp) {
            this.initialServerTimeStamp = newPackage.timeStamp;
        }

        const baseIndex = this.getBasePackageIndex();
        if ( baseIndex > 0 ) {
            this.pkgArray.splice(0, baseIndex);
        }
    }

    getBasePackageIndex(): number {
        const currentServerTime = this.getCurrentServerTime();
        for (let i = pkgArray.length - 1; i >= 0; i-- ) {
            if (pkgArray[i].timeStamp <= currentServerTime) {
                return i;
            }
        }
        return -1;
    }

    getCurrentServerTime(): number {
        return this.initialServerTimeStamp + Date.now() - this.initialServerTimeStamp - State.RENDER_DELAY;
    }
}

type StreamDataPackage = {
    timeStamp: number;
    x: number;
    y: number;
    entities: Record<number, EntityStreamData>;
}

type EntityStreamData = {
    type: EntityType;
    id: number;
    x: number;
    y: number;
}