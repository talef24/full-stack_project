import React from "react";
import ProductsGrid from '../general/ProductsGrid';
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import {withRouter} from "react-router-dom";
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";

class MainScreen extends React.Component{
    constructor(props) {
        super(props);
        this.pageInfo = "Enjoy finding the Perfect Present Package"
        this.state={
            data: [],
            filteredMode: false
        }
    }

    async getData(){
        const searchInput = this.props.match.params.input;
        let res;
        if(!searchInput || searchInput === "empty"){
            res = await requestToServer("/packages", 'GET');
        }else{
            res = await requestToServer(`/search/${searchInput}`, 'GET');
        }

        if(res.ok){
            this.setState({data: res.data});
        }else{
            redirect(res.onError, this.props);
        }
    }

    async componentDidMount(){
        await this.getData();
    }

    componentDidUpdate(prevProps,prevState, snapshot) {
        if (this.props.match.params.input !== prevProps.match.params.input) {
            this.getData();
        }
    }

    render() {
        return (
        <div className="MainScreen">
            <PageDescription pageName = "Perfect Present Package" pageInfo={this.pageInfo}/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ProductsGrid
                    {...this.props}
                    gridData={this.state.data}
                    elementsType="Package"
                    numOfProductsInRow={3}
                />
            </div>
            </div>
        );
    }
}

export default withRouter(MainScreen);