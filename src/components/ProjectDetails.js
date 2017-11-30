import React from "react";
import axios from "axios";
import "../css/ProjectDetails.css";
import Spinner from "./Spinner";

class ProjectDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: undefined
        };
        this.fetchProjectDetails = this.fetchProjectDetails.bind(this);
        this.loading = this.loading.bind(this);
        this.details = this.details.bind(this);
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
            this.setState({ project: result.data.project });
            console.log(result);
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
            <div>
                <div className="page-header">
                    {this.state.project.title}
                </div>
                <div className="gray-border">
                    Sup
                </div>
            </div>
        );
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