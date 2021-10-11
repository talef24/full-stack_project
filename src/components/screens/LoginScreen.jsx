import React from 'react';
import {TextField, Checkbox, FormControlLabel} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import { withRouter } from 'react-router-dom';
import redirect from "../../siteGlobalActions/redirect";
import siteLogo from "../../logoPPP.png";

class LoginScreen extends React.Component{
    constructor(props) {
        super(props);
        this.onChangingRememberMe = this.onChangingRememberMe.bind(this);
        this.handleSignInClick = this.handleSignInClick.bind(this);
        this.state={
            email: "",
            password: "",
            rememberMe: false,
            error: false
        }
    }

    onChangingRememberMe(event) {
        this.setState({rememberMe: event.target.checked});
    }

    async handleSignInClick(){
        const body = {...this.state};
        delete body.error;
        const res = await requestToServer("/login", 'POST', body);
        if(res.ok){
            this.props.onLoggedIn(res.data.userType === "ADMIN");
            redirect("/mainScreen", this.props);
        }else{
            if(res.status === 400) {
                this.setState({error: true})
            } else {
                redirect(res.onError, this.props)
            }
        }
    }

    render() {
        return (
            <form noValidate autoComplete="off">
                <div>
                    <img src={siteLogo} alt="logo" style = {imgStyle}/>
                    <h1 style={{textAlign: "center"}}>Perfect Present Package</h1>
                    {this.state.error ?
                        <label style={{color: "red"}}>Email or password are not correct</label> :
                        ""
                    }
                    <br/> <br/>
                    <div style={divStyle}>
                        <TextField
                            label="Email"
                            type="email"
                            onBlur={(event) => {
                                this.setState({email: event.target.value});
                            }}
                            error={this.state.error}
                        />
                    </div>
                    <br/>
                    <div style={divStyle}>
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={(event) => {
                                this.setState({password: event.target.value});
                            }}
                            error={this.state.error}
                        />
                    </div>
                    <br/>
                    <div style={divStyle}>
                        <FormControlLabel
                            control= {
                                <Checkbox
                                    onClick={this.onChangingRememberMe}
                                />}
                            label="Remember me"
                        />
                        <input type="button"
                               value="Sign in"
                               onClick={this.handleSignInClick.bind(this)}
                        />
                    </div>
                    <br/>
                    <div style={divStyle}>
                        <input type="button"
                               value="Create an account"
                               onClick={() => redirect("/register", this.props)}
                        />
                    </div>
                </div>
            </form>
        );
    }
}

const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
}

const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

export default withRouter(LoginScreen);
