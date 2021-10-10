function fieldInfoObject(fieldName, fieldLabel, fieldType, options) {
    return {
        name: fieldName,
        label: fieldLabel,
        type: fieldType,
        defaultValue: options.defaultValue ? options.defaultValue : "",
        disabled: options.disabled ? options.disabled : false
    }
}

module.exports = {
    fieldInfoObject,
};

