namespace Game {

    export class Enemy extends T3D.Item {

        update(speed: number, end:boolean) {
            let pos = this.transform.translate,
                rotate = this.transform.rotate;
            rotate.z = (rotate.z + 5) % 360;
            pos.z = end ? 0 : pos.z + speed / 2;
        }

        intersect(hero: Hero) {
            if (this.active && this.collider.intersect(hero.collider)) {
                hero.explode = 7;
            }
        }
    }

}