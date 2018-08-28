/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        x: number;
        rad: number;
        acc: number;
        speed: T3D.Vec3;
        speedTime: number;
        scale: number;
        scaleTime: number;
        tokens: number;
        distance: number;
        collider: T3D.Sphere;
        collide: T3D.Vec3;
        explode: number;

        init() {
            const transform = this.transform; 
            transform.translate.set(0, 3, 2);
            transform.rotate.set(0, 0, 0);
            this.active = true;
            this.transform = transform;
            this.collider = new T3D.Sphere(transform);
            this.x = 0;
            this.rad = .4;
            this.acc = -.02;
            this.speed = new T3D.Vec3(0, 0, .1);
            this.speedTime = 0;
            this.scale = .8;
            this.scaleTime = 0;
            this.tokens = 0;
            this.distance = 0;
            this.explode = 0;
            this.stroke = 0;
        }

        left() {
            if (this.x >= 0) {
                this.x--;
            }
        }

        right() {
            if (this.x <= 0) {
                this.x++;
            }
        }

        jump() {
            if (this.collide) {
                this.acc = .065;
            }
        }

        boost() {
            this.speedTime = 75;
        }

        dash() {
            this.scaleTime = 40;
        }

        update() {
            let pos = this.transform.translate,
                scale = this.scale,
                rotate = this.transform.rotate,
                speed = (this.speedTime ? .18 : .1) + Math.min(this.distance / 10000, .05);
            this.speed.z += ((this.active ? speed : 0) - this.speed.z) / 20;
            this.speedTime -= this.speedTime > 0 ? 1 : 0;
            this.scale += ((this.scaleTime ? .6 : .8) - this.scale) / 5;
            this.scaleTime -= this.scaleTime > 0 ? 1 : 0;
            this.stroke += (this.explode - this.stroke) / 25;
            this.active = pos.y > -10 && this.stroke < 6;
            if (!this.active || this.stroke) {
                return;
            }
            this.acc -= this.acc > -.02 ? .01 : 0;
            rotate.z = 90 + (pos.x - this.x) * 25;
            rotate.y = (rotate.y + this.speed.z * 100) % 360;
            this.speed.y += this.acc;
            pos.x += (this.x - pos.x) / 7;
            pos.y += this.speed.y;
            pos.z -= pos.z / 30;
            this.transform.scale.set(scale, scale, scale);
        }

    }
    
}