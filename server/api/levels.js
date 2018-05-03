const router = require('express').Router();
const { Map } = require('../map_generator/mapGen');

module.exports = router;

router.get('/:level', async (req, res, next) => {
  try {
    const { level } = req.params;
    let newMap;
    switch (level) {
      case '1':
        newMap = new Map(7, 2, true);
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

    let map = D6Dungeon.game.add.tilemap('level1map');
    map.addTilesetImage('level_1', 'level1image');
    const floor = map.createLayer('Floor');
    const walls = map.createLayer('Walls');

    const data = await newMap.createJSONMap();
    console.log(data);

    // combineRooms(newMap);

    // console.log(newMap.rooms);

    // const pathToFile = path.join(
    //   __dirname,
    //   '..',
    //   'map_generator',
    //   'layouts',
    //   newMap.rooms[0].filename
    // );

    // let data = await readFilePromise(pathToFile, 'utf8');

    // data = JSON.parse(data);

    // data.tilesets[0].name = 'level_1';

    res.json(data);

    // const promiseArray = newMap.rooms.map(room => {
    //   const pathToFile = path.join(
    //     __dirname,
    //     '..',
    //     'map_generator',
    //     'layouts',
    //     room.filename
    //   );
    //   return readFilePromise(pathToFile, 'utf8');
    // });
    // Promise.all(promiseArray)
    //   .then(rooms =>
    //     rooms.map((room, i) => {
    //       const JSONroom = JSON.parse(room);
    //       JSONroom.position = newMap.rooms[i].position;
    //       return JSONroom;
    //     })
    //   )
    //   .then(rooms => res.json(rooms))
    //   .catch(err => next(err));
  } catch (err) {
    next(err);
  }
});
