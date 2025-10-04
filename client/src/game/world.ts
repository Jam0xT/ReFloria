import { Vec2, lerp } from '@/src/math';
import { Game } from '@/src/game/game';
import { BiomeType } from '@/src/game/config/biome';
import { EntityType } from '@/src/game/config/entity';

export class World {
    private _canvas: HTMLCanvasElement;
    private _camera: Camera = new Camera(1, Vec2.zero());

    public game: Game;
    public chunkSize: number;
    public widthChunks: number;
    public heightChunks: number;
    public worldMapBiome: BiomeType[];
    public entities: Record<number, Entity> = {};
    public isRendering: boolean = false;

    constructor(game: Game) {
        this.game = game;
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this._canvas = canvas;
    }

    render() {
        this.update();

        const ctx = this._canvas.getContext('2d');
        console.log(this._canvas.width, this._canvas.height);



        if (this.isRendering) {
            requestAnimationFrame(this.render.bind(this));
        }
    }

    // get data from State to render the current frame
    update() {
        const state = game.state;
        const baseIndex = state.getBasePackageIndex();
        const localTimeStamp = Date.now();
        if (baseIndex < 0 || baseIndex === state.pkgArray.length - 1) {
            const pkg = state.pkgArray[state.pkgArray.length - 1];

        } else {
            const basePkg = state.pkgArray[baseIndex], nextPkg = state.pkgArray[baseIndex + 1];
            const ratio = (localTimeStamp - basePkg.timeStamp) / (nextPkg.timeStamp - basePkg.timeStamp);
            this._camera.setTarget(new Vec2(
                lerp(basePkg.x, nextPkg.x, ratio),
                lerp(basePkg.y, nextPkg.y, ratio)
            ));
            Object.values(basePkg.entities).forEach(entity => {
                const x = lerp(basePkg.entities[entity.id].x, nextPkg.entities[entity.id].x, ratio);
                const y = lerp(basePkg.entities[entity.id].y, nextPkg.entities[entity.id].y, ratio);
                if ( this.entities[entity.id] ) {
                    this.entities[entity.id].x = x;
                    this.entities[entity.id].y = y;
                } else {
                    this.entities[entity.id] = {
                        x: x,
                        y: y,
                        type: entity.type,
                    };
                }
            });
        }1
    }

    startRender() {
        this.game.container.appendChild(canvas);

        this.isRendering = true;
        console.log(this.worldMap);
        requestAnimationFrame(this.render.bind(this));
    }
}

class Camera {
    public static EASING_COEFFICIENT = 0.2;

    public zoom: number;
    public position: Vec2;
    public target: Vec2;

    constructor(zoom: number, position: Vec2) {
        this.zoom = zoom;
        this.position = position;
    }

    setTarget(position: Vec2) {
        this.target = position;
    }

    update() {
        this.position.add(this.target.sub(this.position).scale(Camera.EASING_COEFFICIENT));
    }
}

type Entity = {
    type: EntityType;
    x: number;
    y: number;
}