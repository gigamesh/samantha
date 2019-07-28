import { useReducer, useEffect, useRef } from 'react';
import reducer, { initState } from './reducer';

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { isMobile } from 'react-device-detect';
import WelcomeScreen from './WelcomeScreen';
import {
  actions as act,
  message,
  onSwitch,
  beep,
  errorBeep,
  lightPads,
  winLength,
  gameState as gState,
} from './constants';
import './App.scss';
import styles from './styles';

const beepSound = new Audio(beep);

function App() {
  const [
    {
      gameState,
      gameOn,
      started,
      strictMode,
      count,
      sequence,
      playerSequence,
      ledDisplay,
      seqInterval,
      welcomeScreen,
      activePad,
    },
    dispatch,
  ] = useReducer(reducer, initState);

  const timers = useRef([]);

  const onHandler = () => {
    let switchAudio = new Audio(onSwitch);
    switchAudio.play();

    if (gameState) {
      timers.current.forEach(timer => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      dispatch({ type: act.TURN_OFF });
    } else {
      dispatch({ type: act.TURN_ON });
    }
  };

  /////////// START GAME

  useEffect(() => {
    if (gameState === gState.ON) {
      const pause = setTimeout(() => {
        dispatch({ type: act.START });
        beepSound.play();
      }, 500);
      timers.current.push(pause);
    }
  }, [gameState]);

  /////////// INCREMENT SEQUENCE

  useEffect(() => {
    if (gameState === gState.STARTED) {
      dispatch({ type: act.INCREMENT_SEQUENCE });
      const started = setTimeout(() => {
        dispatch({ type: act.PLAY_SEQUENCE });
      }, 500);
      timers.current.push(started);
    }
  }, [gameState]);

  /////////// PLAY SEQUENCE

  useEffect(() => {
    if (gameState === gState.PLAYING_SEQUENCE) {
      (() => {
        let i = 0;
        const padTrigger = setInterval(async () => {
          activatePad(sequence[i]);
          const turnOffPad = setTimeout(() => {
            dispatch({
              type: act.SET_ACTIVE_PAD,
              payload: { activePad: null },
            });

            // Sequence done, let the player go
            if (i === sequence.length - 1) {
              clearInterval(padTrigger);
              dispatch({ type: act.SET_PLAYERS_TURN });
            }
            i++;
          }, seqInterval - 200);
          timers.current.push(turnOffPad);
        }, seqInterval);

        timers.current.push(padTrigger);
      })();
    }
  }, [gameState, sequence, seqInterval, count]);

  const activatePad = (activePad, isMuted) => {
    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad } });
    if (isMuted) return;
    let note = new Audio(lightPads[activePad].noteURL);
    note.play();
  };

  const pieMouseUpHandler = async e => {
    if (
      gameState !== gState.PLAYERS_TURN ||
      (isMobile && e.type === 'mouseup')
    ) {
      return;
    }

    if (playerSequence.length === winLength) {
      dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad: null } });
      const pause = setTimeout(() => {
        forTheWin();
      }, 1000);

      timers.current.push(pause);
      return;
    }

    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad: null } });

    if (playerSequence.length === sequence.length) {
      dispatch({ type: act.INCREMENT_SEQUENCE });
      const pause = setTimeout(() => {
        dispatch({ type: act.PLAY_SEQUENCE });
      }, 1200);
      timers.current.push(pause);
    }
  };

  const pieMouseDownHandler = e => {
    if (
      gameState !== gState.PLAYERS_TURN ||
      (isMobile && e.type === 'mousedown')
    ) {
      return;
    }

    const currentPad = Number(e.target.id);
    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad: currentPad } });

    const tempSequence = [...playerSequence, currentPad];

    let newNote;
    let noteURL = lightPads[currentPad].noteURL;

    if (checkIfCorrect(tempSequence)) {
      newNote = new Audio(noteURL);
      newNote.play();
      dispatch({
        type: act.STORE_PLAYER_SEQUENCE,
        payload: { playerSequence: tempSequence },
      });
    } else {
      error();
    }
  };

  const checkIfCorrect = tempSequence => {
    let isCorrect = true;

    tempSequence.forEach((item, i) => {
      if (tempSequence[i] !== sequence[i]) {
        isCorrect = false;
      }
    });
    return isCorrect;
  };

  const error = () => {
    dispatch({ type: act.SET_ERROR });
    errorBeep.play();

    const REPEATS = 8;
    let currentCount = 0;

    let blink = setInterval(() => {
      dispatch({ type: act.UPDATE_DISPLAY, payload: { ledDisplay: '' } });
      const pause = setTimeout(() => {
        dispatch({ type: act.UPDATE_DISPLAY, payload: { ledDisplay: 'XX' } });
      }, 100);
      timers.current.push(pause);
      currentCount++;
      if (currentCount === REPEATS) {
        clearInterval(blink);

        if (strictMode) {
          dispatch({ type: act.RESET_SEQUENCE });
          dispatch({ type: act.INCREMENT_SEQUENCE });
          const pause = setTimeout(() => {
            dispatch({ type: act.PLAY_SEQUENCE });
          }, 600);
          timers.current.push(pause);
        } else {
          const finish = setTimeout(() => {
            dispatch({ type: act.PLAY_SEQUENCE });
          }, 600);
          timers.current.push(finish);
        }
      }
    }, 200);
  };

  const forTheWin = () => {
    dispatch({ type: act.SET_WIN });

    let i = 0;
    const winMsgInterval = setInterval(() => {
      if (i === message.length - 1) {
        i = 0;
      }
      let current = [message[i], message[i + 1]];
      current = current.join('');

      dispatch({ type: act.UPDATE_DISPLAY, payload: { ledDisplay: current } });

      const ledDisplayTimeout = setTimeout(() => {
        dispatch({ type: act.UPDATE_DISPLAY, payload: { ledDisplay: '' } });
      }, 200);
      timers.current.push(ledDisplayTimeout);
      i++;
    }, 220);
    timers.current.push(winMsgInterval);

    let j = 0;
    let timer = 250;
    let isMuted = false;

    const lightShow = () => {
      activatePad(j % 4, isMuted);
      const pause = setTimeout(() => {
        if (timer > 40) {
          timer *= (1 - 0.003) ** j;
        }
        j++;
        if (j > 32) {
          isMuted = true;
        }
        lightShow();
      }, timer);
      timers.current.push(pause);
    };

    lightShow();
  };

  const strictHandler = () => {
    if (gameOn) {
      beepSound.load();
      if (!strictMode) {
        beepSound.play();
      }
      dispatch({ type: act.TOGGLE_STRICT });
    }
  };

  const closeWelcome = () => {
    dispatch({ type: act.CLOSE_WELCOME });
  };

  return welcomeScreen ? (
    <WelcomeScreen closeWelcome={closeWelcome} />
  ) : (
    <div className="App">
      <div className="circle-outer">
        <div className="row-wrap">
          {lightPads.map(pad => (
            <div
              key={pad.id}
              id={pad.id}
              className={`pie ${pad.class} ${
                activePad === pad.id ? 'active' : ''
              }`}
              onTouchStart={pieMouseDownHandler}
              onTouchEnd={pieMouseUpHandler}
              onMouseDown={pieMouseDownHandler}
              onMouseUp={pieMouseUpHandler}
            />
          ))}
        </div>
        <div className="center-circle">
          <h1 className="header">samantha</h1>
          <div className="center-middle-wrap">
            <div className="control-wrap">
              <div className="light start" css={styles.startLight(started)} />
              <p className="start-text">START</p>
            </div>
            <div className="control-wrap">
              <div className="count-box" css={styles.countBox(gameOn)}>
                <p>{ledDisplay}</p>
              </div>
              <p>COUNT</p>
            </div>
            <div className="control-wrap">
              <div
                className="light strict"
                css={styles.strictLight(strictMode)}
                onClick={strictHandler}
              />
              <p>STRICT</p>
            </div>
          </div>
          <div className="on-wrap">
            <div
              className="on-toggle-outer"
              css={styles.onButton(gameOn)}
              onClick={onHandler}
            >
              <div className="on-toggle-inner" />
            </div>
            <p>ON</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
