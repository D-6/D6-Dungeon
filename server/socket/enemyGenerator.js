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
    enemy.name = `weasel${i}`;
    enemy.health = 1;
    enemyArray.push(enemy);
  }
  return enemyArray;
};

const createEnemies = (newMap, level) => {
  newMap.rooms.forEach(room => {
    const { x, y } = room.position;
    // if (room.type === 'start') {
    //   enemies[`level${level}_${x}-${y}`] = [];
    // } else if (room.type === 'normal') {
    enemies[`level${level}_${x}-${y}`] = generateEnemies();
    // }
  });
  return enemies;
};

//using this, we can use findClosestPlayer as the target in the enemyPathing function
const findClosestPlayer = (gamePlayers, enemy) => {
  //gamePlayers has to be an array of both players
  const players = Object.keys(gamePlayers);

  let shortestDist;
  let closestPlayer = null;
  for (let i = 0; i < players.length; i++) {
    let player = gamePlayers[players[i]];
    // console.log(player);
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
