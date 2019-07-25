import React from "react";

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
const initState = {
  timeouts: [],
  intervals: [],
  gameOn: false,
  started: false,
  playersTurn: false,
  strictMode: false,
  count: 0,
  sequence: [],
  playerSequence: [],
  countText: "--",
  interval: 800,
  welcomeScreen: true,
  activePad: null
};

class App extends React.Component {
  state = { ...initState };

  onHandler = () => {
    const { gameOn } = this.state;
    if (gameOn) {
      this.turnOff();
    } else {
      this.setState({ gameOn: true, countText: "--" });
      this.startHandler();
    }
    let switchAudio = new Audio(onSwitch);
    switchAudio.play();
  };

  turnOff = () => {
    const { timeouts, intervals } = this.state;

    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);

    this.setState({ ...initState, welcomeScreen: false });
  };

  startHandler = () => {
    const { gameOn, timeouts } = this.state;
    if (gameOn) {
      beepSound.play();

      let start = setTimeout(this.newSequence, 1000);
      timeouts.push(start);
      this.setState({ started: true, timeouts, sequence: [] });
    }
  };

  resetSequence = () => {
    const { timeouts, intervals } = this.state;

    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);

    this.setState({
      sequence: [],
      count: 0,
      started: false,
      timeouts: [],
      intervals: []
    });

    setTimeout(() => {
      this.setState({ countBox: "--" });
    }, 100);
  };

  newSequence = () => {
    const { count, sequence, interval } = this.state;
    const newCount = count + 1;
    let randomNum = Math.floor(Math.random() * 4);
    sequence.push(randomNum);

    this.setState(
      {
        count: count + 1,
        interval: interval * 0.95,
        started: true,
        countText: newCount.toString().padStart(2, "0"),
        playersTurn: false,
        sequence
      },
      () => this.playSequence()
    );
  };

  playSequence = () => {
    const { sequence, intervals, interval } = this.state;

    let i = 0;

    let padTrigger = setInterval(() => {
      let activePad = sequence[i];

      this.activatePad(activePad);

      setTimeout(() => {
        this.setState({ activePad: null });
      }, interval - 200);

      if (i === sequence.length - 1) {
        clearInterval(padTrigger);
        this.setState({ playersTurn: true });
      }
      i++;
    }, interval);

    intervals.push(padTrigger);
    this.setState({ intervals, playerSequence: [] });
  };

  activatePad = (activePad, isMuted) => {
    this.setState({ activePad }, () => {
      if (isMuted) return;
      let note = new Audio(lightPads[activePad].noteURL);
      note.play();
    });
  };

  pieMouseUpHandler = () => {
    const {
      started,
      playersTurn,
      playerSequence,
      sequence,
      count
    } = this.state;

    if (started && playersTurn) {
      this.setState({ activePad: null }, () => {
        if (playerSequence.length === sequence.length) {
          this.setState({
            playersTurn: false
          });

          if (count === winLength) {
            setTimeout(this.forTheWin, 1000);
            return;
          }
          setTimeout(this.newSequence, 1200);
        }
      });
    }
  };

  pieMouseDownHandler = e => {
    const { playerSequence: tempSequence, playersTurn } = this.state;
    if (!playersTurn) return;

    const activePad = Number(e.target.id);
    this.setState({ activePad });
    let newNote;
    let noteURL = lightPads[activePad].noteURL;

    tempSequence.push(activePad);

    if (this.checkIfCorrect(tempSequence)) {
      newNote = new Audio(noteURL);
      newNote.play();
      this.setState({ playerSequence: tempSequence, activePad });
    } else {
      this.setState({ playersTurn: false }, this.error);
    }
  };

  checkIfCorrect = tempSequence => {
    const { sequence } = this.state;
    this.setState({ playersTurn: false });
    let isCorrect = true;

    tempSequence.forEach((item, i) => {
      if (tempSequence[i] !== sequence[i]) {
        isCorrect = false;
      }
    });

    this.setState({ playersTurn: true });
    return isCorrect;
  };

  error = () => {
    const { strictMode } = this.state;
    errorBeep.play();
    this.blinky();

    if (strictMode) {
      setTimeout(() => {
        this.resetSequence();
        setTimeout(() => {
          this.startHandler();
        }, 1250);
      }, 1250);

      this.setState({ sequence: [], count: 0 });
    }
  };

  blinky = () => {
    const { count } = this.state;
    const repeats = 8;
    let current = 0;

    let blink = setInterval(() => {
      this.setState({ countText: "XX" }, () => {
        setTimeout(() => {
          this.setState({ countText: "" });
        }, 100);
        current++;
        if (current === repeats) {
          clearInterval(blink);
          setTimeout(() => {
            console.log("about to play sequence....");
            this.setState({
              countText: count.toString().padStart(2, "0"),
              playersTurn: true
            });
            this.playSequence();
          }, 600);
        }
      });
    }, 200);
  };

  forTheWin = () => {
    const { intervals, timeouts } = this.state;

    let i = 0;
    const winMsgInterval = setInterval(() => {
      intervals.push(winMsgInterval);
      if (i === message.length - 1) {
        i = 0;
      }
      let current = [message[i], message[i + 1]];
      current = current.join("");

      this.setState({ countText: current });

      const countTextTimeout = setTimeout(() => {
        timeouts.push(countTextTimeout);
        this.setState({ countText: "" });
      }, 200);
      i++;
    }, 220);

    let j = 0;
    let timer = 250;
    let isMuted = false;
    const lightShow = () => {
      const { gameOn } = this.state;

      if (!gameOn) return;
      this.activatePad(j % 4, isMuted);
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

    this.setState({ playersTurn: false, timeouts, intervals });
  };

  strictHandler = () => {
    const { strictMode, gameOn } = this.state;

    if (gameOn) {
      this.setState({ strictMode: !strictMode });

      if (!strictMode) {
        beepSound.play();
      }
    }
  };

  closeWelcome = () => {
    this.setState({ welcomeScreen: false });
  };

  render() {
    const {
      gameOn,
      countText,
      started,
      activePad,
      strictMode,
      welcomeScreen
    } = this.state;

    return welcomeScreen ? (
      <WelcomeScreen closeWelcome={this.closeWelcome} />
    ) : (
      <div className="App">
        <div className="circle-outer">
          <div className="row-wrap">
            <div
              id="3"
              className={`pie upper-left ${activePad === 3 ? "active" : ""}`}
              onMouseDown={this.pieMouseDownHandler}
              onMouseUp={this.pieMouseUpHandler}
            />
            <div
              id="2"
              className={`pie upper-right ${activePad === 2 ? "active" : ""}`}
              onMouseDown={this.pieMouseDownHandler}
              onMouseUp={this.pieMouseUpHandler}
            />
          </div>
          <div className="row-wrap">
            <div
              id="0"
              className={`pie bottom-left ${activePad === 0 ? "active" : ""}`}
              onMouseDown={this.pieMouseDownHandler}
              onMouseUp={this.pieMouseUpHandler}
            />
            <div
              id="1"
              className={`pie bottom-right ${activePad === 1 ? "active" : ""}`}
              onMouseDown={this.pieMouseDownHandler}
              onMouseUp={this.pieMouseUpHandler}
            />
          </div>
          <div className="center-circle">
            <h1 className="header">samantha</h1>
            <div className="center-middle-wrap">
              <div className="control-wrap">
                <div
                  className="light start"
                  onClick={this.startHandler}
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
                  onClick={this.strictHandler}
                />
                <p>STRICT</p>
              </div>
            </div>
            <div className="on-wrap">
              <div
                className="on-toggle-outer"
                css={styles.onButton(gameOn)}
                onClick={this.onHandler}
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
}

export default App;
