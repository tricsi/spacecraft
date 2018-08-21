namespace Game {

    export class Token extends T3D.Item {

        rad: number = .2;

        render(ctx: CanvasRenderingContext2D) {
            if (!this.active) {
                return;
            }
            let pos = this.transform.translate;
            ctx.beginPath();
            ctx.arc(pos.x, pos.z, this.rad * this.transform.scale.x, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "yellow";
            ctx.fill();
        }

    }

}