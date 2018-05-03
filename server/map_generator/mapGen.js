const path = require('path');
const readFilePromise = require('fs-readfile-promise');

// const specialRoomTypes = ['start', 'boss', 'treasure'];

class Room {
  constructor(
    position = { x: null, y: null },
    type = 'normal',
    doors = { n: false, s: false, e: false, w: false }
  ) {
    this.position = position;
    this.doors = doors;
    this.type = type;
    this.filename = '';
  }

  makeRoomFilename() {
    let directions = '';
    if (this.doors.n) directions += 'n';
    if (this.doors.e) directions += 'e';
    if (this.doors.s) directions += 's';
    if (this.doors.w) directions += 'w';
    this.filename = 'layout_' + directions.length + '_' + directions + '.json';
  }
}

class Map {
  constructor(gridSize = 9, totalRooms = 12, startMiddle = true) {
    this.gridSize = gridSize;
    this.totalRooms = totalRooms;
    this.startMiddle = startMiddle;
    this.rooms = [];
    this.createMap();
    this.addDoors();
    this.makeRoomFilenames();
  }

  createMap() {
    if (this.gridSize * this.gridSize >= this.totalRooms) {
      let start;
      if (this.startMiddle) {
        const middle = Math.floor(this.gridSize / 2);
        start = new Room({ x: middle, y: middle }, 'start');
      } else {
        start = new Room(this.getRandomPosition(), 'start');
      }

      this.addRoom(start);

      while (this.rooms.length < this.totalRooms) {
        const nextValidPositions = this.getNextValidPositions();
        const index = Math.floor(Math.random() * nextValidPositions.length);
        const room = new Room(nextValidPositions[index]);
        this.addRoom(room);
      }
    }
  }

  // addDoors adds doors as per below:
  //   ^
  // + |
  // y |
  // - |_________>
  //    - x +
  addDoors() {
    this.rooms.forEach((room, i, self) => {
      self.forEach((compRoom, j) => {
        if (i !== j) {
          const { x, y } = room.position;
          if (compRoom.position.x === x - 1 && compRoom.position.y === y) {
            room.doors.w = true;
          }
          if (compRoom.position.x === x + 1 && compRoom.position.y === y) {
            room.doors.e = true;
          }
          if (compRoom.position.x === x && compRoom.position.y === y - 1) {
            room.doors.s = true;
          }
          if (compRoom.position.x === x && compRoom.position.y === y + 1) {
            room.doors.n = true;
          }
        }
      });
    });
  }

  getNextValidPositions() {
    return this.rooms
      .reduce((acc, room) => {
        // Add all 4 nearby positions
        return acc.concat(
          { x: room.position.x - 1, y: room.position.y },
          { x: room.position.x + 1, y: room.position.y },
          { x: room.position.x, y: room.position.y - 1 },
          { x: room.position.x, y: room.position.y + 1 }
        );
      }, [])
      .filter((position, i, self) => {
        return (
          // Only positions inside the map
          position.x >= 0 &&
          position.y >= 0 &&
          position.x < this.gridSize &&
          position.y < this.gridSize &&
          // Only positions NOT already in this.rooms
          !this.rooms.find(
            room =>
              room.position.x === position.x && room.position.y === position.y
          ) &&
          // No duplicates allowed (remove clustering bias)
          i ===
            self.findIndex(pos => pos.x === position.x && pos.y === position.y)
        );
      });
  }

  getRandomPosition() {
    const positionX = Math.floor(Math.random() * this.gridSize);
    const positionY = Math.floor(Math.random() * this.gridSize);
    return { x: positionX, y: positionY };
  }

  addRoom(room) {
    this.rooms.push(room);
  }

  // drawMap draws rooms as per below:
  //   ^
  // + |   X
  // y |   X X X
  // - |_________>
  //    - x +
  drawMap() {
    const matrix = [];
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push(' ');
      }
      matrix.push(row);
    }

    this.rooms.forEach(room => {
      matrix[this.gridSize - 1 - room.position.y][room.position.x] = 'X';
    });
    console.log(matrix);
  }

  makeRoomFilenames() {
    this.rooms.forEach((room, i) => {
      room.makeRoomFilename();
    });
  }

  async createJSONMap() {
    // const pathToFile = path.join(
    //   __dirname,
    //   '.',
    //   'layouts',
    //   this.rooms[0].filename
    // );
    let mapJSON;
    await this.rooms.forEach(async (room, i) => {
      try {
        const pathToFile = path.join(__dirname, '.', 'layouts', room.filename);
        const roomJSON = JSON.parse(await readFilePromise(pathToFile, 'utf8'));
        if (i === 0) {
          mapJSON = roomJSON;
        } else {
          const floorData = roomJSON.layers[0].data;
          const wallData = roomJSON.layers[1].data;
          mapJSON.layers[0].data.concat(floorData);
          mapJSON.layers[1].data.concat(wallData);
        }
      } catch (err) {
        console.error(err);
      }
    });
    console.log(mapJSON);
    return mapJSON;
  }
}

module.exports = { Map };