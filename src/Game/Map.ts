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
        flop: number;
        seed: number;
        length: number;

        constructor(config: string, seed: number) {
            this.config = config.match(/.{1,4}/g);
            this.length = Math.floor(this.config.length / 2) - 1;
            this.seed = seed;
        }

        init() {
            Rand.seed = this.seed;
            this.count = 0;
            this.flop = 0;
            this.update();
        }

        update() {
            if (--this.count > 0) {
                return;
            }
            let index  = Rand.get(this.length, 0, true) * 2 + this.flop;
            this.row = this.config[index].split('').map(c => parseInt(c, 16));
            this.count = this.row.shift();
            this.flop = ++this.flop % 2;
        }

    }

}