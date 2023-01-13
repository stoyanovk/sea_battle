export const BOARD_SIZE = 10;
export const range = (length = BOARD_SIZE) =>
  Array.from({ length }, (_, i) => i);

export const getLoopFuse = (cycleCount: number = 1000) => {
  let count = 0;
  return {
    isLoopEnded: () => count > cycleCount,
    increaseCount: () => {
      count++;
      console.log(`Count is ${count}`);
    },
    resetCount: () => {
      count = 0;
    },
  };
};
