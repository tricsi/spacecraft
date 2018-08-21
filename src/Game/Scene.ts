namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        hero: Hero;
        map: Map; // platform bit map
        row: number; // active row
        speed: number; // move speed
        distance: number;
        platforms: Platform[];
        hud: HTMLElement;

        constructor() {
            this.hud = document.getElementById('hud');
            this.init();
        }

        init() {
            this.hero = new Hero();
            this.map = new Map();
            this.row = 9;
            this.speed = .05;
            this.distance = 0;
            this.platforms = [];
            for (let z = -9; z < 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = new Platform();
                    platform.token.active = false;
                    platform.transform.translate.set(x, -1, z);
                    this.platforms.push(platform);
                }
            }
            Rand.seed = 42;
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
        }
        
        render(ctx: CanvasRenderingContext2D): void {
            let hero = this.hero,
                under = hero.transform.translate.y < -.5,
                scale = Math.round(ctx.canvas.height / 11);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.translate(Math.round(ctx.canvas.width / 2), Math.round(ctx.canvas.height / 1.2));
            ctx.scale(scale, scale);
            if (under) {
                hero.render(ctx);
            }
            this.platforms.forEach((platform, i) => {
                platform.render(ctx);
            });
            if (!under) {
                hero.render(ctx);
            }
            ctx.restore();
            this.hud.textContent = `Distance: ${hero.distance.toFixed(2)}\nTokens: ${hero.tokens}`;
        }

        updateIndex(): number {
            this.row -= this.speed;
            if (this.row <= -.5) {
                this.row += 11;
            }
            return Math.round(this.row) * 3 + Math.round(this.hero.transform.translate.x) + 1;
        }

        update(): void {
            let rotate = false,
                hero = this.hero;
            hero.update();
            this.platforms.forEach((platform, i) => {
                if (platform.update(this.speed)) {
                    platform.active = (this.map.platform >> (i % 3) & 1) > 0;
                    platform.token.active = (this.map.token >> (i % 3) & 1) > 0;
                    rotate = true;
                }
            });
            if (rotate) {
                this.map.update();
            }
            this.distance += this.speed;
            if (hero.fall) {
                return;
            }
            let pos = hero.transform.translate,
                index = this.updateIndex(),
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