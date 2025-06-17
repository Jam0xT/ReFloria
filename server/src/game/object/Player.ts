import Controller from './component/Controller';
import { Effectable, Effect } from './component/Effect';

class Player implements Controller, Effectable {
    private effects: Effect[] = [];
}