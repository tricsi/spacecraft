namespace Game {

    export class Token extends T3D.Item {

        big: boolean = false;

        score() {
            return this.big ? 10 : 1;
        }

        update() {
            let rotate = this.transform.rotate,
                scale = this.transform.scale;
            rotate.y = (rotate.y + 1.5) % 360;
            if (this.big) {
                scale.set(.7, .15, .7);
            } else {
                scale.set(.5, .1, .5);
            }
        }
    }
}