import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import "./CardNameAlbum.scss"
import { post } from '../../../../api/axios';
import API from "../../../../api/config";
import { unshareAlbumWithMe, unshareImageWithMe } from '../../../../actions/userAction';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify"
import { userLogOut } from '../../../../actions/userAction';
import CheckToken from '../../../../helper/CheckToken';
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

export default function ModalDelete(props) {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setOpenModalUnshareWithMe(false)
    }

    const handleUnshareAlbum = () => {
        post(API.URL_UNSHARE_ALBUM_WITH_ME, {
            idAlbum: props.album._id,
        }).then(res => {
            if (res.data.status === 401) {
                dispatch(userLogOut())
            }
            if (res.data.status === 1) {
                CheckToken()
                dispatch(unshareAlbumWithMe(props.album._id))
                toast.success("Unshare album thành công")
            }
        }).catch(err => {
            toast.error("Unshare album thất bại")
            alert(err.message)
        })
        handleClose()
    }

    const handleUnshareImage = () => {
        post(API.URL_UNSHARE_IMAGE_WITH_ME, {
            idImage: props.image._id
        }).then(res => {
            if (res.data.status === 401) {
                dispatch(userLogOut())
            }
            if (res.data.status === 1) {
                CheckToken()
                toast.success("Unshare image thành công")
                dispatch(unshareImageWithMe(props.image._id))
            }
        }).catch(err => {
            toast.error("Unshare image thất bại")
            alert(err.message)
        })
        handleClose()
    }

    const handleClickDeleteAlbum = () => {
        if (props.unshareAlbum) {
            handleUnshareAlbum()
        } else {
            handleUnshareImage()
        }
    }

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="server-modal-title" variant="h6" component="h2">
                    Bạn có chắc unshare {props.unshareAlbum ? "album" : "image"} này ?
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: "20px" }}>
                    <Button variant="contained" onClick={handleClickDeleteAlbum} color='error'>Unshare</Button>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                </div>
            </Box>
        </Modal>
    )
}
