'use strict';

function generateEquation() {
  var num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
  var num2 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

  let ans;
  var operatorIndex = Math.floor(Math.random() * 4); // Random number between 0 and 3

  var op;
  if (operatorIndex === 0) {
    op = '+';
    ans = num1 + num2;
  } else if (operatorIndex === 1) {
    op = '-';
    ans = num1 - num2;
  } else if (operatorIndex === 2) {
    op = '*';
    ans = num1 * num2;
  } else {
    op = '/';
    ans = num1 / num2;

    //We need to handle ambiguous decimals by calling the method again if they appear
    if (String(ans).length > 3) {
      console.log(`skipped ${ans}`);
      return generateEquation();
    }
  }

  //Create an object with all of the relevant information. 0 = Equation str format. 1 = num1. 2 = operand. 3 = num2. 4 = answer.
  var equation = num1 + ' ' + op + ' ' + num2 + ' = ' + ' ?';
  var equation2 = num1 + ' ' + op + ' ' + num2 + ' = ' + ans;

  return {
    incompleteEquation: equation,
    completeEquation: equation2,
    firstNumber: num1,
    operator: op,
    secondNumber: num2,
    answer: ans,
  };
}

let randomEquation;

let score = 0;
let highScore = 0;
let wrongAnswerFlag = false;
let nextEquationFlag = false;
let startFlag = false;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

//Start the game
document.querySelector('.start').addEventListener('click', function () {
  randomEquation = generateEquation();

  document.querySelector('.equation').textContent =
    randomEquation.incompleteEquation;
  document.querySelector('.equation').style.width = '55rem';

  document.querySelector('.start').style.display = 'none';
  startFlag = true;
});

document.querySelector('.check').addEventListener('click', function () {
  //Flag here to check if they clicked won, so that they cannot access the check button unless they click Continue/Restart!
  if (startFlag) {
    if (nextEquationFlag) {
      document.querySelector('.check').style.display = 'block';
      document.querySelector('.check').textContent = 'Check!';

      randomEquation = generateEquation();

      document.querySelector('.equation').textContent =
        randomEquation.incompleteEquation;
      document.querySelector('.equation').style.width = '55rem';
      document.querySelector('.guess').value = '';
      document.querySelector('body').style.backgroundColor = '#222';

      nextEquationFlag = false;
    } else {
      const guessCheck = document.querySelector('.guess').value;
      const guess = Number(document.querySelector('.guess').value);

      //When there is no input
      if (guessCheck === '' || guessCheck === ' ') {
        displayMessage('🚫 No number!');
        //When player wins
      } else if (guess === randomEquation.answer) {
        displayMessage('🎉 Correct Answer!');
        document.querySelector('.equation').textContent =
          randomEquation.completeEquation;

        //IMPORTANT Here, we are performing DOM manipulation on a CSS element. We don't use a . because we are just accessing the body element, then we can use .style to access style property of this element, and then a specific style. CSS implements dash case, but that is not allowed in js, so we write the name in camelCase instead (here backgroundColor instead of background-color).
        document.querySelector('body').style.backgroundColor = '#60b347';
        score++;
        document.querySelector('.score').textContent = score;

        document.querySelector('.check').textContent = 'Next Equation!';

        nextEquationFlag = true;

        //Here, we are accessing the style of elements in a class. Even though this is a number value, we MUST pass it as a STRING with the unit. Here we just make the box wider when the number is correct.
      } else if (guess !== randomEquation.answer) {
        displayMessage(
          guess > randomEquation.answer
            ? `Wrong! 📈 Too High! The answer was ${randomEquation.answer}`
            : `Wrong! 📉 Too Low! The answer was ${randomEquation.answer}`
        );
        document.querySelector('body').style.backgroundColor = '#d43c3c';
        wrongAnswerFlag = true;
        document.querySelector('.check').style.display = 'none';
        //displayMessage('💥 You lost the game!');
      }
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  //Here, we check if the player actually won before clicking Again! to know that they actually played and we if should subsequently update the high score.
  if (wrongAnswerFlag) {
    if (score > highScore) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }
  }

  document.querySelector('.start').style.display = 'block';
  wrongAnswerFlag = false;
  score = 0;
  document.querySelector('.score').textContent = score;

  displayMessage('Start guessing...');

  document.querySelector('.equation').textContent = '?';
  document.querySelector('.equation').style.width = '15rem';

  document.querySelector('body').style.backgroundColor = '#222';

  document.querySelector('.guess').value = '';
  document.querySelector('.check').style.display = 'block';
});
