namespace Game {

    export class Platform extends T3D.Item {

        visible: boolean = true;

        render(ctx: CanvasRenderingContext2D) {
            if (!this.visible) {
                return;
            }
            let pos = this.transform.translate,
                scale = this.transform.scale;
            ctx.fillStyle = "blue";
            ctx.fillRect(pos.x - scale.x * .45, pos.y - scale.y * .45, scale.x * .9, scale.y * .9);
        }

        update(speed, from, to) {
            let pos = this.transform.translate,
                scale = this.transform.scale;
            pos.y += speed;
            if (pos.y > to) {
                pos.y = from;
            }
            scale.x = 1;
            if (pos.y < from + 1) {
                scale.x = pos.y - from;
            } else if (pos.y > to - 1) {
                scale.x = to - pos.y; 
            }
            scale.y = scale.x;
        }
    }

}