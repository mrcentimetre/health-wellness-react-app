import axios from 'axios';
import { API_NINJAS_KEY } from '@env';

const API_KEY = API_NINJAS_KEY;
const BASE_URL = 'https://api.api-ninjas.com/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const exerciseAPI = {
  // Search exercises with filters
  searchExercises: async (params = {}) => {
    try {
      const response = await apiClient.get('/exercises', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Get exercises by muscle group
  getExercisesByMuscle: async (muscle) => {
    try {
      const response = await apiClient.get('/exercises', {
        params: { muscle },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by muscle:', error);
      throw error;
    }
  },

  // Get exercises by type
  getExercisesByType: async (type) => {
    try {
      const response = await apiClient.get('/exercises', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by type:', error);
      throw error;
    }
  },

  // Get exercises by difficulty
  getExercisesByDifficulty: async (difficulty) => {
    try {
      const response = await apiClient.get('/exercises', {
        params: { difficulty },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by difficulty:', error);
      throw error;
    }
  },

  // Search exercises by name
  searchByName: async (name) => {
    try {
      const response = await apiClient.get('/exercises', {
        params: { name },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching exercises by name:', error);
      throw error;
    }
  },
};
