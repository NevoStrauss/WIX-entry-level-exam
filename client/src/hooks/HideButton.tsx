import React,{useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

//This component is the See less / See more button.
const HideButton=(props:any)=>{
    const {id} = props           //The id of the ticket to hide/show
    //Some styling
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            margin: {
                margin: theme.spacing(1),
            },
            extendedIcon: {
                marginRight: theme.spacing(1),
            },
        }),
    );

    const classes = useStyles(); //Apply style
    const [hideORshow, setHideORshow] = useState(false)  //The state of the current ticket content

    const setState = () => {
        if (hideORshow){ //Need to show less
            // @ts-ignore
            document.getElementById(id).style.cssText =
                "    overflow:hidden;\n" +
                "    text-overflow: ellipsis;\n" +
                "    display: -webkit-box;\n" +
                "    line-height: 18px;     \n" +
                "    max-height: 54px;      \n" +
                "    -webkit-line-clamp: 3; \n" +
                "    -webkit-box-orient: vertical;"
        }
        else { //Need to show more
            // @ts-ignore
            document.getElementById(id).style.cssText =
                "font-size: medium;"+
                "overflow:auto;"+
                "text-overflow: initial;"+
                "display: initial;"+
                "line-height: normal;"+
                "max-height: initial;"+
                "-webkit-line-clamp:"+
                " -webkit-box-orient:"+
                "font-size:medium;"
        }
        setHideORshow(!hideORshow) //Set new state
    }

    return (
        <div>
            <Button onClick={setState} variant="outlined" size="small" color="primary" className={classes.margin}>
                {hideORshow? "See less": "See more"}
            </Button>
        </div>
    );
};
export default HideButton;
