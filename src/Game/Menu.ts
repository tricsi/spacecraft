namespace Game {

    const STORE = 'offliner_hi';

    export class Menu {

        body: Element;
        left: Element;
        right: Element;
        index: number;
        active: boolean;
        scores: NodeListOf<Element>;
        planets: NodeListOf<Element>;
        storage: number[];

        constructor() {
            this.body = $('body');
            this.left = $('#left');
            this.right = $('#right');
            this.scores = document.getElementsByTagName('H3');
            this.planets = document.getElementsByTagName('LI');
            this.index = this.planets.length - 1;
            this.left.className = 'disabled';
            this.storage = JSON.parse(localStorage.getItem(STORE)) || [];
            this.active = true;
            for (let i = 0; i < this.planets.length; i++) {
                if (!this.storage[i]) continue;
                this.scores.item(i * 2).textContent = 'High Score: ' + this.storage[i];
            }
            this.bind();
        }

        score(value: number) {
            let index = this.index * 2,
                high = this.storage[this.index] || 0, 
                beat = high < value;
            if (beat) {
                this.storage[this.index] = value;
                localStorage.setItem(STORE, JSON.stringify(this.storage));
            }
            this.scores.item(index).textContent = beat ? 'New High Score!' : 'High Score: ' + high;
            this.scores.item(index + 1).textContent = (beat ? '' : 'Score: ') + value;
        }

        input(key: number): void {
            if (!this.active) {
                return;
            }
            switch (key) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }

        prev() {
            if (this.left.className) {
                return;
            }
            this.planets.item(++this.index).className = "";
            if (this.index >= this.planets.length - 1) {
                this.left.className = 'disabled';
            }
            this.right.className = '';
        }

        next() {
            if (this.right.className) {
                return;
            }
            this.planets.item(this.index--).className = "hide";
            if (this.index <= 0) {
                this.right.className = 'disabled';
            }
            this.left.className = '';
        }

        show() {
            this.active = true;
            this.body.className = '';
        }

        hide() {
            this.active = false;
            this.body.className = 'play';
        }

        bind() {
            on(this.left, 'click', e => {
                this.prev();
            });
            on(this.right, 'click', e => {
                this.next();
            });    
        }
    }

}