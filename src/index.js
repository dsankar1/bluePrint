import React from 'react';
import ReactDOM from 'react-dom';
//import {Provider} from "react-redux";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import "./css/index.css"
//import "font-awesome/css/font-awesome.min.css";


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
