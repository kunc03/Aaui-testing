import React, { Component } from "react";
import API, { API_SERVER } from "../../repository/api";
import { Redirect } from "react-router-dom";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
        };
    }

    onChange(state, e) {
        const stateCopy = this.state;
        stateCopy[state] = e.target.value;
        this.setState(stateCopy);
    }

    submit() {
        API.get(`${API_SERVER}v1/user/forgot-password/${this.state.email}`).then((res) => {
            if (res.status === 200 && !res.data.error) {
                alert(res.data.result.message);
                this.props.history.push(`/OTP/${res.data.result.id}`)
            } else {
                alert(res.data.result)
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Lupa Password</h1>

                <input
                    type="email"
                    value={this.state.email}
                    className="form-control"
                    placeholder="email"
                    onChange={this.onChange.bind(this, "email")}
                    required
                />

                <button type="submit" onClick={this.submit.bind(this)}>
                    Reset
                </button>
            </div>
        );
    }
}

export default ForgotPassword;
