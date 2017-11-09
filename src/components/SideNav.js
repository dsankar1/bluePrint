import React from "react";
import {Link} from "react-router-dom";
import "../css/SideNav.css";

function openNav() {

}

function closeNav() {

}

const SideNav = (props) => (
    <div>
        <div id="mySidenav" class="sidenav">
            <Link to="/projects">Projects</Link>
        </div>
        <div class="main">
            {props.children}
        </div>
    </div>
);

export default SideNav;