/*
定义：我们称一个控制碰撞箱对碰撞事件产生物理反应的对象为实体。
 */
import { Observer, ObserverEventType, ObserverEventArgs } from '../../Observer';
import { Vec2 } from '../../Math';
class Entity implements Observer {
    constructor() {}
    //
    // implement IObserver

    private _isAbandoned = false;
    public get isAbandoned(): boolean { return this._isAbandoned; }
    public onNotify<T extends ObserverEventType>(eventType: T, args: ObserverEventArgs[T]): void {}
}
export default Entity;