import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {IconButton, Box, Collapse, Typography, Paper} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PageDescription from "../general/PageDescription";
import SearchBar from "../general/SearchBar";
import sendReqToServer from "../../siteGlobalActions/sendReqToServer";
import redirect from "../../siteGlobalActions/redirect";


class AdminScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredMode: false,
        };
        this.filterUsersActivity = this.filterUsersActivity.bind(this)
    }

    async getAllData(){
        await this.getData('/getUsersActivity', false);
    }

    async getData(fetchRelativePath, isFilteredMode){
        const fetchRes = await sendReqToServer(fetchRelativePath, "GET");
        if(fetchRes.ok) {
            this.setState({data: fetchRes.data});
            this.setState({filteredMode: isFilteredMode});
        } else {
            redirect(fetchRes.onError, this.props);
        }
    }

    async componentDidMount(){
        await this.getAllData();
    }

    async getFilteredData(textToFilterBy) {
        await this.getData(`/getFilteredUsersActivity/${textToFilterBy}`, true);
    }

    async filterUsersActivity(event) {
        if (event.key === 'Enter') {
            const textToSearch = event.target.value;
            if(textToSearch === "") {
                await this.getAllData();
            } else {
                await this.getFilteredData(textToSearch);
            }

        }
    }

    render() {
        return (
            <div>
                <PageDescription pageName={"Admin page"} pageInfo={`Here you can see the users' activity`}/>
                <SearchBar style={{border: "1px solid black"}} onSearch={this.filterUsersActivity}/>
                <br/>
                {this.state.filteredMode === true ?
                    this.state.data.length !== 0 ?
                        <p>Found {this.state.data.length} results</p> :
                        "" : ""
                }
                {this.state.data.length === 0 ?
                    <h4>No activities found</h4>
                    :
                    <UsersActivitiesTable {...this.props} rows={this.state.data}/>}
            </div>
        )
    }
}

function ActivitiesTableHead(props) {
    return (
        <TableHead>
            <TableRow>
                {props.tableHeaders.map((currentHeader, key) =>
                    <TableCell key={key} align="left" style={props.style}><b>{currentHeader}</b></TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

function UsersActivitiesTable(props) {
    const tableHeaders = ["", "User", "Logins", "Logouts", "Purchases"];
    const headerStyle = {
        backgroundColor: "black",
        color: "white"
    }
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <ActivitiesTableHead tableHeaders={tableHeaders} style={headerStyle}/>
                <TableBody>
                    {arrangeData(props.rows).map((row, key) => (
                        <Row key={key} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function splitActivitiesToRows(userActivities) {
    let rows = [];
    const userLogins = userActivities.logins;
    const userLogouts = userActivities.logouts;
    const userPurchases = userActivities.purchases;
    let maxArrSize = Math.max(userLogins.length, userLogouts.length, userPurchases.length);

    for(let i = 0; i < maxArrSize; i++) {
        rows.push({
            logins: getCurrentActivity(userLogins, i),
            logouts: getCurrentActivity(userLogouts, i),
            purchases: getCurrentActivity(userPurchases, i)
        });
    }

    function getCurrentActivity(userActivity, index) {
        let currentActivity = "";
        if(index < userActivity.length) {
            currentActivity = userActivity[index];
        }

        return currentActivity;
    }

    return rows;
}

function arrangeData(usersActivity) {
    let rows = [];
    usersActivity.forEach(user => {
        rows.push({
            user: user.firstName,
            lastLogin: getLastActivity(user.logins),
            lastLogout: getLastActivity(user.logouts),
            lastPurchase: getLastActivity(user.purchases),
            allUserActivity: splitActivitiesToRows(user)
        })
    });

    return rows;
}

function getLastActivity(activityArr) {
    return activityArr.length !== 0 ? activityArr[activityArr.length - 1] : "";
}

function LastActivityCell(props) {
    return (
    <TableCell align="left">
        {props.lastActivity ?
            <span>
                <span style={{textDecoration: "underline"}}>{props.description}:</span> {props.lastActivity}
            </span>
            : "No activities yet"}
    </TableCell>
        )
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.user}
                </TableCell>
                <LastActivityCell description="Last login" lastActivity={row.lastLogin}/>
                <LastActivityCell description="Last logout" lastActivity={row.lastLogout}/>
                <LastActivityCell description="Last purchase" lastActivity={row.lastPurchase}/>
            </TableRow>
            <TableRow style={{backgroundColor: "lightgray"}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                All <b>{row.user}</b>'s activities:
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <ActivitiesTableHead tableHeaders={["Logins", "Logouts", "Purchases"]}/>
                                <TableBody>
                                    {row.allUserActivity.map((userActivitiesRow, key) => (
                                        <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                                {userActivitiesRow.logins}
                                            </TableCell>
                                            <TableCell>{userActivitiesRow.logouts}</TableCell>
                                            <TableCell>{userActivitiesRow.purchases}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// ****************************************** STYLE ******************************************
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    search: {
        position: 'relative',
    },
    searchIcon: {
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

export default AdminScreen;