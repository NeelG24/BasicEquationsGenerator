'use strict';

//IMPORTANT DOM stands for Document Object Model. It's the structured represntation of HTML documents, allowing js to access HTML elements and styles and manipulate them. Think of am HTML document as a TREE, with Document being the sole entry point into the tree, leading to the first <html></html> element that of course contains its child elements head and body. We start the tree with Document to perspectivise it as the special entry point into the DOM. We call document.querySelector(), for example, on an element in the tree, using the document keyword to enter. 2 elements with the same parent are siblings (like head and body). DOM methods and manipulation properties are NOT Javascript.

//Here we implement the querySelector method, which allows the referencing of selectors the exact same way they are called in CSS files. Printing it to the console displays the elements of the class in the exact way they are created in the HTML document. The .textContent simply displays text content of the element without element labels. This allows for paragraph content to be put directly into a string, for example. Basically, this is the way that js and HTML documents can communicate.

/*
console.log(document.querySelector('.message').textContent);

//Here, we use = '' to CHANGE the content of elements in the message class. This is DOM manipulation.
document.querySelector('.message').textContent = '🎉 Correct Number!';

document.querySelector('.equation').textContent = 13;
document.querySelector('.score').textContent = 10;

//IMPORTANT Here, we are reading from an input field, so we use value. Using textContent results in an error because there is initially no text content in an input field. We must use .value to get and set for input fields.
document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value);
*/

//IMPORTANT Event listeners are used to observe if actions, such as the click of a button, occur to an element on the page. Here we uses addEventListener(), the best and most useful of these methods. We specify the type of event - in this case, 'click'. We need to add an event handler to make this function work, which is the function after click - an event handler is expected for a listener in the format below.

//Here, after the click, we set whatever value is in the input field to the const guess using querySelector.value. NOTE that this value of course is always a string, and if we want to use it as an int we need to convert the type to a Number function. If an input field is blank, it is treated as a falsy boolean, so we can simply include an if !guess statement to handle the empty field case. We compare to secretValue and decrament the score if the guess is incorrect, displaying the appropriate message. We also only go for as long as the score is above 0, so we include if(score > 1), as the next click will bring to 0.

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
        //document.querySelector('.equation').style.width = '30rem';
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

//IMPORTANT Remember that we refactored this code to put both high and low guesses into one else if statement using a TERNARY operator. These will come in handy to refactory DRY code - just remember to find similarities between cases with repeating code, whihch will open the gates to refactoring code. The SINGLE line with the ternary operator saved us at least 20 lines of code. ALSO, we create a displayMessage method, so that we can simply enter the message we would like to be displayed in the message class's element without typing document.querySelector... every single time. Simple and efficient inclusions like this just make code that much easier to work with.

//   //When guess is too high
// else if (guess > secretNumber) {
//   if (score > 1) {
//     document.querySelector('.message').textContent = ' 📈 Too High!';
//     score--;
//     document.querySelector('.score').textContent = score;
//   } else {
//     document.querySelector('.message').textContent =
//       '💥 You lost the game!';
//     document.querySelector('.score').textContent = 0;
//     document.querySelector('body').style.backgroundColor = '#d43c3c';
//   }

//   //When guess is too low
// } else if (guess < secretNumber) {
//   if (score > 1) {
//     document.querySelector('.message').textContent = '📉 Too Low!';
//     score--;
//     document.querySelector('.score').textContent = score;
//   } else {
//     document.querySelector('.message').textContent =
//       '💥 You lost the game!';
//     document.querySelector('.score').textContent = 0;
//     document.querySelector('body').style.backgroundColor = '#d43c3c';
//   }
// }
