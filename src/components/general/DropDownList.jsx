import React from "react";
import {Select} from "@material-ui/core";

class DropDownList extends React.Component {
    buildListOptions() {
        const originalList = this.props.listOptions;
        return originalList.map((option, key) => <option value = {option} key={key}>{option}</option>);
    }

    render() {
        const subject = this.props.listSubject;
        return (
            <Select native error={this.props.error} id={subject} label={subject} onChange={this.props.onChange}>
                {this.buildListOptions()}
            </Select>
        );
    }
}

export default DropDownList;