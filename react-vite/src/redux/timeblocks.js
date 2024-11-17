import Cookies from 'js-cookie';

//! --------------------------------------------------------------------
//*                        Action Types
//! --------------------------------------------------------------------
const SET_ALL_TIMEBLOCKS = "timeblocks/SET_ALL_TIMEBLOCKS";
const SET_TIMEBLOCK = "timeblocks/SET_TIMEBLOCK";
const CREATE_TIMEBLOCK = "timeblocks/CREATE_TIMEBLOCK";
const EDIT_TIMEBLOCK = "timeblocks/EDIT_TIMEBLOCK";
const DELETE_TIMEBLOCK = "timeblocks/DELETE_TIMEBLOCK";

//! --------------------------------------------------------------------
//*                        Action Creators
//! --------------------------------------------------------------------

export const setAllTimeblocks = (timeblocks) => ({
  type: SET_ALL_TIMEBLOCKS,
  payload: timeblocks
});

export const setTimeblock = (timeblock) => ({
  type: SET_TIMEBLOCK,
  payload: timeblock
});

export const createTimeblock = (newTimeblock) => ({
  type: CREATE_TIMEBLOCK,
  payload: newTimeblock
});

export const editTimeblock = (editedTimeblock) => ({
  type: EDIT_TIMEBLOCK,
  payload: editedTimeblock
});

export const deleteTimeblock = (deletedTimeblock_id) => ({
  type: DELETE_TIMEBLOCK,
  payload: deletedTimeblock_id
});

//! --------------------------------------------------------------------
//*                          Thunks
//! --------------------------------------------------------------------

// Fetch all timeblocks
export const setAllTimeblocksThunk = () => async (dispatch) => {
  try {
    const response = await fetch("/api/timeblocks/");
    if (response.ok) {
      const data = await response.json();
      
      if (Array.isArray(data)) {
        dispatch(setAllTimeblocks(data));
      } else {
        console.error("Expected array of timeblocks but got:", data);
      }
    } else {
      const errorData = await response.json();
      console.error("Error fetching timeblocks", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Fetch one specific timeblock
export const setOneTimeblockThunk = (timeblock_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/timeblocks/${timeblock_id}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(setTimeblock(data));
    } else {
      console.error("Error fetching a timeblock");
      return { error: "Something went wrong when fetching timeblock data" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error occurred" };
  }
};

// Create one timeblock
export const createTimeblockThunk = (timeblockData) => async (dispatch) => {
  try {
    const response = await fetch('/api/timeblocks/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
      },
      body: JSON.stringify(timeblockData),
      credentials: 'include'
    });

    if (response.ok) {
      const newTimeblock = await response.json();
      console.log("Created timeblock:", newTimeblock);

      await dispatch(createTimeblock(newTimeblock));
      await dispatch(setAllTimeblocksThunk());
      return newTimeblock;
    } else {
      const error = await response.json();
      return { error: error.message || "Something went wrong when creating the timeblock" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error occurred" };
  }
};

// Edit a specific timeblock
export const editTimeblockThunk = (timeblockData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/timeblocks/${timeblockData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
      },
      body: JSON.stringify(timeblockData),
      credentials: 'include'
    });

    if (response.ok) {
      const updatedTimeblock = await response.json();
      dispatch(editTimeblock(updatedTimeblock));
      dispatch(setAllTimeblocksThunk());
      return updatedTimeblock;
    } else {
      console.error("Error editing timeblock");
      return { error: "Something went wrong when updating the timeblock" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error occurred" };
  }
};

// Delete a timeblock
export const deleteTimeblockThunk = (timeblock_id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/timeblocks/${timeblock_id}`, {
      method: 'DELETE',
      headers: {
        "XSRF-TOKEN": Cookies.get("XSRF-TOKEN")
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      dispatch(deleteTimeblock(timeblock_id));
      dispatch(setAllTimeblocksThunk());
      return { message: "Timeblock deleted successfully" };
    } else {
      console.error("Error deleting timeblock");
      return { error: "Something went wrong when deleting the timeblock" };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { error: "Network error occurred" };
  }
};

//! --------------------------------------------------------------------
//*                          Reducer
//! --------------------------------------------------------------------

const initialState = {
  allTimeblocks: {},
  singleTimeblock: {}
};

const timeblockReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_TIMEBLOCKS: {
      const newState = { ...state, allTimeblocks: { ...state.allTimeblocks } };
      action.payload.forEach((timeblock) => {
        newState.allTimeblocks[timeblock.id] = timeblock;
      });
      return newState;
    }

    case SET_TIMEBLOCK: {
      return {
        ...state,
        singleTimeblock: action.payload,
      };
    }

    case CREATE_TIMEBLOCK: {
      const newState = {
        ...state,
        allTimeblocks: { ...state.allTimeblocks, [action.payload.id]: action.payload },
        singleTimeblock: action.payload
      };
      return newState;
    }

    case EDIT_TIMEBLOCK: {
      return {
        ...state,
        allTimeblocks: {
          ...state.allTimeblocks,
          [action.payload.id]: action.payload,
        },
      };
    }

    case DELETE_TIMEBLOCK: {
      const newState = { ...state };
      delete newState.allTimeblocks[action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default timeblockReducer;
