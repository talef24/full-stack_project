import siteLogo from "../../../logoPPP.png";
import React from "react";
import {withRouter} from "react-router-dom";
import redirect from "../../../siteGlobalActions/redirect";

function SessionExpired(props) {
    function onExpired() {
        props.onActivityExpired();
        redirect("/", props);
    }

    return (
        <div style={{border: "1px solid blue"}}>
            <img src={siteLogo} alt="Site logo" style = {imgStyle}/>
            <h1 style={headlineStyle}>We are sorry...</h1>
            <p style={{textAlign: "center"}}>
                Your activity may have expired. Thank you for using the service.
                To start an activity again, please click below to continue
            </p>
            <div style={divStyle}>
                <input type="button"
                       value="Click here to continue"
                       onClick={onExpired}
                />
            </div>
        </div>
    )
}

const headlineStyle = {color: "blue", textAlign: "center"};
const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}
const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
}

export default withRouter(SessionExpired);