import React from "react";
import PackageBox from "./PackageBox";
import Item from "./Item";
import Package from "./Package";
import TextField from "@material-ui/core/TextField";
import CartProduct from "./CartProduct";

function ProductsGrid(props) {
    function splitDataToRows(data, numOfProductsInRow) {
        let rowArr = [];
        let dataArr = [];

        for(let i = 0; i < data.length; i++) {
            rowArr.push(data[i]);

            if((i + 1) % numOfProductsInRow === 0 || i === (data.length -1)) {
                dataArr.push(rowArr);
                rowArr = [];
            }
        }

        return dataArr;
    }
    const arrOfGridRows = splitDataToRows(props.gridData, props.numOfProductsInRow);

    return (
        <table>
            <tbody>
            {arrOfGridRows.map((rowData, i) =>
                <GridRow {...props}
                         key={i}
                         typeOfElements={props.elementsType}
                         itemsRowData={rowData}
                         mutualData={props.mutualData}
                         errorData = {props.errorData}
                />
            )}
            </tbody>
        </table>
    );
}

class GridRow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            elemType: props.typeOfElements,
        };
    }

    getElement(elementData, mutualData, elementErrorData) {
        switch(this.state.elemType) {
            case "Box":
                return <PackageBox picSrc ={elementData.picSrc}
                                   productId={elementData.productId}
                                   onChangeSelection = {mutualData.onChangeSelection}
                />;
            case "Item":
                return <Item picSrc={elementData.picSrc}
                             description={elementData.description}
                             price={elementData.price}
                             productId={elementData.productId}
                             onChangeSelection = {mutualData.onChangeSelection}
                />;
            case "Package":
                return <Package {...this.props}
                                id={elementData.productId}
                                picSrc={elementData.picSrc}
                                price={elementData.price}
                                products={elementData.products}
                />
            case "TextForm":
                return <TextField
                    name={elementData.name}
                    label={elementData.label}
                    type={elementData.type}
                    defaultValue = {elementData.defaultValue}
                    disabled={elementData.disabled}
                    error={elementErrorData[elementData.name].error}
                    onBlur = {mutualData.updateState}
                    helperText={elementErrorData[elementData.name].helperText}
                />
            case "CartProduct":
                return <CartProduct picSrc={elementData.picSrc}
                                      packagePrice={elementData.price}
                                      amount={elementData.amount}
                                      cardPrices={elementData.card}
                                      onClick={() => mutualData.onClick(elementData)}
                                      products={elementData.products}
                />
            default:
                return null;
        }
    }

    render() {
        const rowData=this.props.itemsRowData;
        const mutualData = this.props.mutualData;
        const elementErrorData = this.props.errorData;

        return (
            <tr>
                {rowData.map((elementData, j)=>
                    <td key={j}>
                        {this.getElement(elementData, mutualData, elementErrorData)}
                    </td>
                )}
            </tr>
        );
    }
}

export default ProductsGrid;