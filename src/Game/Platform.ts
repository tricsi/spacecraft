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
            ctx.fillRect(pos.x - scale.x * .45, pos.z - scale.z * .45, scale.x * .9, scale.z * .9);
        }

        update(speed, from, to) {
            let pos = this.transform.translate,
                scale = this.transform.scale;
            pos.z += speed;
            if (pos.z > to) {
                pos.z = from;
            }
            scale.x = 1;
            if (pos.z < from + 1) {
                scale.x = pos.z - from;
            } else if (pos.z > to - 1) {
                scale.x = to - pos.z; 
            }
            scale.z = scale.x;
        }
    }

}