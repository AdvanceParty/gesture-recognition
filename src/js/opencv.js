import MessageBox from './utils/MessageBox';

// import { ELEMENTS, CONFIG } from './settings.js';
const msgBox = new MessageBox();

const init = async () => {
  msgBox.title = 'Open CV Tests';
  document.body.appendChild(msgBox.html);
};

init();
