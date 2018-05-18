// Import enemies here:
import { Weasel, Golem, RedHornedBee, ShadowBoyBoss } from './enemies';
import socket from './socket';
import { Item } from './Items';

/* global D6Dungeon */

export const enemyRenderer = (
  game,
  enemiesCollisionGroup,
  collidesWithEnemiesArr
) => {
  const gameRoom = game.state.current;
  const roomEnemiesObj = game.state.enemies[gameRoom];
  const roomEnemiesArr = Object.keys(roomEnemiesObj).map(enemy => {
    return { ...roomEnemiesObj[enemy] };
  });
  let enemiesArr = [];

  if (roomEnemiesArr.length) {
    roomEnemiesArr.forEach(enemy => {
      let monster;
      if (enemy.type === 'weasel') {
        monster = new Weasel(
          game,
          enemy.name,
          enemy.x,
          enemy.y,
          enemy.health,
          enemy.damage
        );
      } else if (enemy.type === 'golem') {
        monster = new Golem(
          game,
          enemy.name,
          enemy.x,
          enemy.y,
          enemy.health,
          enemy.damage
        );
      } else if (enemy.type === 'redHornedBee') {
        monster = new RedHornedBee(
          game,
          enemy.name,
          enemy.x,
          enemy.y,
          enemy.health,
          enemy.damage,
          enemy.ignorePathing
        );
      } else if (enemy.type === 'shadowBoy') {
        monster = new ShadowBoyBoss(
          game,
          enemy.name,
          enemy.x,
          enemy.y,
          enemy.health,
          enemy.damage,
          enemy.ignorePathing
        );
      }

      monster.speed =
        monster.minSpeed + Math.floor(Math.random() * monster.speedVariation);

      monster.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      monster.sprite.body.collides(collidesWithEnemiesArr);
      monster.sprite.body.onBeginContact.add(other => {
        if (other.sprite) {
          if (other.sprite.key === 'bullet') {
            monster.health -= other.sprite.damageAmount;
            monster.sprite.damage(other.sprite.damageAmount);
            other.sprite.kill();
            const generate = Math.random();
            if (monster.sprite.health === 0) {
              if (generate >= 0 && generate <= 0.05) {
                const healthPotion = new Item(
                  'health',
                  monster.sprite.body.x,
                  monster.sprite.body.y
                );
                healthPotion.createItemSprite(
                  game,
                  game.physics.p2.collisionGroups[5],
                  [game.physics.p2.collisionGroups[3]]
                );
              }
              else if (generate > 0.05 && generate <= 0.1) {
                const maxHealth = new Item(
                  'maxHealth',
                  monster.sprite.body.x,
                  monster.sprite.body.y
                );
                maxHealth.createItemSprite(
                  game,
                  game.physics.p2.collisionGroups[5],
                  [game.physics.p2.collisionGroups[3]]
                );
              }
            }
            socket.emit('enemyHit', {
              health: monster.health,
              name: monster.name,
              gameId: D6Dungeon.game.state.gameId
            });
          } else if (other.sprite.key === 'dummyBullet') {
            other.sprite.kill();
          }
        }
      });
      enemiesArr.push(monster);
    });
  }

  return enemiesArr;
};
