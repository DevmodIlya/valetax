"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListeners = void 0;
class EventListeners {
    static add(options, ret) {
        const element = options.element;
        if (!element) {
            return;
        }
        // const callbackFn = <() => void | C>options.callback.bind(options.context);
        const callbackFn = options.callback;
        const eventData = {
            type: options.type,
            callbackFn: callbackFn,
            element: options.element
        };
        if (options.debounce) {
            const debounce = EventListeners.debounce(callbackFn, options.debounce, options.context);
            element.addEventListener(options.type, debounce);
            return;
        }
        element.addEventListener(options.type, callbackFn);
        if (ret) {
            return eventData;
        }
        EventListeners.listeners[options.id] = [eventData];
    }
    static pushToTet(data) {
        EventListeners.test.push(data);
    }
    static debounce(func, delay, context) {
        let timeoutId = null;
        let isCooldown = false;
        return function (...args) {
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
    static getTests() {
        return EventListeners.test;
    }
    static showStatus() {
        return EventListeners.listeners;
    }
    static unlisten(id) {
        const optionsList = EventListeners.listeners[id];
        if (!optionsList || optionsList.length === 0) {
            return;
        }
        optionsList.forEach((option) => {
            if (option) {
                const element = option.element;
                if (!element) {
                    return;
                }
                element.removeEventListener(option.type, option.callbackFn);
            }
        });
    }
    static unlistenNamespace(id) {
        const namespace = EventListeners.groupOfIds;
        if (namespace) {
            const ids = namespace[id];
            if (ids && ids.length > 0) {
                ids.forEach((unlistenId) => {
                    EventListeners.unlisten(unlistenId);
                });
            }
        }
    }
    static groupListeners(groupId, optionsList) {
        if (!optionsList || optionsList.length === 0) {
            return;
        }
        if (groupId.includes("-")) {
            const groupNamespace = groupId.split("-");
            EventListeners.groupOfIds[groupNamespace[0]].push(groupId);
        }
        EventListeners.listeners[groupId] = [];
        let temp = [];
        optionsList.forEach((listenerItem) => {
            temp.push(EventListeners.add(listenerItem, true));
        });
        EventListeners.listeners[groupId] = temp;
    }
}
exports.EventListeners = EventListeners;
EventListeners.test = [];
EventListeners.groupOfIds = {};
EventListeners.listeners = {};
EventListeners.trackables = {};
