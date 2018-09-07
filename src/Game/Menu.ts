namespace Game {

    const STORE = 'offliner_hi';

    export class Menu {

        body: Element;
        shop: boolean;
        info: NodeListOf<Element>;
        active: boolean;
        storage: any;
        selected: number;
        heroes: string[];
        scores: NodeListOf<Element>;

        constructor() {
            let data = JSON.parse(window.localStorage.getItem(STORE));
            this.body = $('body');
            this.info = document.getElementsByTagName('H3');;
            this.shop = true;
            this.active = true;
            this.storage = data && typeof data === 'object' && 'score' in data ? data : {score:0,token:0}; 
            this.selected = 0;
            this.heroes = ['SPUTNIK', 'VOYAGER', 'PIONEER', 'CASSINI'];
            this.scores = document.getElementsByTagName('H4');
            this.hero();
            this.bind();
        }

        bind() {            
            on($('#ok'), 'click', () => {
                Event.trigger('end');
            });
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
                    Event.trigger(this.shop ? 'start' : 'end');
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
            this.info.item(0).textContent = this.heroes[this.selected];
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

        score(score: number, tokens: number) {
            let high = this.storage.score || 0,
                element = this.scores.item(0);
            this.scores.item(4).textContent = `SCORE: ${score}`;
            this.scores.item(5).textContent = `TOKEN: ${tokens}`;
            if (high < score) {
                element.textContent = 'NEW HIGH SCORE';
                this.storage.score = score;
                this.store();
            } else {
                element.textContent = 'RESULTS';
            }
            this.token(tokens);
            this.active = true;
            this.body.className = 'end';
        }

        show() {
            this.shop = true;
            this.body.className = '';
        }

        hide() {
            this.shop = false;
            this.active = false;
            this.scores.item(0).textContent = 'MISSION';
            this.scores.item(4).textContent = '';
            this.scores.item(5).textContent = '';
            this.body.className = 'play';
        }

    }

}