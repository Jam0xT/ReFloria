/*
定义：我们称一个拥有几何形状，可以判定与其他几何形状的关系的对象为碰撞箱。
 */
import { Vec2 } from '../../Math';
import { Observer, ObserverEventType, ObserverEventArgs } from "../../Observer";

class Hitbox {
    constructor() {
    }
    // private _position: Vec2;
    // private _observers: Observer[];
    public addObserver(observer: Observer): void {};
}

export default Hitbox;