import React from "react";
import "../css/DropDown.css";
import $ from "jquery";

const DropDown = props => {
    var listItems = props.list.map((item, index) => (
        <li key={ index }>
            { item.description }
        </li>
    ));
    return (
        <div id="drop-down" className="drop-down">
            <div className="drop-down-header" onClick={ e => {
                    var clicked = e.currentTarget;
                    if (clicked.nextSibling.style.display === "none") {
                        clicked.nextSibling.style.display = "block";
                        //$(clicked).next().css("display", "block");
                    } else {
                        clicked.nextSibling.style.display = "none";
                        //$(clicked).next().css("display", "none");
                    }
                } }>
                <h4>{ props.title + " " }<span class="caret"></span></h4>
            </div>
            <div className="drop-down-body" style={{ display: "none" }}>
                <hr/>
                <ul>
                    { listItems }
                </ul>
                <hr/>
                <input type="text" className="form-control list-text-entry" name="search" placeholder="New Entry..."/>
                <button className="btn list-btn-entry">
                    +
                </button>
            </div>
        </div>
    );
};

export default DropDown;