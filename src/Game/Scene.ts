namespace Game {

    export class Scene extends T3D.Item {

        hero: Hero;
        map: Map; // platform bit map
        row: number; // active row
        distance: number;
        platforms: Platform[];

        constructor(gl: WebGLRenderingContext) {
            super();
            this.map = new Map();
            this.hero = new Hero(new T3D.Mesh(gl, 10), [.1, 1, .1, 10]);
            this.add(this.hero);
            this.platforms = [];
            const platfomMesh = new T3D.Mesh(gl, 4, [.65, .5, .2, -.5]);
            const tokenMesh =  new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30);
            const blue = [.3, .3, 1, 30];
            const yellow = [1, 1, .3, 30];
            for (let i = 0; i < 33; i++) {
                let platform = new Platform(platfomMesh, blue);
                platform.token = new T3D.Item(tokenMesh, yellow, [,1,,90,,,.5,.1,.5]);
                platform.add(platform.token);
                this.platforms.push(platform);
                this.add(platform);
            }
            this.init();
        }

        init() {
            this.row = 9;
            this.distance = 0;
            this.hero.init();
            let i = 0;
            for (let z = -9; z < 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = this.platforms[i++];
                    platform.transform.rotate.y = 45;
                    platform.transform.translate.set(x, -1, z);
                    platform.token.active = false;
                    platform.active = true;
                }
            }
        }

        input(keys: any, down: boolean): void {
            if (this.hero.fall) {
                if (keys.Space) {
                    this.init();
                }
                return;
            }
            const hero = this.hero;
            if ((keys.ArrowLeft || keys.KeyA) && down && hero.x >= 0) {
                hero.x--;
            }
            if ((keys.ArrowRight || keys.KeyD) && down && hero.x <= 0) {
                hero.x++;
            }
            if ((keys.ArrowUp || keys.KeyW) && down) {
                hero.jump();
            }
            if (keys.Space) {
                hero.boost();
            }
        }

        updateIndex(speed:number): number {
            this.row -= speed;
            if (this.row <= -.5) {
                this.row += 11;
            }
            return Math.round(this.row) * 3 + Math.round(this.hero.transform.translate.x) + 1;
        }

        update(): void {
            let rotate = false,
                hero = this.hero,
                speed = hero.speedZ();
            hero.update();
            this.platforms.forEach((platform, i) => {
                if (platform.update(speed)) {
                    platform.active = (this.map.platform >> (i % 3) & 1) > 0;
                    platform.token.active = (this.map.token >> (i % 3) & 1) > 0;
                    rotate = true;
                }
            });
            if (rotate) {
                this.map.update();
            }
            this.distance += speed;
            if (hero.fall) {
                return;
            }
            let pos = hero.transform.translate,
                index = this.updateIndex(speed),
                platform = this.platforms[index],
                token = platform.token;
            if (token.active) {
                token.active = false;
                hero.tokens++;
            }
            hero.fall = !pos.y && !platform.active;
            hero.distance = this.distance;
        }

    }

}