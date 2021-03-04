import React,{useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const HideButton=(props:any)=>{
    const {id} = props
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

    const classes = useStyles();
    const [hideORshow, setHideORshow] = useState(false)

    const setState = () => {
        if (hideORshow){
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
        else {
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
        setHideORshow(!hideORshow)
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
