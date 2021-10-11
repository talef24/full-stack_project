import React from "react";
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { alpha, makeStyles } from '@material-ui/core/styles';
import redirect from "../../siteGlobalActions/redirect";
import SiteLogo from "../../logoPPP.png";
import SearchBar from "./SearchBar";
import ShoppingCartButton from "./applicationBarComponents/ShoppingCartButton";
import SiteMenu from "./applicationBarComponents/SiteMenu";
import AccountMenu from "./applicationBarComponents/AccountMenu";

function ApplicationBar(props){
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <SiteMenu {...props} menuButton = {classes.menuButton}/>
                    <LinkedSiteLogo {...props} className={classes.title}/>
                    <ShoppingCartButton {...props} />
                    <SearchBar onSearch={(event) => findSearchInput(event, props)}/>
                    <AccountMenu {...props} />
                </Toolbar>
            </AppBar>
        </div>
    );
}

function LinkedSiteLogo(props) {
    return (
        <IconButton
            className={props.className}
            onClick={() => redirect("/mainScreen", props)}
        >
            <img
                src={SiteLogo}
                alt="site logo"
                height="50"
            />
        </IconButton>
    );
}

async function findSearchInput(event, props){
    if (event.key === 'Enter'){
        let input = event.target.value;
        if(input === ""){
            props.history.push("/mainScreen");
        }else{
            props.history.push("/searchPackage/" + input);
        }
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        position: 'relative',
        display: 'none',
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(5),
        [theme.breakpoints.up("xs")]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default withRouter(ApplicationBar);

