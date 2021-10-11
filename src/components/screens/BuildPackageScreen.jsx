import React from "react";
import ProductsGrid from "../general/ProductsGrid";
import sendReqToServer from '../../siteGlobalActions/sendReqToServer';
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";

class BuildPackageScreen extends React.Component {
    borderError = "3px solid red";
    noError = "";
    boxValidationMessage = "You must choose a box";
    itemsValidationMessage = "You must choose at least 2 items";
    pageName = "Pick & Pack - Build your own package";
    pageInfo = `You can build your own package!
                 Choose your desired items and match a designed box.`

    constructor(props) {
        super(props);
        this.onChoosingBox = this.onChoosingBox.bind(this);
        this.itemsData = this.getData("items");
        this.onChangingItemSelection = this.onChangingItemSelection.bind(this);
        this.state = {
            boxesData: [],
            itemsData: [],
            chosenBox: null,
            chosenItems: [],
            isBoxValid: true,
            isItemsValid: true
        };
    }

    componentDidMount(){
        this.getData("boxes");
    }

    async getData() {
        const fetchBoxes = await sendReqToServer(`/boxes`, "GET");
        const fetchItems = await sendReqToServer(`/items`, "GET");

        if (fetchBoxes.ok && fetchItems.ok) {
            this.setState({boxesData: fetchBoxes.data});
            this.setState({itemsData: fetchItems.data});
        } else {
            redirect(fetchBoxes.onError, this.props);
        }
    }

    onChoosingBox(event) {
        const clickedRadioButton = event.target;
        const clickedBoxId = clickedRadioButton.id;
        if(clickedRadioButton.checked) {
            this.setState({chosenBox: clickedBoxId});
        }
    }

    onChangingItemSelection(event) {
        const clickedCheckbox = event.target;
        const clickedItemId = clickedCheckbox.id;
        let newChosenItems = this.state.chosenItems;
        clickedCheckbox.checked ?
            newChosenItems.push(clickedItemId)
            :
            newChosenItems.splice(newChosenItems.indexOf(clickedItemId), 1);
        this.setState({chosenItems: newChosenItems});
    }

    async finishPackageBuilding() {
        const reqBody = {
            chosenBox: this.state.chosenBox,
            chosenItems: this.state.chosenItems,
        }
        const fetchRes = await sendReqToServer("/processBuiltPackage", "POST", reqBody);
        if(fetchRes.ok) {
            alert("Package successfully built");
            redirect("/mainScreen", this.props);

        } else {
            if(fetchRes.status === 400) { //bad request params
                this.handleInvalidInput(fetchRes.data.validationDetails);
            } else {
                redirect(fetchRes.onError, this.props);
            }
        }
    }

    handleInvalidInput(validationDetails) {
        const keys = Object.keys(validationDetails);
        keys.forEach(key => {
            const keyWithUpper = key.charAt(0).toUpperCase() + key.slice(1);
            const matchingState = `is${keyWithUpper}Valid`;
            const isValid = validationDetails[key];
            if(this.state[matchingState] !== isValid) {
                this.setState({[matchingState]: isValid});
            }
        })

        window.scrollTo(0, 0); //scroll the page up
    }

    getBorder(isValid) {
        return isValid ? this.noError : this.borderError;
    }

    render() {
        return (
            <div className="BuildPackageScreen">
                <PageDescription pageName={this.pageName} pageInfo={this.pageInfo}/>
                <div className = "chooseBoxSection">
                    <h3 style={{border: this.getBorder(this.state.isBoxValid)}}>Step 1: Choose box</h3>
                    <p style={{color: "red"}}>{this.state.isBoxValid ? this.noError : this.boxValidationMessage}</p>
                    <ProductsGrid gridData={this.state.boxesData}
                                  mutualData={{onChangeSelection: this.onChoosingBox}}
                                  elementsType="Box"
                                  numOfProductsInRow={4}
                    />
                </div>
                <hr/>
                <div className = "chooseItemsSection">
                    <h3 style={{border: this.getBorder(this.state.isItemsValid)}}>Step 2: Choose items</h3>
                    <p style={{color: "red"}}>{this.state.isItemsValid ? this.noError : this.itemsValidationMessage}</p>
                    <ProductsGrid gridData={this.state.itemsData}
                                  mutualData={{onChangeSelection: this.onChangingItemSelection}}
                                  elementsType="Item"
                                  numOfProductsInRow={4}
                    />
                </div>
                <br/>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <input type="button"
                           value="Finish"
                           onClick={this.finishPackageBuilding.bind(this)}
                           style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                    />
                </div>
            </div>
        );
    }
}

export default BuildPackageScreen;