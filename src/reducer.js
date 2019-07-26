const initialState = {
  
}

function reducer(state, action) {
  if (action.type === "GAME_ON") {
    if (state.gameOn) {
      return { ...state, isClickable: true, lastProgress: state.progress };
    }
    return {
      ...state,
      progress: state.progress + 1,
      lastProgress: state.progress
    };
  }
  if (action.type === "RESET") {
    return {
      isClickable: false,
      count: state.count + 1,
      progress: 0,
      lastProgress: state.progress
    };
  }
},