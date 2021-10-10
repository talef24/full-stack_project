import PriceTag from "./PriceTag";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {Tooltip} from "@material-ui/core";
import ProductsList from "./ProductsList";

function CartProduct(props){
    const cardPrices = props.cardPrices.map(card => card.price);

    return (
        <div style={{border: '2px solid black', padding: '25px 100px 50px 100px'}}>
            <br/>
            <Tooltip title="Delete from cart" style={{border: '2px solid black', marginLeft: '-60px'}}>
                <IconButton onClick={props.onClick}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <br/>
            <div style={{marginLeft: '60px'}}>
                <img src={`pictures/${props.picSrc}`} alt="package" style={{width: 100}}/><br/>
                <PriceTag price={props.packagePrice}/><br/>
                <label>
                    Amount: {props.amount}
                </label>
                <List>
                    {generateCardList(props.amount, cardPrices)}
                </List>
                <ProductsList products={props.products}/>
                <PriceTag label = "Total price"
                          price = {(props.packagePrice * props.amount) + (cardPrices.reduce((accumulator, currentValue) => accumulator + currentValue))}
                />
            </div>

        </div>
    );
}

function generateCardList(amount, prices) {
    const cardsAmount = amount;
    const arr = [];
    for (let i=0; i<cardsAmount; i++) {
        arr.push({index: i+1, price: prices[i]});
    }
    return arr.map((value, key) =>
        <ListItem key={key}>
            <ListItemText
                primary={"card " + value.index + ": " + value.price + "₪"}
            />
        </ListItem>
    );
}

export default CartProduct;