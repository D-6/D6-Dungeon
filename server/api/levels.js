const router = require('express').Router();
const { Map, combineRooms } = require('../map_generator/mapGen');

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

    const data = newMap.createJSONMap();

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
