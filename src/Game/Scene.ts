namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        map: number = 2; // platform bit map
        row: number = 9; // active row
        speed: number = .05; // move speed
        hero: Hero = new Hero();
        distance: number = 0;
        platforms: Platform[] = [];

        constructor() {
            Rand.seed = 42;
            for (let z = -9; z < 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = new Platform();
                    platform.transform.translate.set(x, -1, z);
                    this.platforms.push(platform);
                }
            }
        }

        input(keys: any, down: boolean): void {
            if (this.hero.fall) {
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
        }

        updateMap(): void {
            switch (++this.distance % 8) {
                case 0:
                    this.map = Rand.get(7, 1);
                    break;
                case 5:
                    this.map = 7;
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
                    rotate = true;
                }
            });
            if (rotate) {
                this.updateMap();
            }
            let index = this.updateIndex();
            if (!hero.fall) {
                hero.fall = !this.platforms[index].active;
            }
        }

    }

}