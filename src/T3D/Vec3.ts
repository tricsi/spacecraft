export const RAD_SCALE = Math.PI / 180;

export class Vec3 {

    constructor(public x: number = 0, public y: number = 0, public z: number = 0) {
    }

    set(vec?: Vec3): Vec3;
    set(x?: number, y?: number, z?: number): Vec3;
    set(xOrVec?: any, y?: number, z?: number): Vec3 {
        if (xOrVec instanceof Vec3) {
            this.x = xOrVec.x;
            this.y = xOrVec.y;
            this.z = xOrVec.z;
            return this;
        }
        if (typeof xOrVec == 'number') {
            this.x = xOrVec;
        }
        if (typeof y == 'number') {
            this.y = y;
        }
        if (typeof z == 'number') {
            this.z = z;
        }
        return this;
    }

    max(): number {
        return Math.max(this.x, this.y, this.z);
    }

    add(vec: Vec3): Vec3 {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    sub(vec: Vec3): Vec3 {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }

    distance(vec: Vec3): number {
        return Math.sqrt(
            (this.x - vec.x) * (this.x - vec.x) +
            (this.y - vec.y) * (this.y - vec.y) +
            (this.z - vec.z) * (this.z - vec.z)
        );
    }

    dot(vec: Vec3): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    cross(vec: Vec3): Vec3 {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let vx = vec.x;
        let vy = vec.y;
        let vz = vec.z;
        this.x = y * vz - z * vy;
        this.y = z * vx - x * vz;
        this.z = x * vy - y * vx;
        return this;
    };

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    scale(value: Vec3): Vec3;
    scale(value: number): Vec3;
    scale(value: any): Vec3 {
        this.x *= value instanceof Vec3 ? value.x : value;
        this.y *= value instanceof Vec3 ? value.y : value;
        this.z *= value instanceof Vec3 ? value.z : value;
        return this;
    }

    normalize() {
        var length = this.length();
        if (length > 0) {
            this.scale(1 / length);
        }
        return this;
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z);
    }

    invert(): Vec3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    toArray(): Array<number> {
        return [this.x, this.y, this.z];
    }

}
