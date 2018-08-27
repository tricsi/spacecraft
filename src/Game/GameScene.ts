namespace Game {

    export class GameScene extends T3D.Item {

        hero: Hero;
        map: Map; // platform bit map
        row: number; // active row
        index: number; // active platform
        distance: number;
        platforms: Platform[];

        constructor(gl: WebGLRenderingContext, map: Map) {
            super();
            this.map = map;
            this.hero = new Hero(new T3D.Mesh(gl, 10), [.9, .9, .9, 10]);
            this.add(this.hero);
            this.platforms = [];
            let platfomMesh = new T3D.Mesh(gl, 4, [.55, .5, .65, .4, .65, -.4, .55, -.5]),
                fenceMesh =  new T3D.Mesh(gl, 12, [.4, .5, .5, .4, .5, -.4, .4, -.5], 30),
                tokenMesh =  new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
                blue = [.3, .3, 1, 30],
                yellow = [1, 1, .3, 30],
                red = [1, .3, .3, 0];
            for (let i = 0; i < 33; i++) {
                let platform = new Platform(platfomMesh, blue),
                    token = new T3D.Item(tokenMesh, yellow, [,1,,90,,,.5,.1,.5]),
                    fence = new T3D.Item(fenceMesh, red, [,1.8,,,,,,1.5]);
                token.collider = new T3D.Sphere(token.transform);
                fence.collider = new T3D.Box(fence.transform);
                platform.collider = new T3D.Box(platform.transform);
                platform.token = token;
                platform.fence = fence;
                platform.add(token).add(fence);
                this.platforms.push(platform);
                this.add(platform);
            }
            this.init();
        }

        init() {
            this.row = 9;
            this.distance = 0;
            this.hero.init();
            this.map.init();
            let i = 0;
            for (let z = -9; z < 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = this.platforms[i++];
                    platform.transform.rotate.y = 45;
                    platform.transform.translate.set(x, -1, z);
                    platform.fence.active =
                    platform.token.active = false;
                    platform.active = true;
                }
            }
        }

        input(key: number): void {
            const hero = this.hero;
            if (!hero.active) {
                if (key === 32) {
                    this.init();
                }
                return;
            }
            switch (key) {
                case 37:
                    hero.left();
                    break;
                case 39:
                    hero.right();
                    break;
                case 38:
                    hero.jump();
                    break;
                case 40:
                    hero.dash();
                    break;
                case 32:
                    hero.boost();
            }
        }

        updateRow(speed:number) {
            this.row -= speed;
            if (this.row <= -.5) {
                this.row += 11;
            }
            this.index = Math.round(this.row) * 3 + Math.round(this.hero.transform.translate.x) + 1;
        }

        getIndex(add: number = 0): number {
            let length = this.platforms.length,
                index = this.index + add;
            if (index < 0) {
                return index + length;
            }
            if (index >= length) {
                return index - length;
            }
            return index;
        }

        update(): void {
            this.hero.update();
            let rotate = false,
                hero = this.hero,
                speed = hero.speed.z;

            this.platforms.forEach((platform, i) => {
                if (platform.update(speed)) {
                    let cfg = this.map.row[i % 3];
                    platform.active = (cfg & 1) > 0;
                    platform.transform.translate.y = (cfg & 2) > 0 ? 0 : -1;
                    platform.token.active = (cfg & 4) > 0;
                    platform.token.transform.rotate.y = 0;
                    platform.fence.active = (cfg & 8) > 0;
                    rotate = true;
                }
            });
            if (rotate) {
                this.map.update();
            }
            this.distance += speed;
            this.updateRow(speed);
            hero.collide = this.platforms[this.getIndex()].intersect(hero);
            [-3, 3, -1, 1, -2, 2, -4, 4].forEach(add => {
                let index = this.getIndex(add),
                    platform = this.platforms[index];
                platform.intersect(hero, add == 1 || add == -1);
            });
        }

    }

}