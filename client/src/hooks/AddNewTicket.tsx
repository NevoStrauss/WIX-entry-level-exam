import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Ticket} from "../api";

//This component is the "add new ticket" button
//It enables the users to create there on tickets and upload them to the system and write them into the database
const AddNewTicket = (props:any) => { //The props sent here is a function of the App component
    const setter = props.setter
    //States initialization:
    const [open, setOpen] = useState(false); //open and close the dialog box
    const [title, setTitle] = useState("No title") //title input
    const [content, setContent] = useState("No content") //content input
    const [email, setEmail] = useState("No Email") //email input
    const [labels, setLabels] = useState([]) //labels input

    //handle commands-> set new values for the states
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeTitle = (e:string) => {
        setTitle(e)
    }
    const handleChangeContent = (e:string) => {
        setContent(e)
    }
    const handleChangeEmail = (e:string) => {
        setEmail(e)
    }

    //Disassembled the string into array of substrings by separating between the spaces
    const handleChangeLabels = (e:string) => {
        const newLabels:string[] = e.split(' ')
        // @ts-ignore
        setLabels(newLabels)
    }

    const reSetStates = () => {
        setTitle("No title")
        setContent("No content")
        setEmail("No Email")
        setLabels([])
    } 

    //generates new ID for the new ticket. the length of the new ID is 36 characters and the characters are taken from 37 different characters.
    //Notice that it might happen in zero probability that an identical id will be generated. (there are 36^36 optional ID's :))
    const generateNewID = (length:number) =>{
        const characters ='abcdefghijklmnopqrstuvwxyz0123456789-';
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    //This method executed after pressing the upload button.
    //It creates a Ticket object with the values of the states inserted by the user.
    //It sends the Ticket to the App component for the api request using the setter method extracted from the props.
    const handleUpload = () => {
        const generateID:string = generateNewID(36)
        const currentTime = new Date().getTime()
        const ticket:Ticket = {id:generateID,title:title,content:content,userEmail:email,creationTime:currentTime,labels:labels}
        setter(ticket)
        handleClose()
        reSetStates()
    }

    //Notice that the onChange function of the TextFields sends the value of the events (user writing) to the matching methods.
    return (
        <div>
            <Button startIcon={<AddIcon />} variant="outlined" color="primary" onClick={handleClickOpen}>
                Add new Ticket
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" >Edit your Ticket</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill all the fields below:
                    </DialogContentText>
                    <TextField
                        id="titleField"
                        label="title"
                        type="title"
                        onChange={(e) => handleChangeTitle(e.target.value)}
                        autoFocus
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        id="outlined-multiline-static"
                        label="Content"
                        onChange={(e) => handleChangeContent(e.target.value)}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        id="userEmail"
                        label="Email Address"
                        type="email"
                        onChange={(e) => handleChangeEmail(e.target.value)}
                        autoFocus
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        id="labels"
                        label="Please enter some key words with spaces between them"
                        type="label"
                        onChange={(e) => handleChangeLabels(e.target.value)}
                        autoFocus
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default AddNewTicket;

