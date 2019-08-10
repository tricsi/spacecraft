export class Event {

    private static listener: {[event: string]: {(event?:string, params?: any): void}[]} = { all: [] };

    static on(event:string, listener: {(event?:string, params?: any): void}): void {
        const events = event.match(/[a-zA-Z]+/g);
        if (!events) {
            return;
        }
        events.forEach(event => {
            if (!(event in Event.listener)) {
                Event.listener[event] = [];
            }
            Event.listener[event].push(listener);
        });
    }

    static trigger(event: string, params?: any): void {
        Event.listener['all'].forEach(listener => {
            listener(event, params);
        });
        if (event in Event.listener) {
            Event.listener[event].forEach(listener => {
                listener(event, params);
            });
        }
    }
}
