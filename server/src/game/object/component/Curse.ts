/*
here's just some notes for myself
when reading resources, all curses should be put in the cursePool with an curseID formatted as 'module/file/id'
like 'default/effects/poison'
curses can have levels like 1, 2, 3, ... probably more but within some defined limit
and the actual effect of a curse can be amplified by an amplifier, determined using a level->amplifier map

ideally I could just map all the ids to some order number so it's easier to access them
and I just did.


 */

interface Cursable {
    // a list of all the curse amplifier levels
    curseLevels: number[];
}

class Curse {
    private static _isReady = false;
    public static isReady() { return Curse._isReady; }

    public static async readResources() {
        // read resources from file and fill the cursePool
        // fill the curseOrderMap so that we can access curses with its order number
    }

    // id -> order
    private static curseOrderMap: Record<string, number> = {}

    // order -> Curse
    private static cursePool: Curse[] = [];

    private constructor(id: string, order: number, options: CurseOptions) {
        this._id = id;
        this._order = order;
        this._amplifier = options.amplifier;
    }

    private readonly _id: string;
    public get id() { return this._id; }

    private readonly _order: number;
    public get order() { return this._order; }

    private readonly _amplifier: number[];
    public get amplifier() { return this._amplifier; }
}

interface CurseOptions {
    amplifier: number[];
}

export {
    Curse,
    Cursable,
}