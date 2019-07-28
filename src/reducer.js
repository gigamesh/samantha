import { actions as act, gameState as gState } from './constants';

export const initState = {
  gameState: null,
  gameOn: false,
  started: false,
  playersTurn: false,
  strictMode: false,
  count: 0,
  sequence: [],
  playerSequence: [],
  ledDisplay: '--',
  seqInterval: 800,
  welcomeScreen: true,
  activePad: null,
  isMobile: false,
};

function reducer(state, action) {
  if (action.type === act.CLOSE_WELCOME) {
    return { ...state, welcomeScreen: false };
  }

  if (action.type === act.TURN_ON) {
    return { ...state, gameState: gState.ON, gameOn: true, ledDisplay: '--' };
  }

  if (action.type === act.TURN_OFF) {
    return { ...initState, welcomeScreen: false };
  }

  if (action.type === act.START) {
    return {
      ...state,
      gameState: gState.STARTED,
      started: true,
      sequence: [],
      count: 0,
      ledDisplay: '00',
    };
  }

  if (action.type === act.INCREMENT_SEQUENCE) {
    let randomNum = Math.floor(Math.random() * 4);
    const newSequence = [...state.sequence, randomNum];
    return {
      ...state,
      gameState: gState.PAUSED,
      seqInterval: state.seqInterval * 0.95,
      count: state.count + 1,
      sequence: newSequence,
    };
  }

  if (action.type === act.PLAY_SEQUENCE) {
    return {
      ...state,
      gameState: gState.PLAYING_SEQUENCE,
      ledDisplay: state.count.toString().padStart(2, '0'),
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
      ledDisplay: state.count.toString().padStart(2, '0'),
      playerSequence: [],
    };
  }

  if (action.type === act.SET_ERROR) {
    return {
      ...state,
      gameState: gState.ERROR,
      activePad: null,
    };
  }

  if (action.type === act.STORE_PLAYER_SEQUENCE) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === act.UPDATE_DISPLAY) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === act.RESET_SEQUENCE) {
    return {
      ...state,
      count: 0,
      sequence: [],
      playerSequence: [],
    };
  }

  if (action.type === act.PAUSE) {
    return {
      ...state,
      gameState: gState.PAUSED,
    };
  }

  if (action.type === act.SET_WIN) {
    return {
      ...state,
      gameState: gState.WIN_SEQUENCE,
    };
  }

  if (action.type === act.TOGGLE_STRICT) {
    return {
      ...state,
      strictMode: !state.strictMode,
    };
  }
}

export default reducer;
