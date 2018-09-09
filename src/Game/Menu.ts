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
        tasks: Task[];

        constructor() {
            let data = JSON.parse(window.localStorage.getItem(STORE));
            this.body = $('body');
            this.info = document.getElementsByTagName('H3');;
            this.shop = true;
            this.active = true;
            this.storage = data && typeof data === 'object' && 'level' in data ? data : {
                score: 0,
                token: 0,
                level: 0
            }; 
            this.selected = 0;
            this.heroes = ['SPUTNIK', 'VOYAGER', 'PIONEER', 'CASSINI'];
            this.scores = document.getElementsByTagName('H4');
            this.hero();
            this.bind();
            this.init();
        }

        level() {
            return this.storage.level + 1;
        }

        init() {
            let level = this.level(),
                tasks = [],
                target = Math.ceil(level / 3);
            switch (level % 3) {
                case 1:
                    tasks.push(new Task('coin', target * 75));
                    break;
                case 2:
                    tasks.push(new Task('power', target, target % 2 == 0));
                    break;
                default:
                    tasks.push(new Task('coin', target * 50, true));
                    break;
            }
            target = Math.ceil(level / 4);
            switch (level % 4) {
                case 1:
                    tasks.push(target < 8
                        ? new Task('planet', target) 
                        : new Task('hit', target, true)
                    );
                    break;
                case 2:
                    tasks.push(target % 2 == 0
                        ? new Task('fence', 5 * target)
                        : new Task('fence', 3 * target, true)
                    );
                    break;
                case 3:
                    tasks.push(target % 2 == 0
                        ? new Task('enemy', 3 * target)
                        : new Task('enemy', 2 * target, true)
                    );
                    break;
                default:
                    tasks.push(new Task('hit', target));
                    break;
            }
            this.tasks = tasks;
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
            Event.on('all', (event) => {
                this.tasks.forEach(task => {
                    task.on(event);
                });
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

        mission(result: boolean = false) {
            let complete = true;
            this.tasks.forEach((task, i) => {
                if (!result) {
                    task.init();
                }
                let item = this.scores.item(i + 1);
                item.textContent = task.toString(result);
                item.className = task.done ? 'done' : '';
                complete = complete && task.done;
            });
            if (complete) {
                this.storage.level++;
                this.scores.item(0).textContent = 'LEVEL ' + this.level();                
                this.store();
                this.init();
            }
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
            this.mission(true);
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
            this.mission();
            this.scores.item(0).textContent = 'LEVEL ' + this.level();
            this.scores.item(4).textContent =
            this.scores.item(5).textContent = '';
            this.body.className = 'play';
        }

    }

}