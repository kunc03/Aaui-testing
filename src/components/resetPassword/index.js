import React, { Component } from "react";

class ResetPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            password: '',
            confirmPassword: ''
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
                    onChange={this.onChangePassword}
                    required
                />

                <input
                    type="password"
                    value={this.state.confirmPassword}
                    className="form-control"
                    placeholder="Confirm Password"
                    onChange={this.onChangePassword}
                    required
                />
            </div>
        );
    }
}

export default ResetPassword;
