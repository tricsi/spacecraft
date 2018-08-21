namespace Game {

    export class Platform extends T3D.Item {

        token: Token = new Token();

        render(ctx: CanvasRenderingContext2D) {
            if (this.active) {
                let pos = this.transform.translate,
                    scale = this.transform.scale;
                ctx.fillStyle = "blue";
                ctx.fillRect(pos.x - scale.x * .45, pos.z - scale.z * .45, scale.x * .9, scale.z * .9);
            }
            this.token.render(ctx)
        }

        update(speed: number): boolean {
            let pos = this.transform.translate,
                token = this.token.transform;
            pos.z += speed;
            let end = pos.z > 2;
            if (end) {
                pos.z -= 11;
            }
            let scale = 1;
            if (pos.z < -8) {
                scale = pos.z + 9;
            } else if (pos.z > 1) {
                scale = 2 - pos.z; 
            }
            this.transform.scale.set(scale, scale, scale);
            token.translate.set(pos);
            token.scale.set(scale, scale, scale);
            return end;
        }
    }

}