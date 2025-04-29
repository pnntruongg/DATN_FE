import React, { useState } from 'react'
import { Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import PasswordIcon from '@mui/icons-material/Password';
import EmailIcon from '@mui/icons-material/Email';
import { useSelector } from 'react-redux'
import ModalChangePassword from '../../../layout-components/components/ModalChangePassword';
import ModalEditNameUser from './ModalEditNameUser';
export default function InfoDetail() {
    const user = useSelector(state => state.user.dataUser)
    const darkmode = useSelector(state => state.user.darkmode)
    const [isOpenChangePassword, setIsOpenChangePassword] = useState(false)
    const [isOpenModalEditNameUser, setIsModalEditNameUser] = useState(false)
    return (
        <div>
            <ModalEditNameUser isOpen={isOpenModalEditNameUser} setIsModalEditNameUser={setIsModalEditNameUser} nameUser={user.name && user.name}></ModalEditNameUser>
            <ModalChangePassword isOpen={isOpenChangePassword} setIsOpenChangePassword={setIsOpenChangePassword}></ModalChangePassword>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '20px', paddingRight: '15px', color: !darkmode ? "white" : "#262626", fontWeight: !darkmode ? "500" : "400" }}>{user.name && user.name}</p>
                <Button onClick={() => { setIsModalEditNameUser(true) }} style={{ border: '1px solid #efefef', color: !darkmode ? "white" : "black", fontWeight: '600' }} endIcon={<EditIcon></EditIcon>}>Edit</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: '16px', color: !darkmode ? "white" : "black" }}><span style={{ color: "#F6CB18", fontWeight: '600', paddingRight: '10px' }}>{user.albums.length}</span>albums</p>
                <p style={{ fontSize: '16px', color: !darkmode ? "white" : "black" }}><span style={{ color: "#F6CB18", fontWeight: '600', paddingRight: '10px' }}>{user.albums.reduce((total, album) => {
                    return total += album.images.length
                }, 0)}</span>images</p>
                <p style={{ fontSize: '16px', color: !darkmode ? "white" : "black" }}><span style={{ color: "#F6CB18", fontWeight: '600', paddingRight: '10px' }}>{user.albumsShare.length + user.imagesShare.length}</span>share</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ color: !darkmode ? "white" : "black" }}><EmailIcon></EmailIcon> </p>
                <span style={{ fontSize: '16px', fontWeight: "600", paddingLeft: '20px', transform: "translateY(-4px)", color: !darkmode ? "white" : "black" }}>{user.email && user.email}</span>
            </div>
            <div>
                <Button onClick={() => { setIsOpenChangePassword(true) }} style={{ width: '100%', border: !darkmode ? '1px solid #F6CB18' : '1px solid #0000001c', color: '#F6CB18' }} startIcon={<PasswordIcon />}>
                    Change Password
                </Button>
            </div>
        </div >
    )
}
