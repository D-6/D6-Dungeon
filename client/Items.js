export class Potion {
  constructor(type) {
    this.type = type;
  }

  createPotionSprite(game, itemsCollisionGroup, collidesWithItemsArr) {
    this.sprite = game.add.sprite(400, 400, 'potion');
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
          player1.health++;
          console.log('HEALTH POTION! ', player1.health);
          this.sprite.destroy();
        }
      }
    });
  }
}
