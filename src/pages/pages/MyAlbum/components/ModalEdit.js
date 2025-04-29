import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import "./CardNameAlbum.scss"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { post } from '../../../../api/axios';
import API from "../../../../api/config";
import { updateAlbumAfterEdit } from '../../../../actions/userAction';
import { useDispatch } from 'react-redux';
import CheckToken from '../../../../helper/CheckToken';
import LoadingFixed from '../../../layout-components/components/LoadingFixed';
import { toast } from 'react-toastify';
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

export default function ModalEdit(props) {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setOpenModalEdit(false)
    }
    const [nameAlbum, setNameAlbum] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleClickSave = async (e) => {
        console.log("Save")
        setIsLoading(true)
        await post(API.URL_EDIT_NAME_ALBUM, {
            nameAlbum, idAlbum: props.album._id
            , oldName: props.album.name
        })
            .then(res => {
                console.log(res)
                if (res.data.status === 1) {
                    setIsLoading(false)
                    CheckToken()
                    dispatch(updateAlbumAfterEdit(res.data.album))
                    toast.success("Edit thành công")
                    handleClose()
                } else {
                    setIsLoading(false)
                    toast.error("Tên album tồn tại");
                }
            })
            .catch(err => {
                setIsLoading(false)
                alert(err.message)
            })
    }

    useEffect(() => {
        setNameAlbum(props.nameAlbum)
    }, [props.nameAlbum])

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])
    return (
        <>
            {isLoading ? (<LoadingFixed></LoadingFixed>) : null}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="server-modal-title" style={{ marginBottom: "10px" }} variant="h6" component="h2">
                        Sửa tên album
                    </Typography>
                    <TextField fullWidth onBlur={(e) => { setNameAlbum(e.target.value) }} defaultValue={props.nameAlbum} id="outlined-basic" label="Tên album" variant="outlined" />
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: "20px" }}>
                        <Button variant="contained" onClick={handleClickSave} style={{ background: "#F6CB18" }}>Save</Button>
                        <Button variant="contained" style={{ background: "#bdbdbd" }} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}
