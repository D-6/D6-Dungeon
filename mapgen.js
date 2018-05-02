const specialRoomTypes = ['start', 'end', 'boss', 'treasure'];

class Room {
  constructor(
    position = { x: null, y: null },
    type = 'normal',
    doors = { n: false, s: false, e: false, w: false }
  ) {
    this.position = position;
    this.doors = doors;
    this.type = type;
  }
}

class Map {
  constructor(size = 12) {
    this.size = size;
    this.rooms = [];
    this.createMap();
    this.addDoors();
  }

  createMap() {
    const start = new Room(this.getRandomPosition(), 'start');
    this.addRoom(start);

    while (this.rooms.length < this.size) {
      const nextValidPositions = this.getNextValidPositions();
      const randomIndex = Math.floor(Math.random() * nextValidPositions.length);
      const room = new Room(nextValidPositions[randomIndex]);
      this.addRoom(room);
    }
  }

  addDoors() {}

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
      .filter((position, index, self) => {
        return (
          // Only positions inside the map
          position.x >= 0 &&
          position.y >= 0 &&
          position.x < this.size &&
          position.y < this.size &&
          // Only positions NOT already in this.rooms
          !this.rooms.find(
            room =>
              room.position.x === position.x && room.position.y === position.y
          ) &&
          // No duplicates allowed
          index ===
            self.findIndex(pos => pos.x === position.x && pos.y === position.y)
        );
      });
  }

  getRandomPosition() {
    const positionX = Math.floor(Math.random() * this.size);
    const positionY = Math.floor(Math.random() * this.size);
    return { x: positionX, y: positionY };
  }

  addRoom(room) {
    this.rooms.push(room);
  }

  showMap() {
    const matrix = [];
    for (let i = 0; i < this.size; i++) {
      const row = [];
      for (let j = 0; j < this.size; j++) {
        row.push(' ');
      }
      matrix.push(row);
    }

    this.rooms.forEach(room => {
      matrix[room.position.y][room.position.x] = 'X';
    });
    console.log(matrix);
  }
}

const map = new Map();

map.showMap();
