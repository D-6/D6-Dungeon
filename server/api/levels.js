const router = require('express').Router();
const path = require('path');
const readFilePromise = require('fs-readfile-promise');
const { Map } = require('../map_generator/mapGen');
const { createEnemies } = require('../socket/enemyGenerator');

router.get('/:level', async (req, res, next) => {
  try {
    const { level } = req.params;
    let newMap;
    switch (level) {
      case '1':
        newMap = new Map(7, 8, true);
        break;
      case '2':
        newMap = new Map(7, 12, true);
        break;
      case '3':
        newMap = new Map(7, 16, true);
        break;
      default:
        newMap = null;
    }

    const enemies = createEnemies(newMap, level);

    const promiseArray = newMap.rooms.map(room => {
      const pathToFile = path.join(
        __dirname,
        '..',
        'map_generator',
        'layouts',
        room.filename
      );
      return readFilePromise(pathToFile, 'utf8');
    });

    Promise.all(promiseArray)
      .then(rooms =>
        rooms.map((room, i) => {
          const JSONroom = JSON.parse(room);
          JSONroom.position = newMap.rooms[i].position;
          return JSONroom;
        })
      )
      .then(rooms => res.json({ rooms, enemies }))
      .catch(err => next(err));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
