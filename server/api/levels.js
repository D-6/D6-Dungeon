const router = require('express').Router();
const path = require('path');
const readFilePromise = require('fs-readfile-promise');
const { Map } = require('../map_generator/mapGen');

// const layoutsDirectory = '/map-generator/layouts/';
// Eventually Maps db will hold the map information
// const { Maps } = require('../db/models');
module.exports = router;

const fakeMapInfo = {
  gridSize: 9,
  totalRooms: 2,
  startMiddle: true,
  rooms: [
    {
      position: {
        x: 4,
        y: 4
      },
      doors: {
        n: false,
        s: false,
        e: false,
        w: true
      },
      type: 'start',
      filename: 'layout_1_w.json'
    },
    {
      position: {
        x: 3,
        y: 4
      },
      doors: {
        n: false,
        s: false,
        e: true,
        w: false
      },
      type: 'normal',
      filename: 'layout_1_e.json'
    }
  ]
};

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let newMap;
    switch (id) {
      case '1':
        newMap = new Map(9, 8, true);
        break;
      case '2':
        newMap = new Map(9, 12, true);
        break;
      case '3':
        newMap = new Map(9, 16, true);
        break;
      default:
        newMap = null;
    }
    newMap = fakeMapInfo;
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
      .then(rooms => res.json(rooms))
      .catch(err => next(err));
  } catch (err) {
    next(err);
  }
});
