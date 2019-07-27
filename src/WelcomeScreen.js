import React from 'react';
import { winLength } from './constants';
import './App.scss';

export default function WelcomeScreen(props) {
  return (
    <div className="welcome-screen-container">
      <div className="content">
        <h1 className="header">samantha</h1>
        <p>
          Repeat the sequence of sound/colors. If you can successfully remember{' '}
          {winLength} steps of the sequence, you win!
        </p>
        <div className="button-container">
          <button className="new-game-btn" onClick={props.closeWelcome}>
            start new game
          </button>
        </div>
      </div>
    </div>
  );
}
