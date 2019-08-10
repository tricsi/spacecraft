import { Vec3 } from "./Vec3";

export class Mat4 {

    constructor(public data: Array<number> = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) {
    }

    clone(): Mat4 {
        return new Mat4(this.data);
    }

    multiply(b: Array<number>): Mat4 {
        const a: Array<number> = this.data,
            a00: number = a[0 * 4 + 0],
            a01: number = a[0 * 4 + 1],
            a02: number = a[0 * 4 + 2],
            a03: number = a[0 * 4 + 3],
            a10: number = a[1 * 4 + 0],
            a11: number = a[1 * 4 + 1],
            a12: number = a[1 * 4 + 2],
            a13: number = a[1 * 4 + 3],
            a20: number = a[2 * 4 + 0],
            a21: number = a[2 * 4 + 1],
            a22: number = a[2 * 4 + 2],
            a23: number = a[2 * 4 + 3],
            a30: number = a[3 * 4 + 0],
            a31: number = a[3 * 4 + 1],
            a32: number = a[3 * 4 + 2],
            a33: number = a[3 * 4 + 3],
            b00: number = b[0 * 4 + 0],
            b01: number = b[0 * 4 + 1],
            b02: number = b[0 * 4 + 2],
            b03: number = b[0 * 4 + 3],
            b10: number = b[1 * 4 + 0],
            b11: number = b[1 * 4 + 1],
            b12: number = b[1 * 4 + 2],
            b13: number = b[1 * 4 + 3],
            b20: number = b[2 * 4 + 0],
            b21: number = b[2 * 4 + 1],
            b22: number = b[2 * 4 + 2],
            b23: number = b[2 * 4 + 3],
            b30: number = b[3 * 4 + 0],
            b31: number = b[3 * 4 + 1],
            b32: number = b[3 * 4 + 2],
            b33: number = b[3 * 4 + 3];
        this.data = [
            a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
        ];
        return this;
    }

    scale(vec: Vec3): Mat4 {
        return this.multiply([
            vec.x, 0, 0, 0,
            0, vec.y, 0, 0,
            0, 0, vec.z, 0,
            0, 0, 0, 1,
        ]);
    }

    translate(vec: Vec3): Mat4 {
        return this.multiply([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            vec.x, vec.y, vec.z, 1
        ]);
    }

    rotateX(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this.multiply([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }

    rotateY(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this.multiply([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    rotateZ(angle: number): Mat4 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this.multiply([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ]);
    }

    rotate(vec: Vec3): Mat4 {
        return this
            .rotateX(vec.x)
            .rotateY(vec.y)
            .rotateZ(vec.z);
    }

    invert(): number[] {
        let m4 = this.data,
            a00 = m4[0], a01 = m4[1], a02 = m4[2],
            a10 = m4[4], a11 = m4[5], a12 = m4[6],
            a20 = m4[8], a21 = m4[9], a22 = m4[10],
            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,
            d = a00 * b01 + a01 * b11 + a02 * b21;
        if (!d) {
            return null;
        }
        const id = 1 / d;
        const m3 = [
            b01 * id,
            (-a22 * a01 + a02 * a21) * id,
            (a12 * a01 - a02 * a11) * id,
            b11 * id,
            (a22 * a00 - a02 * a20) * id,
            (-a12 * a00 + a02 * a10) * id,
            b21 * id,
            (-a21 * a00 + a01 * a20) * id,
            (a11 * a00 - a01 * a10) * id
        ];
        a01 = m3[1],
        a02 = m3[2],
        a12 = m3[5];
        m3[1] = m3[3];
        m3[2] = m3[6];
        m3[3] = a01;
        m3[5] = m3[7];
        m3[6] = a02;
        m3[7] = a12;
        return m3;
    }

}
