import siteLogo from "../../../logoPPP.png";
import React from "react";
import {withRouter} from "react-router-dom";
import redirect from "../../../siteGlobalActions/redirect";

function PageNotFound(props) {
    return (
        <div style={{border: "1px solid blue"}}>
            <img src={siteLogo} alt="Site logo" style={imgStyle}/>
            <h1 style={headlineStyle}>Page not found</h1>
            <div style={divStyle}>
                <input type="button"
                       value="Back to site"
                       onClick={() => redirect("/", props)}
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

export default withRouter(PageNotFound);