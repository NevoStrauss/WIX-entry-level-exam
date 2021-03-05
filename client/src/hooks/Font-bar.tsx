import React,{useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

//This component is the app bar of the font setting.
const Fontbar = () => {
    //States initialization of the buttons
    const [smallFontState, setSmallFontState] = useState(true)
    const [mediumFontState, setMediumFontState] = useState(false)
    const [largeFontState, setLargeFontState] = useState(true)

    //This method is called from the small font button.
    //It changes the font to small size, changes the values of the 3 states, and by doing that its disappears this button and raises another one.
    //*Note this comment for the next 3 methods.
    const smallFont = () =>{
        setSmallFontState(false)
        setMediumFontState(true)
        setLargeFontState(true)
        // @ts-ignore
        for (const element of document.getElementsByClassName("txt")) //loops over the tickets and set its css font-size to small.
            element.style.fontSize = "small"
    }
    const normalFont = () =>{
        setSmallFontState(true)
        setMediumFontState(false)
        setLargeFontState(true)
        // @ts-ignore
        for (const element of document.getElementsByClassName("txt"))
            element.style.fontSize = "medium"
    }
    const largeFont = () =>{
        setSmallFontState(true)
        setMediumFontState(true)
        setLargeFontState(false)
        // @ts-ignore
        for (const element of document.getElementsByClassName("txt"))
            element.style.fontSize = "large"
    }

    //app bar style
    const useStyles = makeStyles((theme) => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }));

    const classes = useStyles(); //Apply the style

    return (
        <AppBar position="static">
            <Toolbar className={classes.root}>
                <Typography variant="h6" align={"left"} >
                    Font Setting
                </Typography>
                {smallFontState?
                    <Button onClick={smallFont} variant="contained">small</Button> :null}
                {mediumFontState?
                    <Button onClick={normalFont} variant="contained">normal</Button>: null}
                {largeFontState?
                    <Button onClick={largeFont} variant="contained">large</Button>: null}
            </Toolbar>
        </AppBar>
    )
}
export default Fontbar;

