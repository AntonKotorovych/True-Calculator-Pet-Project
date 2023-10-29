'use strict';

const BUTTONS = document.getElementsByTagName('button');

document.addEventListener('keydown', event => {
  const pressedKey = event.key;
  console.log(BUTTONS);
  console.log(pressedKey);
  console.log(`Клавиша ${event.key} был нажата.`);
});
