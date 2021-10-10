import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import siteLogo from "../../logoPPP.png";
import TextForm from "../general/TextForm";
import redirect from "../../siteGlobalActions/redirect";
import createTextFormFieldInfo from "../../siteGlobalActions/createTextFormFieldInfo";

class RegistrationScreen extends React.Component {
    render() {
        return(
            <div>
                <img src={siteLogo} alt="logo" style={imgStyle}/>
                <h1 style={{textAlign: "center"}}>Perfect Present Package</h1>
                <RegistrationForm {...this.props}/>
                <br/>
                <div style={divStyle}>
                    <input type="button" value="Back to login page"
                           onClick={() => redirect("/login", this.props)}
                    />
                </div>
            </div>
        );
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
        marginLeft: theme.spacing(35),
        marginTop: theme.spacing(10),
    },
    signButton: {
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(5),
    }
}));

function RegistrationForm(props) {
    const classes = useStyles();
    const registerFieldsInfo = [
        createTextFormFieldInfo.fieldInfoObject("email", "Email", "email", {}),
        createTextFormFieldInfo.fieldInfoObject("password", "Password", "password", {}),
        createTextFormFieldInfo.fieldInfoObject("repeatedPassword", "Repeat Password", "password", {}),
        createTextFormFieldInfo.fieldInfoObject("firstName", "First Name", "text", {}),
        createTextFormFieldInfo.fieldInfoObject("lastName", "Last Name", "text", {}),
        createTextFormFieldInfo.fieldInfoObject("address", "Address", "text", {}),
        createTextFormFieldInfo.fieldInfoObject("city", "City", "text", {}),
        createTextFormFieldInfo.fieldInfoObject("region", "Region", "text", {}),
        createTextFormFieldInfo.fieldInfoObject("telephone", "Telephone", "tel", {}),
    ];

    function onRegistered () {
        alert("You are now registered !");
        redirect("/login", props);
    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextForm
                    fieldsInfo={registerFieldsInfo}
                    relativePathOnSubmit='/register'
                    httpMethodOnSubmit = "POST"
                    submitButtonValue="Sign up"
                    onSuccessfulSubmission = {onRegistered.bind(this)}
                />
            </div>
        </form>
    );
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

export default RegistrationScreen;