import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import CardGiftCardIcon from "@material-ui/icons/CardGiftcard";
import MenuIcon from "@material-ui/icons/Menu";
import ToggleMenu from "./ToggleMenu";

function SiteMenu(props) {
    const itemsData = [
        {
            pageLinked: "/mainScreen",
            icon: <HomeIcon fontSize="small" />,
            text: "Home Page"
        },
        {
            pageLinked: "/filterPackage",
            icon: <FindInPageIcon fontSize="small" />,
            text: "Advanced Search"
        },
        {
            pageLinked: "/buildPackage",
            icon: <CardGiftCardIcon fontSize="small" />,
            text: "Build Your Package"
        },
    ];


    return (
        <ToggleMenu
            {...props}
            menuButton = {props.menuButton}
            menuIcon = {<MenuIcon fontSize="large"/>}
            edge="start"
            menuItemsData = {itemsData}
        />
    )
}

export default SiteMenu;