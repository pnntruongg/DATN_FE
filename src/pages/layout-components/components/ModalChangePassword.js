import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { post } from "../../../api/axios"
import API from "../../../api/config"
import { toast } from 'react-toastify';
import CheckToken from "../../../helper/CheckToken"
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

export default function ModalChangePassword(props) {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props.setIsOpenChangePassword(false)
    }
    const [oldPass, setOldPass] = useState("")
    const [errOldPass, setOldErrPass] = useState({
        message: "",
        isErr: false
    })
    const handleChangeOldPass = (e) => {
        setOldPass(e.target.value)
        if (e.target.value.length < 6) {
            setOldErrPass(() => {
                return {
                    isErr: true,
                    message: "Mật khẩu ít nhất 6 ký tự"
                }
            })
        } else {
            setOldErrPass(() => {
                return {
                    isErr: false,
                    message: ""
                }
            })
        }
    }

    const [newPass, setNewPass] = useState("")
    const [errNewPass, setNewErrPass] = useState({
        message: "",
        isErr: false
    })
    const handleChangeNewPass = (e) => {
        setNewPass(e.target.value)
        if (e.target.value.length < 6) {
            setNewErrPass(() => {
                return {
                    isErr: true,
                    message: "Mật khẩu ít nhất 6 ký tự"
                }
            })
        } else if (e.target.value !== reNewPass) {
            setErrRenewPass(() => {
                return {
                    isErr: true,
                    message: "Mật khẩu nhập lại không đúng"
                }
            })
        } else {
            setNewErrPass(() => {
                return {
                    isErr: false,
                    message: ""
                }
            })
        }
    }

    const [reNewPass, setReNewPass] = useState("")
    const [errReNewPass, setErrRenewPass] = useState({
        message: "",
        isErr: false
    })
    const handleChangeReNewPass = (e) => {
        setReNewPass(e.target.value)
        if (e.target.value !== newPass) {
            setErrRenewPass(() => {
                return {
                    isErr: true,
                    message: "Mật khẩu nhập lại không đúng"
                }
            })
        } else {
            setErrRenewPass(() => {
                return {
                    isErr: false,
                    message: ""
                }
            })
        }
    }

    const handleChangePassword = async () => {
        if (newPass.length === 0 || oldPass.length === 0 || reNewPass.length === 0) {
            toast.warning("Yêu cầu nhập đầy đủ các trường")
        } else if (errOldPass.isErr || errNewPass.isErr || errReNewPass.isErr) {
            toast.warning("Nhập đúng định dạng")
        } else {
            await post(API.URL_CHANGE_PASSWORD, { oldPass, newPass })
                .then(res => {
                    console.log(res)
                    if (res.data.status === 1) {
                        CheckToken()
                        toast.success("Change password success")
                        handleClose()
                    } else {
                        toast.error(res.data.message)
                    }
                })
                .catch(err => {
                    alert(err.message)
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
                        Thay đổi mật khẩu
                    </Typography>
                    <TextField onChange={handleChangeOldPass} error={errOldPass.isErr} helperText={errOldPass.message} sx={{ margin: '10px 0' }} fullWidth id="outlined-basic" label="Old Password" type={'password'} variant="outlined" />
                    <TextField onChange={handleChangeNewPass} error={errNewPass.isErr} helperText={errNewPass.message} sx={{ margin: '10px 0' }} fullWidth id="outlined-basic" label="New Password" type={'password'} variant="outlined" />
                    <TextField onChange={handleChangeReNewPass} error={errReNewPass.isErr} helperText={errReNewPass.message} sx={{ margin: '10px 0' }} fullWidth id="outlined-basic" label="Re-New Password" type={'password'} variant="outlined" />
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: "20px" }}>
                        <Button onClick={handleChangePassword} variant="contained" style={{ background: "#F6CB18" }}>Change</Button>
                        <Button variant="contained" style={{ background: "#bdbdbd" }} onClick={handleClose}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

