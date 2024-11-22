import React, { useState } from 'react';

const ConnectFour = ({ player1, player2, onWinner, onTie }) => {
    const rows = 6;
    const cols = 7;
    const [board, setBoard] = useState(Array(rows).fill().map(() => Array(cols).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningDiscs, setWinningDiscs] = useState([]); // Track winning discs

    const checkWinner = (board) => {
        const directions = [
            { name: 'horizontal', dx: 1, dy: 0 },
            { name: 'vertical', dx: 0, dy: 1 },
            { name: 'diagonal1', dx: 1, dy: 1 },
            { name: 'diagonal2', dx: 1, dy: -1 },
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const disc = board[row][col];
                if (disc) {
                    for (let { dx, dy } of directions) {
                        let winningDiscs = [];
                        for (let i = 0; i < 4; i++) {
                            const r = row + i * dy;
                            const c = col + i * dx;
                            if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== disc) {
                                break;
                            }
                            winningDiscs.push([r, c]);
                        }
                        if (winningDiscs.length === 4) {
                            setWinningDiscs(winningDiscs);
                            return disc; // Return winner ('Red' or 'Yellow')
                        }
                    }
                }
            }
        }

        return null;
    };

    const handleClick = (col) => {
        // Don't process further if there's already a winner
        if (winner) return;

        const newBoard = board.map(row => row.slice());
        for (let row = rows - 1; row >= 0; row--) {
            if (!newBoard[row][col]) {
                newBoard[row][col] = isRedNext ? 'Red' : 'Yellow';
                break;
            }
        }

        setBoard(newBoard);
        const currentWinner = checkWinner(newBoard); // Avoid overwriting the 'winner' state directly
        if (currentWinner) {
            setWinner(currentWinner);
            onWinner(currentWinner === 'Red' ? player1 : player2); // Notify winner
        } else if (newBoard.every(row => row.every(cell => cell))) {
            onTie();
        }
        setIsRedNext(!isRedNext);
    };

    const resetGame = () => {
        setBoard(Array(rows).fill().map(() => Array(cols).fill(null))); // Reset the board
        setIsRedNext(true); // Reset to Red's turn
        setWinner(null); // No winner initially
        setWinningDiscs([]); // Clear winning discs
    };

    const currentPlayerName = isRedNext ? player1 : player2;
    const currentPlayerColor = isRedNext ? 'Red' : 'Yellow';

    const status = winner ? `Winner: ${winner === 'Red' ? player1 : player2}` : `Next player: ${currentPlayerName} (${currentPlayerColor})`;

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Connect Four</h2>
            <div className="text-lg mb-4">{status}</div>
            <div className="grid grid-cols-7 gap-1">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isWinningCell = winningDiscs.some(([r, c]) => r === rowIndex && c === colIndex);
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 flex items-center justify-center border border-gray-500 rounded-full 
                                ${cell === 'Red' ? 'bg-red-500' : cell === 'Yellow' ? 'bg-yellow-500' : 'bg-white'} 
                                ${isWinningCell ? 'border-4 border-green-500' : ''}`}
                                onClick={() => handleClick(colIndex)}
                            >
                                {cell && <div className="w-12 h-12 rounded-full" style={{ backgroundColor: cell }}></div>}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Reset Button */}
            <button
                onClick={resetGame}
                className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
                Reset Game
            </button>
        </div>
    );
};

export default ConnectFour;
