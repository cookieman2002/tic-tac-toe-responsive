import React from 'react';

const Leaderboard = ({ leaderboard }) => {
    return (
        <div>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Ties</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((player) => (
                        <tr key={player.name}>
                            <td>{player.name}</td>
                            <td>{player.wins}</td>
                            <td>{player.losses}</td>
                            <td>{player.ties}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
