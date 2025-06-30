interface Effectable {
}

class Effect {
    private static _isReady = false;
    public static get isReady() { return Effect._isReady; }

    public static async readResources() {
    }
}

export {
    Effect,
    Effectable,
}