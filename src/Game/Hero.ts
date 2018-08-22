/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        x: number = 0;
        rad: number = .4;
        acc: number = -.02;
        fall: boolean = false;
        speed: T3D.Vec3 = new T3D.Vec3(0, 0, .05);
        timer: number = 0;
        tokens: number = 0;
        distance: number = 0;

        jump() {
            if (!this.transform.translate.y) {
                this.acc = .07;
            }
        }

        boost() {
            this.timer = 60;
        }

        speedZ() {
            return this.speed.z + (this.timer ? .05 : 0);
        }

        render(ctx: CanvasRenderingContext2D) {
            if (!this.active) {
                return;
            }
            let pos = this.transform.translate,
                rad = pos.y / 10 + this.rad;
            if (rad > 0) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.z, rad, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = "red";
                ctx.fill();
            }
        }

        update() {
            if (!this.active) {
                return;
            }
            this.acc -= this.acc > -.02 ? .01 : 0;
            let pos = this.transform.translate;
            pos.x += (this.x - pos.x) / 5;
            if (this.timer) {
                this.timer -= this.timer > 0 ? 1 : 0;
            } else {
                this.speed.y += this.acc;
                pos.y += this.speed.y;
                if (pos.y < 0 && !this.fall) {
                    this.speed.y = 0;
                    pos.y = 0;
                }
                this.active =  pos.y > -10;
            }
        }

    }
    
}