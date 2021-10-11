import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PageDescription from "../general/PageDescription";
import TextForm from "../general/TextForm";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PersonalDetailsIcon from '@material-ui/icons/PersonPin';
import PasswordIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import requestToServer from "../../siteGlobalActions/sendReqToServer";
import {withRouter} from "react-router-dom";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import redirect from "../../siteGlobalActions/redirect";
import createFieldInfo from "../../siteGlobalActions/createTextFormFieldInfo";

function AccountScreen(props){
    const tabs = {
        0: <PersonalDetailsForm {...props}/>,
        1: <PasswordForm {...props}/>,
    }

    return(
        <div>
            <AccountTabs tabs={tabs}/>
        </div>
    );
}

class PersonalDetailsForm extends React.Component{
    constructor(props) {
        super(props);
        this.onSuccessfulSubmission =  this.onSuccessfulSubmission.bind(this);
        this.pageName = "My Account";
        this.pageInfo = `You can access and change your personal details (name, billing address, phone number, etc.) 
            to facilitate your future buying process and notify us of any change in your contact information.`;
        this.state = {
            data: [],
        }
        this.getData();
    }

    convertToLabel(key) {
        let keyWithSpaces = key.replace( /([A-Z])/g, " $1" );
        return keyWithSpaces.charAt(0).toUpperCase() + keyWithSpaces.slice(1);
    }

    setFieldsInfo(defaultValues) {
        const fieldsInfo = [];
        const keys = Object.keys(defaultValues);
        keys.forEach(key => {
            let type;
            let options = {};
            switch(key) {
                case(key.toLowerCase().includes("password")):
                    type = "password";
                    break;
                case("email"):
                    type = "email";
                    options.disabled = true;
                    break;
                default:
                    type = "text";
                    break;
            }
            options.defaultValue = defaultValues[key];
            const currentField = createFieldInfo.fieldInfoObject(key, this.convertToLabel(key), type, options);
            fieldsInfo.push(currentField);
        });

        return fieldsInfo;
    }

    async getData(){
        const res = await requestToServer("/getPersonalDetails", 'GET');

        if(res.ok){
            const organizedData = await this.setFieldsInfo(res.data);
            this.setState({data: organizedData});
        }else{
            redirect(res.onError, this.props);
        }
    }

    onSuccessfulSubmission() {
        alert("Data successfully updated");
        this.getData();
    }

    render() {
        const dataIsNotLoadedYet = this.state.data.length === 0;
        if(dataIsNotLoadedYet) {
            return <h2>Loading data...</h2>
        } else {
            return (
                <div>
                    <PageDescription pageName={this.pageName} pageInfo={this.pageInfo}/>
                    <TextForm
                        fieldsInfo={this.state.data}
                        submitButtonValue="Update personal details"
                        relativePathOnSubmit="/updatePersonalDetails"
                        httpMethodOnSubmit = "PUT"
                        onSuccessfulSubmission = {this.onSuccessfulSubmission}
                    />
                </div>
            );
        }
    }
}

function PasswordForm(props) {
    const pageInfo = `If you want to change your password to access your account,
     you must provide the following information:`
    const fieldsInfo = [
        createFieldInfo.fieldInfoObject("password", "New password", "password", {}),
        createFieldInfo.fieldInfoObject("repeatedPassword", "Repeat Password", "password", {}),
    ];

    function onSuccessfulSubmission() {
        alert("Password successfully changed");
    }

    return (
        <div>
            <PageDescription pageName={"Change password"} pageInfo={pageInfo}/>
            <TextForm
                {...props}
                fieldsInfo={fieldsInfo}
                relativePathOnSubmit="/changePassword"
                httpMethodOnSubmit = "PUT"
                submitButtonValue="Change password"
                onSuccessfulSubmission = {onSuccessfulSubmission}
            />
        </div>
    )
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Tabs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AccountTabs(props) {
    const useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
        },
        tabs: {
            borderRight: `1px solid ${theme.palette.divider}`,
        },
    }));
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper square className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                indicatorColor="secondary"
                textColor="secondary"
                className={classes.tabs}
                orientation="vertical"
                /*aria-label="icon label tabs example"*/
            >
                <Tab icon={<PersonalDetailsIcon />} label="Personal details" />
                <Tab icon={<PasswordIcon />} label="Change your password" />
                {props.isAdmin === true ?
                    <Tab icon={<SupervisorAccountIcon />} label="Admin" />
                    :
                    null
                }
            </Tabs>
            <TabPanel value={value} index={0}>
                {props.tabs[0]}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {props.tabs[1]}
            </TabPanel>
            {props.isAdmin === true ?
                <TabPanel value={value} index={2}>
                    {props.tabs[2]}
                </TabPanel>
                :
                null
            }
        </Paper>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`a11y-tabpanel-${index}`}
            //aria-labelledby={`a11y-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default withRouter(AccountScreen);