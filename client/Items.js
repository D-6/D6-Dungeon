import socket from './socket';

export class Item {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  createItemSprite(game, itemsCollisionGroup, collidesWithItemsArr) {
    if (this.type === 'health') {
      this.sprite = game.add.sprite(this.x, this.y, 'potion');
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(4);
    } else if (this.type === 'maxHealth') {
      this.sprite = game.add.sprite(this.x, this.y, 'blood');
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(4);
    } else if (this.type === 'ironFist') {
      this.sprite = game.add.sprite(this.x, this.y, 'fist');
      this.sprite.anchor.setTo(0.5, 0.5);
      this.sprite.scale.set(0.15);
    }

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
          maxHealth,
          socketId,
          sprite,
          hearts
        } = player1;

        if (this.type === 'health') {
          let healAmount = 1;

          if (player1.health + healAmount > maxHealth) {
            healAmount = maxHealth - player1.health;
          }

          if (player1.health !== maxHealth) {
            player1.health += healAmount;
            sprite.health += healAmount;

            for (let i = 0; i < healAmount; i++) {
              for (let j = 0; j < hearts.length; j++) {
                let heart = hearts.getAt(j);

                if (heart.frame === 2) {
                  heart.frame = 1;
                  break;
                } else if (heart.frame === 1) {
                  heart.frame = 0;
                  break;
                }
              }
            }
          }
        } else if (this.type === 'maxHealth') {
          const maxHealthIncrease = 2;
          player1.maxHealth += maxHealthIncrease;

          game.add.sprite(120 + 40 * hearts.length, 45, 'hearts', 2, hearts);

          hearts.setAll('scale.x', 0.35);
          hearts.setAll('scale.y', 0.35);
        } else if (this.type === 'ironFist') {
          const maxHealthIncrease = 2;
          player1.maxHealth += maxHealthIncrease;

          game.add.sprite(120 + 40 * hearts.length, 45, 'hearts', 2, hearts);

          hearts.setAll('scale.x', 0.35);
          hearts.setAll('scale.y', 0.35);
        }

        this.sprite.destroy();

        socket.emit('playerPickup', {
          bulletSpeed,
          damage,
          fireRate,
          speed,
          maxHealth: player1.maxHealth,
          health: player1.health,
          socketId,
          gameId
        });
      }
    });
  }
}
