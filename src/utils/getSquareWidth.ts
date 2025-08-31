

export function getMaxSquareWidth(
  containerWidth: number,
  containerHeight: number,
  numberOfSquares: number
): [number, number] {
  if (numberOfSquares <= 0) return [0,0];
  if (numberOfSquares === 1) return [Math.min(containerWidth, containerHeight), 1];

  let maxSquareWidth = 0;
  let rowsWithMaxSquareWidth = 0

  for (let rows = 1; rows <= numberOfSquares; rows++) {
    const cols = Math.ceil(numberOfSquares / rows);
    
    const maxWidthByContainer = containerWidth / cols;
    const maxHeightByContainer = containerHeight / rows;
    
    const squareWidth = Math.min(maxWidthByContainer, maxHeightByContainer);
        
    if (squareWidth >= maxSquareWidth) {
        rowsWithMaxSquareWidth = cols 
    }
    maxSquareWidth = Math.max(maxSquareWidth, squareWidth);
  }

  return [maxSquareWidth, rowsWithMaxSquareWidth];
}