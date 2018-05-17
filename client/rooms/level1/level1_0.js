import socket from '../../socket';
import { createWallCollision } from '../../wallCollision';
import { createDoorCollision } from '../../doorCollision';
import { createDoorSensors } from '../../doorSensors';
import { enemyRenderer } from '../../enemyRenderer';
import { createCollisionGroups } from '../../collisionGroups';
import { Potion } from '../../Items';
import HealthBar from '../../health';
/* global D6Dungeon */

let player1;
let player2;
let enemies;
let game;
let carpet;
let border;
let gameRoom;
let doors;
let map;
let music;

export default {
  create() {
    game = D6Dungeon.game;

    player1 = game.state.player1;
    player2 = game.state.player2;
    const { gameId } = game.state;
    gameRoom = game.state.current;

    const [
      wallsCollisionGroup,
      doorsCollisionGroup,
      doorSensorsCollisionGroup,
      playersCollisionGroup,
      enemiesCollisionGroup,
      bulletsCollisionGroup,
      itemsCollisionGroup
    ] = createCollisionGroups(game);

    socket.emit('setRoom', { gameId, gameRoom });

    map = game.add.tilemap(gameRoom);
    const floorDoor = game.add.tilemap('floorDoor');

    if (gameRoom.includes('level1')) {
      map.addTilesetImage('level_1', 'level1Image');
      floorDoor.addTilesetImage('level_1', 'level1Image');
    } else if (gameRoom.includes('level2')) {
      map.addTilesetImage('level_1', 'level2Image');
      floorDoor.addTilesetImage('level_1', 'level2Image');
    } else {
      map.addTilesetImage('level_1', 'level3Image');
      floorDoor.addTilesetImage('level_1', 'level3Image');
    }
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');
    doors = map.createLayer('Doors');

    const hole = floorDoor.createLayer('Hole');
    hole.cameraOffset.setTo(
      (map.widthInPixels - hole.layer.widthInPixels) / 2,
      (map.heightInPixels - hole.layer.heightInPixels) / 2
    );
    hole.visible = false;
    const ladder = floorDoor.createLayer('Ladder');
    ladder.cameraOffset.setTo(
      (map.widthInPixels - ladder.layer.widthInPixels) / 2,
      (map.heightInPixels - ladder.layer.heightInPixels) / 2
    );

    ladder.visible = false;
    carpet = floorDoor.createLayer('Carpet');
    carpet.cameraOffset.setTo(
      (map.widthInPixels - carpet.layer.widthInPixels) / 2,
      (map.heightInPixels - carpet.layer.heightInPixels) / 2
    );
    carpet.visible = false;
    border = floorDoor.createLayer('Border');
    border.cameraOffset.setTo(
      (map.widthInPixels - border.layer.widthInPixels) / 2,
      (map.heightInPixels - border.layer.heightInPixels) / 2
    );
    border.visible = false;

    const wallBodies = createWallCollision(map, walls, game);
    wallBodies.forEach(wallBody => {
      wallBody.setCollisionGroup(wallsCollisionGroup);
      wallBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    const doorBodies = createDoorCollision(map, doors, game);
    doorBodies.forEach(doorBody => {
      doorBody.setCollisionGroup(doorsCollisionGroup);
      doorBody.collides([
        bulletsCollisionGroup,
        enemiesCollisionGroup,
        playersCollisionGroup
      ]);
    });

    // *** Door Sensors ***
    createDoorSensors(game, gameRoom).forEach(doorSensor => {
      doorSensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      doorSensor.body.collides(playersCollisionGroup);
    });

    // *** Player - Sprite ***
    player1.addPlayerToRoom(
      game,
      'player1',
      playersCollisionGroup,
      [
        bulletsCollisionGroup,
        doorSensorsCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup,
        itemsCollisionGroup,
        doorsCollisionGroup
      ],
      enemiesCollisionGroup
    );
    player2.addPlayerToRoom(
      game,
      'player2',
      playersCollisionGroup,
      [
        bulletsCollisionGroup,
        doorSensorsCollisionGroup,
        playersCollisionGroup,
        wallsCollisionGroup,
        itemsCollisionGroup,
        doorsCollisionGroup
      ],
      enemiesCollisionGroup
    );

    // *** Bullets ***
    player1.addBullets(
      game,
      'bullet',
      player1.damage,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );
    player2.addBullets(
      game,
      'dummyBullet',
      player2.damage,
      bulletsCollisionGroup,
      [playersCollisionGroup, wallsCollisionGroup, doorsCollisionGroup],
      enemiesCollisionGroup
    );

    // *** Player 1 - Hearts ***
    player1.addHearts(game);

    enemies = enemyRenderer(game, enemiesCollisionGroup, [
      bulletsCollisionGroup,
      enemiesCollisionGroup,
      playersCollisionGroup,
      wallsCollisionGroup,
      doorsCollisionGroup
    ]);

    if (enemies.length && enemies[0].name.includes('shadowBoy')) {
      hole.visible = true;
      ladder.visible = true;
      carpet.visible = true;

      const sensor = game.add.sprite(
        map.widthInPixels / 2,
        map.heightInPixels / 2,
        'wizard'
      );
      sensor.scale.set(0.3);
      sensor.anchor.setTo(0.5);
      sensor.visible = false;
      game.physics.p2.enable(sensor, false);
      sensor.body.static = true;
      sensor.body.data.shapes[0].sensor = true;
      sensor.body.setCollisionGroup(doorSensorsCollisionGroup);
      sensor.body.collides(playersCollisionGroup);
      sensor.body.onBeginContact.add(other => {
        if (other.sprite.key === 'player1' && enemies[0].health === 0) {
          let nextLevel = +gameRoom.slice(5, 6) + 1;
          if (nextLevel > 3) nextLevel = 1;
          const nextRoom = gameRoom.slice(0, 5) + nextLevel + '_3-3';
          socket.emit('nextRoomReady', {
            gameId,
            socketId: player1.socketId,
            nextRoom,
            direction: 'down'
          });
        }
      });
    }

    // game.state.music = D6Dungeon.game.add.audio('boss-battle');
    // game.state.music.loopFull(0.1);
    // game.state.music.allowMultiple = false;

    // console.log(game.state.music);
    // const resumeAudio = () => {
    //   // console.log(game.sound.context.state);
    //   // console.log(game.state.music.isPlaying);
    //   if (game.sound.context.state === 'suspended') {
    //     game.sound.context.resume();
    //     game.state.music.play();
    //   }
    // };

    // if (game.sound.usingWebAudio) {
    //   player1.keybinds.up.onDown.addOnce(resumeAudio);
    //   player1.keybinds.down.onDown.addOnce(resumeAudio);
    //   player1.keybinds.left.onDown.addOnce(resumeAudio);
    //   player1.keybinds.right.onDown.addOnce(resumeAudio);
    // }

    socket.emit('intervalTest', gameId);
  },

  update() {
    enemies.forEach(enemy => {
      if (!D6Dungeon.game.state.enemies[gameRoom][enemy.name]) {
        enemy.sprite.kill();
      }

      if (enemy.sprite._exists) {
        if (enemy.sprite.children[0]) {
          enemy.sprite.children[0].setText(`HP: ${enemy.health}`);
        }

        const { nextXTile, nextYTile } = D6Dungeon.game.state.enemies[gameRoom][
          enemy.name
        ];

        const nextX = nextXTile * 64;
        const nextY = nextYTile * 64;
        const currentX = enemy.sprite.position.x;
        const currentY = enemy.sprite.position.y;

        const distanceFactor = Math.sqrt(
          Math.pow(Math.abs(currentX - nextX), 2) +
            Math.pow(Math.abs(currentY - nextY), 2)
        );

        if (distanceFactor > enemy.randomBehavior && !enemy.ignorePathing) {
          if (nextX > currentX) {
            enemy.sprite.body.velocity.x = enemy.speed;
            enemy.sprite.scale.x = enemy.scale;

            if (
              enemy.sprite.children[0] &&
              enemy.sprite.children[0].scale.x < 0
            ) {
              enemy.sprite.children[0].scale.x = enemy.scale;
            }
          } else if (nextX < currentX) {
            enemy.sprite.body.velocity.x = -enemy.speed;
            enemy.sprite.scale.x = -enemy.scale;

            if (
              enemy.sprite.children[0] &&
              enemy.sprite.children[0].scale.x > 0
            ) {
              enemy.sprite.children[0].scale.x = -enemy.scale;
            }
          }

          if (nextY > currentY) {
            enemy.sprite.body.velocity.y = enemy.speed;
          } else if (nextY < currentY) {
            enemy.sprite.body.velocity.y = -enemy.speed;
          }
        }

        if (
          enemy.sprite.animations._anims.run &&
          enemy.sprite.animations._anims.attack &&
          !enemy.sprite.animations._anims.attack.isPlaying
        ) {
          if (!enemy.sprite.body.velocity.x && !enemy.sprite.body.velocity.y) {
            enemy.sprite.animations.play('idle');
          } else {
            enemy.sprite.animations.play('run');
          }
        }
      }
    });

    player1.addMovement(game);
    player1.addShooting(game);

    player2.sprite.body.setZeroVelocity();
    player2.sprite.body.mass = 2000;

    if (!Object.keys(game.state.enemies[gameRoom]).length) {
      game.physics.p2.clearTilemapLayerBodies(map, doors);
      carpet.visible = false;
      // music.fadeOut(2000);
      doors.destroy();
    }

    // P2 connection
    if (player2.health > 0 && player2.socketId && !player2.sprite.visible) {
      player2.sprite.visible = true;
      player2.sprite.body.data.shapes[0].sensor = false;
    } else if (!player2.socketId && player2.sprite.visible) {
      player2.sprite.visible = false;
      player2.sprite.body.data.shapes[0].sensor = true;
    }

    if (player2.health <= 0) {
      player2.sprite.kill();
    }
  }
};
