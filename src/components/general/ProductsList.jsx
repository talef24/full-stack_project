import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function Products(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root} style={{width: 160}}>
                <Button onClick={handleClick} variant="outlined">
                    Products
                </Button>
                {open ? (
                    <div className={classes.dropdown}>
                        <IconButton onClick={handleClick}>
                            <HighlightOffIcon/>
                        </IconButton>
                        <ul className="List">
                            {props.products.map((product, key) =>
                            <li key={key}>{product}</li>)}
                        </ul>
                    </div>
                ) : null}
            </div>
        </ClickAwayListener>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
    },
    dropdown: {
        position: 'absolute',
        top: 5,
        right: 0,
        left: 0,
        zIndex: 9,
        border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));
