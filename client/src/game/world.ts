import { Vec2 } from '@/src/math';
import { Game } from '@/src/game/game';

export class World {
    private _canvas: HTMLCanvasElement;
    private _camera: Camera = new Camera(1, Vec2.zero());

    public game: Game;
    public worldMap: string[][];
    public isRendering: boolean = false;

    constructor(game: Game) {
        this.game = game;
    }

    render() {
        const ctx = this._canvas.getContext('2d');
        console.log(this._canvas.width, this._canvas.height);
        for (let i = 0; i < this.worldMap.length; i++) {
            for (let j = 0; j < this.worldMap[i].length; j++) {
                switch (this.worldMap[i][j]) {
                    case 'garden':
                        ctx.fillStyle = 'green';
                        break;
                    case 'desert':
                        ctx.fillStyle = 'yellow';
                        break;
                    case 'ocean':
                        ctx.fillStyle = 'blue';
                        break;
                    default:
                        ctx.fillStyle = 'black';
                }
                ctx.fillRect(i*10, j*10, 10, 10);
            }
        }
        if (this.isRendering) {
            // requestAnimationFrame(this.render.bind(this));
        }
    }

    startRender() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this._canvas = canvas;
        this.game.container.appendChild(canvas);

        this.isRendering = true;
        console.log(this.worldMap);
        requestAnimationFrame(this.render.bind(this));
    }

    setMap(worldMap: string[][]) {
        this.worldMap = worldMap;
    }

    setCameraPosition(position: Vec2) {
        this._camera.setPosition(position);
    }
}

class Camera {
    public zoom: number;
    public position: Vec2;

    constructor(zoom: number, position: Vec2) {
        this.zoom = zoom;
        this.position = position;
    }

    setPosition(position: Vec2) {
        this.position = position;
    }
}