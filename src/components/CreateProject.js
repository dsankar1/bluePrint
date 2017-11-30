import React from "react";
import axios from "axios";
import $ from "jquery";
import Spinner from "./Spinner";

class CreateProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            newProjectTitle: "",
            newProjectDescription: "",
            newProjectTitleError: "",
            newProjectDescriptionError: ""
        };
        this.validateForm = this.validateForm.bind(this);
        this.createProject = this.createProject.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.clearModal = this.clearModal.bind(this);
        this.loading = this.loading.bind(this);
        this.projectCreationForm = this.projectCreationForm.bind(this);
    }

    loading() {
        return (
            <Spinner id="create-project-spinner"/>
        );
    }

    projectCreationForm() {
        return (
            <div id="create-project-modal-body" className="modal-body">
                <form>
                    <div className="form-group">
                        <label className="login-label">Title: <span style={{ color: "red" }}>{ this.state.newProjectTitleError }</span></label>
                        <input id="project-title-box" type="text" maxLength="50" className="login-text form-control" 
                            onChange={ e => this.setState({ newProjectTitle: e.target.value, newProjectTitleError: "" }) }/>
                    </div>
                    <div className="form-group">
                        <label className="login-label">Description: <span style={{ color: "red" }}>{ this.state.newProjectDescriptionError }</span></label>
                        <textarea id="project-description-box" maxLength="1000" className="login-text form-control" 
                            onChange={ e => this.setState({ newProjectDescription: e.target.value, newProjectDescriptionError: "" })}/>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn create-btn"
                            onClick={ e => { e.preventDefault(); this.createProject(); } }>
                            Create
                        </button>
                        <button type="button" className="btn create-btn"
                            onClick={ this.closeModal }>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    validateForm() {
        if (!this.state.newProjectTitle) {
            this.setState({ newProjectTitleError: "Field Required" });
            return false;
        }
        if (!this.state.newProjectDescription) {
            this.setState({ newProjectDescriptionError: "Field Required" });
            return false;
        }
        return true;
    }

    createProject() {
        if (this.validateForm()) {
            this.setState({ loading: true });
            var project = {
                "title": this.state.newProjectTitle,
                "description": this.state.newProjectDescription,
                "manager_name": this.props.user.firstname + " " + this.props.user.lastname,
                "requirements_hours": 0,
                "designing_hours": 0,
                "coding_hours": 0,
                "testing_hours": 0,
                "management_hours": 0,
                "risk_status": "None"
            }
            var authOptions = {
                method: "POST",
                url: "http://localhost:3001/api/projects",
                headers: {
                    "x-access-token": this.props.user.token
                },
                data: {
                    ...project
                }
            };
            axios(authOptions)
            .then(response => {
                if (response.data.success) {
                    project = {
                        ...project,
                        id: response.data.project_id
                    };
                    this.props.addProject(project);
                    this.closeModal();
                    this.setState({ loading: false });
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
            });
        }
    }

    closeModal() {
        $("#new-project-modal").modal("hide");
    }

    clearModal() {
        $("#project-title-box").val("");
        $("#project-description-box").val("");
        this.setState({
            newProjectTitle: "",
            newProjectDescription: "",
            newProjectTitleError: "",
            newProjectDescriptionError: ""
        });
    }

    render() {
        return (
            <div className="create-project-div">
                <button className="btn create-project-btn" 
                    data-toggle="modal" data-target="#new-project-modal" onClick={this.clearModal}>
                    Create New Project
                </button>
                <div id="new-project-modal" className="modal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header" style={{ background: "#2f395c", color: "white" }}>
                                <button type="button" className="close" data-dismiss="modal" style={ {color: "white"} }>
                                    &times;
                                </button>
                                <h4 className="modal-title" style={{ fontWeight: "600" }}>Create New Project</h4>
                            </div>
                            { this.state.loading ? this.loading() : this.projectCreationForm() }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateProject;