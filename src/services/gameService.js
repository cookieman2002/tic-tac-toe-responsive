// services/gameService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/games'; // Adjust the port if needed

// Fetch last 10 game results
export const fetchGameHistory = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching game history:", error);
        throw error;
    }
};

// Add a new game result
export const addGameResult = async (gameResult) => {
    try {
        const response = await axios.post(API_URL, gameResult);
        return response.data;
    } catch (error) {
        console.error("Error saving game result:", error);
        throw error;
    }
};
