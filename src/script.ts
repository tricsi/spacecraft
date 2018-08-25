namespace Game {

    function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    export function fullscreen() {
        if (!document.webkitFullscreenElement) {
            document.documentElement.webkitRequestFullscreen();
            canvas.requestPointerLock();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            document.exitPointerLock();
        }
    }

    export class Rand {

        static seed: number = Math.random();

        static get(max: number = 1, min: number = 0, round: boolean = true): number {
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            let value = min + (Rand.seed / 233280) * (max - min);
            return round ? Math.round(value) : value;
        }

    }
    
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>$('#game'),
        hud: Element = $('#hud'),
        gl: WebGLRenderingContext = canvas.getContext('experimental-webgl'),
        scene: Scene = new Scene(gl),
        camera: T3D.Camera = new T3D.Camera(canvas.width / canvas.height),
        light = {
            position: new T3D.Vec3(5, 15, 3),
            ambient: [.2, .2, .2],
            diffuse: [.8, .8, .8],
            specular: [.8, .8, .8]
        },
        shader: T3D.Shader = new T3D.Shader(gl,
            'precision mediump float;' +
            'attribute vec3 aPos, aNorm;' +
            'uniform mat4 uWorld, uProj;' +
            'uniform mat3 uInverse;' +
            'uniform float uStroke;' +
            'varying vec4 vPos;' +
            'varying vec3 vNorm;' +
            'void main(void) {' +
                'vec3 pos = aPos + (aNorm * uStroke);' +
                'vPos = uWorld * vec4(pos, 1.0);' +
                'vNorm = uInverse * aNorm;' +
                'gl_Position = uProj * vPos;' +
            '}',

            'precision mediump float;' +
            'uniform mat4 uWorld;' +
            'uniform vec4 uColor;' +
            'uniform vec3 uLight;' +
            'uniform vec3 uAmbient;' +
            'uniform vec3 uDiffuse;' +
            'uniform vec3 uSpecular;' +
            'uniform float uLevels;' +
            'varying vec4 vPos;' +
            'varying vec3 vNorm;' +
            'void main(void) {' +
                'vec3 lightDir = normalize(uLight - vPos.xyz);' +
                'vec3 normal = normalize(vNorm);' +
                'vec3 eyeDir = normalize(-vPos.xyz);' +
                'vec3 reflectionDir = reflect(-lightDir, normal);' +
                'float specularWeight = 0.0;' +
                'if (uColor.w > 0.0) { specularWeight = pow(max(dot(reflectionDir, eyeDir), 0.0), uColor.w); }' +
                'float diffuseWeight = max(dot(normal, lightDir), 0.0);' +
                'vec3 weight = uAmbient + uSpecular * specularWeight  + uDiffuse * diffuseWeight;' +
                'vec3 color = uColor.xyz * weight;' +
                'if (uLevels > 1.0) { color = floor(color * uLevels) * (1.0 / uLevels); }' +
                'gl_FragColor = vec4(color, 1);' +
            '}'
        );

    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.width / canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function bind(): void {
        let x: number = 0,
            y: number = 0,
            min: number = 20,
            drag = false,
            keys: any = {};
        on(document, 'touchstart', (e: TouchEvent) => {
            let touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            drag = true;
        });
        on(document, 'touchmove', (e: TouchEvent) => {
            if (!drag) {
                return;
            }
            let touch = e.touches[0];
            if (!keys.ArrowRight && touch.clientX - x > min) {
                keys.ArrowRight = true;
                scene.input(keys, true);
                drag = false;
            }
            if (!keys.ArrowLeft && touch.clientX - x < -min) {
                keys.ArrowLeft = true;
                scene.input(keys, true);
                drag = false;
            }
            if (!keys.ArrowDown && touch.clientY - y > min) {
                keys.ArrowDown = true;
                scene.input(keys, true);
                drag = false;
            }
            if (!keys.ArrowUp && touch.clientY - y < -min) {
                keys.ArrowUp = true;
                scene.input(keys, true);
                drag = false;
            }
        });
        on(document, 'touchend', (e: TouchEvent) => {
            if (drag) {
                keys.Space = true;
                scene.input(keys, true);
            }
            keys.Space =
            keys.ArrowRight =
            keys.ArrowLeft =
            keys.ArrowUp =
            keys.ArrowDown =
            drag = false;
            scene.input(keys, false);
        });
        on(document, 'keydown', (e: KeyboardEvent) => {
            if (!keys[e.code]) {
                keys[e.code] = true;
                keys[0] = keys.Enter || keys.Space || e.shiftKey || e.ctrlKey;
                scene.input(keys, true);
            }
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            if (keys[e.code]) {
                keys[e.code] = false;
                keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
                scene.input(keys, false);
            }
        });
        on(window, 'resize', resize);
    }
    
    function render(item: T3D.Item, stroke: number = 0) {
        item.childs.forEach(child => {
            render(child, stroke);
        });
        let scale = item.transform.scale;
        if (!item.active || !item.mesh) {
            return;
        }
        let invert = item.transform.matrix().invert();
        if (!invert) {
            return;
        }
        gl.cullFace(stroke > 0 ? gl.FRONT : gl.BACK);
        gl.useProgram(shader.program);
        shader.attrib("aPos", item.mesh.verts, 3)
            .attrib("aNorm", item.mesh.normals, 3)
            .uniform("uWorld", camera.transform(item.transform).data)
            .uniform("uProj", camera.perspective().data)
            .uniform("uInverse", invert.transpose().data)
            .uniform("uColor", stroke ? [0, 0, 0, 1] : item.color)
            .uniform("uLight", light.position.clone().sub(camera.position).toArray())
            .uniform("uAmbient", light.ambient)
            .uniform("uDiffuse", light.diffuse)
            .uniform("uSpecular", light.specular)
            .uniform("uStroke", stroke || 0)
            .uniform("uLevels", stroke ? 0 : 5);
        gl.drawArrays(gl.TRIANGLES, 0, item.mesh.length);
    }

    function anim(): void {
        requestAnimationFrame(anim);
        scene.update();
        gl.clear(gl.COLOR_BUFFER_BIT);
        render(scene);
        render(scene, .02);
        hud.textContent = `Distance: ${scene.distance.toFixed(2)}\nTokens: ${scene.hero.tokens}`;
    }

    on(window, 'load', () => {
        camera.position.set(0, .7, 5);
        camera.rotate.x = -.85;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        resize();
        bind();
        anim();
    });
}