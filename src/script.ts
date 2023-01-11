import { View } from "./modules/View";
import { Board } from "./modules/Board";
import { ShipsCreator } from "./modules/ShipsCreator";





const ships = new ShipsCreator();

const board = new Board(ships.ships);

const view = new View({
  mountNode: document.getElementById("board"),
  board,
});

view.render();
document.addEventListener("click", (e) => {
  const id = (e.target as HTMLDivElement).id
  if (id) {
    board.addLocation(id);
    view.render();
  }
});
