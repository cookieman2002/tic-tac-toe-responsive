import { useState, useEffect } from 'react';
import './App.css';
import TicTacToe from './Tictactoe';
import ConnectFour from './ConnectFour';

function App() {
    const [playerX, setPlayerX] = useState('');
    const [playerO, setPlayerO] = useState('');
    const [namesEntered, setNamesEntered] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isTie, setIsTie] = useState(false);
    const [gameMode, setGameMode] = useState('tic-tac-toe');
    const [leaderboard, setLeaderboard] = useState(() => {
        const savedLeaderboard = localStorage.getItem('leaderboard');
        return savedLeaderboard ? JSON.parse(savedLeaderboard) : [];
    });

    const handleWinner = (winnerName) => {
        setWinner(winnerName);
        setIsTie(false);
        updateLeaderboard(winnerName);
    };

    const handleTie = () => {
        setIsTie(true);
        setWinner(null);
        updateLeaderboard(null); // Handle tie case
    };

    const updateLeaderboard = (winnerName) => {
        setLeaderboard((prevLeaderboard) => {
            let updatedLeaderboard = [...prevLeaderboard];

            if (winnerName) {
                // Update the winner's score
                updatedLeaderboard = updatedLeaderboard.map((player) => {
                    if (player.name === winnerName) {
                        return { ...player, wins: player.wins + 1 };
                    }
                    return player;
                });

                // Add the winner to the leaderboard if they don't exist
                if (!updatedLeaderboard.some((player) => player.name === winnerName)) {
                    updatedLeaderboard.push({ name: winnerName, wins: 1, losses: 0, ties: 0 });
                }
            }

            if (isTie) {
                // Update the tie count for both players
                updatedLeaderboard = updatedLeaderboard.map((player) => {
                    if (player.name === playerX || player.name === playerO) {
                        return { ...player, ties: player.ties + 1 };
                    }
                    return player;
                });
            } else if (!winnerName) {
                // If no winner, both players lose
                updatedLeaderboard = updatedLeaderboard.map((player) => {
                    if (player.name === playerX) {
                        return { ...player, losses: player.losses + 1 };
                    }
                    if (player.name === playerO) {
                        return { ...player, losses: player.losses + 1 };
                    }
                    return player;
                });
            }

            // Save the updated leaderboard to local storage
            localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
            return updatedLeaderboard;
        });
    };

    const handleStart = () => {
        if (playerX.trim() && playerO.trim()) {
            setNamesEntered(true);
        } else {
            alert('Please enter names for both players.');
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Multigame Selector</h1>

            {/* Name Entry Section */}
            {!namesEntered && (
                <div className="mb-6 space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            id="playerX"
                            value={playerX}
                            onChange={(e) => setPlayerX(e.target.value)}
                            className="peer px-3 py-2 w-full border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=" "
                        />
                        <label
                            htmlFor="playerX"
                            className="absolute left-3 top-0 text-gray-500 transition-all duration-300 transform 
                                       peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-gray-400 
                                       peer-placeholder-shown:scale-100 
                                       peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-blue-500 bg-white px-1"
                        >
                            Player X Name
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            id="playerO"
                            value={playerO}
                            onChange={(e) => setPlayerO(e.target.value)}
                            className="peer px-3 py-2 w-full border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=" "
                        />
                        <label
                            htmlFor="playerO"
                            className="absolute left-3 top-0 text-gray-500 transition-all duration-300 transform 
                                       peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-gray-400 
                                       peer-placeholder-shown:scale-100 
                                       peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-blue-500 bg-white px-1"
                        >
                            Player O Name
                        </label>
                    </div>
                    <button
                        onClick={handleStart}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                        Proceed to Game Selection
                    </button>
                </div>
            )}

            {/* Game Selection Section */}
            {namesEntered && (
                <>
                    <div className="mb-4">
                        <label htmlFor="gameMode" className="mr-2 text-lg font-semibold">
                            Select Game Mode:
                        </label>
                        <select
                            id="gameMode"
                            value={gameMode}
                            onChange={(e) => setGameMode(e.target.value)}
                            className="px-3 py-1 border border-gray-500 rounded"
                        >
                            <option value="tic-tac-toe">Tic Tac Toe</option>
                            <option value="connect-four">Connect Four</option>
                        </select>
                    </div>

                    {/* Render the Selected Game */}
                    {gameMode === 'tic-tac-toe' && <TicTacToe playerX={playerX} playerO={playerO} onWinner={handleWinner} onTie={handleTie} />}
                    {gameMode === 'connect-four' && <ConnectFour player1={playerX} player2={playerO} onWinner={handleWinner} onTie={handleTie} />}
                </>
            )}

            {/* Leaderboard */}
            <div className="mt-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Wins</th>
                            <th className="px-4 py-2 border-b">Losses</th>
                            <th className="px-4 py-2 border-b">Ties</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.length > 0 ? (
                            leaderboard.map((player) => (
                                <tr key={player.name}>
                                    <td className="px-4 py-2">{player.name}</td>
                                    <td className="px-4 py-2">{player.wins}</td>
                                    <td className="px-4 py-2">{player.losses}</td>
                                    <td className="px-4 py-2">{player.ties}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-2 text-center">No players yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
