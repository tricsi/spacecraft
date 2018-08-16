namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        hero: Hero = new Hero();
        platforms: Platform[] = [];

        constructor() {
            for (let z = -9; z <= 2; z++) {
                for (let x = -1; x <= 1; x++) {
                    let platform = new Platform();
                    platform.transform.translate.set(x, 0, z);
                    this.platforms.push(platform);
                }
            }
            return this;
        }

        input(keys: any, down: boolean): void {
            const pos = this.hero.pos;
            if ((keys.ArrowLeft || keys.KeyA) && down && pos.x >= 0) {
                pos.x--;
            }
            if ((keys.ArrowRight || keys.KeyD) && down && pos.x <= 0) {
                pos.x++;
            }
        }
        
        render(ctx: CanvasRenderingContext2D): void {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.translate(Math.round(ctx.canvas.width / 2), Math.round(ctx.canvas.height / 1.2));
            ctx.scale(64, 64);
            this.platforms.forEach(platform => {
                platform.render(ctx);
            });
            this.hero.render(ctx);
            ctx.restore();
        }
        
        update(): void {
            this.platforms.forEach(platform => {
                platform.update(.05, -9, 2);
            });
            this.hero.update();
        }

    }

}