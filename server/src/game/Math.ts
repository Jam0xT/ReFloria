export class Vec2 {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    public get x() { return this._x; }
    public get y() { return this._y; }
    public get mag() { return Math.sqrt(this._x * this._x + this._y * this._y); }
    public set x(value: number) { this._x = value; }
    public set y(value: number) { this._y = value; }
    public subtract(v: Vec2) {
        this._x -= v.x;
        this._y -= v.y;
        return this;
    }
    public add(v: Vec2) {
        this._x += v.x;
        this._y += v.y;
        return this;
    }
    public dot(v: Vec2) { return this.x * v.x + this.y * v.y; }
    public isParallelTo(v: Vec2): boolean { return this.x * v.y === this.y * v.x; }
}