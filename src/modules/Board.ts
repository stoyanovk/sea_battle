import { IBoard, IShip, Location } from "../interfaces";

export class Board implements IBoard {
  ships: IShip[];
  hitLocation: Location;
  missedLocation: Location;
  constructor(ships) {
    this.ships = ships;
    this.hitLocation = [];
    this.missedLocation = [];
  }

  addLocation(coordinate) {
    const { hitLocation, ships, missedLocation } = this;
    for (let ship of ships) {
      if (ship.location.includes(coordinate)) {
        hitLocation.push(coordinate);
        return;
      }
    }
    missedLocation.push(coordinate);
  }
}
