import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CheckToken from '../../../../helper/CheckToken';
import { post } from '../../../../api/axios';
import API from "../../../../api/config"
import { updateNameUser } from '../../../../actions/userAction';
import { useDispatch } from 'react-redux';
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

export default function ModalEditNameUser(props) {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setIsModalEditNameUser(false)
    }

    const handleBlurNameUser = (e) => {
        setName(e.target.value)
    }
    const [name, setName] = useState("")

    const handleClickCallApi = async () => {
        if (name !== "") {
            console.log("call api")
            await post(API.URL_UPDATE_NAME_USER, { name })
                .then(res => {
                    if (res.data.status === 1) {
                        CheckToken()
                        dispatch(updateNameUser(name))
                        toast.success("Update name success")

                        handleClose()
                    }
                })
                .catch(err => {
                    toast.err(err.message)

                })
        }
    }

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="server-modal-title" style={{ marginBottom: "10px" }} variant="h6" component="h2">
                        Cập nhật tên tuổi
                    </Typography>
                    <TextField sx={{ margin: '10px 0' }} onBlur={handleBlurNameUser} defaultValue={props.nameUser} fullWidth id="outlined-basic" label="Old Password" type={'text'} variant="outlined" />

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: "20px" }}>
                        <Button variant="contained" style={{ background: "#F6CB18" }} onClick={handleClickCallApi}>Edit</Button>
                        <Button variant="contained" style={{ background: "#bdbdbd" }} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

