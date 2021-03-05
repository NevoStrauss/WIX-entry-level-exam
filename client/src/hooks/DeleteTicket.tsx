import React,{useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const DeleteTicket = (props:any) => {
    const idx = props.idx
    const setter = props.setter
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = () =>{
        setter(idx)
        handleClose()
    }

    return (
        <div>
            <IconButton aria-label="delete" onClick={handleClickOpen} style={{position: 'absolute', right: 0}}>
                <DeleteIcon fontSize="default"/>
            </IconButton>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{"Delete Ticket"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                          Are you sure you want to delete this Ticket?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAgree} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
        </div>
    );
}

export default DeleteTicket;