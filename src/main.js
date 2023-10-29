'use strict';

const BUTTONS = document.querySelectorAll('.digits button');
console.log(BUTTONS);
document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value == event.key) {
      button.classList.add('digit--clicked');
      setTimeout(() => {
        button.classList.remove('digit--clicked');
      }, 70);
    }
  });
});
