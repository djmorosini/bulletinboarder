import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import Board from './Components/Board'
import OtherBoard from './Examples/TheBoard'
import * as serviceWorker from './serviceWorker';
import { authorQuoteMap } from './Examples/data'

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();