export class Potion {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  createPotionSprite(game, itemsCollisionGroup, collidesWithItemsArr) {
    this.sprite = game.add.sprite(this.x, this.y, 'potion');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.set(4);

    game.physics.p2.enable(this.sprite, true);
    this.sprite.body.static = true;
    this.sprite.body.setCollisionGroup(itemsCollisionGroup);
    this.sprite.body.collides(collidesWithItemsArr);

    this.sprite.body.onBeginContact.add(other => {
      if (other.sprite.key === 'player') {
        const { player1 } = game.state;

        if (this.type === 'health') {
          player1.sprite.health++;
          console.log('HEALTH POTION! sprite', player1.sprite.health);
          // TODO: Emit new hp

          this.sprite.destroy();
        }
      }
    });
  }
}
