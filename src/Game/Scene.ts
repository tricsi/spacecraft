namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        hero: Hero;
        map: number; // platform bit map
        row: number; // active row
        token: number; 
        speed: number; // move speed
        tokens: number; 
        distance: number;
        platforms: Platform[];
        hud: HTMLElement;

        constructor() {
            this.hud = document.getElementById('hud');
            this.init();
        }

        init() {
            this.hero = new Hero();
            this.map = 2;
            this.row = 9;
            this.speed = .05;
            this.tokens = 0;
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
            this.hud.textContent = `Distance: ${hero.distance.toFixed(2)}\nTokens: ${this.tokens}`;
        }

        updateMap(): void {
            switch (Math.round(this.distance) % 5) {
                case 0:
                    this.map = Rand.get(7, 1);
                    this.token = Rand.get(7, 0) & this.map;
                    break;
                case 3:
                    this.map = 7;
                    this.token = Rand.get(7, 0);
                    break;
            }
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
                    platform.active = (this.map >> (i % 3) & 1) > 0;
                    platform.token.active = (this.token >> (i % 3) & 1) > 0;
                    rotate = true;
                }
            });
            if (rotate) {
                this.updateMap();
            }
            this.distance += this.speed;
            if (hero.fall) {
                return;
            }
            let index = this.updateIndex(),
                platform = this.platforms[index];
            if (platform.token.active) {
                platform.token.active = false;
                this.tokens++;
            }
            hero.fall = !platform.active;
            hero.distance = this.distance;
        }

    }

}