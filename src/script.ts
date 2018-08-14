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

        static get(max: number = 1, min: number = 0): number {
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            return min + (Rand.seed / 233280) * (max - min);
        }

    }
    
    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        keys: object = {},
        scene: SceneInterface;

    function resize(): void {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    
    function bind(): void {
        on(document, 'keydown', (e: KeyboardEvent) => {
            keys[e.code] = true;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, true);
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.code] = false;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, false);
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