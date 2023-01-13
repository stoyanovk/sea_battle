import { IShip, IShipCreator, Location, Coordinate } from "../interfaces";
import { BOARD_SIZE, range, getLoopFuse } from "../utils";

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

  getInitialShipsCounter() {
    // ships and their count
    return {
      1: 4, // single ship
      2: 3, // double ship
      3: 2, // triple ship
      4: 1, // ship for 4 places
    };
  }

  generateShips() {
    const loopFuse = getLoopFuse(20);
    let shipsTypeCount = this.getInitialShipsCounter();
    const pushShips = (shipSize) => {
      if (shipsTypeCount[shipSize] > 0) {
        // it work if ship count > 0
        const newShip = new Ship(this.generateShipLocation(shipSize));
        if (!this.checkCollision(newShip)) {
          this.ships.push(newShip);
          shipsTypeCount[shipSize] = shipsTypeCount[shipSize] - 1; // if everything ok we decrease count
        }
      }
    };

    while (this.ships.length < this.shipCount) {
      loopFuse.increaseCount();

      pushShips(4);
      pushShips(3);
      pushShips(2);
      pushShips(1);
      if (loopFuse.isLoopEnded()) {
        console.log("something went wrong");
        this.ships = [];
        loopFuse.resetCount();
        shipsTypeCount = this.getInitialShipsCounter();
      }
    }
  }

  generateShipLocation(shipLength): Location {
    const { random, round, floor } = Math;
    // 0 - vertical, 1 - horizontal;
    const direction = round(random()); // 0 || 1
    const xCoordinate = floor(random() * this.boardSize);
    const yCoordinate = floor(random() * (this.boardSize - shipLength));
    const row = (!!direction ? xCoordinate : yCoordinate) + 1; // plus 1 need that row not to be 0
    const column = (!!direction ? yCoordinate : xCoordinate) + 1; // plus 1 need that column not to be 0

    return range(shipLength).map((_, i): Coordinate => {
      return !!direction ? `${row}-${column + i}` : `${row + i}-${column}`;
    });
  }

  checkCollision(newShip) {
    if (!this.ships.length) return false;
    const shipsPlaces = this.ships.reduce((acc, item) => {
      // I get all ships places
      return [...acc, ...item.location];
    }, []);

    const forbiddenZone = shipsPlaces.reduce((acc, item) => {
      // get all ships places and place near them where ship can't be
      return [...acc, ...this.getForbiddenZone(item)];
    }, []);

    const forbiddenZoneSet = new Set(forbiddenZone); // drop duplicates

    for (let i = 0; i < newShip.location.length; i++) {
      // check each location in  forbiddenZone
      if (forbiddenZoneSet.has(newShip.location[i])) return true;
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
