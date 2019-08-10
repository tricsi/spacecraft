import { Event } from "./Event";
import { $, on } from "../main";
import { Hero } from "./Hero";
import { Task } from "./Task";
import { SFX } from "../sfx";

const STORE = 'offliner_hi';

export class Menu {

    body: Element;
    btn: Element;
    shop: boolean;
    info: HTMLCollectionOf<Element>;
    active: boolean;
    storage: any;
    selected: number;
    heroes: any[];
    scores: HTMLCollectionOf<Element>;
    tasklist: HTMLCollectionOf<Element>;
    tasks: Task[];
    stats: any;
    sfxBtn: Element;
    volume: number;

    constructor() {
        let data = JSON.parse(window.localStorage.getItem(STORE));
        this.body = $('body');
        this.btn = $('#play');
        this.info = document.getElementsByTagName('H3');
        this.shop = true;
        this.active = true;
        this.storage = data && typeof data === 'object' && 'shop' in data ? data : {
            score: 0,
            token: 0,
            level: 0,
            shop: [0]
        };
        this.selected = 0;
        this.heroes = [
            {name: 'SPUTNIK', price: 0},
            {name: 'VOYAGER', price: 500},
            {name: 'PIONEER', price: 1000},
            {name: 'CASSINI', price: 2500}
        ];
        this.tasklist = document.getElementsByTagName('H4');
        this.scores = document.getElementsByTagName('TD');
        this.stats = {};
        this.sfxBtn = $('#sfx');
        this.volume = .3;
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
                tasks.push(target % 2 == 1
                    ? new Task('fence', 5 * target)
                    : new Task('fence', 3 * target, true)
                );
                break;
            case 3:
                tasks.push(target % 2 == 1
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
        on(this.btn, 'click', () => {
            this.play();
        });
        on($('#prev'), 'click', () => {
            this.prev();
        });
        on($('#next'), 'click', () => {
            this.next();
        });
        on($('#fs'), 'click', () => {
            //@ts-ignore
             if (!document.webkitFullscreenElement) document.documentElement.webkitRequestFullscreen();
             //@ts-ignore
             else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        });
        on(this.sfxBtn, 'click', () => {
            let btn = this.sfxBtn,
                music = SFX.mixer('music'),
                sound = SFX.mixer('master'),
                time = sound.context.currentTime;
            try {
                switch(btn.className) {
                    case 'no':
                        this.volume = .3;
                        music.gain.setValueAtTime(this.volume, time);
                        sound.gain.setValueAtTime(1, time);
                        btn.className = '';
                        break;
                    case 'sfx':
                        sound.gain.setValueAtTime(0, time);
                        btn.className = 'no';
                        break;
                    default:
                        this.volume = 0;
                        music.gain.setValueAtTime(this.volume, time);
                        btn.className = 'sfx';
                }
            } catch (ex) {}
        });
        Event.on('all', (event) => {
            if (event in this.stats) {
                this.stats[event] += 1;
            } else {
                this.stats[event] = 1;
            }
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
                if (this.shop) {
                    this.play()
                } else {
                    Event.trigger('end');
                }
                break;
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
        }
    }

    play() {
        if (this.btn.textContent == 'PLAY') {
            this.stats = {};
            Event.trigger('start');
        } else if (this.btn.className == '') {
            this.storage.token -= this.heroes[this.selected].price;
            this.storage.shop.push(this.selected);
            this.store();
            this.hero();
        }
    }

    hero() {
        let token = this.storage.token,
            data = this.heroes[this.selected],
            buy = this.storage.shop.indexOf(this.selected) < 0,
            can = token >= data.price;
        this.info.item(0).textContent = data.name;
        this.info.item(1).textContent = buy ? `₮ ${data.price} / ${token}` : '';
        this.btn.textContent = buy ? 'BUY' : 'PLAY';
        this.btn.className = !buy || can ? '' : 'disabled';
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

    mission(result: boolean = false) {
        let complete = true;
        this.tasks.forEach((task, i) => {
            if (!result) {
                task.init();
            }
            let item = this.tasklist.item(i + 1);
            item.textContent = task.toString();
            item.className = task.done ? 'done' : '';
            complete = complete && task.done;
        });
        if (complete) {
            this.storage.level++;
            this.store();
            this.init();
        }
        return complete;
    }

    score(hero: Hero) {
        let high = this.storage.score || 0,
            element = this.tasklist.item(0),
            scores = this.scores,
            hit = this.stats.hit || 0,
            places = (this.stats.planet || 0) + 1,
            power = this.stats.power || 0,
            tokens = this.stats.coin || 0,
            total = Math.round(hero.distance),
            mission = this.mission(true) ? 1 : 0;
        scores.item(0).textContent = total + '';
        scores.item(1).textContent = '₮ ' + tokens + ' x 10';
        scores.item(2).textContent = power + ' x 25';
        scores.item(3).textContent = hit + ' x 50';
        scores.item(4).textContent = places + ' x 100';
        scores.item(5).textContent = mission + ' x 500';
        total += (mission * 500) + (places * 100) + (hit * 50) + (power * 25) + (tokens * 10);
        scores.item(6).textContent = total + '';
        if (high < total) {
            element.textContent = 'NEW HIGH SCORE';
            this.storage.score = total;
        } else {
            element.textContent = 'SCORE';
        }
        this.storage.token += tokens;
        this.store();
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
        this.tasklist.item(0).textContent = 'MISSION ' + this.level();
        this.scores.item(4).textContent =
        this.scores.item(5).textContent = '';
        this.body.className = 'play';
    }

}
