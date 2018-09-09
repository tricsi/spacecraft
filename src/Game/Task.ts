namespace Game {

    const LABEL = {
        coin: 'Collect $ token',
        power: 'Collect $ big token',
        planet: 'Travel to $',
        fence: 'Dodge junks $ time',
        enemy: 'Dodge asteroids $ time',
        hit: 'Destroy $ asteroid',
    };

    const PLANETS = ['Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Space'];

    export class Task {

        event: string;

        target: number;

        count: number;

        run: boolean;

        done: boolean;

        constructor(event: string, target: number, run: boolean = false) {
            this.event = event;
            this.target = target;
            this.count = 0;
            this.run  = run || event == 'planet';
            this.done = false;
        }

        init() {
            if (!this.done && this.run) {
                this.count = 0;
            }
        }

        on(event: string) {
            if (!this.done && this.event == event) {
                this.done = this.target <= ++this.count;
            }
        }

        toString(result: boolean = false) {
            let event = this.event,
                text = LABEL[event],
                param = this.target.toString();
            if (event == 'planet') {
                param = PLANETS[this.target - 1];
            } else {
                if (this.target > 1) {
                    text += 's';
                }
                if (this.run) {
                    text += ' on a mission'
                }
                if (result) {
                    param += ' / ' + this.count;
                }
            }
            return text.replace('$', param);
        }

    }

}