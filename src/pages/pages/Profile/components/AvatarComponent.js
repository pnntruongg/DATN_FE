import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { post } from "../../../../api/axios"
import CheckToken from "../../../../helper/CheckToken"
import { useDispatch } from 'react-redux'
import LoadingFixed from "../../../layout-components/components/LoadingFixed"
import API from "../../../../api/config"
import { updateAvatar } from '../../../../actions/userAction'

export default function AvatarComponent() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.dataUser)
    const darkmode = useSelector(state => state.user.darkmode)
    const [isLoading, setIsLoading] = useState(false)
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        const { type } = file;
        if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('gif'))) {
        } else {
            setIsLoading(true)
            const formData = new FormData();
            formData.append("file", e.target.files[0])
            formData.append("upload_preset", "qqqhcaa3");
            axios.post(`https://api.cloudinary.com/v1_1/databaseimg/image/upload`, formData)
                .then(res => {
                    setIsLoading(false)
                    console.log(res.data.url);
                    CheckToken()
                    post(API.URL_UPDATE_AVATAR, { avatarURL: res.data.url })
                        .then(result => {
                            console.log("here")
                            dispatch(updateAvatar(res.data.url))
                            console.log(result)
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    toast.success("Upload avatar thành công")
                })
                .catch(err => {
                    setIsLoading(false)
                    toast.error("Upload avatar thất bại")
                })
        }
    }
    return (
        <>
            {isLoading && <LoadingFixed></LoadingFixed>}
            <label htmlFor='profile-header-update-avatar'>
                <Avatar src={user?.avatarURL ? user.avatarURL : 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360'} className="avatar" style={{ height: '160px', width: '160px', border: darkmode ? '2px solid rgb(246, 203, 24)' : '2px solid white' }} >NONE</Avatar>
            </label>
            <input id="profile-header-update-avatar" type="file" style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={(e) => handleChangeAvatar(e)}></input>
        </>
    )
}
