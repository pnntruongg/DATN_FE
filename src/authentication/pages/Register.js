import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import CheckMail from "../../helper/CheckMail";
import { toast } from 'react-toastify';
import "./authentication.scss"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import API from "../../api/config"
import { post } from "../../api/axios";
const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [rePass, setRePass] = useState('')
    const [otp, setOtp] = useState('');
    const [timeCountDown, setTimeCountDown] = useState('')
    const [isSendOtp, setIsSendOtp] = useState(true)
    const navigate = useNavigate()

    const handleSendOtp = async () => {
        if (!CheckMail(email)) {
            toast.error("Sai định dạng mail");
        } else {
            post(API.URL_SENT_OTP, {
                email
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

    const handleResgister = async () => {
        if (email.length === 0 || pass.length === 0 || rePass.length === 0 || otp.length === 0) {
            toast.error("Nhập đầy đủ thông tin");
        } else if (pass.length < 6) {
            toast.error("Mật khẩu phải đủ từ 6 kỳ tự trở lên");
        } else if (!CheckMail(email)) {
            toast.error("Sai định dạng mail");
        } else if (pass !== rePass) {
            toast.error("Nhập lại mật khẩu không đúng");
        } else {
            post(API.URL_REGISTER_USER, {
                email,
                pass,
                otp
            }).then(res => {
                if (res.data.status === 1) {
                    toast.success(res.data.message)
                    navigate('/login')
                } else {
                    toast.error(res.data.message)
                }
            }).catch(err => {
                toast.error(err.message.message)
            })
        }
    };

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

    return (
        <div className="body">
            <img style={{ position: "fixed", top: "80px", left: "20px" }} src="./login.png" alt="IMAGE preview" />
            <form className="form">
                <Link to={"/login"}>
                    <div className="direction">
                        Login &rarr;
                    </div>
                </Link>

                <Typography mb={2} variant="h4" component="h4">
                    Resgister
                </Typography>
                <div style={{ position: 'relative', width: '100%' }}>
                    <TextField
                        id="outlined-basic"
                        required
                        label="Email"
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
                    fullWidth
                    size="small"
                    onChange={(e) => {
                        setPass(e.target.value);
                    }}
                    variant="outlined"
                    type={"password"}
                    sx={{ marginBottom: "20px" }}
                />
                <TextField
                    id="outlined-basic"
                    label="Re-Password"
                    required
                    fullWidth
                    size="small"
                    onChange={(e) => {
                        setRePass(e.target.value);
                    }}
                    variant="outlined"
                    type={"password"}
                    sx={{ marginBottom: "20px" }}
                />
                <TextField
                    id="outlined-basic"
                    label="OTP"
                    required
                    name="OTP"
                    fullWidth
                    size="small"
                    onChange={(e) => { setOtp(e.target.value) }}
                    variant="outlined"
                    sx={{ marginBottom: "20px" }}
                />
                <Button
                    onClick={handleResgister}
                    sx={{ width: "100%" }}
                    variant="contained"
                >
                    Register
                </Button>
            </form>
        </div>
    );
};

export default Register