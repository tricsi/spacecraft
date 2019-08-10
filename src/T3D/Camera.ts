import { Vec3 } from "./Vec3";
import { Mat4 } from "./Mat4";
import { Transform } from "./Transform";

export class Camera {

    rotate: Vec3 = new Vec3();
    position: Vec3 = new Vec3();

    constructor(
        public aspect: number = 1,
        public fov: number = 45,
        public near: number = .1,
        public far: number = 100
    ) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
    }

    transform(transform: Transform): Mat4 {
        return transform.matrix()
            .rotate(this.rotate.clone().invert())
            .translate(this.position.clone().invert());
    }

    perspective(): Mat4 {
        const near = this.near;
        const far = this.far;
        const f: number = Math.tan(Math.PI * 0.5 - 0.5 * this.fov);
        const rangeInv: number = 1.0 / (near - far);
        return new Mat4().multiply([
            f / this.aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
        ]);
    }

}
