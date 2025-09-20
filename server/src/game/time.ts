export class Loop {
    private readonly _callback: (...args: unknown[]) => unknown;

    private readonly _intervalMilliSeconds: number;

    private _started: boolean = false;
    public get started(): boolean {
        return this._started;
    }

    private _ended: boolean = false;
    public isEnded(): boolean {
        return this._ended;
    }

    constructor(callback: (...args: unknown[]) => unknown, intervalMilliSeconds: number) {
        this._callback = callback;
        this._intervalMilliSeconds = intervalMilliSeconds;
    }

    async start(){
        this._started = true;
        const intervalID =
            setInterval(this._callback, this._intervalMilliSeconds);
        await until(this.isEnded.bind(this));
        clearInterval(intervalID);
    }

    end(){
        if (!this._started) {
            throw new Error('Loop: Attempt to end Loop before it is started.');
        }
        this._ended = true;
    }

    // pause and resume??
}

function until(conditionFunction: (...args: unknown[]) => boolean): Promise<void> {
    const poll = (resolve: (() => void)) => {
        if (conditionFunction()) {
            resolve();
        } else {
            setTimeout(() => {poll(resolve)}, 1000);
        }
    }
    return new Promise(poll);
}