import { Rand } from "../main";
import { Hero } from "./Hero";
import { Item } from "../T3D/Item";

const yellow = [1, 1, .3, 30];
const purple = [1, .3, 1, 30];

export class Token extends Item {

    big: boolean = false;
    speed: number;

    init(active: boolean) {
        this.active = active;
        this.transform.translate.set(0, 1, 0);
        this.big = !Rand.get(50, 0, true);
        this.speed = .01;
    }

    score() {
        return this.big ? 5 : 1;
    }

    update() {
        let rotate = this.transform.rotate,
            scale = this.transform.scale;
        rotate.y = (rotate.y + 1.5) % 360;
        if (this.big) {
            scale.set(.7, .15, .7);
            this.color = purple;
        } else {
            scale.set(.5, .1, .5);
            this.color = yellow;
        }
    }

    intersect(hero: Hero) {
        let collider = this.big ? hero.collider : hero.tokenCollider;
        if (this.active && this.collider.intersect(collider)) {
            let pos = this.collider.getTranslate();
            if (pos.distance(hero.transform.translate) < .5) {
                this.active = false;
                if (this.big) {
                    hero.magnetize();
                } else {
                    hero.coin();
                }
                return;
            }
            this.speed += this.speed;
            this.transform.translate.add(hero.transform.translate.clone().sub(pos).scale(this.speed));
        }
    }
}
