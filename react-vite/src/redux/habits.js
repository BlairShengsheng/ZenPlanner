import Cookies from 'js-cookie';

//! --------------------------------------------------------------------
//*                        Action Types
//! --------------------------------------------------------------------
const SET_ALL_HABITS = "habits/SET_ALL_HABITS";
const SET_HABIT = "habits/SET_HABIT";
const CREATE_HABIT = "habits/CREATE_HABIT";
const EDIT_HABIT = "habits/EDIT_HABIT";
const DELETE_HABIT = "habits/DELETE_HABIT";

//! --------------------------------------------------------------------
//*                        Action Creators
//! --------------------------------------------------------------------

export const setAllHabits = (habits) => ({
  type: SET_ALL_HABITS,
  payload: habits
});

export const setHabit = (habit) => ({
  type: SET_HABIT,
  payload: habit
});

export const createHabit = (newHabit) => ({
  type: CREATE_HABIT,
  payload: newHabit
});

export const editHabit = (editedHabit) => ({
  type: EDIT_HABIT,
  payload: editedHabit
});

export const deleteHabit = (deletedHabit_id) => ({
  type: DELETE_HABIT,
  payload: deletedHabit_id
});

//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------

// Fetch all habits
export const setAllHabitsThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/habits/");
    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data)) {
        dispatch(setAllHabits(data));
      } else {
        console.error("Expected array of habits but got:", data);
      }
    } else {
      const errorData = await response.json();
      console.error("Error fetching habits", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Fetch one specific habit
export const setOneHabitThunk = (habit_id) => async (dispatch) => {
  const response = await fetch(`/api/habits/${habit_id}`);
  if (response.ok) {
    const data = await response.json();
    console.log("API Response:", data); // Debug log
    dispatch(setHabit(data));
  } else {
    console.error("Error fetching a habit");
    return { error: "Something went wrong when fetching habit data" };
  }
};

// Create one habit
export const createAHabitThunk = (habitData) => async (dispatch) => {
  const response = await fetch('/api/habits/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
    },
    body: JSON.stringify(habitData),
    credentials: 'include'
  });

  if (response.ok) {
    const newHabit = await response.json();
    console.log("Created habit:", newHabit); // Debug log

    await dispatch(createHabit(newHabit));
    await dispatch(setAllHabitsThunk()); // re-fetching to maintain consistency with backend
    return newHabit;
  } else {
    const error = await response.json();
    return { error: error.message || "Something went wrong when creating the habit" };
  }
};

// Edit a specific habit
export const editAHabitThunk = (habitData) => async (dispatch) => {
  const response = await fetch(`/api/habits/${habitData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
    },
    body: JSON.stringify(habitData),
    credentials: 'include'
  });

  if (response.ok) {
    const updateHabit = await response.json();
    dispatch(editHabit(updateHabit));
    dispatch(setAllHabitsThunk());
    return updateHabit;
  } else {
    console.error("Error editing a habit");
    return { error: "Something went wrong when updating a habit" };
  }
};

// Delete a habit
export const deleteAHabitThunk = (habit_id) => async (dispatch) => {
  const response = await fetch(`/api/habits/${habit_id}`, {
    method: 'DELETE',
    headers: {
      "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
    },
    credentials: 'include'
  });

  if (response.ok) {
    dispatch(deleteHabit(habit_id));
    dispatch(setAllHabitsThunk());
  } else {
    console.error("Error deleting a habit");
    return { error: "Something went wrong when deleting a habit" };
  }
};

//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

const initialState = {
  allHabits: {},
  singleHabit: {}
};

const habitsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_HABITS: {
      const newState = { ...state, allHabits: { ...state.allHabits } };
      action.payload.forEach((habit) => {
        newState.allHabits[habit.id] = habit;
      });
      return newState;
    }

    case SET_HABIT: {
      return {
        ...state,
        singleHabit: action.payload,
      };
    }

    case CREATE_HABIT: {
      const newState = {
        ...state,
        allHabits: { ...state.allHabits, [action.payload.id]: action.payload },
        singleHabit: action.payload
      };
      return newState;
    }

    case EDIT_HABIT: {
      return {
        ...state,
        allHabits: {
          ...state.allHabits,
          [action.payload.id]: action.payload,
        },
      };
    }

    case DELETE_HABIT: {
      const newState = { ...state };
      delete newState.allHabits[action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default habitsReducer;
