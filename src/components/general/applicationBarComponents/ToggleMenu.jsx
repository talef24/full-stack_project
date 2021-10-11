import React from "react";
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core/styles";
import {Menu, MenuItem} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import redirect from "../../../siteGlobalActions/redirect";

function ToggleMenu(props) {
    const [menu, setMenu] = React.useState(null);
    const isMenuOpen = Boolean(menu);

    const onClickMenuIcon = (event) => {
        setMenu(event.currentTarget);
    };

    const handleClose = () => {
        setMenu(null);
    };

    handleClose.bind(this);

    return (
        <div>
            <IconButton
                edge={props.edge}
                className={props.menuButton}
                color="inherit"
                aria-label="toggle-menu icon"
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={onClickMenuIcon}
            >
                {props.menuIcon}
            </IconButton>
            <StyledMenu
                anchorEl={menu}
                keepMounted
                open={isMenuOpen}
                onClose={handleClose}
            >
                {props.menuItemsData.map((menuItem,key) =>
                    <StyledMenuItem key={key} onClick={() => onClickMenuItem(menuItem, props, handleClose)}>
                        <ListItemIcon>
                            {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={menuItem.text} />
                    </StyledMenuItem>
                )}
            </StyledMenu>
        </div>
    )
}

async function onClickMenuItem(menuItem, props, closeMenuFunc) {
    if(menuItem.text === "Logout") {
        props.onLogout(props);
        redirect("/login", props);
    } else {
        closeMenuFunc();
        redirect(menuItem.pageLinked, props);
    }
}

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));
const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default ToggleMenu;