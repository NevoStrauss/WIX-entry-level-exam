import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {Ticket} from "./api";

const AddNewTicket = (props:any) => {
    const setter = props.setter
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("No title")
    const [content, setContent] = useState("No content")
    const [email, setEmail] = useState("No Email")
    const [labels, setLabels] = useState([])

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
    const handleChangeLabels = (e:string) => {
        const newLabels:string[] = e.split(" ")
        // @ts-ignore
        setLabels(newLabels)
    }

    const generate = (length:number) =>{
        const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleUpload = () => {
        const generateID:string = generate(36)
        const currentTime = new Date().getTime()
        const ticket:Ticket = {id:generateID,title:title,content:content,userEmail:email,creationTime:currentTime,labels:[]}
        setter(ticket)
        handleClose()
    }

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

