import React, { useState } from 'react';

const TicTacToe = ({ playerX, playerO, onWinner, onTie }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winningLine, setWinningLine] = useState(null);
    const [isTie, setIsTie] = useState(false);

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
                const winner = squares[a] === 'X' ? playerX : playerO;
                onWinner(winner); // Send the winner to the parent component
                return squares[a];
            }
        }

        if (!squares.includes(null)) {
            setIsTie(true);
            onTie(); // Notify the parent component about the tie
        }

        return null;
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinningLine(null);
        setIsTie(false);
    };

    const currentPlayerName = isXNext ? playerX : playerO;
    const currentPlayerSymbol = isXNext ? 'X' : 'O';

    const status = winningLine
        ? (
            <span>
                Winner: <span className="font-bold">{playerX} ({'X'})</span>
            </span>
        )
        : isTie
            ? "It's a tie!"
            : `Next player: ${currentPlayerName} (${currentPlayerSymbol})`;

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
            <div className={`text-lg mb-4 ${winningLine || isTie ? 'text-green-500 font-bold' : ''}`}>
                {status}
            </div>
            <div className="grid grid-cols-3 gap-2 w-60 sm:w-72">
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
            <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
                Reset Game
            </button>
        </div>
    );
};


export default TicTacToe;
