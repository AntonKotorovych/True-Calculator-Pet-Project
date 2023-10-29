'use strict';

const BUTTONS = document.querySelectorAll('.keyboard li button');
console.log(BUTTONS);
document.addEventListener('keydown', event => {
  BUTTONS.forEach(button => {
    if (button.value == event.key) {
      button.classList.add('button--clicked');
      setTimeout(() => {
        button.classList.remove('button--clicked');
      }, 70);
    }
  });
});
