import React from "react";
import PageDescription from "../general/PageDescription";
import TextField from "@material-ui/core/TextField";
import DropDownList from "../general/DropDownList";
import sendReqToServer from "../../siteGlobalActions/sendReqToServer";
import redirect from "../../siteGlobalActions/redirect";
import {withRouter} from "react-router-dom";

function CheckOutScreen(props){
    const paymentFieldsInfo = {
        creditCardNumber: {
            defaultValue: "",
            helperText: "",
            errorHelperText: "Should contain 16 digits"
        },
        expirationMonth: {
            defaultValue: 1,
            helperText: "Month"
        },
        expirationYear: {
            defaultValue: new Date().getFullYear(),
            helperText: "Year"
        },
        cvv: {
            defaultValue: "",
            helperText: "The last three digits on the back of the card",
            errorHelperText: "Should contain 3 digits"
        },
    };

    return(
        <div>
            <PageDescription pageName={"Check out"} pageInfo={`Please enter your credit card details`}/>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <PaymentForm {...props} fieldsConstData={paymentFieldsInfo}/>
            </div>
        </div>
    );
}

class PaymentForm extends React.Component{
    constructor(props) {
        super(props);
        this.updateInput = this.updateInput.bind(this);
        this.payment = this.payment.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        const fieldsConstData = this.props.fieldsConstData;
        const fields = Object.keys(fieldsConstData);
        let initialState = {};
        fields.forEach(field => {
            initialState[field] = {
                currentValue: fieldsConstData[field].defaultValue,
                helperText: fieldsConstData[field].helperText,
                error: false
            }
        });

        initialState.expirationMessage = "";
        initialState.isExpirationValid = {
            helperText: "",
            error: false
        }

        return initialState;
    }

    updateInput = event => {
        const {
            target: { id, value }
        } = event;

        this.updateFieldState(id, {currentValue: value});
    };

    updateFieldState(field, toUpdate) {
        const keysToUpdate = Object.keys(toUpdate);
        const updatedState = this.state[field];
        keysToUpdate.forEach(key => {
            updatedState[key] = toUpdate[key];
        });

        this.setState({[field]: updatedState});
    }

    setError(field) {
        const updatedText = field === "isExpirationValid" ?
            "Expiration date is not valid - this date already passed" :
            this.props.fieldsConstData[field].errorHelperText;
        const toUpdate = {
            error: true,
            helperText: updatedText
        }
        this.updateFieldState(field, toUpdate);
    }

    unsetError(field) {
        const updatedText = field === "isExpirationValid" ?
            "" :
            this.props.fieldsConstData[field].helperText;
        const toUpdate = {
            error: false,
            helperText: updatedText
        }
        this.updateFieldState(field, toUpdate);
    }

    async payment() {
        const reqBody = this.getAllInputs();
        const fetchRes = await sendReqToServer('/payment', "POST", reqBody);
        if(fetchRes.ok) {
            alert("Thank you for buying at PPP !");
            redirect("/mainScreen", this.props)
        } else {
            if(fetchRes.status === 400) {
                this.handleInvalidInput(fetchRes.data.validationDetails);
            } else {
                redirect(fetchRes.onError, this.props);
            }
        }
    }

    getAllInputs() {
        let allValues = {};
        const allFields = Object.keys(this.props.fieldsConstData); //without isExpirationValid
        allFields.forEach((field) => {
            allValues[field] = this.state[field].currentValue;
        });

        return allValues;
    }

    handleInvalidInput(validationDetails) {
        Object.keys(validationDetails).forEach(key => {
            const isFieldValid = validationDetails[key];
            if(!isFieldValid) {
                this.setError(key);
            } else {
                if(this.state[key].error) { //if was not valid in the last click but now it is valid.
                    this.unsetError(key);
                }
            }
        });
    }

    getTextField(fieldID, label) {
        const fieldState = this.state[fieldID];
        const fieldsErrorState = this.state[fieldID].error;

        return (
            <TextField
                id = {fieldID}
                label = {label}
                onBlur = {this.updateInput}
                error = {fieldsErrorState}
                helperText = {fieldState.helperText}
            />
        )
    }

    getExpirationLists() {
        function createRangeArray(start, stop, step) {
            return Array.from({ length: (stop - start) / step + 1},
                (_, i) => start + (i * step));
        }

        const currentYear = new Date().getFullYear();
        const listsData = [
            {
                listOptions: createRangeArray(1, 12, 1),
                listSubject: "expirationMonth"
            },
            {
                listOptions: createRangeArray(currentYear, currentYear+10, 1),
                listSubject: "expirationYear"
            }
        ];

        return listsData.map((list, key) =>
            <DropDownList
                key={key}
                listOptions = {list.listOptions}
                listSubject = {list.listSubject}
                onChange = {this.updateInput}
                error = {this.state[list.listSubject].error}
            />
        );
    }

    render() {
        return(
            <div>
                {this.getTextField("creditCardNumber", "Credit card number")}
                <br/> <br/>
                <span style={{color: "gray"}}>Expiration date: </span>
                {this.getExpirationLists()}
                <br/>
                <span style={{color: "red", fontSize: "small"}}> {this.state.isExpirationValid.helperText}</span>
                <br/>
                {this.getTextField("cvv", "CVV")}
                <br/> <br/>
                <input type="button"
                       value="Payment"
                       onClick={this.payment}
                       style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                />
                <input type="button"
                       value="Back to cart"
                       onClick={() => redirect("/cartScreen", this.props)}
                       style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                />
            </div>
        );
    }
}

export default withRouter(CheckOutScreen);