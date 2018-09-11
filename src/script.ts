namespace Game {

    export function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    export function on(element: any, event: string, callback: EventListenerOrEventListenerObject, capture: any = false) {
        element.addEventListener(event, callback, capture);
    }

    export class Rand {

        static seed: number = Math.random();

        static get(max: number = 1, min: number = 0, round: boolean = true): number {
            if (max <= min) {
                return max;
            }
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            let value = min + (Rand.seed / 233280) * (max - min);
            return round ? Math.round(value) : value;
        }

    }
    
    export const COLOR = {
        WHITE:  [1, 1, 1, 10],
        PINK: [1, .3, 1, 30],
        BLUE: [.3, .3, 1, 30],
        YELLOW: [1, 1, .3, 30],
        RED: [1, .3, .3, 0],
        CYAN: [.3, 1, 1, 30]
    }

    let running: boolean = false,
        canvas: HTMLCanvasElement = <HTMLCanvasElement>$('#game'),
        menu: Menu = new Menu(),
        music: AudioBufferSourceNode,
        time: number = new Date().getTime(),
        gl: WebGLRenderingContext = canvas.getContext('webgl'),
        light: T3D.Vec3 = new T3D.Vec3(5, 15, 7),
        camera: T3D.Camera = new T3D.Camera(canvas.width / canvas.height),
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
            'uniform float uLevels;' +
            'varying vec4 vPos;' +
            'varying vec3 vNorm;' +
            'vec3 uAmbient = vec3(.2, .2, .2);' +
            'vec3 uDiffuse = vec3(.8, .8, .8);' +
            'vec3 uSpecular = vec3(.8, .8, .8);' +
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
        ),
        mesh = {
            hero: [
                new T3D.Mesh(gl, 10), 
                new T3D.Mesh(gl, 10, [.5, .15, .5, .1, .5, -.1, .5, -.15]),
                new T3D.Mesh(gl, 10, [.2, .5, .48, .2, .5, .1, .2, .1, .2, -.1, .5, -.1, .48, -.2, .2, -.5]),
                new T3D.Mesh(gl, 10, [.3, .44, .43, .3, .45, .2, .49, .2, .5, .1, .45, .1, .45, -.1, .5, -.1, .49, -.2, .45, -.2, .43, -.3, .3, -.44]),
            ],
            block: new T3D.Mesh(gl, 4, [.55, .5, .65, .4, .65, -.4, .55, -.5]),
            fence: new T3D.Mesh(gl, 12, [.4, .5, .5, .4, .5, -.4, .4, -.5], 40),
            token: new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
            enemy: new T3D.Mesh(gl, 6),
        },
        hero: Hero = new Hero(mesh.hero[0], COLOR.WHITE),
        scene: Scene = new Scene(hero, () => {
            let platform = new Platform(),
                block = new T3D.Item(mesh.block, COLOR.BLUE, [,,,,45]),
                enemy = new Enemy(mesh.enemy, COLOR.CYAN, [,1,,,,,.7,.7,.7]),
                token = new Token(mesh.token, COLOR.YELLOW, [,1,,90,,,.5,.1,.5]),
                fence = new T3D.Item(mesh.fence, COLOR.RED, [,1.4,,,,,.8,1,.8]);
            block.collider = new T3D.Box(block.transform);
            enemy.collider = new T3D.Sphere(enemy.transform);
            token.collider = new T3D.Sphere(token.transform);
            fence.collider = new T3D.Box(fence.transform);
            platform.block = block;
            platform.token = token;
            platform.fence = fence;
            platform.enemy = enemy;
            return platform.add(block).add(token).add(fence).add(enemy);
        }, new Map(
            '311737173711|4111|5711|3111|'+
            '211135012111|2111|301531513510|'+
            '311119973111|5111111d|311120003115|'+
            '551111dd|305130053051|3111139b3511|'+
            '211130002115|401510004510'
        ));

    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.width / canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function bind(): void {
        let x: number = 0,
            y: number = 0,
            min: number = 15,
            keys: boolean[] = [],
            drag = false;
        
        on(document, 'touchstart', (e: TouchEvent) => {
            let touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            drag = true;
        });
        
        on(document, 'touchmove', (e: TouchEvent) => {
            e.preventDefault();
            if (!drag || menu.active) {
                return;
            }
            let touch = e.touches[0];
            if (!keys[39] && touch.clientX - x > min) {
                keys[39] = true;
                scene.input(39);
                drag = false;
            } else if (!keys[37] && touch.clientX - x < -min) {
                keys[37] = true;
                scene.input(37);
                drag = false;
            } else if (!keys[40] && touch.clientY - y > min) {
                keys[40] = true;
                scene.input(40);
                drag = false;
            } else if (!keys[38] && touch.clientY - y < -min) {
                keys[38] = true;
                scene.input(38);
                drag = false;
            }
        }, {passive: false});
        
        on(document, 'touchend', (e: TouchEvent) => {
            if (drag && !menu.active) {
                keys[32] = true;
                scene.input(32);
            }
            keys[32] =
            keys[37] =
            keys[38] =
            keys[39] =
            keys[40] =
            drag = false;
        });
        
        on(document, 'keydown', (e: KeyboardEvent) => {
            if (keys[e.keyCode]) {
                return;
            }
            keys[e.keyCode] = true;
            if (!running) {
                if (keys[32]) {
                    load();
                }
            } else if (menu.active) {
                menu.input(e.keyCode);
                return;
            } else {
                scene.input(e.keyCode);
            }
        });

        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
        });
        
        on(window, 'resize', resize);

        on($('#start'), 'click', () => {
            if (!running) {
                load();
            }
        });

        Event.on('all', (event) => {
            SFX.play(event);
        });

        Event.on('start', () => {
            menu.hide();
            scene.init();
            if (!music) {
                let mixer = SFX.mixer('music'),
                    time = mixer.context.currentTime;
                mixer.gain.setValueAtTime(menu.volume, time);
                music = SFX.play('music', true, 'music');
            }
        });

        Event.on('end', () => {
            hero.init(false);
            menu.show();
        });
    }

    function render(item: T3D.Item, stroke: number = 0) {
        item.childs.forEach(child => {
            render(child, stroke);
        });
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
            .uniform("uLight", light.clone().sub(camera.position).toArray())
            .uniform("uStroke", stroke + item.stroke)
            .uniform("uLevels", stroke ? 0 : 5);
        gl.drawArrays(gl.TRIANGLES, 0, item.mesh.length);
    }

    function update() {
        requestAnimationFrame(update);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (menu.shop) {
            hero.mesh = mesh.hero[menu.selected];
            hero.preview();
            render(hero);
            render(hero, .02);
            return;
        }
        let now = new Date().getTime();
        if (now - time > 30) {
            scene.update();
        }
        time = now;
        scene.update();
        render(scene);
        render(scene, .02);
        if (!hero.active && music) {
            let mixer = SFX.mixer('music'),
                time = mixer.context.currentTime;
            mixer.gain.setValueCurveAtTime(Float32Array.from([menu.volume, 0]), time, .5);
            music.stop(time + .5);
            music = null;
        }
        if (!menu.active && scene.ended()) {
            menu.score(hero);
        }
    }

    async function load() {
        running = true;
        let btn = $('#start');
        btn.className = 'disabled';
        btn.textContent = 'loading';
        await SFX.init();
        await Promise.all([
            new SFX.Sound('custom', [5, 1, 0], 1).render('exp', [220,0], 1),
            new SFX.Sound('custom', [3, 1, 0], 1).render('hit', [1760,0], .3),
            new SFX.Sound('square', [.5, .1, 0], 1).render('power', [440,880,440,880,440,880,440,880], .3),
            new SFX.Sound('triangle', [.5, .1, 0], 1).render('jump', [220,880], .3),
            new SFX.Sound('square', [.2, .1, 0], .2).render('coin', [1760,1760], .2),
            new SFX.Sound('custom', [.1, .5, 0], .3).render('move', [1760,440], .3),
            SFX.render('music', [
                new SFX.Channel(new SFX.Sound('sawtooth', [1, .3], .2), '8a2,8a2,8b2,8c3|8|8g2,8g2,8a2,8b2|8|8e2,8e2,8f2,8g2|4|8g2,8g2,8a2,8b2|4|'.repeat(4), 1),
                new SFX.Channel(new SFX.Sound('sawtooth', [.5, .5], 1), '1a3,1g3,2e3,4b3,4c4,1a3c3e3,1g3b3d4,2e3g3b3,4d3g3b3,4g3c4e4|1|'+'8a3,8a3e4,8a3d4,8a3e4|2|8g3,8g3d4,8g3c4,8g3d4|2|8e3,8e3a3,8e3b3,8e3a3,4g3b3,4g3c4|1|'.repeat(2), 4)
            ])
        ]);
        $('#load').className = 'hide';
        update();
    }

    on(window, 'load', async () => {
        hero.init();
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        camera.rotate.x = -.7;
        camera.position.set(0, 0, 1.2);
        hero.transform.rotate.set(10, 22, 30);
        render(hero);
        render(hero, .02);
        (<HTMLLinkElement>$("link[rel=apple-touch-icon]")).href = 
        (<HTMLLinkElement>$("link[rel=icon]")).href = canvas.toDataURL();
        camera.position.set(0, .5, 5);
        resize();
        bind();
    });

    $('ontouchstart' in window ? '#keys' : '#touch').className = 'hide';
}