/*
定义：我们称一个拥有几何形状，可以判定与其他几何形状的关系的对象为碰撞箱。
 */
import { Vec2 } from './Math';
import { IObserver, ObserverEventType, IObserverEventArgs } from "./Observer";

class Hitbox {
    private _position: Vec2;
    private _observers: IObserver[];
}

export default Hitbox;