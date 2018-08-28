namespace Game {

    export class Platform extends T3D.Item {

        block: T3D.Item;
        token: T3D.Item;
        fence: T3D.Item;
        enemy: Enemy;

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
            rotate.y = (rotate.y + 1.5) % 360;
            this.enemy.update(speed, end);
            return end;
        }

        intersect(hero: Hero, jump: boolean = false) {
            let token = this.token,
                fence = this.fence,
                collide;
            if (token.active && token.collider.intersect(hero.collider)) {
                token.active = false;
                hero.tokens++;
            }
            if (fence.active) {
                collide = fence.collider.intersect(hero.collider);
                if (collide) {
                    if (jump && collide.x) hero.jump();
                    hero.transform.translate.add(collide);
                    hero.speed.y += collide.y;
                }
            }
            if (!this.block.active) {
                return;
            }
            collide = this.block.collider.intersect(hero.collider);
            if (collide) {
                if (jump && collide.x) hero.jump();
                hero.transform.translate.add(collide);
                hero.speed.y += collide.y;
            }
            return collide;
        }
    }

}