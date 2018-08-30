namespace Game {

    const STORE = 'offliner_hi';

    export class Menu {

        body: Element;
        active: boolean;
        storage: number;
        scores: NodeListOf<Element>;

        constructor() {
            this.body = $('body');
            this.storage = JSON.parse(localStorage.getItem(STORE)) || 0;
            this.active = true;
            this.scores = document.getElementsByTagName('H3');
            if (this.storage) {
                this.scores.item(0).textContent = 'High Score: ' + this.storage;
            }
        }

        score(value: number) {
            let high = this.storage || 0, 
                beat = high < value;
            if (beat) {
                this.storage = value;
                localStorage.setItem(STORE, JSON.stringify(this.storage));
            }
            this.scores.item(0).textContent = beat ? 'New High Score!' : 'High Score: ' + this.storage;
            this.scores.item(1).textContent = (beat ? '' : 'Score: ') + value;
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