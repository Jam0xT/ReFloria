interface Observer {
    isAbandoned: boolean;
    onNotify<T extends ObserverEventType>(
        eventType: T,
        args: ObserverEventArgs[T],
    ): void;
}

type ObserverEventType =
    'EVENT_A' |
    'EVENT_B';

interface ObserverEventArgs {
    EVENT_A: {
        id: number;
    };
    EVENT_B: {

    };
}

export {
    Observer,
    ObserverEventType,
    ObserverEventArgs,
}