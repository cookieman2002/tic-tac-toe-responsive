import React, { useState, useEffect } from 'react';

import { fetchGameHistory, addGameResult } from './services/gameService';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winningLine, setWinningLine] = useState(null);
    const [playerX, setPlayerX] = useState("Player X");
    const [playerO, setPlayerO] = useState("Player O");
    const [gameStarted, setGameStarted] = useState(false);
    const [isTie, setIsTie] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);

    useEffect(() => {
        // Fetch game history on component mount
        const loadGameHistory = async () => {
            try {
                const history = await fetchGameHistory();
                setGameHistory(history);
            } catch (error) {
                console.error("Failed to load game history:", error);
            }
        };

        loadGameHistory();
    }, []);

    const handleClick = (index) => {
        if (board[index] || winningLine || isTie) return;
        const newBoard = board.slice();
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);
        checkWinner(newBoard);
    };

    const checkWinner = async (squares) => {
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

                // Save the game result
                const result = {
                    winnerName: squares[a] === 'X' ? playerX : playerO,
                    winnerSymbol: squares[a],
                    loserName: squares[a] === 'X' ? playerO : playerX,
                    loserSymbol: squares[a] === 'X' ? 'O' : 'X',
                    isTie: false,
                };
                await saveGameResult(result);

                return squares[a];
            }
        }

        if (!squares.includes(null)) {
            setIsTie(true);
            const result = {
                winnerName: null,
                winnerSymbol: null,
                loserName: null,
                loserSymbol: null,
                isTie: true,
            };
            await saveGameResult(result);
        }

        return null;
    };
    const sendGameResult = async (winner, loser, isTie) => {
        try {
            await fetch('http://localhost:5000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ winner, loser, tie: isTie }),
            });
        } catch (error) {
            console.error('Error saving game result:', error);
        }
    };
    
    const saveGameResult = async (result) => {
        try {
            const savedResult = await addGameResult(result);
            setGameHistory(prevHistory => [savedResult, ...prevHistory.slice(0, 9)]);
        } catch (error) {
            console.error("Failed to save game result:", error);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinningLine(null);
        setIsTie(false);
    };

    const startGame = () => {
        setGameStarted(true);
        resetGame();
    };

    const returnToStart = () => {
        setGameStarted(false);
        resetGame();
    };

    const currentPlayerName = isXNext ? playerX : playerO;
    const winnerName = winningLine ? (board[winningLine[0]] === 'X' ? playerX : playerO) : null;
    const loserName = winningLine ? (winnerName === playerX ? playerO : playerX) : null;

    const status = winnerName
        ? (
            <span>
                Winner: <span className="font-bold">{winnerName}</span>, 
                <span className="text-red-500 font-bold"> Loser: {loserName}</span>
            </span>
        )
        : isTie
            ? "It's a tie!"
            : `Next player: ${currentPlayerName}`;

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
                    <button
                        onClick={startGame}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                        disabled={!playerX || !playerO} // Disable if names are not provided
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
                    {/* Display Game History */}
                    <div className="mt-8 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Game History</h2>
                        <ul className="space-y-2">
                            {gameHistory.map((game, index) => (
                                <li key={index} className="p-2 border-b border-gray-300">
                                    {game.isTie ? (
                                        <span>Game {index + 1}: It's a tie!</span>
                                    ) : (
                                        <span>Game {index + 1}: {game.winnerName} ({game.winnerSymbol}) defeated {game.loserName} ({game.loserSymbol})</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicTacToe;
