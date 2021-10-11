const ApiError = require('../error/ApiError');
const requiredFormats = {
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/ ,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    firstName: /\w+/,
    lastName: /\w+/,
    address: /[a-zA-Z]+ [0-9]+/,
    city: /\w+/,
    region: /\w+/,
    telephone: /^([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    creditCardNumber: /^[0-9]{16}$/,
    cvv: /^[0-9]{3}$/,
    expirationMonth: /^([1-9]|1[0-2])$/,
    //expirationYear: /^[0-9]{3}$/,
}
const errorMessages = {
    email: "This is not a valid email" ,
    password: "Password must be at least 8 characters and contains capital letter, lowercase letter, digit and symbol",
    repeatedPassword: "Not equals to password",
    firstName: "Should contain only letters",
    lastName:  "Should contain only letters",
    address: "Should contain street name and number",
    city:  "Should contain only letters",
    region:  "Should contain only letters",
    telephone: "Should contain 10 digits",
    creditCardNumber: "Should contain 16 digits",
    cvv: "Should contain 3 digits",
    expirationMonth: "",
    //expirationYear: /^[0-9]{3}$/,
    isExpirationValid: "Expiration date is not valid - this date already passed"
}

function inputValidation(req, res, next) {
    const data = req.body;
    if (data) {
        if (validationIsNeeded(data)) {
            const validationObj = checkValidation(data);
            if (!validationObj.isFormatsValid) {
                next(ApiError.badRequest(JSON.stringify(validationObj)));
                return;
            }
        }
    }
    next();
}

function validationIsNeeded(obj){
    let validationNeeded = false;
    const keys = Object.keys(obj);
    for(let i=0; i<keys.length; i++){
        if(Object.keys(requiredFormats).includes(keys[i])){
            validationNeeded = true;
            break;
        }
    }

    return validationNeeded;
}

function checkValidation(input) {
    const errorsDetails = {};
    const validationDetails = {};
    const inputKeys = Object.keys(input);
    const requiredFormatsKeys = Object.keys(requiredFormats);

    inputKeys.forEach(key => {
        errorsDetails[key] = errorMessages[key];
        switch(key) {
            case("repeatedPassword"):
                validationDetails[key] = input[key] === input["password"];
                break;
            case("expirationYear"):
                const month = parseInt(input["expirationMonth"]);
                const year = parseInt(input["expirationYear"]);
                validationDetails["isExpirationValid"] = checkIfExpirationValid(month, year);
                break;
            default:
                if(requiredFormatsKeys.includes(key)) {
                    validationDetails[key] = requiredFormats[key].test(input[key]);
                }
                break;
        }
    });

    return {
        isFormatsValid: !Object.values(validationDetails).includes(false),
        validationDetails: validationDetails,
        errorsDetails: errorsDetails
    }
}

function checkIfExpirationValid(month, year) {
    const todayDate = new Date();
    const isCurrentYear = year === todayDate.getFullYear();
    const isMonthPassed = month >= todayDate.getMonth();
    //If it is the current year - check if the month didn't pass, otherwise - check year is not passed
    return isCurrentYear ? isMonthPassed : year >= todayDate.getFullYear();
}

module.exports = inputValidation;