namespace Game {

    export class Menu {

        body: Element;
        left: Element;
        right: Element;
        index: number;
        active: boolean;
        scores: NodeListOf<Element>;
        planets: NodeListOf<Element>;

        constructor() {
            this.body = $('body');
            this.left = $('#left');
            this.right = $('#right');
            this.scores = document.getElementsByTagName('H3');
            this.planets = document.getElementsByTagName('LI');
            this.index = this.planets.length - 1;
            this.left.className = 'disabled';
            this.active = true;
            this.bind();
        }

        score(value: number) {
            let index = this.index * 2;
            this.scores.item(index + 1).textContent = `Score: ${value}`;
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