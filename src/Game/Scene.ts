namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        hero: Hero = new Hero();

        input(keys: any, down: boolean): void {
            const hero = this.hero;
            if (keys.ArrowLeft && down && hero.pos.x >= 0) {
                hero.pos.x--;
            }
            if (keys.ArrowRight && down && hero.pos.x <= 0) {
                hero.pos.x++;
            }
        }
        
        render(ctx: CanvasRenderingContext2D): void {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.translate(Math.round(ctx.canvas.width / 2), Math.round(ctx.canvas.height / 2));
            ctx.scale(64, 64);
            this.hero.render(ctx);
            ctx.restore();
        }
        
        update(): void {
        }

    }

}