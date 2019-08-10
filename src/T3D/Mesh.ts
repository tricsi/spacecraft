import { RAD_SCALE, Vec3 } from "./Vec3";

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

class Vert extends Vec3 {

    faces: Array<Face> = [];

    addFace(face: Face) {
        this.faces.push(face);
        return this;
    }

}

export class Mesh {

    verts: WebGLBuffer;
    normals: WebGLBuffer;
    length: number;

    constructor(gl: WebGLRenderingContext, divide: number, path: Array<number> = [], smooth: number = 0, angle: number=360) {
        if (divide < 2) {
            return;
        }
        if (path.length < 2) {
            path = this.sphere(path.length > 0 ? path[0] + 2 : Math.ceil(divide / 2) + 1);
        }
        const verts: Array<Vert> = this.createVerts(divide, path, 0, angle);
        const faces: Array<Face> = this.createFaces(verts, divide, path.length / 2);
        const cos = Math.cos(smooth * RAD_SCALE);
        const vertData: number[] = [];
        const normalData: number[] = [];
        faces.forEach((face: Face) => {
            face.calcNormals(cos)
                .pushVerts(vertData)
                .pushNormals(normalData);
        });
        this.verts = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verts);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
        this.normals = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        this.length = vertData.length / 3;
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
