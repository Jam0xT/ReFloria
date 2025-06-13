interface IObserver {
    isAbandoned: boolean;
    onNotify<T extends ObserverEventType>(
        eventType: T,
        args: IObserverEventArgs[T],
    ): void;
}

type ObserverEventType =
    'EVENT_A' |
    'EVENT_B';

interface IObserverEventArgs {
    EVENT_A: {
        id: number;
    };
    EVENT_B: {

    };
}

export {
    IObserver,
    ObserverEventType,
    IObserverEventArgs,
}