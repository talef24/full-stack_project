import React from "react";
import PriceTag from "./PriceTag";
import { withRouter } from 'react-router-dom';
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import redirect from "../../siteGlobalActions/redirect";
import {Tooltip} from "@material-ui/core";
import Products from "../general/ProductsList";

class Package extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            image: null,
        }
    }

    componentDidMount() {
        import("../../../public/pictures/packages/" + this.props.picSrc).then((image) => {
            this.setState({ image: image.default });
        });
    }

    render() {
        return (
            <div className="Package">
                <img src={this.state.image} alt={this.props.number} style={{width:300,  height: 300}}/>
                <br/>
                <br/>
                <PriceTag price={this.props.price}/>
                <AddCartButton {...this.props} id={this.props.id}/>
                <Products products={this.props.products} />
            </div>
        );
    }
}

function AddCartButton(props){
    return(
        <Tooltip title="Add to cart" placement="right" style={{alignItems: "center"}}>
            <IconButton onClick={() =>redirect("/makeItPersonal/" + props.id, props)}>
                <AddShoppingCartIcon fontSize="large"/>
            </IconButton>
        </Tooltip>
    );
}

export default withRouter(Package);
