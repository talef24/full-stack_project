import ProductsGrid from "../general/ProductsGrid";
import React from "react";
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";

class CartScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pageInfo: ""
        }
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    async getData(){
        const res = await requestToServer("/getCart", 'GET');
        if(res.ok){
            this.setState({data: res.data});
            const isCartEmpty = res.data.length === 0;
            const cartInfo = isCartEmpty ? "Your cart is empty" : "";
            this.setState({pageInfo: cartInfo});
        }else{
            redirect(res.onError, this.props);
        }
    }

    async componentDidMount(){
        await this.getData();
    }

    async handleRemoveClick(elementData){
        const reqBody = {selectedPackage: elementData, updateType: "remove"};
        const fetchRes = await requestToServer("/updateCart", 'POST', reqBody);
        if(fetchRes.ok) {
            await this.getData();
        } else {
            redirect(fetchRes.onError, this.props);
        }
    }

    render() {
        return (
            <div className="CartScreen">
                <PageDescription pageName={"Shopping Cart"} pageInfo={this.state.pageInfo}/>
                {this.state.data.length !== 0 ?
                    <div>
                        <ProductsGrid
                            gridData={this.state.data}
                            elementsType="CartProduct"
                            numOfProductsInRow={1}
                            mutualData={{onClick: this.handleRemoveClick}}
                        />
                        <input type="button"
                               value = "Continue for payment"
                               onClick={() => redirect("/payment", this.props)}
                               style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                        />
                    </div> :
                    null
                }
            </div>
        );
    }
}

export default CartScreen;