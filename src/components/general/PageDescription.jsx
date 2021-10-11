import React from "react";

function PageDescription(props) {
    const descriptionStyle = {backgroundColor: "lavender", width: '100%', top: "0"};
    const textStyle = {textAlign: "center"};

    return(
        <div id="pageDescription" style={descriptionStyle}>
            <h2 style={textStyle}>{props.pageName}</h2>
            <p style={textStyle}>{props.pageInfo}</p>
        </div>
    );
}

export default PageDescription;