import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/tasks`;

export const createGoal = createAsyncThunk(
  'tasks/createGoal',
  async ({ goal, duration, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goal, duration, user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getAllGoals = createAsyncThunk(
  'tasks/getAllGoals',
  async ({ user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/displayAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getGoalById = createAsyncThunk(
  'tasks/getGoalById',
  async ({ goalId, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goal/${goalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      console.log(data);
      
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);


export const deleteGoal = createAsyncThunk(
  'tasks/deleteGoal',
  async ({ goalId, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return { ...data, goalId };
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getGoalStats = createAsyncThunk(
  'tasks/getGoalStats',
  async ({ user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getDailyTasks = createAsyncThunk(
  'tasks/getDailyTasks',
  async ({ goalId, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/daily-tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getWeeklyTasks = createAsyncThunk(
  'tasks/getWeeklyTasks',
  async ({ goalId, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/weekly-tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getMonthlyTasks = createAsyncThunk(
  'tasks/getMonthlyTasks',
  async ({ goalId, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/monthly-tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateDailyTaskStatus = createAsyncThunk(
  'tasks/updateDailyTaskStatus',
  async ({ goalId, taskIndex, status, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/daily-tasks/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIndex, status, user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return { ...data, goalId, taskType: 'daily' };
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateWeeklyTaskStatus = createAsyncThunk(
  'tasks/updateWeeklyTaskStatus',
  async ({ goalId, taskIndex, status, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/weekly-tasks/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIndex, status, user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return { ...data, goalId, taskType: 'weekly' };
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

export const updateMonthlyTaskStatus = createAsyncThunk(
  'tasks/updateMonthlyTaskStatus',
  async ({ goalId, taskIndex, status, user }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${goalId}/monthly-tasks/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIndex, status, user }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data);
      }
      
      return { ...data, goalId, taskType: 'monthly' };
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
export const addManualTask = createAsyncThunk(
  'manualTask/addManualTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add-manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Network error occurred'
      });
    }
  }
);

const initialState = {
  goals: [],
  selectedGoal: null,
  dailyTasks: [],
  weeklyTasks: [],
  monthlyTasks: [],
  manualTasks: [], 
  stats: null,
  loading: {
    createGoal: false,
    getAllGoals: false,
    getGoalById: false,
    deleteGoal: false,
    getStats: false,
    getDailyTasks: false,
    getWeeklyTasks: false,
    getMonthlyTasks: false,
    updateDailyTask: false,
    updateWeeklyTask: false,
    updateMonthlyTask: false,
    addManualTask: false 
  },
  error: null,
  successMessage: null,
  success: false 
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedGoal: (state) => {
      state.selectedGoal = null;
    },
    clearTasks: (state) => {
      state.dailyTasks = [];
      state.weeklyTasks = [];
      state.monthlyTasks = [];
      state.manualTasks = []; 
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoal.pending, (state) => {
        state.loading.createGoal = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading.createGoal = false;
        state.goals.unshift(action.payload.data);
        state.successMessage = action.payload.message;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading.createGoal = false;
        state.error = action.payload?.message || 'Failed to create goal';
      })

    builder
      .addCase(getAllGoals.pending, (state) => {
        state.loading.getAllGoals = true;
        state.error = null;
      })
      .addCase(getAllGoals.fulfilled, (state, action) => {
        state.loading.getAllGoals = false;
        state.goals = action.payload.data;
      })
      .addCase(getAllGoals.rejected, (state, action) => {
        state.loading.getAllGoals = false;
        state.error = action.payload?.message || 'Failed to fetch goals';
      })

    builder
      .addCase(getGoalById.pending, (state) => {
        state.loading.getGoalById = true;
        state.error = null;
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.loading.getGoalById = false;
        state.selectedGoal = action.payload.data;
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.loading.getGoalById = false;
        state.error = action.payload?.message || 'Failed to fetch goal';
      })

    builder
      .addCase(deleteGoal.pending, (state) => {
        state.loading.deleteGoal = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading.deleteGoal = false;
        state.goals = state.goals.filter(goal => goal._id !== action.payload.goalId);
        if (state.selectedGoal && state.selectedGoal._id === action.payload.goalId) {
          state.selectedGoal = null;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading.deleteGoal = false;
        state.error = action.payload?.message || 'Failed to delete goal';
      })

    builder
      .addCase(getGoalStats.pending, (state) => {
        state.loading.getStats = true;
        state.error = null;
      })
      .addCase(getGoalStats.fulfilled, (state, action) => {
        state.loading.getStats = false;
        state.stats = action.payload.data;
      })
      .addCase(getGoalStats.rejected, (state, action) => {
        state.loading.getStats = false;
        state.error = action.payload?.message || 'Failed to fetch stats';
      })

    builder
      .addCase(getDailyTasks.pending, (state) => {
        state.loading.getDailyTasks = true;
        state.error = null;
      })
      .addCase(getDailyTasks.fulfilled, (state, action) => {
        state.loading.getDailyTasks = false;
        state.dailyTasks = action.payload.data.dailyTasks;
      })
      .addCase(getDailyTasks.rejected, (state, action) => {
        state.loading.getDailyTasks = false;
        state.error = action.payload?.message || 'Failed to fetch daily tasks';
      })

    builder
      .addCase(getWeeklyTasks.pending, (state) => {
        state.loading.getWeeklyTasks = true;
        state.error = null;
      })
      .addCase(getWeeklyTasks.fulfilled, (state, action) => {
        state.loading.getWeeklyTasks = false;
        state.weeklyTasks = action.payload.data.weeklyTasks;
      })
      .addCase(getWeeklyTasks.rejected, (state, action) => {
        state.loading.getWeeklyTasks = false;
        state.error = action.payload?.message || 'Failed to fetch weekly tasks';
      })

    builder
      .addCase(getMonthlyTasks.pending, (state) => {
        state.loading.getMonthlyTasks = true;
        state.error = null;
      })
      .addCase(getMonthlyTasks.fulfilled, (state, action) => {
        state.loading.getMonthlyTasks = false;
        state.monthlyTasks = action.payload.data.monthlyTasks;
      })
      .addCase(getMonthlyTasks.rejected, (state, action) => {
        state.loading.getMonthlyTasks = false;
        state.error = action.payload?.message || 'Failed to fetch monthly tasks';
      })

    builder
      .addCase(updateDailyTaskStatus.pending, (state) => {
        state.loading.updateDailyTask = true;
        state.error = null;
      })
      .addCase(updateDailyTaskStatus.fulfilled, (state, action) => {
        state.loading.updateDailyTask = false;
        const { taskIndex, newStatus } = action.payload.data;
        if (state.dailyTasks[taskIndex]) {
          state.dailyTasks[taskIndex].status = newStatus;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateDailyTaskStatus.rejected, (state, action) => {
        state.loading.updateDailyTask = false;
        state.error = action.payload?.message || 'Failed to update daily task';
      })

    builder
      .addCase(updateWeeklyTaskStatus.pending, (state) => {
        state.loading.updateWeeklyTask = true;
        state.error = null;
      })
      .addCase(updateWeeklyTaskStatus.fulfilled, (state, action) => {
        state.loading.updateWeeklyTask = false;
        const { taskIndex, newStatus } = action.payload.data;
        if (state.weeklyTasks[taskIndex]) {
          state.weeklyTasks[taskIndex].status = newStatus;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateWeeklyTaskStatus.rejected, (state, action) => {
        state.loading.updateWeeklyTask = false;
        state.error = action.payload?.message || 'Failed to update weekly task';
      })

    builder
      .addCase(updateMonthlyTaskStatus.pending, (state) => {
        state.loading.updateMonthlyTask = true;
        state.error = null;
      })
      .addCase(updateMonthlyTaskStatus.fulfilled, (state, action) => {
        state.loading.updateMonthlyTask = false;
        const { taskIndex, newStatus } = action.payload.data;
        if (state.monthlyTasks[taskIndex]) {
          state.monthlyTasks[taskIndex].status = newStatus;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateMonthlyTaskStatus.rejected, (state, action) => {
        state.loading.updateMonthlyTask = false;
        state.error = action.payload?.message || 'Failed to update monthly task';
      })

    builder
      .addCase(addManualTask.pending, (state) => {
        state.loading.addManualTask = true; 
        state.error = null;
        state.success = false;
      })
      .addCase(addManualTask.fulfilled, (state, action) => {
        state.loading.addManualTask = false; 
        state.success = true;
        state.successMessage = action.payload.message; 
        state.goals.unshift(action.payload.data);
      })
      .addCase(addManualTask.rejected, (state, action) => {
        state.loading.addManualTask = false;
        state.error = action.payload?.message || 'Failed to add manual task';
        state.success = false;
      });
  }
});

export const { clearError, clearSuccessMessage, clearSelectedGoal, clearTasks, clearSuccess } = taskSlice.actions;
export default taskSlice.reducer;