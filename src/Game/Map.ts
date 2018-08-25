namespace Game {

    /**
     * Platform config
     * 1 2 4 8
     * | | | +- Fence
     * | | +--- Token
     * | +----- Scale
     * +------- Active
     */
    export class Map {

        config: string[];
        count: number;
        row: number[];
        last: number;
        seed: number;

        constructor(config: string, seed: number) {
            this.config = config.match(/.{1,4}/g);
            this.seed = seed;
        }

        init() {
            Rand.seed = this.seed;
            this.count = 0;
            this.last = 0;
            this.update();
        }

        update() {
            if (--this.count > 0) {
                return;
            }
            let index;
            do {
                index = Rand.get(this.config.length - 1, 0, true);
            } while (index == this.last);
            this.row = this.config[index].split('').map(c => parseInt(c, 16));
            this.count = this.row.shift();
            this.last = index;
        }

    }

}