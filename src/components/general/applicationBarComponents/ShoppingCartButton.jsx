import React from "react";
import IconButton from "@material-ui/core/IconButton";
import redirect from "../../../siteGlobalActions/redirect";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

function ShoppingCartButton(props) {
    return (
        <IconButton
            onClick={() => redirect("/cartScreen", props)}
            color="inherit"
            aria-label="open drawer"
        >
            <ShoppingCartIcon fontSize="large"/>
        </IconButton>
    );
}

export default ShoppingCartButton;