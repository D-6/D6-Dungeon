// Import enemies here:
import { Weasel } from './enemies';
import socket from './socket';

export const enemyRenderer = (
  game,
  enemiesCollisionGroup,
  collidesWithEnemiesArr
) => {
  const currentState = game.state.current;
  const roomEnemies = game.state.enemies[currentState];
  let enemiesArr = [];

  if (roomEnemies.length) {
    roomEnemies.forEach(enemy => {
      const weasel = new Weasel(game, enemy.name, enemy.x, enemy.y, enemy.health);

      weasel.speed =
        weasel.minSpeed + Math.floor(Math.random() * weasel.speedVariation);

      weasel.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      weasel.sprite.body.collides(collidesWithEnemiesArr);

      weasel.sprite.body.onBeginContact.add(other => {
        if (other.sprite && other.sprite.key === 'bullet') {
          weasel.sprite.damage(other.sprite.damage);
          other.sprite.kill();

          socket.emit('enemyDamage', {
            name: weasel.name,
            damage: other.sprite.damage
          });

          if (!weasel.sprite._exists) {
            socket.emit('enemyKill', { name: weasel.name, room: currentState });
          }
        }
      });

      enemiesArr.push(weasel);
    });
  }

  return enemiesArr;
};
