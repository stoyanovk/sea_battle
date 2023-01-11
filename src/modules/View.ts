import { IBoard, IView, Coordinate } from "../interfaces";
import { BOARD_SIZE, range } from "../utils";

export class View implements IView {
  mountNode: HTMLElement;
  size: number;
  board: IBoard;

  constructor({ mountNode, size = BOARD_SIZE, board }) {
    this.mountNode = mountNode;
    this.size = size;
    this.board = board;
  }
  render() {
    let column = "";
    for (let i of range(this.size)) {
      let row = "";
      for (let j of range(this.size)) {
        const id: Coordinate = `${i + 1}-${j + 1}`;
        const isHit = this.board.hitLocation.includes(id);
        const isMiss = this.board.missedLocation.includes(id);
        const className = `cell ${isHit ? "red" : ""} ${isMiss ? "gray" : ""}`;
        row += `<div id=${id} class="${className}">${id}</div>`;
      }
      column += `<div class="row">${row}</div>`;
    }
    this.mountNode.innerHTML = column;
  }
}
