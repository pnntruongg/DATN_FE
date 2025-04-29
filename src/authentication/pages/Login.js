import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import CheckMail from "../../helper/CheckMail"
import { toast } from 'react-toastify';
import "./authentication.scss"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { userLogin } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import API from "../../api/config"
import { post } from "../../api/axios";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [isSendOtp, setIsSendOtp] = useState(true)
    const [timeCountDown, setTimeCountDown] = useState('')
    const [totp, setTotp] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        if (!CheckMail(email)) {
            toast.error("Sai định dạng mail");
        } else {
            post(API.URL_SENT_TOTP, {
                email,
            }).then(res => {
                if (res.data.status === 1) {
                    toast.success(res.data.message)
                    setIsSendOtp(false)
                    renderCountDown()

                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                toast.error(err.message.message)
            })
        }
    }

    const renderCountDown = () => {
        let time, minutes, seconds;
        time = 60;
        let timeInterval = setInterval(function () {
            minutes = parseInt(time / 60, 10);
            seconds = parseInt(time % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            setTimeCountDown(minutes + ":" + seconds)
            if (--time < 0) {
                clearInterval(timeInterval)
                setIsSendOtp(true)
                setTimeCountDown('')
            }
        }, 1000);
    }

    const handleLogin = async () => {
        if (email.length === 0 || pass.length === 0 || totp.length === 0) {
            toast.error("Nhập đầy đủ thông tin");
        } else if (pass.length < 6) {
            toast.error("Mật khẩu phải đủ từ 6 kỳ tự trở lên");
        } else if (!CheckMail(email)) {
            toast.error("Sai định dạng mail");
        } else {
            post(API.URL_LOGIN_USER, {
                email,
                pass,
                totp
            }).then(res => {
                if (res.data.status === 1) {
                    toast.success(res.data.message)
                    dispatch(userLogin(res.data.user, res.data.token))
                    navigate('/my-album')
                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                toast.error(err.message.message)
            })

        }
    }

    return (
        <div className="body">
            <img style={{ position: "fixed", top: "100px", left: "20px" }} src="./login.png" alt="IMAGE " />
            <form className="form">
                <Link to={"/register"}>
                    <div className="direction">
                        Resgister &rarr;
                    </div>
                </Link>
                <Typography mb={2} variant="h4" component="h4">
                    Login
                </Typography>
                <div style={{ position: 'relative', width: '100%' }}>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        fullWidth
                        name="Email"
                        size="small"
                        variant="outlined"
                        sx={{ marginBottom: "20px", width: 'auto' }}
                    />
                    <div style={{ position: 'absolute', top: '1.5px', right: '0' }}>
                        <Button
                            variant="contained"
                            sx={{ display: 'absolute' }}
                            onClick={handleSendOtp}
                            disabled={!isSendOtp}
                        >
                            SEND
                        </Button>
                    </div>
                </div>
                <p style={{ margin: '0' }} >{timeCountDown}</p>
                <TextField
                    id="outlined-basic"
                    label="Password"
                    required
                    size="small"
                    fullWidth
                    onChange={(e) => {
                        setPass(e.target.value);
                    }}
                    variant="outlined"
                    type={"password"}
                    sx={{ marginBottom: "20px" }}
                />
                <TextField
                    id="outlined-basic"
                    label="TOTP"
                    required
                    name="totp"
                    onChange={(e) => { setTotp(e.target.value) }}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ marginBottom: "20px" }}
                />
                <Button
                    onClick={handleLogin}
                    sx={{ width: "100%" }}
                    variant="contained"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}
