import React, { Component } from "react";

class OTP extends Component {
    constructor(props) {
        super(props);

        this.state = {
            otp: "",
            time: 300000,
        };
    }

    onChange(state, e) {
        const stateCopy = this.state;
        stateCopy[state] = e.target.value;
        this.setState(stateCopy);
    }

    submit() {
        this.props.history.push(`/reset-password/${this.props.match.params.id}/${this.state.otp}`);
    }

    toMMSS = (duration) => {
        // second to mmhh
        // var sec_num = parseInt(duration, 10); // don't forget the second param
        // var hours = Math.floor(sec_num / 3600);
        // var minutes = Math.floor((sec_num - hours * 3600) / 60);
        // var seconds = sec_num - hours * 3600 - minutes * 60;

        // if (hours < 10) {
        //     hours = "0" + hours;
        // }
        // if (minutes < 10) {
        //     minutes = "0" + minutes;
        // }
        // if (seconds < 10) {
        //     seconds = "0" + seconds;
        // }
        // return minutes + ":" + seconds;

        // ms to mmhh
        var seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return minutes + ":" + seconds;
    };

    render() {
        let timer = setInterval(() => {
            this.setState({ time: this.state.time - 1 });
        }, 1);
        if (this.state.time === 0) {
            clearInterval(timer);
            this.props.history.push(`/forgot-password`);
        }
        return (
            <div>
                <h1>OTP</h1>

                <input
                    type="text"
                    value={this.state.otp}
                    className="form-control"
                    placeholder="OTP"
                    onChange={this.onChange.bind(this, "otp")}
                    required
                />

                <div>{this.toMMSS(this.state.time)}</div>

                <button type="submit" onClick={this.submit.bind(this)}>
                    submit
                </button>
            </div>
        );
    }
}

export default OTP;
