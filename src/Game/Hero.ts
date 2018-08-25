/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        x: number;
        rad: number;
        acc: number;
        speed: T3D.Vec3;
        timer: number;
        tokens: number;
        distance: number;
        collider: T3D.Sphere;
        collide: T3D.Vec3;

        init() {
            const transform = this.transform; 
            transform.translate.set(0, 2, 0);
            transform.scale.set(.8, .8, .8);
            transform.rotate.set(0, 0, 0);
            this.active = true;
            this.transform = transform;
            this.collider = new T3D.Sphere(transform);
            this.x = 0;
            this.rad = .4;
            this.acc = -.02;
            this.speed = new T3D.Vec3(0, -.1, .05);
            this.timer = 0;
            this.tokens = 0;
            this.distance = 0;
        }

        jump() {
            if (this.collide.y) {
                this.acc = .07;
            }
        }

        boost() {
            this.timer = 75;
        }

        speedZ() {
            return this.speed.z + (this.timer ? .05 : 0);
        }

        update() {
            if (this.timer) {
                this.timer -= this.timer > 0 ? 1 : 0;
            }
            if (!this.active) {
                return;
            }
            this.acc -= this.acc > -.02 ? .01 : 0;
            let pos = this.transform.translate,
                rotate = this.transform.rotate;
            rotate.z = 90 + (pos.x - this.x) * 25;
            rotate.y = (rotate.y + this.speedZ()* 100) % 360;
            this.speed.y += this.acc;
            pos.x += (this.x - pos.x) / 7;
            pos.y += this.speed.y;
            this.active = pos.y > -10;
        }

    }
    
}