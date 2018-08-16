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
    }

}