/*
定义：我们称一个控制碰撞箱对碰撞事件产生物理反应的对象为实体。
 */
import { Vec2 } from '../../Math';
import Hitbox from './Hitbox';

interface Entity {
    hitbox: Hitbox;
}

export default Entity;