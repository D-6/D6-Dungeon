const baseEnemies = [
  // {
  //   name: 'golem',
  //   health: 5,
  //   quantity: 1,
  //   damage: 2,
  //   interval: 10000,
  //   type: 'boss'
  // },
  {
    name: 'weasel',
    health: 1,
    quantity: 4,
    damage: 1,
    interval: 0,
    type: 'normal',
    ignorePathing: false
  },
  {
    name: 'redHornedBee',
    health: 1,
    quantity: 16,
    damage: 1,
    interval: 0,
    type: 'normal',
    ignorePathing: true
  },
  {
    name: 'shadowBoy',
    health: 30,
    quantity: 1,
    damage: 1,
    interval: 0,
    type: 'boss',
    ignorePathing: false
  }
];

const enemies = {};

const getRandomPosition = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateEnemies = baseEnemy => {
  const minX = 192;
  const maxX = 1024;
  const minY = 192;
  const maxY = 640;
  const enemyObject = {};
  for (let i = 0; i < baseEnemy.quantity; i++) {
    const enemyName = baseEnemy.name + i;
    enemyObject[enemyName] = { type: baseEnemy.name };
    enemyObject[enemyName].x = getRandomPosition(minX, maxX);
    enemyObject[enemyName].y = getRandomPosition(minY, maxY);
    enemyObject[enemyName].health = baseEnemy.health;
    enemyObject[enemyName].damage = baseEnemy.damage;
    enemyObject[enemyName].ignorePathing = baseEnemy.ignorePathing;
    enemyObject[enemyName].name = enemyName;
    enemyObject[enemyName].interval = baseEnemy.interval;
  }
  return enemyObject;
};

const createEnemies = (newMap, level) => {
  newMap.rooms.forEach(room => {
    const { x, y } = room.position;

    if (room.type === 'start') {
      enemies[`level${level}_${x}-${y}`] = [];
      // enemies[`level${level}_${x}-${y}`] = generateEnemies(baseEnemies[2]);
      // enemies[`level${level}_${x}-${y}`] = generateEnemies(baseEnemies[3]);
    } else if (room.type === 'normal') {
      const normalEnemies = baseEnemies.filter(
        enemy => enemy.type === 'normal'
      );
      const randomEnemy =
        normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
      enemies[`level${level}_${x}-${y}`] = generateEnemies(randomEnemy);
    } else if (room.type === 'boss') {
      enemies[`level${level}_${x}-${y}`] = generateEnemies(baseEnemies[0]);
    }
  });
  return enemies;
};

//using this, we can use findClosestPlayer as the target in the enemyPathing function
const findClosestPlayer = (gamePlayers, enemy) => {
  const players = Object.keys(gamePlayers);
  const playersAlive = players.filter(player => gamePlayers[player].health > 0);
  let shortestDist;
  let closestPlayer = null;

  for (let i = 0; i < playersAlive.length; i++) {
    let player = gamePlayers[playersAlive[i]];

    const dist = Math.sqrt(
      Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
    );
    if (!closestPlayer) {
      closestPlayer = player;
      shortestDist = dist;
    } else if (dist < shortestDist) {
      closestPlayer = player;
      shortestDist = dist;
    }
  }
  return closestPlayer;
};

module.exports = { createEnemies, findClosestPlayer };
