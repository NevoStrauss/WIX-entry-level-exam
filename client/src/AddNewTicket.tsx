import React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from "@material-ui/icons/Add";

const IconLabelButtons = () => {
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
    }),
);

    const classes = useStyles();

    return (
        <div>
            <Button
                // onClick={}
                variant="contained"
                className={classes.button}
                startIcon={<AddIcon />}>
                Add new Ticket
            </Button>
        </div>
    );
}
export default IconLabelButtons
