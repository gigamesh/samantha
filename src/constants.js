export const actions = {
  CLOSE_WELCOME: 'CLOSE_WELCOME',
  TURN_ON: 'TURN_ON',
  TURN_OFF: 'TURN_OFF',
  START: 'START',
  INCREMENT_SEQUENCE: 'INCREMENT_SEQUENCE',
  SET_ACTIVE_PAD: 'SET_ACTIVE_PAD',
  SET_PLAYERS_TURN: 'SET_PLAYERS_TURN',
  SET_ERROR: 'SET_ERROR',
  STORE_PLAYER_SEQUENCE: 'STORE_PLAYER_SEQUENCE',
};

export const gameState = {
  ON: 'ON',
  STARTED: 'STARTED',
  ERROR: 'ERROR',
  PLAYING_SEQUENCE: 'PLAYING_SEQUENCE',
  PLAYERS_TURN: 'PLAYERS_TURN',
};

export const message = 'YOU WIN!!   '.split('');
export const winLength = 20;
export const onSwitch =
  'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/offswitch.mp3';
export const beep =
  'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/beep.mp3';
export const errorBeep = new Audio(
  'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/errorBeep.mp3'
);
export const lightPads = [
  {
    class: '.bottom-left',
    color: '#4abeff',
    noteURL:
      'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/note1.mp3',
  },
  {
    class: '.bottom-right',
    color: '#f74343',
    noteURL:
      'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/note2.mp3',
  },
  {
    class: '.upper-right',
    color: '#6bf26b',
    noteURL:
      'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/note3.mp3',
  },
  {
    class: '.upper-left',
    color: '#f9e920',
    noteURL:
      'https://s3-us-west-1.amazonaws.com/mattmasurka/random/fCC+samantha/note4.mp3',
  },
];
