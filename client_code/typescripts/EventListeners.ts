export interface ListenerOptions<T, C> {
    id?: string
    type: string
    context: T
    callback: C
    debounce?: number
    element: HTMLDivElement | HTMLInputElement | HTMLButtonElement | HTMLSpanElement
}

interface ListenerOptionsWithFn {
    type: string
    callbackFn: any
    element: HTMLDivElement | HTMLInputElement | HTMLButtonElement | HTMLSpanElement
}

interface Trackable {
    callbackFn: any
    element: HTMLDivElement | HTMLInputElement | HTMLButtonElement | HTMLSpanElement
}

export class EventListeners {

    private static test: any = []
    private static groupOfIds: { [key: string]: string[] } = {};
    private static listeners: { [key: string]: ListenerOptionsWithFn[] } = {};
    private static trackables: { [key: string]: Trackable } = {};

    public static add<T, C>(options: ListenerOptions<T, () => void | C>, ret: boolean): void | ListenerOptionsWithFn {
        const element: HTMLDivElement | HTMLInputElement | HTMLButtonElement | HTMLSpanElement = options.element;
        if (!element) {
            return;
        }

        // const callbackFn = <() => void | C>options.callback.bind(options.context);
        const callbackFn = <() => void | C>options.callback;
        const eventData: ListenerOptionsWithFn = {
            type: options.type,
            callbackFn: callbackFn,
            element: options.element
        }
        if (options.debounce) {
            const debounce = EventListeners.debounce<() => void | C, T>(callbackFn, options.debounce, options.context);
            element.addEventListener(<string>options.type, debounce);
            return;
        }
        element.addEventListener(<string>options.type, callbackFn);

        if (ret) {
            return eventData;
        }
        EventListeners.listeners[<string>options.id] = [eventData];
    }

    public static pushToTet(data: any): void {
        EventListeners.test.push(data)
    }

    private static debounce<T, C>(func: T, delay: number, context: C): () => void {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let isCooldown = false;

        return function (this: any, ...args: any[]) {
            const context = this;

            if (!isCooldown) {
                // @ts-ignore
                func.apply(context, args);
                isCooldown = true;

                timeoutId = setTimeout(() => {
                    isCooldown = false;
                    if (timeoutId !== null) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                }, delay);
            }
        };
    }

    public static getTests(): any {
        return EventListeners.test
    }

    public static showStatus(): { [key: string]: ListenerOptionsWithFn[] } {
        return EventListeners.listeners;
    }

    public static unlisten(id: string): void {
        const optionsList: ListenerOptionsWithFn[] = EventListeners.listeners[id];
        if (!optionsList || optionsList.length === 0) {
            return;
        }
        optionsList.forEach((option: ListenerOptionsWithFn) => {
            if (option) {
                const element = option.element;
                if (!element) {
                    return;
                }
                element.removeEventListener(option.type, option.callbackFn);
            }
        });
    }

    public static unlistenNamespace(id: string): void {
        const namespace = EventListeners.groupOfIds;

        if (namespace) {
            const ids = namespace[id];
            if (ids && ids.length > 0) {
                ids.forEach((unlistenId: string) => {
                    EventListeners.unlisten(unlistenId);
                })
            }
        }
    }

    public static groupListeners<T, C>(groupId: string, optionsList: (ListenerOptions<T, (item?: T) => void | C>)[]): void {
        if (!optionsList || optionsList.length === 0) {
            return;
        }

        if (groupId.includes("-")) {
            const groupNamespace = groupId.split("-");
            EventListeners.groupOfIds[groupNamespace[0]].push(groupId);
        }

        EventListeners.listeners[groupId] = [];
        let temp: ListenerOptionsWithFn[] = []
        optionsList.forEach((listenerItem: ListenerOptions<T, (item?: T) => void | C>) => {
            temp.push(<ListenerOptionsWithFn>EventListeners.add(listenerItem, true));
        });
        EventListeners.listeners[groupId] = temp;
    }

}