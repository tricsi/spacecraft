namespace Game {

    export class Hero {

        pos: T3D.Vec3 = new T3D.Vec3();

        render(ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, .4, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
        }

    }
    
}