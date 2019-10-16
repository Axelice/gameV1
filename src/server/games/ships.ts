const BOARD_SIZE = 10;
const ROUNDS_TO_DRAW = 100;
const SHIP_NUM = 3;
const SHIP_SIZE = 4;
const PLAYER_LOST = "PLAYER_LOST";
const SHIPS_ARE_VALID = "SHIPS_ARE_VALID";
const SHIPS_COUNT_NOT_VALID = "SHIPS_COUNT_NOT_VALID";
const SHIPS_PARTS_NOT_VALID = "SHIPS_PARTS_NOT_VALID";
const SHIPS_NOT_VALID = "SHIPS_NOT_VALID";
const SHIPS_OVERLAP = "SHIPS_OVERLAP";
const HIT = "x";
const EMPTY = " -- ";

/**
 * shipPart = {
 *  pos: {
 *    posX: Number 0 to BOARD_SIZE - 1
 *    posY: Number 0 to BOARD_SIZE - 1
 *  }
 * }
 * shipList = [[shipPart], [shipPart], ...] length is SHIP_NUM
 *
 *
 * players = {
 *  playerId,
 *  actions: {
 *    getShips,
 *    runRound,
 *  }
 * }
 *
 *
 */

interface Point {
  posX: number;
  posY: number;
}

enum BoardSquareTypes {
  HIT = "x",
  EMPTY = " -- "
}

class Board extends Array {
  [index: number]: Array<
    BoardSquareTypes.HIT | BoardSquareTypes.EMPTY | number
  >;
  static boardSize: number = BOARD_SIZE;
}

class Ship extends Array {
  [index: number]: Point;
}

const checkBoardIsCleared = function(board: Board) {
  for (let x = 0; x < Board.boardSize; x++) {
    for (let y = 0; y < Board.boardSize; y++) {
      const boardPosValue = board[x][y];
      if (boardPosValue !== undefined && Number.isInteger(<any>boardPosValue)) {
        return false;
      }
    }
  }
  return true;
};

const checkWinner = function(board: Board) {
  return checkBoardIsCleared(board);
};

const checkIsIntSmallerThan = function(val: number, max: number) {
  return Number.isInteger(val) && val < max;
};

const checkPos = function({ posX, posY }: Point) {
  try {
    return (
      checkIsIntSmallerThan(posX, BOARD_SIZE) &&
      checkIsIntSmallerThan(posY, BOARD_SIZE)
    );
  } catch (e) {
    return false;
  }
};

enum ShipValidity {
  SHIPS_ARE_VALID,
  SHIPS_COUNT_NOT_VALID = "Your ships count is wrong.",
  SHIPS_PARTS_NOT_VALID = "Your ships parts are wrong.",
  SHIPS_NOT_VALID = "Your ships have an unknown issue."
}

const checkShips = function(shipsList: Array<Ship>): ShipValidity {
  try {
    const isShipsLengthValid = shipsList.length === SHIP_NUM;

    const areShipsValid = shipsList.every(ship => {
      const isSizeValid = ship.length === SHIP_SIZE;

      const isShipPosValid = ship.every(pos => checkPos(pos));

      return isSizeValid && isShipPosValid;
    });

    if (!isShipsLengthValid) {
      return ShipValidity.SHIPS_COUNT_NOT_VALID;
    } else if (!areShipsValid) {
      return ShipValidity.SHIPS_PARTS_NOT_VALID;
    }
    return ShipValidity.SHIPS_ARE_VALID;
  } catch (e) {
    return ShipValidity.SHIPS_NOT_VALID;
  }
};

const generateEmptyBoard = function(): Board {
  const board = new Board();
  for (let x = 0; x < BOARD_SIZE; x++) {
    board[x] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      board[x][y] = undefined;
    }
  }
  return board;
};

const checkBoardPlacement = function(board: Board) {
  let shipPartsCount = 0;
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (Number.isInteger(<any>board[x][y])) {
        shipPartsCount++;
      }
    }
  }
  return shipPartsCount === SHIP_NUM * SHIP_SIZE;
};

const getBoardWithShips = function(shipList: Array<Ship>) {
  const board = generateEmptyBoard();
  shipList.forEach((ship, shipId) => {
    ship.forEach(({ posX, posY }) => {
      board[posX][posY] = shipId;
    });
  });

  return board;
};

interface IPlayer {
  playerId: string;
  getShips(boardSize: number): Array<Ship>;
  runRound({ board }: { board: Board }): Point;
}

export function runGame(players: Array<IPlayer>) {
  const boardList: Array<Board> = [];
  let winner;

  // checks ships
  // places ships on board
  players.forEach(({ playerId, getShips }: IPlayer, index) => {
    try {
      const shipList = getShips(Board.boardSize);
      const shipCheckValue: ShipValidity = checkShips(shipList);
      if (shipCheckValue !== ShipValidity.SHIPS_ARE_VALID) {
        throw new Error(`${playerId}'s ships are invalid. ${shipCheckValue}`);
      }

      const board = getBoardWithShips(shipList);
      if (!checkBoardPlacement(board)) {
        throw new Error(`${playerId}'s ships are invalid. ${SHIPS_OVERLAP}`);
      }

      boardList.push(board);
    } catch (e) {
      console.log(e);
      winner = playerId;
    }
  });

  let rounds = 0;
  const alreadyHitList = [BoardSquareTypes.HIT, BoardSquareTypes.EMPTY];
  while (!winner) {
    rounds++;
    players.forEach(({ runRound }, playerIndex) => {
      try {
        const otherPlayerIndex = (playerIndex + 1) % 2;
        const otherPlayerBoard = boardList[otherPlayerIndex];
        const firePos = runRound({
          board: otherPlayerBoard.slice()
        });

        if (!checkPos(firePos)) {
          winner = players[otherPlayerIndex].playerId;
        }

        if (
          !alreadyHitList.includes(<BoardSquareTypes>otherPlayerBoard[firePos.posX][firePos.posY])
        ) {
          if (Number.isInteger(<number>otherPlayerBoard[firePos.posX][firePos.posY])) {
            otherPlayerBoard[firePos.posX][firePos.posY] = BoardSquareTypes.HIT;
          } else {
            otherPlayerBoard[firePos.posX][firePos.posY] = BoardSquareTypes.EMPTY;
          }
        }

        if (checkWinner(otherPlayerBoard)) {
          winner = players[otherPlayerIndex].playerId;
        }
      } catch (error) {
        console.log(error);
        debugger;
      }
    });
  }
  console.log("****************");
  console.log(
    boardList[0]
      .map(line =>
        line.map((place:any) => (place === undefined ? "~" : place)).join(" ")
      )
      .join("\n")
  );
  console.log("################");
  console.log(
    boardList[1]
      .map(line =>
        line.map((place:any) => (place === undefined ? "~" : place)).join(" ")
      )
      .join("\n")
  );
  console.log("****************");
  return { winner, boardList };
}
