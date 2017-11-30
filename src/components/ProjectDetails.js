import React from "react";
import axios from "axios";
import "../css/ProjectDetails.css";
import Spinner from "./Spinner";
import DropDown from "./DropDown";

class ProjectDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: undefined
        };
        this.fetchProjectDetails = this.fetchProjectDetails.bind(this);
        this.loading = this.loading.bind(this);
        this.details = this.details.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.FUNCTIONAL_ID = 1;
        this.NONFUNCTIONAL_ID = 2;
        this.RISKS_ID = 3;
    }

    componentDidMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails() {
        var authOptions = {
            method: "GET",
            url: "http://localhost:3001/api/projects/" + this.props.match.params.id,
            headers: {
                "x-access-token": this.props.user.token
            }
        };
        axios(authOptions)
        .then(result => {
            this.setState({ project: result.data });
            console.log(result.data);
        })
        .catch(err => {
            this.setState({ project: { success: false }});
            console.log(err);
        });
    }

    loading() {
        return (
            <Spinner id="project-detail-spinner"/>
        );
    }

    details() {
        return (
            <div className="gray-border">
                <div className="page-header">
                    {this.state.project.details.title}
                </div>
                <hr/>
                <h4 style={{ color: "#475581" }}>Manager: { this.state.project.details.manager_name }</h4>
                <h4 style={{ color: "#475581" }}>Description: { this.state.project.details.description }</h4>
                <DropDown title="Functional Requirements" list={ this.state.project.functional_requirements } id={ this.FUNCTIONAL_ID }/>
                <DropDown title="Non-Functional Requirements" list={ this.state.project.nonfunctional_requirements } id={ this.NONFUNCTIONAL_ID }/>
                <DropDown title="Risks" list={ this.state.project.risks } id={ this.RISKS_ID }/>
            </div>
        );
    }

    updateProject(id, list) {
        switch(id) {
            case this.FUNCTIONAL_ID:
                break;
            case this.NONFUNCTIONAL_ID: 
                break;
            case this.RISKS_ID: 
                break;
            default: console.log("Invalid id given: " + id);
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.project ? this.details() : this.loading()
                }
            </div>
        );
    }
}

export default ProjectDetails;