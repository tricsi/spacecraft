namespace Game {

    export class Platform extends T3D.Item {

        block: T3D.Item;
        token: Token;
        fence: T3D.Item;
        enemy: Enemy;

        update(speed: number): boolean {
            let pos = this.transform.translate;
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
            this.token.update();
            this.enemy.update(speed, end);
            return end;
        }

        intersect(hero: Hero, side: boolean = false) {
            if (!hero.active || hero.stroke) {
                return;
            }
            let fence = this.fence,
                collide;
            this.token.intersect(hero);
            if (fence.active) {
                collide = fence.collider.intersect(hero.collider);
                if (collide) {
                    if (side && collide.x) hero.cancel();
                    hero.transform.translate.add(collide);
                    hero.speed.y += collide.y;
                }
            }
            if (!this.block.active) {
                return;
            }
            collide = this.block.collider.intersect(hero.collider);
            if (collide) {
                if (side && collide.x) hero.cancel();
                hero.transform.translate.add(collide);
                hero.speed.y += collide.y;
            }
            return collide;
        }
    }

}