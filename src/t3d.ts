/**
 * Tiny 3D library
 */
namespace T3D {

    /**
     * Radiant scale
     */
    export const RAD_SCALE = Math.PI / 180;
    
    /**
     * Vector 3 math
     */
    export class Vec3 {

        x: number = 0;
        y: number = 0;
        z: number = 0;

        constructor(x?: number, y?: number, z?:number) {
            this.set(x, y, z);
        }

        set(x?: number, y?: number, z?: number): Vec3 {
            if (typeof x == 'number') {
                this.x = x;
            }
            if (typeof y == 'number') {
                this.y = y;
            }
            if (typeof z == 'number') {
                this.z = z;
            }
            return this;
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

        scale(scale: any): Vec3 {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
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

        easeOut(vec: Vec3, intense: number = 2): Vec3 {
            this.x += (vec.x - this.x) / intense;
            this.y += (vec.y - this.y) / intense;
            this.z += (vec.z - this.z) / intense;
            return this;
        }

        toArray(): Array<number> {
            return [this.x, this.y, this.z];
        }

    }

    /**
     * 3x3 matrix math
     */
    export class Mat3 {

        data: Array<number>;

        constructor(data?: Array<number>) {
            this.data = data || [
                0, 0, 0,
			    0, 0, 0,
			    0, 0, 0
            ];
        }

        transpose() : Mat3 {
            const a = this.data, 
                a01 = a[1],
                a02 = a[2],
                a12 = a[5];
            a[1] = a[3];
            a[2] = a[6];
            a[3] = a01;
            a[5] = a[7];
            a[6] = a02;
            a[7] = a12;
            return this;
        }
    }

    /**
     * 4x4 matrix math
     */
    export class Mat4 {

        public data: Array<number>;

        constructor(data?: Array<number>) {
            this.data = data || [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
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

        perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
            const f: number = Math.tan(Math.PI * 0.5 - 0.5 * fov);
            const rangeInv: number = 1.0 / (near - far);
            return this.multiply([
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ]);
        }

        invert(): Mat3 {
            const mat = this.data,
                a00 = mat[0], a01 = mat[1], a02 = mat[2],
                a10 = mat[4], a11 = mat[5], a12 = mat[6],
                a20 = mat[8], a21 = mat[9], a22 = mat[10],
                b01 = a22 * a11 - a12 * a21,
                b11 = -a22 * a10 + a12 * a20,
                b21 = a21 * a10 - a11 * a20,
                d = a00 * b01 + a01 * b11 + a02 * b21;
            if (!d) {
                return null;
            }
            const id = 1 / d;
            return new Mat3([
                b01 * id,
                (-a22 * a01 + a02 * a21) * id,
                (a12 * a01 - a02 * a11) * id,
                b11 * id,
                (a22 * a00 - a02 * a20) * id,
                (-a12 * a00 + a02 * a10) * id,
                b21 * id,
                (-a21 * a00 + a01 * a20) * id,
                (a11 * a00 - a01 * a10) * id
            ]);
        }

    }

    /**
     * Transform class
     */
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

    /**
     * 3D Camera settings
     */
    export class Camera {

        fov: number;
        aspect: number;
        near: number;
        far: number;
        rotate: Vec3 = new Vec3();
        position: Vec3 = new Vec3();

        constructor(aspect: number = 1, fov: number = 45, near: number = .1, far: number = 100) {
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
            return new Mat4().perspective(this.fov, this.aspect, this.near, this.far);
        }

    }

    /**
     * Vertice class
     */
    class Vert extends Vec3 {

        faces: Array<Face> = [];

        addFace(face: Face) {
            this.faces.push(face);
            return this;
        }

    }

    /**
     * Triangle face
     */
    class Face {

        verts: Array<Vert> = [];
        normal: Vec3;
        normals: Array<Vec3> = [];

        constructor(v1: Vert, v2: Vert, v3: Vert) {
            v1.addFace(this);
            v2.addFace(this);
            v3.addFace(this);
            this.verts.push(v1, v2, v3);
            this.normal = v2.clone().sub(v1).cross(v3.clone().sub(v1)).normalize();
        }

        calcNormals(angleCos: number): Face {
            this.verts.forEach((vert: Vert, i: number) => {
                let normal: Vec3;
                vert.faces.forEach(face => {
                    if (this.normal.dot(face.normal) > angleCos) {
                        normal = normal ? normal.add(face.normal) : face.normal.clone();
                    }
                });
                this.normals.push(normal ? normal.normalize() : this.normal);
            });
            return this;
        }

        pushVerts(data: Array<number>): Face {
            this.verts.forEach((vec: Vert) => {
                data.push(...vec.toArray());
            });
            return this;
        }

        pushNormals(data: Array<number>): Face {
            this.normals.forEach((vec: Vert) => {
                data.push(...vec.toArray());
            });
            return this;
        }

    }

    /**
     * Generated mesh
     */
    export class Mesh {

        verts: Array<number> = [];
        normals: Array<number> = [];

        constructor(divide: number, path: Array<number> = [], smooth: number = 0, angle: number=360) {
            if (divide < 2) {
                return;
            }
            if (path.length < 2) {
                path = this.sphere(path.length > 0 ? path[0] + 2 : Math.ceil(divide / 2) + 1);
            }
            const verts: Array<Vert> = this.createVerts(divide, path, 0, angle);
            const faces: Array<Face> = this.createFaces(verts, divide, path.length / 2);
            const cos = Math.cos(smooth * RAD_SCALE);
            faces.forEach((face: Face) => {
                face.calcNormals(cos)
                    .pushVerts(this.verts)
                    .pushNormals(this.normals);
            });
        }

        private sphere(divide: number) {
            const path = [];
            if (divide < 3) {
                return;
            }
            let angle: number = Math.PI / (divide - 1);
            for (let i = 1; i < divide - 1; i++) {
                let a = angle * i;
                path.push(Math.sin(a) / 2);
                path.push(Math.cos(a) / 2);
            }
            return path;
        }

        private createVerts(divide: number, path: Array<number>, start: number, end: number): Array<Vert> {
            start *= RAD_SCALE;
            end *= RAD_SCALE;
            let verts: Array<Vert> = [];
            let angle: number = (end - start) / divide;
            verts.push(new Vert(0, .5, 0));
            verts.push(new Vert(0, -.5, 0));
            for (let i = 0; i < divide; i++) {
                let a = angle * i + start;
                let x = Math.cos(a);
                let z = Math.sin(a);
                for (let j = 0; j < path.length; j += 2) {
                    let vert = new Vert(x, 0, z);
                    vert.scale(path[j]).y = path[j + 1];
                    verts.push(vert);
                }
            }
            return verts;
        }

        private createFaces(verts: Array<Vert>, divide: number, length: number): Array<Face> {
            const faces: Array<Face> = [];
            let index;
            for (let i = 1; i < divide; ++i) {
                index = i * length + 2;
                faces.push(new Face(verts[0], verts[index], verts[index - length]));
                faces.push(new Face(verts[1], verts[index - 1], verts[index + length - 1]));
                for (let j = 0; j < length - 1; j++) {
                    let add = index + j;
                    faces.push(new Face(verts[add + 1], verts[add - length], verts[add]));
                    faces.push(new Face(verts[add - length + 1], verts[add - length], verts[add + 1]));
                }
            }
            faces.push(new Face(verts[0], verts[2], verts[index]));
            faces.push(new Face(verts[1], verts[index + length - 1], verts[length + 1]));
            for (let j = 0; j < length - 1; j++) {
                let add = index + j;
                faces.push(new Face(verts[j + 3], verts[add], verts[j + 2]));
                faces.push(new Face(verts[add + 1], verts[add], verts[j + 3]));
            }
            return faces;
        }

    }

    /**
     * Simple game item
     */
    export class Item {

        mesh: Mesh;
        color: Array<number>;
        transform: Transform;
        childs: Array<Item> = [];

        constructor(mesh?: Mesh, color?: Array<number>, transform?: Array<number>) {
            this.mesh = mesh;
            this.color = color;
            this.transform = new Transform(transform);
        }

        add(child) {
            this.childs.push(child);
            child.transform.parent = this.transform;
            return this;
        }

    }

    /**
     * Shader utility
     */
    export class Shader {

        gl: WebGLRenderingContext;
        program: WebGLProgram;
        indices: WebGLBuffer;
        attribs: object = {};
        location: object = {};

        constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
            this.gl = gl;
            this.program = gl.createProgram();
            this.indices = gl.createBuffer();
            const program = this.program;
            gl.attachShader(program, this.create(gl.VERTEX_SHADER, vertexShader));
            gl.attachShader(program, this.create(gl.FRAGMENT_SHADER, fragmentShader));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
            }
        }

        private create(type: number, source: string): WebGLShader {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }

        attrib(name: string, values: Array<number>, size: number): Shader {
            const gl = this.gl;
            if (!this.location[name]) {
                this.location[name] = gl.getAttribLocation(this.program, name);
                this.attribs[name] = gl.createBuffer();
            }
            const location = this.location[name];
            gl.bindBuffer(gl.ARRAY_BUFFER, this.attribs[name]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
            return this;
        }

        uniform(name: string, value: number): Shader;
        uniform(name: string, value: Array<number>): Shader;
        uniform(name: string, value: any): Shader {
            const gl = this.gl;
            if (!this.location[name]) {
                this.location[name] = gl.getUniformLocation(this.program, name);
            }
            const location = this.location[name];
            if (typeof value == 'number') {
                gl.uniform1f(location, value);
                return this;
            }
            switch (value.length) {
                case 2: gl.uniform2fv(location, value); break;
                case 3: gl.uniform3fv(location, value); break;
                case 4: gl.uniform4fv(location, value); break;
                case 9: gl.uniformMatrix3fv(location, false, value); break;
                case 16: gl.uniformMatrix4fv(location, false, value); break;
            }
            return this;
        }

    }

}