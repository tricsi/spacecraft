namespace Game {

    export interface SceneInterface {

        input(keys: any, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;

    }

    export class Scene implements SceneInterface {

        hero: Hero = new Hero();

        input(keys: any, down: boolean): void {
            const pos = this.hero.pos;
            if (keys.ArrowLeft && down && pos.x >= 0) {
                pos.x--;
            }
            if (keys.ArrowRight && down && pos.x <= 0) {
                pos.x++;
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
            this.hero.update();
        }

    }

}