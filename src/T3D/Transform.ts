import { Vec3, RAD_SCALE } from "./Vec3";
import { Mat4 } from "./Mat4";

export class Transform {

    scale: Vec3;
    rotate: Vec3;
    translate: Vec3;
    parent: Transform;

    constructor(data: Array<number> = []) {
        this.translate = new Vec3(data[0] || 0, data[1] || 0, data[2] || 0);
        this.rotate = new Vec3(data[3] || 0, data[4] || 0, data[5] || 0);
        this.scale = new Vec3(data[6] || 1, data[7] || 1, data[8] || 1);
    }

    matrix(matrix?: Mat4) : Mat4 {
        matrix = matrix || new Mat4();
        matrix.scale(this.scale)
            .rotate(this.rotate.clone().scale(RAD_SCALE))
            .translate(this.translate);
        return this.parent
            ? this.parent.matrix(matrix)
            : matrix;
    }

}
