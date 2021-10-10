import React from "react";
import {Slider, Typography} from "@material-ui/core";
import DropDownList from "../general/DropDownList";
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import PageDescription from "../general/PageDescription";
import redirect from "../../siteGlobalActions/redirect";
import { withRouter } from 'react-router-dom';


class FilterPackagesScreen extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            celebration: "",
            budget: [0,0],
            gender: "",
            isDataLoaded: false
        };

        this.handleFilterPackages = this.handleFilterPackages.bind(this);
    }

    handleCelebration(event){
        const value = event.target.value;
        this.setState({celebration: value});
    }

    handleGender(event){
        const value = event.target.value;
        this.setState({gender: value});
    }

    handleSlider(value){
        this.setState({budget: value});
    }

    handleFilterPackages(){
        const category = this.state.celebration.toLowerCase();
        const minVal = this.state.budget[0];
        const maxVal = this.state.budget[1];
        const gender = this.state.gender.toLowerCase();

        filterPackages(category,minVal,maxVal,gender, this.props);
    }

    async componentDidMount() {
        await this.setAllFiltersOptions();
    }

    convertTextToLabel(text) { //Change first letter to upper-case
        return text.toString().charAt(0).toUpperCase() + text.slice(1);
    }

    async setAllFiltersOptions() {
        const fetchResult = await requestToServer("/packagesFiltersOptions", "GET");
        if(fetchResult.ok) {
            const allFiltersOptions = fetchResult.data;
            this.celebrationOptions = allFiltersOptions.categories.map(category =>
                this.convertTextToLabel(category));
            this.genderOptions = allFiltersOptions.genders.map(gender =>
                this.convertTextToLabel(gender));
            this.budgetOptions = [allFiltersOptions.minimalPrice, allFiltersOptions.maximalPrice];
            this.setState({celebration: this.celebrationOptions[0]});
            this.setState({gender: this.genderOptions[0]});
            this.setState({budget: this.budgetOptions});
            this.setState({isDataLoaded: true});
        } else {
            redirect(fetchResult.onError, this.props);
        }
    }

    render() {
        if(this.state.isDataLoaded) {
            return (
                <div id="packageAdvisorBody">
                    <PageDescription pageName="Package Advisor"
                                     pageInfo="Let us help you find the perfect package for you!"/>
                    <div id="chooseFiltersForm" style={{margin: 50, alignContent: "center"}}>
                        <div id="leadingQuestions" style={questionsContainerStyle}>
                            <FormQuestion
                                questionSubject="celebration"
                                questionText="What does the receiver celebrating?"
                                ansOptionsType="Picklist"
                                ansOptions={this.celebrationOptions}
                                onChange={(event) => this.handleCelebration(event)}
                            />
                            <FormQuestion
                                questionSubject="budget"
                                questionText="Your budget:"
                                ansOptionsType="Slider"
                                ansOptions={this.budgetOptions}
                                onChange={(value) => this.handleSlider(value)}
                            />
                            <FormQuestion
                                questionSubject="gender"
                                questionText="The receiver's gender:"
                                ansOptionsType="Picklist"
                                ansOptions={this.genderOptions}
                                onChange={(event) => this.handleGender(event)}
                            />
                        </div>
                        <br/>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <input type="button" value="Show me my options" id="buttonFilterResults"
                                   onClick={this.handleFilterPackages}
                                   style={{padding: '10px 20px 10px 20px', fontWeight: "bold"}}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <h2>Load data...</h2>
        }
    }
}

async function filterPackages(category,minVal,maxVal,gender, props){
    const path = `/filter/${category}/${minVal}/${maxVal}/${gender}`;
    props.history.push("/SelectedPackagesScreen", [path]);
}

const questionsContainerStyle = {
    backgroundColor: "lightgray",
    margin: "auto",
    alignment: "center",
    width: "max-content"
}

class FormQuestion extends React.Component {
    getAnsElement()
    {
        switch (this.props.ansOptionsType) {
            case "Picklist":
                return <DropDownList listOptions={this.props.ansOptions}
                                     listSubject={this.props.questionSubject}
                                     onChange={(event) => this.props.onChange(event)}
                />;
            case "Slider":
                const minVal = this.props.ansOptions[0];
                const maxVal = this.props.ansOptions[1];
                return (
                    <div>
                        <Slider className={this.props.questionSubject}
                                valueLabelDisplay="auto"
                                min={minVal}
                                max={maxVal}
                                defaultValue={[minVal,maxVal]}
                                style={{width: 200}}
                                onChange={(_,value) => this.props.onChange(value)}
                        />
                        <Typography id="range-slider" gutterBottom variant={"caption"}>   *Range: {minVal}-{maxVal}</Typography>
                    </div>
                );
            default:
                alert("No such answer's options type");
                break;
        }
    }

    render() {
        return (
            <div className="questionForFilter">
                <label htmlFor={this.props.questionSubject}> {this.props.questionText} </label>
                <span style={answerOptionsStyle}> {this.getAnsElement()} </span>
                <br/> <br/>
            </div>
        );
    }
}

const answerOptionsStyle = {
    display: "inline-block",
    marginLeft: "10px",
};

export default withRouter(FilterPackagesScreen);