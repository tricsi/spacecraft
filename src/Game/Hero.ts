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
        collider: T3D.Sphere;
        collide: T3D.Vec3;

        init() {
            const transform = this.transform; 
            transform.translate.set(0, 2, 2);
            transform.rotate.set(0, 0, 0);
            this.active = true;
            this.transform = transform;
            this.collider = new T3D.Sphere(transform);
            this.x = 0;
            this.rad = .4;
            this.acc = -.02;
            this.speed = new T3D.Vec3();
            this.speedTime = 0;
            this.scale = .8;
            this.scaleTime = 0;
            this.tokens = 0;
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
            this.speed.z += ((this.active ? (this.speedTime ? .12 : .07) : 0) - this.speed.z) / 20;
            this.speedTime -= this.speedTime > 0 ? 1 : 0;
            this.scale += ((this.scaleTime ? .6 : .8) - this.scale) / 5;
            this.scaleTime -= this.scaleTime > 0 ? 1 : 0;
            if (!this.active) {
                return;
            }
            this.acc -= this.acc > -.02 ? .01 : 0;
            let pos = this.transform.translate,
                scale = this.scale,
                rotate = this.transform.rotate;
            rotate.z = 90 + (pos.x - this.x) * 25;
            rotate.y = (rotate.y + this.speed.z * 100) % 360;
            this.speed.y += this.acc;
            pos.x += (this.x - pos.x) / 7;
            pos.y += this.speed.y;
            pos.z -= pos.z / 30;
            this.active = pos.y > -10;
            this.transform.scale.set(scale, scale, scale);
        }

    }
    
}