import socket from './socket';

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

    game.physics.p2.enable(this.sprite, false);
    this.sprite.body.static = true;
    this.sprite.body.setCollisionGroup(itemsCollisionGroup);
    this.sprite.body.collides(collidesWithItemsArr);

    this.sprite.body.onBeginContact.add(other => {
      if (other.sprite.key === 'player1') {
        const { player1, gameId } = game.state;
        const {
          bulletSpeed,
          damage,
          fireRate,
          speed,
          socketId,
          sprite
        } = player1;

        if (this.type === 'health') {
          sprite.health++;
          console.log('HEALTH POTION! sprite', sprite.health);

          socket.emit('playerPickup', {
            bulletSpeed,
            damage,
            fireRate,
            speed,
            health: sprite.health,
            socketId,
            gameId
          });

          this.sprite.destroy();
        }
      }
    });
  }
}
