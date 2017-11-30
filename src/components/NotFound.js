import React from "react";
import "../css/NotFound.css";
var notFoundImage = require("../res/404.png");

class NotFound extends React.Component {
    render() {
        return (
                <img className="page-not-found-img" src={notFoundImage} alt="Page Not Found"/>
        )
    }
}

export default NotFound;