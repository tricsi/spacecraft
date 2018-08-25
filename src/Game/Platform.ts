namespace Game {

    export class Platform extends T3D.Item {

        token: T3D.Item;
        fence: T3D.Item;

        update(speed: number): boolean {
            let pos = this.transform.translate,
                rotate = this.token.transform.rotate;
            pos.z += speed;
            let end = pos.z > 2;
            if (end) {
                pos.z -= 11;
            }
            let scale = 1;
            if (pos.z < -8) {
                scale = pos.z + 9;
            } else if (pos.z > 1) {
                scale = 2 - pos.z; 
            }
            this.transform.scale.set(scale, scale, scale);
            rotate.y = (rotate.y + 1) % 360;
            return end;
        }

        intersect(hero: Hero) {
            let token = this.token;
            if (token.active && token.collider.intersect(hero.collider)) {
                token.active = false;
                hero.tokens++;
            }
            if (!this.active) {
                return;
            }
            let collide = this.collider.intersect(hero.collider);
            if (collide) {
                hero.transform.translate.add(collide);
                hero.speed.y += collide.y;
            }
            return collide;
        }
    }

}