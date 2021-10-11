import React from "react";
import PriceTag from "./PriceTag";

function Item(props) {
    const imgSrc = `pictures/items/${props.picSrc}`;
    const imgStyle = {width: 250, height: 250, backgroundColor: "white"};

    return (
        <div className="Item">
            <input type="checkbox" id={props.productId} onChange={props.onChangeSelection}/>
            <figure>
                <img src={imgSrc} className="itemsPics" style={imgStyle} alt="Item"/>
                <figcaption>
                    <ItemInformation infoDescription={props.description} infoPrice={props.price}/>
                </figcaption>
            </figure>
        </div>
    );
}

function ItemInformation(props) {
    return (
        <div className="ItemInformation">
            <span className="itemName"> {props.infoDescription} </span>
            <br/>
            <PriceTag price={props.infoPrice}/>
        </div>
    );
}

export default Item;