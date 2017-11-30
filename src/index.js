import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import "./css/index.css"
//import "font-awesome/css/font-awesome.min.css";

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
