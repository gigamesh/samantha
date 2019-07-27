import { useReducer, useEffect } from "react";
// import { useTimeout, useInterval } from "./hooks";
import reducer, { initState } from "./reducer";

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from "@emotion/core";
import WelcomeScreen from "./WelcomeScreen";
import {
  actions as act,
  message,
  onSwitch,
  beep,
  errorBeep,
  lightPads,
  winLength,
  gState
} from "./constants";
import "./App.scss";
import styles from "./styles";

const beepSound = new Audio(beep);
const delay = time => new Promise(res => setTimeout(() => res(), time));

function App() {
  const [
    {
      gameState,
      timers,
      gameOn,
      started,
      strictMode,
      count,
      sequence,
      playerSequence,
      countText,
      seqInterval,
      welcomeScreen,
      activePad
    },
    dispatch
  ] = useReducer(reducer, initState);

  const onHandler = () => {
    dispatch({ type: act.ON_SWITCH });
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
    }
  }, [gameState]);

  ///////// INCREMENT SEQUENCE

  useEffect(() => {
    if (gameState === gState.STARTED) {
      setTimeout(() => {
        dispatch({ type: act.INCREMENT_SEQUENCE });
      }, 500);
    }
  }, [gameState]);

  ///////// PLAY SEQUENCE

  useEffect(() => {
    if (gameState === gState.PLAYING_SEQUENCE) {
      (() => {
        let i = 0;
        const padTrigger = setInterval(async () => {
          // TODO: save padTrigger to ref

          activatePad(sequence[i]);
          await delay(seqInterval - 200);
          dispatch({
            type: act.SET_ACTIVE_PAD,
            payload: { activePad: null }
          });

          // Sequence done, let the player go
          if (i === sequence.length - 1) {
            clearInterval(padTrigger);
            dispatch({ type: act.SET_PLAYERS_TURN });
          }
          i++;
        }, seqInterval);
      })();
    }
  }, [gameState, sequence, seqInterval, timers, count]);

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
    dispatch({ type: act.SET_ACTIVE_PAD, payload: { activePad, isMuted } });
    if (isMuted) return;
    let note = new Audio(lightPads[activePad].noteURL);
    note.play();
  };

  // const pieMouseUpHandler = () => {
  //   if (started && playersTurn) {
  //     setActivePad(null);
  //     if (playerSequence.length === sequence.length) {
  //       setPlayersTurn(false);
  //     }

  //     if (count === winLength) {
  //       setTimeout(forTheWin, 1000);
  //       return;
  //     }
  //     setTimeout(newSequence, 1200);
  //   }
  // };

  // const pieMouseDownHandler = e => {
  //   if (!playersTurn) return;
  //   const currentPad = Number(e.target.id);
  //   setActivePad(currentPad);

  //   const tempSequence = [...playerSequence, currentPad];

  //   let newNote;
  //   let noteURL = lightPads[currentPad].noteURL;

  //   if (checkIfCorrect(tempSequence)) {
  //     newNote = new Audio(noteURL);
  //     newNote.play();
  //     setPlayerSequence(tempSequence);
  //   } else {
  //     setPlayersTurn(false);
  //     error();
  //   }
  // };

  // const checkIfCorrect = tempSequence => {
  //   setPlayersTurn(false);
  //   let isCorrect = true;

  //   tempSequence.forEach((item, i) => {
  //     if (tempSequence[i] !== sequence[i]) {
  //       isCorrect = false;
  //     }
  //   });

  //   setPlayersTurn(true);
  //   return isCorrect;
  // };

  // const error = () => {
  //   errorBeep.play();
  //   blinky();

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

  // const blinky = () => {
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
            className={`pie upper-left ${activePad === 3 ? "active" : ""}`}
            // onMouseDown={pieMouseDownHandler}
            // onMouseUp={pieMouseUpHandler}
          />
          <div
            id="2"
            className={`pie upper-right ${activePad === 2 ? "active" : ""}`}
            // onMouseDown={pieMouseDownHandler}
            // onMouseUp={pieMouseUpHandler}
          />
        </div>
        <div className="row-wrap">
          <div
            id="0"
            className={`pie bottom-left ${activePad === 0 ? "active" : ""}`}
            // onMouseDown={pieMouseDownHandler}
            // onMouseUp={pieMouseUpHandler}
          />
          <div
            id="1"
            className={`pie bottom-right ${activePad === 1 ? "active" : ""}`}
            // onMouseDown={pieMouseDownHandler}
            // onMouseUp={pieMouseUpHandler}
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
