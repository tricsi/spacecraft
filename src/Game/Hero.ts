/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        pos: T3D.Vec3 = new T3D.Vec3();

        render(ctx: CanvasRenderingContext2D) {
            const pos = this.transform.translate;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, pos.z / 10 + .4, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
        }

        update() {
            this.transform.translate.easeOut(this.pos, 5);
        }

    }
    
}