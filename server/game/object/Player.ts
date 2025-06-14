import IController from './component/Controller';
import { IEffectable, Effect } from './component/Effect';

class Player implements IController, IEffectable {
    private effects: Effect[] = [];
}