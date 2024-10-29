import React, { useState } from 'react';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winningLine, setWinningLine] = useState(null);
    const [playerX, setPlayerX] = useState("Player X");
    const [playerO, setPlayerO] = useState("Player O");
    const [gameStarted, setGameStarted] = useState(false);
    const [isTie, setIsTie] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClick = (index) => {
        if (board[index] || winningLine || isTie) return;
        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
        checkWinner(newBoard);
    };

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                setWinningLine([a, b, c]);
                setIsTie(false);
                return squares[a];
            }
        }

        if (!squares.includes(null)) {
            setIsTie(true);
        } else {
            setIsTie(false);
        }

        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinningLine(null);
        setIsTie(false);
    };

    const startGame = () => {
        if (playerX.trim() === '' || playerO.trim() === '') {
            setErrorMessage("Please enter names for both players.");
            return;
        }
        setErrorMessage(""); // Clear error message if inputs are valid
        setGameStarted(true);
        resetGame();
    };

    const returnToStart = () => {
        setGameStarted(false);
        resetGame();
    };

    const currentPlayerName = isXNext ? playerX : playerO;
    const currentPlayerSymbol = isXNext ? 'X' : 'O';
    const winnerName = winningLine ? (board[winningLine[0]] === 'X' ? playerX : playerO) : null;
    const loserName = winningLine ? (winnerName === playerX ? playerO : playerX) : null;

    const status = winnerName
        ? (
            <span>
                Winner: <span className="font-bold">{winnerName} ({winnerName === playerX ? 'X' : 'O'})</span>,
                <span className="text-red-500 font-bold"> Loser: {loserName} ({loserName === playerX ? 'X' : 'O'})</span>
            </span>
        )
        : isTie
            ? "It's a tie!"
            : `Next player: ${currentPlayerName} (${currentPlayerSymbol})`;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
            {!gameStarted && (
                <div className="mb-4 space-y-2">
                    <input
                        type="text"
                        placeholder="Player X Name"
                        value={playerX}
                        onChange={(e) => setPlayerX(e.target.value)}
                        className="px-3 py-1 border border-gray-500 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Player O Name"
                        value={playerO}
                        onChange={(e) => setPlayerO(e.target.value)}
                        className="px-3 py-1 border border-gray-500 rounded"
                    />
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <button
                        onClick={startGame}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                        Start Game
                    </button>
                </div>
            )}
            {gameStarted && (
                <>
                    <div className={`text-lg mb-4 ${winningLine || isTie ? 'text-green-500 font-bold' : ''}`}>
                        {status}
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-60 sm:w-72 relative">
                        {board.map((value, index) => (
                            <button
                                key={index}
                                className={`w-20 h-20 sm:w-24 sm:h-24 text-3xl sm:text-4xl font-semibold flex items-center justify-center border border-gray-500 bg-gray-100 
                                ${winningLine && winningLine.includes(index) ? 'bg-green-200' : ''}`}
                                onClick={() => handleClick(index)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={resetGame}
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        >
                            Reset Game
                        </button>
                        <button
                            onClick={returnToStart}
                            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                        >
                            Change Names
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicTacToe;
