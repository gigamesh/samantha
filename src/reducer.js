import {
  actions,
  gState,
  message,
  onSwitch,
  beep,
  errorBeep,
  lightPads,
  winLength
} from "./constants";

export const initState = {
  gameState: null,
  gameOn: false,
  started: false,
  playersTurn: false,
  strictMode: false,
  count: -1,
  sequence: [],
  playerSequence: [],
  countText: "--",
  seqInterval: 800,
  welcomeScreen: true,
  activePad: null
};

function reducer(state, action) {
  if (action.type === actions.CLOSE_WELCOME) {
    return { ...state, welcomeScreen: false };
  }

  if (action.type === actions.ON_SWITCH) {
    if (state.gameOn) {
      // RESET STATE EXCEPT WELCOME SCREEN (TURN OFF GAME):
      return { ...initState, welcomeScreen: false };
    }
    return { ...state, gameState: gState.ON, gameOn: true, countText: "--" };
  }

  if (action.type === actions.START) {
    return {
      ...state,
      gameState: gState.STARTED,
      started: true,
      sequence: [],
      count: 0,
      countText: "00"
    };
  }

  if (action.type === actions.INCREMENT_SEQUENCE) {
    let randomNum = Math.floor(Math.random() * 4);
    const newSequence = [...state.sequence, randomNum];
    return {
      ...state,
      gameState: gState.PLAYING_SEQUENCE,
      seqInterval: state.seqInterval * 0.95,
      sequence: newSequence
    };
  }

  if (action.type === actions.SET_ACTIVE_PAD) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === actions.SET_PLAYERS_TURN) {
    console.log("player");
    return {
      ...state,
      gameState: gState.PLAYERS_TURN,
      playerSequence: []
    };
  }
}

export default reducer;
