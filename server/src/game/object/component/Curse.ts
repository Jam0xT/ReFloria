interface Cursable {
}

class Curse {
    private static _isReady = false;
    public static get isReady() { return Curse._isReady; }

    public static async readResources() {
    }

    private static cursePool: Record<string, Curse>;
    constructor() {}

}

export {
    Curse,
    Cursable,
}