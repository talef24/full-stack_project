import React from "react";
import ProductsGrid from '../general/ProductsGrid';
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import {withRouter} from "react-router-dom";
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";
import getSearchResultInfo from "../../siteGlobalActions/getSerachResultInfo";

class SelectedPackagesScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data: [],
        }
    }

    async getData(){
        const path = this.props.history.location.state;
        const res = await requestToServer(path[0], 'GET');
        if(res.ok){
            this.setState({data: res.data});
        }else{
            redirect(res.onError, this.props);
        }
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return (
            <div className="MainScreen">
                <PageDescription
                    pageName = "Perfect Present Package"
                    pageInfo= {getSearchResultInfo(this.state.data)}
                />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ProductsGrid {...this.props} gridData={this.state.data} elementsType="Package" numOfProductsInRow={3}/>
                </div>
                <br/>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <button
                        onClick={() => this.props.history.push("/filterPackage")}
                        style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                    >
                        Back To Advanced Search
                    </button>
                </div>

            </div>
        );
    }
}

export default withRouter(SelectedPackagesScreen);