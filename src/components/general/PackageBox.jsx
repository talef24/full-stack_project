import React from "react";

function PackageBox(props) {
    const imgSrc = `pictures/boxes/${props.picSrc}`;

    return(
        <div id="choosePackageBox">
            <input type="radio" name="box" id={props.productId} onChange={props.onChangeSelection}/>
            <img src={imgSrc} className="boxesPics" style={{width: 200}} alt="Box"/>
        </div>
    );
}

export default PackageBox;