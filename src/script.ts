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
    
    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        scene: SceneInterface;

    function resize(): void {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
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
            if (!keys.ArrowUp && touch.clientY - y > min) {
                keys.ArrowUp = true;
                scene.input(keys, true);
                drag = false;
            }
            if (!keys.ArrowDown && touch.clientY - y < -min) {
                keys.ArrowDown = true;
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
    
    function render(): void {
        requestAnimationFrame(() => {
            render();
        });
        scene.update();
        scene.render(ctx);
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        scene = new Scene();
        resize();
        bind();
        render();
    });
}