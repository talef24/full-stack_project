import React from "react";
import ProductsGrid from "./ProductsGrid";
import sendReqToServer from "../../siteGlobalActions/sendReqToServer";
import redirect from "../../siteGlobalActions/redirect";

class TextForm extends React.Component {
    constructor(props) {
        super(props);
        this.fieldsInfo = this.props.fieldsInfo;
        this.onInputChanged =  this.onInputChanged.bind(this);
        this.state = this.setFieldsProperties();
    }

    onInputChanged = event => {
        const {
            target: { name, value }
        } = event;

        this.updateFieldState(name, {currentValue: value});
    };

    setFieldsProperties() {
        let initialState = {};
        this.props.fieldsInfo.forEach(field => {
            initialState[field.name] = {
                currentValue:  field.defaultValue,
                helperText: "",
                error: false
            }
        });
        return initialState;
    }

    getAllInputs() {
        let allValues = {};

        const allFields = Object.keys(this.state);
        allFields.forEach((field) => {
            allValues[field] = this.state[field].currentValue;
        });

        return allValues;
    }

    async submitTextForm() {
        const reqBody = this.getAllInputs();
        const fetchRes = await sendReqToServer(this.props.relativePathOnSubmit, this.props.httpMethodOnSubmit, reqBody);
        if(fetchRes.ok) {
            this.props.onSuccessfulSubmission();
        }
        else {
           if(fetchRes.status === 400) { //bad request params
               const responseData = fetchRes.data;
               if(typeof(responseData) === "object") {
                   Object.keys(responseData).includes("isFormatsValid") ?
                       this.markInvalidFields(fetchRes.data) :
                       alert(fetchRes.data);
               } else {
                   alert(fetchRes.data);
               }
           } else {
               redirect(fetchRes.onError, this.props);
           }
       }
    }

    markInvalidFields(validationData) {
        const validationDetails = validationData.validationDetails;
        const errorsDetails = validationData.errorsDetails;
        Object.keys(validationDetails).forEach(key => {
            const isFieldValid = validationDetails[key];
            const toUpdate = {
                error: !isFieldValid,  //If isFieldValid=false -> error should be set to true
                helperText: isFieldValid ? "" : errorsDetails[key], //If isFieldValid=false -> error message
            }
            this.updateFieldState(key, toUpdate);
        })
    }

    updateFieldState(field, updatedData) { //updatedData = only the keys&values we need to update
        const keysToUpdate = Object.keys(updatedData);
        const updatedState = this.state[field];
        keysToUpdate.forEach(key => {
            updatedState[key] = updatedData[key];
        });

        this.setState({[field]: updatedState});
    }

    render()
    {
        return (
            <form>
                <div>
                    <ProductsGrid
                        gridData={this.props.fieldsInfo}
                        mutualData={{updateState: this.onInputChanged}}
                        errorData={this.state}
                        elementsType="TextForm"
                        numOfProductsInRow={3}
                    />
                    <br/>
                    <input type="button"
                           value={this.props.submitButtonValue}
                           onClick={this.submitTextForm.bind(this)}
                    />
                </div>
            </form>
        );
    }
}

export default TextForm;