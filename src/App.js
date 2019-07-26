import { useState, useEffect } from "react";
import { useTimeout, useInterval } from "./hooks";

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from "@emotion/core";
import WelcomeScreen from "./WelcomeScreen";
import {
  message,
  onSwitch,
  beep,
  errorBeep,
  lightPads,
  winLength
} from "./constants";
import "./App.scss";
import styles from "./styles";

const beepSound = new Audio(beep);

function App() {
  const [timeouts, setTimeouts] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [gameOn, setGameOn] = useState(false);
  const [started, setStarted] = useState(false);
  const [playersTurn, setPlayersTurn] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [count, setCount] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [countText, setCountText] = useState("--");
  const [seqInterval, setSeqInterval] = useState(800);
  const [welcomeScreen, setWelcomeScreen] = useState(true);
  const [activePad, setActivePad] = useState(null);

  useEffect(() => {
    if (!playersTurn && gameOn) {
      let i = 0;
      let padTrigger = setInterval(() => {
        let activePad = sequence[i];

        activatePad(activePad);

        setTimeout(() => {
          setActivePad(null);
        }, seqInterval - 200);

        if (i === sequence.length - 1) {
          clearInterval(padTrigger);
          setPlayersTurn(true);
        }
        i++;
      }, seqInterval);

      intervals.push(padTrigger);
      setIntervals(intervals);
      setPlayerSequence([]);
    }
  }, [playersTurn, gameOn, sequence, seqInterval, intervals]);

  const onHandler = () => {
    if (gameOn) {
      turnOff();
    } else {
      setGameOn(true);
      setCountText("--");
      startHandler();
    }
    let switchAudio = new Audio(onSwitch);
    switchAudio.play();
  };

  const turnOff = () => {
    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);

    setWelcomeScreen(false);
    setTimeouts([]);
    setIntervals([]);
    setGameOn(false);
    setStarted(false);
    setPlayersTurn(false);
    setStrictMode(false);
    setCount(0);
    setSequence([]);
    setPlayerSequence([]);
    setCountText("--");
    setSeqInterval(800);
    setActivePad(null);
  };

  const startHandler = () => {
    if (gameOn) {
      beepSound.play();

      let start = setTimeout(newSequence, 1000);
      timeouts.push(start);
      setStarted(true);
      setTimeouts(timeouts);
      setSequence([]);
    }
  };

  const resetSequence = () => {
    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);

    setSequence([]);
    setCount(0);
    setStarted(false);
    setTimeouts([]);
    setSequence([]);

    setTimeout(() => {
      setCountText("--");
    }, 100);
  };

  const newSequence = () => {
    const newCount = count + 1;
    let randomNum = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, randomNum];

    setCount(newCount);
    setSeqInterval(seqInterval * 0.95);
    setStarted(true);
    setCountText(newCount.toString().padStart(2, "0"));
    setPlayersTurn(false);
    setSequence(newSequence);
  };

  const activatePad = (activePad, isMuted) => {
    setActivePad(activePad);
    if (isMuted) return;
    let note = new Audio(lightPads[activePad].noteURL);
    note.play();
  };

  const pieMouseUpHandler = () => {
    if (started && playersTurn) {
      setActivePad(null);
      if (playerSequence.length === sequence.length) {
        setPlayersTurn(false);
      }

      if (count === winLength) {
        setTimeout(forTheWin, 1000);
        return;
      }
      setTimeout(newSequence, 1200);
    }
  };

  const pieMouseDownHandler = e => {
    if (!playersTurn) return;
    const currentPad = Number(e.target.id);
    setActivePad(currentPad);

    const tempSequence = [...playerSequence, currentPad];

    let newNote;
    let noteURL = lightPads[currentPad].noteURL;

    if (checkIfCorrect(tempSequence)) {
      newNote = new Audio(noteURL);
      newNote.play();
      setPlayerSequence(tempSequence);
    } else {
      setPlayersTurn(false);
      error();
    }
  };

  const checkIfCorrect = tempSequence => {
    setPlayersTurn(false);
    let isCorrect = true;

    tempSequence.forEach((item, i) => {
      if (tempSequence[i] !== sequence[i]) {
        isCorrect = false;
      }
    });

    setPlayersTurn(true);
    return isCorrect;
  };

  const error = () => {
    errorBeep.play();
    blinky();

    if (strictMode) {
      setTimeout(() => {
        resetSequence();
        setTimeout(() => {
          startHandler();
        }, 1250);
      }, 1250);

      setCount(0);
      setSequence([]);
    }
  };

  const blinky = () => {
    const repeats = 8;
    let current = 0;

    let blink = setInterval(() => {
      setCountText("XX");
      setTimeout(() => {
        setCountText("");
      }, 100);
      current++;
      if (current === repeats) {
        clearInterval(blink);
        setTimeout(() => {
          setCount(count.toString().padStart(2, "0"));
          setPlayersTurn(true);
        }, 600);
      }
    }, 200);
  };

  const forTheWin = () => {
    setPlayersTurn(false);

    let i = 0;
    const winMsgInterval = setInterval(() => {
      intervals.push(winMsgInterval);
      if (i === message.length - 1) {
        i = 0;
      }
      let current = [message[i], message[i + 1]];
      current = current.join("");

      setCountText(current);

      const countTextTimeout = setTimeout(() => {
        timeouts.push(countTextTimeout);
        setCountText("");
      }, 200);
      i++;
    }, 220);

    let j = 0;
    let timer = 250;
    let isMuted = false;
    const lightShow = () => {
      if (!gameOn) return;
      activatePad(j % 4, isMuted);
      setTimeout(() => {
        if (timer > 40) {
          timer *= (1 - 0.003) ** j;
        }
        j++;
        if (j > 50) {
          isMuted = true;
        }
        lightShow();
      }, timer);
    };

    lightShow();
    setTimeouts(timeouts);
    setIntervals(intervals);
  };

  const strictHandler = () => {
    if (gameOn) {
      setStrictMode(!strictMode);

      if (!strictMode) {
        beepSound.play();
      }
    }
  };

  const closeWelcome = () => {
    setWelcomeScreen(false);
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
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
          <div
            id="2"
            className={`pie upper-right ${activePad === 2 ? "active" : ""}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
        </div>
        <div className="row-wrap">
          <div
            id="0"
            className={`pie bottom-left ${activePad === 0 ? "active" : ""}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
          <div
            id="1"
            className={`pie bottom-right ${activePad === 1 ? "active" : ""}`}
            onMouseDown={pieMouseDownHandler}
            onMouseUp={pieMouseUpHandler}
          />
        </div>
        <div className="center-circle">
          <h1 className="header">samantha</h1>
          <div className="center-middle-wrap">
            <div className="control-wrap">
              <div
                className="light start"
                onClick={startHandler}
                css={styles.startLight(started)}
              />
              <p>START</p>
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
