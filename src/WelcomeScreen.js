import React from "react";
import { winLength } from "./constants";
import "./App.scss";

export default function WelcomeScreen(props) {
  return (
    <div className="welcome-screen-container">
      <div className="content">
        <h1 className="header">samantha</h1>
        <p>
          Samantha is a multi-player memory game. Repeat the sequence of
          sound/colors. If you can successfully remember {winLength} steps of
          the sequence, you win!
        </p>
        {/* <p>
          Samantha is a multi-player memory game. Each player takes turns adding
          to a sequence, and the player who can remember the longest sequence is
          the winner.
        </p> */}
        {/* <h1 className="header">join a game</h1> */}
        <div className="button-container">
          <button className="new-game-btn" onClick={props.closeWelcome}>
            start new game
          </button>
        </div>
      </div>
    </div>
  );
}
