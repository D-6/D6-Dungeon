const enemyTypes = ['weasel'];

const enemies = {};

const getRandomPosition = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateEnemies = () => {
  const minX = 192;
  const maxX = 1024;
  const minY = 192;
  const maxY = 640;
  const enemyArray = [];
  for (let i = 0; i < 4; i++) {
    const enemy = { type: 'weasel' };
    enemy.x = getRandomPosition(minX, maxX);
    enemy.y = getRandomPosition(minY, maxY);
    enemyArray.push(enemy);
  }
  return enemyArray;
};

const createEnemies = (newMap, level) => {
  newMap.rooms.forEach(room => {
    const { x, y } = room.position;
    if (room.type === 'start') {
      enemies[`level${level}_${x}-${y}`] = [];
    } else if (room.type === 'normal') {
      enemies[`level${level}_${x}-${y}`] = generateEnemies();
    }
  });
  return enemies;
};

module.exports = { createEnemies };
