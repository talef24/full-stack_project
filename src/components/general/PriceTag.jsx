import React from 'react';

function PriceTag(props){
    const currencySymbol = "₪";
    const label = props.label ? props.label : "Price";

    return(
        <label className="ItemPrice">
            {label}: {props.price}{currencySymbol}
        </label>
    );
}

export default PriceTag;