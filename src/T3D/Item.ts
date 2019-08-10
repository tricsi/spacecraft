import { Mesh } from "./Mesh";
import { Collider } from "./Collider";
import { Transform } from "./Transform";

export class Item {

    transform: Transform;
    collider: Collider;
    childs: Array<Item> = [];
    active: boolean = true;
    stroke: number = 0;

    constructor(
        public mesh?: Mesh,
        public color?: Array<number>,
        transform?: Array<number>
    ) {
        this.transform = new Transform(transform);
    }

    add(child: Item) {
        this.childs.push(child);
        child.transform.parent = this.transform;
        return this;
    }

}
