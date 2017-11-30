import React from "react";
import { NavLink } from "react-router-dom"
import "../css/Nav.css";
import logo from "../res/blueprint_logo.png";
import profilePicture from "../res/blueprint_user_generic.png";

function returnScrolling() {
    document.getElementsByTagName("html")[0].style.overflowY = "auto";
}

function removeScrolling() {
    document.getElementsByTagName("html")[0].style.overflowY = "hidden";
}

function collapseDrawer() {
    document.getElementById("drawer-toggle").checked = false;
    returnScrolling();
}

function drawerToggleChange() {
    if (document.getElementById("drawer-toggle").checked) {
        removeScrolling();
    } else {
        returnScrolling();
    }
}

const Nav = (props) => (
    <div>
        <input type="checkbox" id="drawer-toggle" name="drawer-toggle" onChange={ drawerToggleChange }/>
        <label htmlFor="drawer-toggle" id="drawer-toggle-label"></label>
        <header className="header"><img src={ logo } alt="bluePrint" height="30"/></header>
        <nav id="drawer">
            <ul>
                <NavLink activeClassName="drawer-active" to="/profile" onClick={ collapseDrawer }>
                    <div className="drawer-profile">
                        <img src={profilePicture} alt="Profile" width="120" style={ {margin: 10 + "px"} }/>
                        <div>{ props.firstname + " " + props.lastname }</div>
                    </div>
                </NavLink>
                <hr/>
                <NavLink activeClassName="drawer-active" to="/projects" onClick={ collapseDrawer }>
                    <span className="glyphicon glyphicon-folder-close"></span> Projects
                </NavLink>
                <NavLink activeClassName="drawer-active" to="/settings" onClick={ collapseDrawer }>
                    <span className="glyphicon glyphicon-cog"></span> Settings
                </NavLink>
                <div onClick={ e => {props.updateUser(null)} }>
                    <span className="glyphicon glyphicon-log-out"></span> Logout
                </div>
                <hr/>
            </ul>
        </nav>
        <div id="page-content" className="dark-blue-background">
            <div className="container-fluid">
                { props.children }
            </div>
        </div>
    </div>
);

export default Nav;