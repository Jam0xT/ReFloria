export class Game {

    private _container: HTMLElement;

    constructor() {}

    private get initialized() {
        return (this._container !== null);
    }

    setContainer(container: HTMLElement) {
        this._container = container;
    }

}