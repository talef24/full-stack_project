import React from "react";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ToggleMenu from "./ToggleMenu";

function AccountMenu(props) {
    const itemsData = [
        {
            pageLinked: "/accountScreen",
            icon: <AccountBoxIcon fontSize="small" />,
            text: "My account"
        },
        {
            pageLinked: "/logout",
            icon: <ExitToAppIcon fontSize="small" />,
            text: "Logout"
        },
    ];

    if(props.isAdmin) {
        itemsData.unshift(
            {
                pageLinked: "/admin",
                icon: <SupervisorAccountIcon fontSize="small" />,
                text: "Admin screen"
            }
        )
    }

    return (
        <ToggleMenu
            {...props}
            menuButton = {props.menuButton}
            menuIcon = {<AccountCircleIcon fontSize="large"/>}
            edge="end"
            menuItemsData = {itemsData}
        />
    )
}

export default AccountMenu;