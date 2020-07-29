import React, { Component } from "react";
import API, { API_SERVER } from "../../repository/api";

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
        };
    }

    onChange(state, e) {
        const stateCopy = this.state;
        stateCopy[state] = e.target.value;
        this.setState(stateCopy);
    }

    submit() {
        console.log(this.state, this.props.match.params);
        if (this.state.password !== this.state.confirmPassword) {
            alert("please check your password");
        } else {
            API.get(
                `${API_SERVER}v1/user/reset-password/${this.props.match.params.id}/${this.props.match.params.key}/${this.state.password}/${this.state.confirmPassword}/${new Date().getTime()}`
            ).then((res) => {
                if (res.status === 200) {
                    alert(res.data.result);
                }
            });
        }
    }

    render() {
        console.log(this.props.match.params);
        return (
            <div>
                <h1>Reset Password</h1>

                <input
                    type="password"
                    value={this.state.password}
                    className="form-control"
                    placeholder="Password"
                    onChange={this.onChange.bind(this, "password")}
                    required
                />

                <input
                    type="password"
                    value={this.state.confirmPassword}
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={this.onChange.bind(this, "confirmPassword")}
                    required
                />

                <button type="submit" onClick={this.submit.bind(this)}>
                    Reset
                </button>
            </div>
        );
    }
}

export default ResetPassword;
