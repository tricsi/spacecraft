namespace Game {

    const STORE = 'offliner_hi';

    export class Menu {

        body: Element;
        active: boolean;
        storage: number;

        constructor() {
            this.body = $('body');
            this.storage = JSON.parse(localStorage.getItem(STORE)) || 0;
            this.active = true;
        }

        score(value: number) {
            let high = this.storage || 0, 
                beat = high < value;
            if (beat) {
                this.storage = value;
                localStorage.setItem(STORE, JSON.stringify(this.storage));
            }
        }

        show() {
            this.active = true;
            this.body.className = '';
        }

        hide() {
            this.active = false;
            this.body.className = 'play';
        }

    }

}