namespace Game {

    export class Map {

        platform: number;
        token: number;
        count: number;
        max: number;
        min: number;

        constructor() {
            this.count = 0;
            this.rand();
        }

        rand(init: boolean = true) {
            if (init) {
                this.platform = Rand.get(6, 1);
                this.max = Rand.get(6, 4);
                this.min = Rand.get(this.max - 1, this.max - 3);
            } else {
                this.platform = 7;
            }
            this.token = Rand.get(7, 0) & this.platform;
        }

        update() {
            if (++this.count >= this.max) {
                this.count = 0;
            }
            switch (this.count) {
                case 0:
                    this.rand();
                    break;
                case this.min:
                    this.rand(false);
                    break;
            }
        }

    }

}