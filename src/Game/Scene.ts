namespace Game {

    export class Scene extends T3D.Item {

        hero: Hero;
        map: Map; // platform bit map
        row: number; // active row
        index: number; // active platform
        distance: number;
        platforms: Platform[];

        constructor(gl: WebGLRenderingContext) {
            super();
            this.map = new Map();
            this.hero = new Hero(new T3D.Mesh(gl, 10), [.9, .9, .9, 10]);
            this.add(this.hero);
            this.platforms = [];
            let platfomMesh = new T3D.Mesh(gl, 4, [.65, .5, .65, -.5]),
                tokenMesh =  new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
                fenceMesh = new T3D.Mesh(gl, 6, [.1, .5, .1, -.5]),
                blue = [.3, .3, 1, 30],
                yellow = [1, 1, .3, 30],
                red = [1, .3, .3, 0];
            for (let i = 0; i < 33; i++) {
                let platform = new Platform(platfomMesh, blue),
                    token = new T3D.Item(tokenMesh, yellow, [,1,,90,,,.5,.1,.5]),
                    fence = new T3D.Item(fenceMesh, red, [,1,,-45,,90]);
                token.collider = new T3D.Sphere(token.transform);
                fence.collider = new T3D.Box(fence.transform, new T3D.Vec3(1, .1, .1));
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

        input(keys: any, down: boolean): void {
            const hero = this.hero;
            if (!hero.active) {
                if (keys.Space) {
                    this.init();
                }
                return;
            }
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
            this.updateRow(speed);
            hero.collide = this.platforms[this.getIndex()].intersect(hero);
            [-3, 3, -1, 1, -2, 2, -4, 4].forEach(add => {
                let index = this.getIndex(add),
                    platform = this.platforms[index];
                platform.intersect(hero);
            });
            hero.distance = this.distance;
        }

    }

}