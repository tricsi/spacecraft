namespace Game {

    export class MenuScene {

        play: HTMLElement;
        left: HTMLElement;
        right: HTMLElement;
        index: number;
        planets: NodeListOf<HTMLElement>;

        constructor() {
            this.play = <HTMLElement>$('#play');
            this.left = <HTMLElement>$('#left');
            this.right = <HTMLElement>$('#right');
            this.planets = <NodeListOf<HTMLElement>>document.getElementsByTagName('LI');
            this.index = this.planets.length - 1;
            this.left.className = 'disabled';
            this.bind();
        }

        bind() {
            on(this.left, 'click', e => {
                if (this.left.className) {
                    return;
                }
                this.planets.item(++this.index).className = "";
                if (this.index >= this.planets.length - 1) {
                    this.left.className = 'disabled';
                }
                this.right.className = '';
            });
            on(this.right, 'click', e => {
                if (this.right.className) {
                    return;
                }
                this.planets.item(this.index--).className = "hide";
                if (this.index <= 0) {
                    this.right.className = 'disabled';
                }
                this.left.className = '';
            });
        }
    }

}