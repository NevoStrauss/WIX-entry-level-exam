import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

const RenameTitle = (props:any) => {
    const idx = props.idx
    const setter = props.setter

    const handleClick = () => {
        setter(idx)
    };

    return (
        <div>
            <Button size={"small"} onClick={handleClick} startIcon={<EditIcon />} style={{position: 'absolute', right: 50}}>Rename</Button>
        </div>
    );
}

export default RenameTitle;