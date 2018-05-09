// Import enemies here:
import { Weasel } from './enemies';

export const enemyGenerator = (
  game,
  enemiesCollisionGroup,
  collidesWithEnemiesArr
) => {
  let enemiesArr = [];
  const minSpeed = 60;
  const speedVariation = 60;

  const enemyPos = {
    pos0: [
      { x: 300, y: 300 },
      { x: 300, y: 608 },
      // { x: 608, y: 300 },
      // { x: 608, y: 608 }
    ],
    pos1: [
      { x: 200, y: 200 },
      { x: 200, y: 350 },
      // { x: 200, y: 500 },
      // { x: 200, y: 650 }
    ]
  };

  const random = Math.floor(Math.random() * 2);
  enemyPos[`pos${random}`].forEach(pos => {
    const enemy = new Weasel(game, pos.x, pos.y);
    enemy.sprite.body.setCollisionGroup(enemiesCollisionGroup);
    enemy.sprite.body.collides(collidesWithEnemiesArr);
    enemy.speed = minSpeed + Math.floor(Math.random() * speedVariation);
    enemiesArr.push(enemy);
  });

  return enemiesArr;
};
