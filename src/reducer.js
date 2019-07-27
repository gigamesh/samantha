import {
  actions as act,
  gameState as gState,
  message,
  onSwitch,
  beep,
  errorBeep,
  lightPads,
  winLength,
} from './constants';

export const initState = {
  gameState: null,
  gameOn: false,
  started: false,
  playersTurn: false,
  strictMode: false,
  count: -1,
  sequence: [],
  playerSequence: [],
  countText: '--',
  seqInterval: 800,
  welcomeScreen: true,
  activePad: null,
};

function reducer(state, action) {
  if (action.type === act.CLOSE_WELCOME) {
    return { ...state, welcomeScreen: false };
  }

  if (action.type === act.TURN_ON) {
    if (state.gameOn) {
      // RESET STATE EXCEPT WELCOME SCREEN (TURN OFF GAME):
      return { ...initState, welcomeScreen: false };
    }
    return { ...state, gameState: gState.ON, gameOn: true, countText: '--' };
  }

  if (action.type === act.START) {
    return {
      ...state,
      gameState: gState.STARTED,
      started: true,
      sequence: [],
      count: 0,
      countText: '00',
    };
  }

  if (action.type === act.INCREMENT_SEQUENCE) {
    let randomNum = Math.floor(Math.random() * 4);
    const newSequence = [...state.sequence, randomNum];
    return {
      ...state,
      gameState: gState.PLAYING_SEQUENCE,
      seqInterval: state.seqInterval * 0.95,
      sequence: newSequence,
    };
  }

  if (action.type === act.SET_ACTIVE_PAD) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === act.SET_PLAYERS_TURN) {
    return {
      ...state,
      gameState: gState.PLAYERS_TURN,
      playerSequence: [],
    };
  }

  if (action.type === act.SET_ERROR) {
    return {
      ...state,
      gameState: gState.ERROR,
    };
  }

  if (action.type === act.STORE_PLAYER_SEQUENCE) {
    return {
      ...state,
      ...action.payload,
    };
  }
}

export default reducer;
