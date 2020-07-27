import React, { Component } from "react";

class ResetPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: ''
        }
    }

    onChange(e) {
        console.log(e)
        console.log(e.target.value)
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
                    onChange={this.onChange.bind(this)}
                    required
                />
            </div>
        );
    }
}

export default ResetPassword;
