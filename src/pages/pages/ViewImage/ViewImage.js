import React, { useEffect, useState } from "react";
import OpenSeaDragon from "./OpenSeaDragon";
import { useParams } from 'react-router-dom';
import API from "../../../api/config"
import { get } from "../../../api/axios"
import { Grid, Container } from "@mui/material";
import CheckToken from "../../../helper/CheckToken";
import { userLogOut } from "../../../actions/userAction";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import IosShareIcon from '@mui/icons-material/IosShare';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ModalDelete from "../MyAlbum/components/ModalDelete";
import { useSelector } from "react-redux";
import "./ViewImage.scss"
export default function ImageViewer() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const user = useSelector(state => state.user)
    const [image, setImage] = useState(null)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    useEffect(() => {
        document.title = image?.name ? image.name : "Loading...."
    }, [image])
    useEffect(() => {
        const fetApi = async () => {
            await get(API.URL_GET_IMAGE + "?idImage=" + params.id)
                .then(res => {
                    if (res.data.status === 401) {
                        dispatch(userLogOut())
                    }
                    if (res.data.status === 1) {
                        CheckToken()
                        const hashUrl = res.data.image.imgURL.split("/")
                        const nameUrl = hashUrl[5].split(".jpeg")
                        res.data.image.nameUrl = nameUrl[0]
                        setImage(res.data.image)
                    }
                })
                .catch(err => {
                    alert(err)
                })
        }
        fetApi()
    }, [])

    const renderDate = (date) => {
        let time = new Date(date)
        return time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear() + " - " + time.getHours() + ":" + time.getMinutes()
    }

    return (
        <div className="view-image">
            <ModalDelete
                idAlbum={image?.album?._id}
                isOpen={openModalDelete}
                deleteAlbum={false}
                user={user}
                setOpenModalDelete={setOpenModalDelete}
                image={image && image}
                backAlbum={true}
            ></ModalDelete>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item sm={8}>
                        <div>
                            {/* Back */}
                            <IconButton style={{ color: "white", marginBottom: '20px' }} onClick={() => { navigate(-1) }} aria-label="delete">
                                <ArrowBackIcon style={{ height: '30px ', width: '30px ' }} />
                            </IconButton>x
                            {/* Share */}
                            <IconButton style={{ color: "white", marginBottom: '20px' }} onClick={() => { navigate(-1) }} aria-label="delete">
                                <IosShareIcon />
                            </IconButton>
                            {/* Move */}
                            <IconButton style={{ color: "white", marginBottom: '20px' }} onClick={() => { navigate(-1) }} aria-label="delete">
                                <DriveFileMoveIcon />
                            </IconButton>
                            {/* List share */}
                            <IconButton style={{ color: "white", marginBottom: '20px' }} onClick={() => { navigate(-1) }} aria-label="delete">
                                <RecentActorsIcon />
                            </IconButton>
                            {/* Delete */}
                            <IconButton onClick={() => { setOpenModalDelete(true) }} style={{ color: "white", marginBottom: '20px' }} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <OpenSeaDragon image={image}></OpenSeaDragon>
                    </Grid>
                    <Grid item sm={4}>
                        <div className="info-image">
                            <p className="info-image_author-title">Author</p>
                            <p className="info-image_author-name">{image && image.users[0].email}</p>
                            <p className="info-image_author-title">Description</p>
                            <p className="info-image_author-name">{image && image.name}</p>
                            <p className="info-image_author-title">Create</p>
                            <p className="info-image_author-name">{image && renderDate(image.createdAt)}</p>
                            <p className="info-image_author-title">Share with</p>
                            <p className="info-image_author-name">
                                <ul>
                                    {image && image.users.map((user, index) => {
                                        if (index === 0) {
                                            return (<li style={{ padding: '5px 0' }}>{user.email + " (you)"}</li>)
                                        } else {
                                            return (<li style={{ padding: '5px 0' }}>{user.email}</li>)
                                        }
                                    })}
                                </ul>
                            </p>
                            <p className="info-image_author-title">Detail</p>
                            <p className="info-image_author-name">
                                <p>{image && `Size: ${image.height} x ${image.width}`}</p>
                                <p>{image && `Memory: ${(image.size / 1024 / 1024).toFixed(2) + " Mb"}`}</p>

                            </p>
                        </div>
                    </Grid>
                </Grid>
            </Container>

        </div>
    );
}