$(document).ready(function() {
  const $on = $("#on-toggle-outer");
  const $onInner = $on.children();
  const $countBox = $("#count-box");
  const $startLight = $(".start");
  const $strictLight = $(".strict");
  const $circleOuter = $(".circle-outer");
  const $pie = $(".pie");

  // $startLight.click(e => {
  //   if (gameOn) {
  //     startHandler(e);
  //   }
  // });
  // $strictLight.click(e => {
  //   if (gameOn) {
  //     strictHandler(e);
  //   }
  // });

  $pie.mousedown(e => {
    if (started && playersTurn) {
      pieMouseDownHandler(e);
    }
  });
  $pie.mouseup(e => {
    if (started && playersTurn) {
      pieMouseUpHandler(e);
    }
  });
  $pie.mouseout(e => {
    if (started && playersTurn) {
      pieMouseUpHandler(e);
    }
  });

  // function startHandler() {
  //   started = !started;
  //   let beepSound;

  //   if (started) {
  //     $startLight.addClass("start-on");
  //     sequence = [];
  //     beepSound = new Audio(beep);
  //     beepSound.play();

  //     $countBox.children().text(count.toString().padStart(2, "0"));
  //     let start = setTimeout(newSequence, 1000);
  //     asyncFuncs.push(start);
  //   } else {
  //     count = 0;
  //     started = false;
  //     reset();
  //   }
  // }

  function strictHandler() {
    $strictLight.toggleClass("strict-on");
    strict = !strict;

    if (strict) {
      beepSound = new Audio(beep);
      beepSound.play();
    }
  }

  function pieMouseDownHandler(e) {
    $target = $(e.target);
    let newNote;
    let noteURL;
    let color;
    let pad;

    switch (true) {
      case $target.hasClass("upper-left"):
        noteURL = lightPads[3].note;
        pad = 3;
        break;
      case $target.hasClass("upper-right"):
        pad = 2;
        noteURL = lightPads[2].note;
        break;
      case $target.hasClass("bottom-left"):
        pad = 0;
        noteURL = lightPads[0].note;
        break;
      case $target.hasClass("bottom-right"):
        pad = 1;
        noteURL = lightPads[1].note;
        break;
      default:
        break;
    }

    playerSequence.push(pad);
    if (checkIfCorrect()) {
      $target.addClass("active");
      newNote = new Audio(noteURL);
      newNote.play();
    }
  }

  // function pieMouseUpHandler(e) {
  //   $(e.target).removeClass("active");
  //   if (playerSequence.length == sequence.length) {
  //     playersTurn = false;
  //     if (count == winLength) {
  //       setTimeout(forTheWin, 500);
  //       return;
  //     }
  //     setTimeout(newSequence, 1200);
  //   }
  // }

  function checkIfCorrect() {
    playersTurn = false;
    for (let i = 0; i < playerSequence.length; i++) {
      if (playerSequence[i] != sequence[i]) {
        error();
        return false;
      }
    }
    playersTurn = true;
    return true;
  }

  function newSequence() {
    started = true;
    count += 1;
    let randomNum = Math.floor(Math.random() * 4);

    $countBox.children().text(count.toString().padStart(2, "0"));
    sequence.push(randomNum);
    playSequence();
  }

  function playSequence() {
    playerSequence = [];
    let i = 0;

    let padTrigger = setInterval(() => {
      triggerNext();
    }, 800);

    function triggerNext() {
      triggerPad(sequence[i], 600);
      if (i == sequence.length - 1) {
        clearInterval(padTrigger);
        playersTurn = true;
      }
      i++;
    }

    triggerNext();
    asyncFuncs.push(padTrigger);
  }

  function triggerPad(num, wait) {
    let pad = $circleOuter.find(lightPads[num].class);
    let note = new Audio(lightPads[num].note);

    pad.addClass("active");
    note.play();
    setTimeout(() => {
      pad.removeClass("active");
    }, wait);
  }

  function error() {
    errorBeep.play();
    blinky(8, "XX");

    if (strict) {
      sequence = [];
      count = 0;
      setTimeout(() => {
        reset();
        setTimeout(() => {
          // $startLight.addClass('start-on');
          //
          // newSequence();
          startHandler();
        }, 1250);
      }, 1250);
    }
  }

  function blinky(repeats, str) {
    let current = 0;
    let blink = setInterval(() => {
      $countBox.children().text(str);
      setTimeout(() => {
        $countBox.children().text("");
      }, 100);
      current++;
      if (current === repeats) {
        clearInterval(blink);
        setTimeout(() => {
          $countBox.children().text(count.toString().padStart(2, "0"));
          playSequence();
        }, 600);
      }
    }, 200);
    asyncFuncs.push(blink);
  }

  // function forTheWin() {
  //   playersTurn = false;
  //   let pad = 0;
  //   let speed = 500;
  //   let counter = 700;
  //   let tick = 1;

  //   let i = 0;
  //   let winMsg = setInterval(() => {
  //     if (i == message.length - 1) {
  //       i = 0;
  //     }
  //     let current = [message[i], message[i + 1]];
  //     current = current.join("");
  //     $countBox.children().text(current);
  //     setTimeout(() => {
  //       $countBox.children().text("");
  //     }, 200);
  //     i++;
  //   }, 220);

  //   asyncFuncs.push(winMsg);

  //   triggerPad(pad, speed);
  //   let myFunction = function() {
  //     pad++;
  //     if (pad == 4) {
  //       pad = 0;
  //     }
  //     counter *= 0.95;
  //     speed *= 0.95;
  //     triggerPad(pad, speed);
  //     timeout = setTimeout(myFunction, counter);
  //     tick++;
  //     if (tick == 17 || !gameOn) {
  //       reset();
  //       clearTimeout(timeout);
  //     }
  //   };
  //   let timeout = setTimeout(myFunction, counter);
  // }

  // function turnOff() {
  //   reset();
  //   gameOn = false;
  //   strict = false;

  //   $onInner.removeClass("on");
  //   $strictLight.removeClass("strict-on");
  //   $countBox.removeClass("count-on");
  //   $countBox.children().text("--");
  // }

  // function reset() {
  //   sequence = [];
  //   count = 0;
  //   started = false;
  //   $startLight.removeClass("start-on");
  //   asyncFuncs.forEach(val => {
  //     clearInterval(val);
  //   });
  //   setTimeout(() => {
  //     $countBox.children().text("--");
  //   }, 100);
  // }
});
