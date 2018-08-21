namespace Game {

    export class Token extends T3D.Item {

        render(ctx: CanvasRenderingContext2D) {
            if (!this.active) {
                return;
            }
            let pos = this.transform.translate;
            ctx.beginPath();
            ctx.arc(pos.x, pos.z, .2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "yellow";
            ctx.fill();
        }

    }

}