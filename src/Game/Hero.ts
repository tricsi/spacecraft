/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        x: number;
        rad: number;
        acc: number;
        fall: boolean;
        speed: T3D.Vec3;
        timer: number;
        tokens: number;
        distance: number;

        init() {
            this.active = true;
            this.transform = new T3D.Transform();
            this.transform.rotate.z = 90;
            this.x = 0;
            this.rad = .4;
            this.acc = -.02;
            this.fall = false;
            this.speed = new T3D.Vec3(0, 0, .05);
            this.timer = 0;
            this.tokens = 0;
            this.distance = 0;
        }

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

        update() {
            if (!this.active) {
                return;
            }
            this.acc -= this.acc > -.02 ? .01 : 0;
            let pos = this.transform.translate,
                rotate = this.transform.rotate;
            pos.x += (this.x - pos.x) / 5;
            rotate.y = (rotate.y + this.speedZ()* 100) % 360;
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