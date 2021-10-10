import siteLogo from "../../../logoPPP.png";
import React from "react";
import {withRouter} from "react-router-dom";
import redirect from "../../../siteGlobalActions/redirect";

function ServiceUnavailable(props) {
    function onTryAgain() {
        props.refreshSiteRouter();
        redirect("/", props);
    }

    return (
        <div style={{border: "1px solid blue"}}>
            <img src={siteLogo} alt="Site logo" style={imgStyle}/>
            <h1 style={headlineStyle}>Service Unavailable</h1>
            <h3 style={{textAlign: "center"}}>The site is temporarily offline. please try again later</h3>
            <div style={divStyle}>
                <input type="button"
                       value="Try again"
                       onClick={onTryAgain}
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

export default withRouter(ServiceUnavailable);