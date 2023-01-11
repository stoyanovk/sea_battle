import { IShip, IShipCreator, Location, Coordinate } from "../interfaces";
import { BOARD_SIZE, range } from "../utils";

class Ship implements IShip {
  location: Location;
  constructor(location) {
    this.location = location;
  }
}

export class ShipsCreator implements IShipCreator {
  ships: IShip[];
  boardSize: number;
  shipCount: number;
  constructor(boardSize = BOARD_SIZE) {
    this.ships = [];
    this.boardSize = boardSize;
    this.shipCount = 10;

    this.generateShips();
  }

  generateShips() {
    // ships and their count
    const shipsTypeCount = {
      1: 4, // single ship
      2: 3, // double ship
      3: 2, // triple ship
      4: 1, // ship for 4 places
    };

    const pushShips = (shipSize) => {
      if (shipsTypeCount[shipSize] > 0) {
        // it work if ship count > 0
        const location = this.generateShipLocation(shipSize);
        if (!this.checkCollision({ ships: this.ships, location })) {
          this.ships.push(new Ship(location));
          shipsTypeCount[shipSize] = shipsTypeCount[shipSize] - 1; // if everything ok we decrease count
        }
      }
    };

    while (this.ships.length < this.shipCount) {
      pushShips(1);
      pushShips(2);
      pushShips(3);
      pushShips(4);
    }
  }

  generateShipLocation(shipLength): Location {
    const { random, round, floor } = Math;
    // 1 - vertical, 2 - horizontal;
    const direction = round(random()); // 0 || 1
    const startCoordinate = floor(random() * this.boardSize);
    const endCoordinate = floor(random() * (this.boardSize - shipLength));
    const row = (!!direction ? startCoordinate : endCoordinate) + 1; // plus 1 need that row not to be 0
    const column = (!!direction ? endCoordinate : startCoordinate) + 1; // plus 1 need that column not to be 0

    return range(shipLength).map((_, i): Coordinate => {
      return !!direction ? `${row}-${column + i}` : `${row + i}-${column}`;
    });
  }

  checkCollision({ ships, location }) {
    if (!ships.length) return false;
    const shipsPlaces = ships.reduce((acc, item) => {
      // I get all ships places
      return [...acc, ...item.location];
    }, []);

    const forbiddenZone = shipsPlaces.reduce((acc, item) => {
      // get all ships places and place near them where ship can't be
      return [...acc, ...this.getForbiddenZone(item)];
    }, []);

    const forbiddenZoneSet = new Set(forbiddenZone); // drop duplicates

    for (let i = 0; i < location.length; i++) {
      // check each location in  forbiddenZone
      if (forbiddenZoneSet.has(location[i])) return true;
    }
    return false;
  }

  getForbiddenZone(value) {
    if (!value) return [];
    let [row, column] = value.split("-");
    const forbiddenZone = [value]; // first forbiddenZone

    row = Number(row);
    column = Number(column);

    forbiddenZone.push(`${row - 1}-${column}`); // top cell
    forbiddenZone.push(`${row + 1}-${column}`); // bottom cell
    forbiddenZone.push(`${row}-${column - 1}`); // left cell
    forbiddenZone.push(`${row}-${column + 1}`); // right cell
    forbiddenZone.push(`${row - 1}-${column - 1}`); // top left cell
    forbiddenZone.push(`${row + 1}-${column + 1}`); // bottom  right cell
    forbiddenZone.push(`${row - 1}-${column + 1}`); // top right cell
    forbiddenZone.push(`${row + 1}-${column - 1}`); // bottom left cell

    return forbiddenZone;
  }
}
