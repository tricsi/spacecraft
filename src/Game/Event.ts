namespace Game {

    export class Event {

        private static listener: {[event: string]: {(params?: any, event?:string): void}[]} = {};

        static on(event:string, listener: {(params?: any, event?:string): void}): void {
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
            if (!(event in Event.listener)) {
                return;
            }
            Event.listener[event].forEach(listener => {
                listener(params, event);
            });
        }
    }
}