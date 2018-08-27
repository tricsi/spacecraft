namespace Game {

    export class Menu {

        body: HTMLElement;
        left: HTMLElement;
        right: HTMLElement;
        index: number;
        active: boolean;
        planets: NodeListOf<HTMLElement>;

        constructor() {
            this.body = <HTMLElement>$('body');
            this.left = <HTMLElement>$('#left');
            this.right = <HTMLElement>$('#right');
            this.planets = <NodeListOf<HTMLElement>>document.getElementsByTagName('LI');
            this.index = this.planets.length - 1;
            this.left.className = 'disabled';
            this.active = true;
            this.bind();
        }

        input(key: number): void {
            if (!this.active) {
                return;
            }
            switch (key) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
            }
        }

        prev() {
            if (this.left.className) {
                return;
            }
            this.planets.item(++this.index).className = "";
            if (this.index >= this.planets.length - 1) {
                this.left.className = 'disabled';
            }
            this.right.className = '';
        }

        next() {
            if (this.right.className) {
                return;
            }
            this.planets.item(this.index--).className = "hide";
            if (this.index <= 0) {
                this.right.className = 'disabled';
            }
            this.left.className = '';
        }

        show() {
            this.active = true;
            this.body.className = '';
        }

        hide() {
            this.active = false;
            this.body.className = 'play';
        }

        bind() {
            on(this.left, 'click', e => {
                this.prev();
            });
            on(this.right, 'click', e => {
                this.next();
            });    
        }
    }

}