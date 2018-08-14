/**
 * Tiny 3D library
 */
var T3D;
(function (T3D) {
    /**
     * Radiant scale
     */
    T3D.RAD_SCALE = Math.PI / 180;
    /**
     * Vector 3 math
     */
    class Vec3 {
        constructor(x, y, z) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.set(x, y, z);
        }
        set(x, y, z) {
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
        add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            this.z += vec.z;
            return this;
        }
        sub(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            this.z -= vec.z;
            return this;
        }
        dot(vec) {
            return this.x * vec.x + this.y * vec.y + this.z * vec.z;
        }
        cross(vec) {
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
        }
        ;
        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        scale(scale) {
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
        clone() {
            return new Vec3(this.x, this.y, this.z);
        }
        invert() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        }
        toArray() {
            return [this.x, this.y, this.z];
        }
    }
    T3D.Vec3 = Vec3;
    /**
     * 3x3 matrix math
     */
    class Mat3 {
        constructor(data) {
            this.data = data || [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ];
        }
        transpose() {
            const a = this.data, a01 = a[1], a02 = a[2], a12 = a[5];
            a[1] = a[3];
            a[2] = a[6];
            a[3] = a01;
            a[5] = a[7];
            a[6] = a02;
            a[7] = a12;
            return this;
        }
    }
    T3D.Mat3 = Mat3;
    /**
     * 4x4 matrix math
     */
    class Mat4 {
        constructor(data) {
            this.data = data || [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
        }
        clone() {
            return new Mat4(this.data);
        }
        multiply(b) {
            const a = this.data, a00 = a[0 * 4 + 0], a01 = a[0 * 4 + 1], a02 = a[0 * 4 + 2], a03 = a[0 * 4 + 3], a10 = a[1 * 4 + 0], a11 = a[1 * 4 + 1], a12 = a[1 * 4 + 2], a13 = a[1 * 4 + 3], a20 = a[2 * 4 + 0], a21 = a[2 * 4 + 1], a22 = a[2 * 4 + 2], a23 = a[2 * 4 + 3], a30 = a[3 * 4 + 0], a31 = a[3 * 4 + 1], a32 = a[3 * 4 + 2], a33 = a[3 * 4 + 3], b00 = b[0 * 4 + 0], b01 = b[0 * 4 + 1], b02 = b[0 * 4 + 2], b03 = b[0 * 4 + 3], b10 = b[1 * 4 + 0], b11 = b[1 * 4 + 1], b12 = b[1 * 4 + 2], b13 = b[1 * 4 + 3], b20 = b[2 * 4 + 0], b21 = b[2 * 4 + 1], b22 = b[2 * 4 + 2], b23 = b[2 * 4 + 3], b30 = b[3 * 4 + 0], b31 = b[3 * 4 + 1], b32 = b[3 * 4 + 2], b33 = b[3 * 4 + 3];
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
        scale(vec) {
            return this.multiply([
                vec.x, 0, 0, 0,
                0, vec.y, 0, 0,
                0, 0, vec.z, 0,
                0, 0, 0, 1,
            ]);
        }
        translate(vec) {
            return this.multiply([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                vec.x, vec.y, vec.z, 1
            ]);
        }
        rotateX(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1
            ]);
        }
        rotateY(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1
            ]);
        }
        rotateZ(angle) {
            const c = Math.cos(angle);
            const s = Math.sin(angle);
            return this.multiply([
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]);
        }
        rotate(vec) {
            return this
                .rotateX(vec.x)
                .rotateY(vec.y)
                .rotateZ(vec.z);
        }
        perspective(fov, aspect, near, far) {
            const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
            const rangeInv = 1.0 / (near - far);
            return this.multiply([
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ]);
        }
        invert() {
            const mat = this.data, a00 = mat[0], a01 = mat[1], a02 = mat[2], a10 = mat[4], a11 = mat[5], a12 = mat[6], a20 = mat[8], a21 = mat[9], a22 = mat[10], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, d = a00 * b01 + a01 * b11 + a02 * b21;
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
    T3D.Mat4 = Mat4;
    /**
     * Transform class
     */
    class Transform {
        constructor(data = []) {
            this.translate = new Vec3(data[0] || 0, data[1] || 0, data[2] || 0);
            this.rotate = new Vec3(data[3] || 0, data[4] || 0, data[5] || 0);
            this.scale = new Vec3(data[6] || 1, data[7] || 1, data[8] || 1);
        }
        matrix(matrix) {
            matrix = matrix || new Mat4();
            matrix.scale(this.scale)
                .rotate(this.rotate.clone().scale(T3D.RAD_SCALE))
                .translate(this.translate);
            return this.parent
                ? this.parent.matrix(matrix)
                : matrix;
        }
    }
    T3D.Transform = Transform;
    /**
     * 3D Camera settings
     */
    class Camera {
        constructor(aspect = 1, fov = 45, near = .1, far = 100) {
            this.rotate = new Vec3();
            this.position = new Vec3();
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;
        }
        transform(transform) {
            return transform.matrix()
                .rotate(this.rotate.clone().invert())
                .translate(this.position.clone().invert());
        }
        perspective() {
            return new Mat4().perspective(this.fov, this.aspect, this.near, this.far);
        }
    }
    T3D.Camera = Camera;
    /**
     * Vertice class
     */
    class Vert extends Vec3 {
        constructor() {
            super(...arguments);
            this.faces = [];
        }
        addFace(face) {
            this.faces.push(face);
            return this;
        }
    }
    /**
     * Triangle face
     */
    class Face {
        constructor(v1, v2, v3) {
            this.verts = [];
            this.normals = [];
            v1.addFace(this);
            v2.addFace(this);
            v3.addFace(this);
            this.verts.push(v1, v2, v3);
            this.normal = v2.clone().sub(v1).cross(v3.clone().sub(v1)).normalize();
        }
        calcNormals(angleCos) {
            this.verts.forEach((vert, i) => {
                let normal;
                vert.faces.forEach(face => {
                    if (this.normal.dot(face.normal) > angleCos) {
                        normal = normal ? normal.add(face.normal) : face.normal.clone();
                    }
                });
                this.normals.push(normal ? normal.normalize() : this.normal);
            });
            return this;
        }
        pushVerts(data) {
            this.verts.forEach((vec) => {
                data.push(...vec.toArray());
            });
            return this;
        }
        pushNormals(data) {
            this.normals.forEach((vec) => {
                data.push(...vec.toArray());
            });
            return this;
        }
    }
    /**
     * Generated mesh
     */
    class Mesh {
        constructor(divide, path = [], smooth = 0, angle = 360) {
            this.verts = [];
            this.normals = [];
            if (divide < 2) {
                return;
            }
            if (path.length < 2) {
                path = this.sphere(path.length > 0 ? path[0] + 2 : Math.ceil(divide / 2) + 1);
            }
            const verts = this.createVerts(divide, path, 0, angle);
            const faces = this.createFaces(verts, divide, path.length / 2);
            const cos = Math.cos(smooth * T3D.RAD_SCALE);
            faces.forEach((face) => {
                face.calcNormals(cos)
                    .pushVerts(this.verts)
                    .pushNormals(this.normals);
            });
        }
        sphere(divide) {
            const path = [];
            if (divide < 3) {
                return;
            }
            let angle = Math.PI / (divide - 1);
            for (let i = 1; i < divide - 1; i++) {
                let a = angle * i;
                path.push(Math.sin(a) / 2);
                path.push(Math.cos(a) / 2);
            }
            return path;
        }
        createVerts(divide, path, start, end) {
            start *= T3D.RAD_SCALE;
            end *= T3D.RAD_SCALE;
            let verts = [];
            let angle = (end - start) / divide;
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
        createFaces(verts, divide, length) {
            const faces = [];
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
    T3D.Mesh = Mesh;
    /**
     * Simple game item
     */
    class Item {
        constructor(mesh, color, transform) {
            this.childs = [];
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
    T3D.Item = Item;
    /**
     * Shader utility
     */
    class Shader {
        constructor(gl, vertexShader, fragmentShader) {
            this.attribs = {};
            this.location = {};
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
        create(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        attrib(name, values, size) {
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
        uniform(name, value) {
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
                case 2:
                    gl.uniform2fv(location, value);
                    break;
                case 3:
                    gl.uniform3fv(location, value);
                    break;
                case 4:
                    gl.uniform4fv(location, value);
                    break;
                case 9:
                    gl.uniformMatrix3fv(location, false, value);
                    break;
                case 16:
                    gl.uniformMatrix4fv(location, false, value);
                    break;
            }
            return this;
        }
    }
    T3D.Shader = Shader;
})(T3D || (T3D = {}));
var Game;
(function (Game) {
    class Hero {
        constructor() {
            this.lane = 0;
        }
        render(ctx) {
            ctx.beginPath();
            ctx.arc(this.lane * 64, 0, 24, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Scene {
        constructor() {
            this.hero = new Game.Hero();
        }
        input(keys, down) {
            const hero = this.hero;
            if (keys.ArrowLeft && down && hero.lane >= 0) {
                hero.lane--;
            }
            if (keys.ArrowRight && down && hero.lane <= 0) {
                hero.lane++;
            }
        }
        render(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.save();
            ctx.translate(Math.round(ctx.canvas.width / 2), Math.round(ctx.canvas.height / 2));
            this.hero.render(ctx);
            ctx.restore();
        }
        update() {
        }
    }
    Game.Scene = Scene;
})(Game || (Game = {}));
var Game;
(function (Game) {
    function $(query, element) {
        return (element || document).querySelector(query);
    }
    function on(element, event, callback) {
        element.addEventListener(event, callback, false);
    }
    function fullscreen() {
        if (!document.webkitFullscreenElement) {
            document.documentElement.webkitRequestFullscreen();
            canvas.requestPointerLock();
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            document.exitPointerLock();
        }
    }
    Game.fullscreen = fullscreen;
    class Rand {
        static get(max = 1, min = 0) {
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            return min + (Rand.seed / 233280) * (max - min);
        }
    }
    Rand.seed = Math.random();
    Game.Rand = Rand;
    let canvas, ctx, keys = {}, scene;
    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    function bind() {
        on(document, 'keydown', (e) => {
            keys[e.code] = true;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, true);
        });
        on(document, 'keyup', (e) => {
            keys[e.code] = false;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, false);
        });
        on(window, 'resize', resize);
    }
    function render() {
        requestAnimationFrame(() => {
            render();
        });
        scene.update();
        scene.render(ctx);
    }
    on(window, 'load', () => {
        canvas = $('#game');
        ctx = canvas.getContext('2d');
        scene = new Game.Scene();
        resize();
        bind();
        render();
    });
})(Game || (Game = {}));
//# sourceMappingURL=script.js.map