import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import "./CardNameAlbum.scss"
import { post } from '../../../../api/axios';
import API from "../../../../api/config"
import { useDispatch, useSelector } from 'react-redux';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckToken from '../../../../helper/CheckToken';
import { updateAlbumAfter } from "../../../../actions/userAction"
import { KeyboardReturnOutlined } from '@mui/icons-material';
import LoadingFixed from '../../../layout-components/components/LoadingFixed';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
};

export default function ModalMoveImage(props) {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setOpenModalMove(false)
    }
    const user = useSelector(state => state.user)
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = React.useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])


    const handleClickMoveImage = async () => {
        console.log(props.image);
        if (value.length !== 0) {
            setIsLoading(true)
            await post(API.URL_MOVE_IMAGE, { nameAlbum: value, idImage: props.image?._id })
                .then(res => {
                    console.log(res)
                    if (res.data.status === 1) {
                        setValue("")
                        setIsLoading(false)
                        dispatch(updateAlbumAfter(value, props.nameAlbum, props.image?._id))
                        props.updateAlbumAfterMove(props.image?._id)
                        CheckToken()
                        handleClose()
                    }
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log(err);
                })
        }
    }

    return (
        <>
            {isLoading && <LoadingFixed></LoadingFixed>}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="server-modal-title" variant="h6" component="h2">
                        Chọn album bạn cần chuyển
                    </Typography>
                    <RadioGroup value={value} onChange={handleChange} name="use-radio-group" style={{ paddingLeft: "20px" }} defaultValue="first">
                        {
                            user.dataUser && user.dataUser.albums.map((album, index) => {
                                if (album.name !== props.nameAlbum) {
                                    return (
                                        <FormControlLabel key={index} value={album.name} control={<Radio />} label={album.name} />
                                    )
                                } else {
                                    return ""
                                }
                            })
                        }
                    </RadioGroup>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: "20px" }}>
                        <Button variant="contained" onClick={handleClickMoveImage} style={{ background: "#F6CB18", width: "120" }}>Move</Button>
                    </div>
                </Box>
            </Modal>
        </>

    )
}
