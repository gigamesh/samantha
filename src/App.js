import { useReducer, useEffect, useRef } from 'react';
import reducer, { initState } from './reducer';

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
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
      countText,
      seqInterval,
      welcomeScreen,
      activePad,
    },
    dispatch,
  ] = useReducer(reducer, initState);

  const timers = useRef([]);

  const onHandler = () => {
    dispatch({ type: act.TURN_ON });
    let switchAudio = new Audio(onSwitch);
    switchAudio.play();
  };

  ///////// START GAME

  useEffect(() => {
    if (gameState === gState.ON) {
      setTimeout(() => {
        dispatch({ type: act.START });
        beepSound.play();
      }, 500);
    } else {
      dispatch({ type: act.TURN_OFF });
      timers.current.forEach(timer => {
        clearTimeout(timer);
        clearInterval(timer);
      });
    }
  }, [gameState]);

  ///////// INCREMENT SEQUENCE

  useEffect(() => {
    if (gameState === gState.STARTED) {
      const started = setTimeout(() => {
        dispatch({ type: act.INCREMENT_SEQUENCE });
      }, 500);
      timers.current.push(started);
    }
  }, [gameState]);

  ///////// PLAY SEQUENCE

  useEffect(() => {
    if (gameState === gState.PLAYING_SEQUENCE) {
      (() => {
        let i = 0;
        const padTrigger = setInterval(async () => {
          timers.current.push(padTrigger);
          // TODO: save padTrigger to ref

          activatePad(sequence[i]);
          const turnOffPad = setTimeout(() => {
            timers.current.push(turnOffPad);

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
        }, seqInterval);
      })();
    }
  }, [gameState, sequence, seqInterval, count]);

  // const resetSequence = () => {
  //   timers.forEach(timer => {
  //     clearTimeout(timer);
  //     clearInterval(timer);
  //   });

  //   setSequence([]);
  //   setCount(0);
  //   setStarted(false);
  //   setTimers([]);
  //   setSequence([]);

  //   setTimeout(() => {
  //     setCountText("--");
  //   }, 100);
  // };

  // const newSequence = () => {
  //   const newCount = count + 1;
  //   let randomNum = Math.floor(Math.random() * 4);
  //   const newSequence = [...sequence, randomNum];

  //   setCount(newCount);
  //   setSeqInterval(seqInterval * 0.95);
  //   setStarted(true);
  //   setCountText(newCount.toString().padStart(2, "0"));
  //   setPlayersTurn(false);
  //   setSequence(newSequence);
  // };

  const activatePad = (activePad, isMuted) => {
    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad } });
    if (isMuted) return;
    let note = new Audio(lightPads[activePad].noteURL);
    note.play();
  };

  const pieMouseUpHandler = async () => {
    if (gameState !== gState.PLAYERS_TURN) return;

    if (count === winLength) {
      const pause = setTimeout(() => {
        timers.current.push(pause);
        console.log('forTheWin TODO');
        // forTheWin()
      }, 1000);
      return;
    }

    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad: null } });
    if (playerSequence.length === sequence.length) {
      const pause = setTimeout(() => {
        timers.current.push(pause);
        dispatch({ type: act.INCREMENT_SEQUENCE });
      }, 1200);
    }
  };

  const pieMouseDownHandler = e => {
    if (gameState !== gState.PLAYERS_TURN) return;

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
      console.log('error! (TO DO)');
      // error();
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

  // const error = () => {
  //   dispatch({type: act.SET_ERROR});
  //   errorBeep.play();

  //   const repeats = 8;
  //   let current = 0;

  //   let blink = setInterval(() => {
  //     setCountText("XX");
  //     setTimeout(() => {
  //       setCountText("");
  //     }, 100);
  //     current++;
  //     if (current === repeats) {
  //       clearInterval(blink);
  //       setTimeout(() => {
  //         setCount(count.toString().padStart(2, "0"));
  //         setPlayersTurn(true);
  //       }, 600);
  //     }
  //   }, 200);

  //   if (strictMode) {
  //     setTimeout(() => {
  //       resetSequence();
  //       setTimeout(() => {
  //         startHandler();
  //       }, 1250);
  //     }, 1250);

  //     setCount(0);
  //     setSequence([]);
  //   }
  // };

  // const forTheWin = () => {
  //   setPlayersTurn(false);

  //   let i = 0;
  //   const winMsgInterval = setInterval(() => {
  //     timers.push(winMsgInterval);
  //     if (i === message.length - 1) {
  //       i = 0;
  //     }
  //     let current = [message[i], message[i + 1]];
  //     current = current.join("");

  //     setCountText(current);

  //     const countTextTimeout = setTimeout(() => {
  //       timers.push(countTextTimeout);
  //       setCountText("");
  //     }, 200);
  //     i++;
  //   }, 220);

  //   let j = 0;
  //   let timer = 250;
  //   let isMuted = false;
  //   const lightShow = () => {
  //     if (!gameOn) return;
  //     activatePad(j % 4, isMuted);
  //     setTimeout(() => {
  //       if (timer > 40) {
  //         timer *= (1 - 0.003) ** j;
  //       }
  //       j++;
  //       if (j > 50) {
  //         isMuted = true;
  //       }
  //       lightShow();
  //     }, timer);
  //   };

  //   lightShow();
  //   setTimers(timers);
  //   setTimers(timers);
  // };

  // const strictHandler = () => {
  //   if (gameOn) {
  //     setStrictMode(!strictMode);

  //     if (!strictMode) {
  //       beepSound.play();
  //     }
  //   }
  // };

  const closeWelcome = () => {
    dispatch({ type: act.CLOSE_WELCOME });
  };

  return welcomeScreen ? (
    <WelcomeScreen closeWelcome={closeWelcome} />
  ) : (
    <div className="App">
      <div className="circle-outer">
        <div className="row-wrap">
          <div
            id="3"
            className={`pie upper-left ${activePad === 3 ? 'active' : ''}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
          <div
            id="2"
            className={`pie upper-right ${activePad === 2 ? 'active' : ''}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
        </div>
        <div className="row-wrap">
          <div
            id="0"
            className={`pie bottom-left ${activePad === 0 ? 'active' : ''}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
          <div
            id="1"
            className={`pie bottom-right ${activePad === 1 ? 'active' : ''}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
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
                <p>{countText}</p>
              </div>
              <p>COUNT</p>
            </div>
            <div className="control-wrap">
              <div
                className="light strict"
                css={styles.strictLight(strictMode)}
                // onClick={strictHandler}
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
