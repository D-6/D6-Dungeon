// Import enemies here:
import { Weasel } from './enemies';

export const enemyGenerator = (
  game,
  enemiesCollisionGroup,
  collidesWithEnemiesArr
) => {
  let enemiesArr = [];
  const currentState = game.state.current;

  const enemyPos = {
    pos0: [
      { x: 300, y: 300 },
      { x: 300, y: 608 },
      { x: 608, y: 300 },
      { x: 608, y: 608 }
    ],
    pos1: [
      { x: 200, y: 200 },
      { x: 200, y: 350 },
      { x: 200, y: 500 },
      { x: 200, y: 650 }
    ]
  };

  if (game.state.rooms[currentState].spawnEnemies === true) {
    const random = Math.floor(Math.random() * 2);
    const positions = `pos${random}`;
    enemyPos[positions].forEach(position => {
      const enemy = new Weasel(game, position.x, position.y);

      enemy.speed =
        enemy.minSpeed + Math.floor(Math.random() * enemy.speedVariation);

      enemy.sprite.body.setCollisionGroup(enemiesCollisionGroup);
      enemy.sprite.body.collides(collidesWithEnemiesArr);

      enemy.sprite.body.onBeginContact.add(other => {
        if (other.sprite && other.sprite.key === 'bullet') {
          enemy.sprite.damage(other.sprite.damage);
          other.sprite.kill();

          if (!enemy.sprite._exists) {
            game.state.rooms[currentState].enemiesLeft--;
          }
        }
      });

      enemiesArr.push(enemy);
    });
    game.state.rooms[currentState].enemiesLeft = positions.length;
    game.state.rooms[currentState].spawnEnemies = false;
  }

  return enemiesArr;
};
