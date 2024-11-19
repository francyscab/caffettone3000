"use strict";

import App from './app.js';

const appContainer = document.querySelector('#main');
const menu = document.querySelector('#menu');
// creating our app
const app = new App(appContainer, menu);