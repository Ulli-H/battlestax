import { createSlice } from "@reduxjs/toolkit";
import { generateGameId } from "../util/random";

export const initialState = {
  id: "",
  idError: "",
  idLoading: false,
};

export const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setId: (state, action) => {
        state.id = action.payload;
    },

    setIdError: (state, action) => {
        state.idError = action.payload;
    },

    setIdLoading: (state, action) => {
        state.idLoading = action.payload;
    },
  },
});

// let's export our actions and selectors
export const { setId, setIdLoading, setIdError } = slice.actions;
export const selectGame = (state) => state.game;

// let's create an asnyc action to create a new game
export const createGame = () => {
  return async (dispatch) => {
    // let's set the id state back to the defaults
    dispatch(setIdLoading(true));
    dispatch(setIdError(""));
    dispatch(setId(""));
    try {
      const gameId = generateGameId();
      const res = await fetch(`/.netlify/functions/insertGame/${gameId}`, {
        method: "POST",
        body: JSON.stringify({ state: "initialized" }),
        });
        if (!res.ok) {
            throw Error(res.statusText);
        }
      const resJson = await res.json();
        dispatch(setId(resJson.documentId));
    } catch (e) {
      dispatch(setIdError(e.message));
    }
    // let's set the id state to not loading
    dispatch(setIdLoading(false));
  };
};

export default slice.reducer;
