namespace Game {

    const STORE = 'offliner_hi';

    export class Menu {

        body: Element;
        active: boolean;
        storage: any;
        selected: number;
        heroes: string[];
        scores: NodeListOf<Element>;

        constructor() {
            this.body = $('body');
            this.active = true;
            this.storage = JSON.parse(window.localStorage.getItem(STORE)) || {};
            this.selected = 0;
            this.heroes = ['Sputnik', 'Voyager', 'Pioneer', 'Cassini'];
            this.scores = document.getElementsByTagName('H3');
            this.score(this.storage);
            this.hero();
            this.bind();
        }

        bind() {            
            on($('#play'), 'click', () => {
                Event.trigger('start');
            });
            on($('#prev'), 'click', () => {
                this.prev();
            });
            on($('#next'), 'click', () => {
                this.next();
            });
        }

        input(key: number): void {
            if (!this.active) {
                return;
            }
            switch (key) {
               case 32:
                    Event.trigger('start');
                    break;
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }

        hero() {
            this.scores.item(1).textContent = this.heroes[this.selected];
        }

        prev() {
            if (--this.selected < 0) {
                this.selected = this.heroes.length -1;
            }
            this.hero();
        }

        next() {
            if (++this.selected >= this.heroes.length) {
                this.selected = 0;
            }
            this.hero();
        }

        store() {
            window.localStorage.setItem(STORE, JSON.stringify(this.storage));
        }

        token(value: number = 0) {
            let token = this.storage.token || 0;
            if (token < value) {
                token = value;
                this.storage.token = value;
                this.store();
            }
            return token;
        }

        score(value: number) {
            let score = this.storage.score || 0, 
                element = this.scores.item(0);
            if (score < value) {
                element.textContent = 'New High Score: ' + score;
                this.storage.score = value;
                this.store();
            } else if (score) {
                element.textContent = 'High Score: ' + score;
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