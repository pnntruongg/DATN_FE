import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import "./CardImage.scss"
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import IosShareIcon from '@mui/icons-material/IosShare';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { useNavigate } from 'react-router-dom';
import ModalShare from './ModalShare';
import ModalListShare from './ModalListShare';
import { useSelector } from "react-redux"
import ModalDelete from './ModalDelete';
import ModalMoveImage from './ModalMoveImage';
export default function CardImage(props) {
    const [openModalListShare, setOpenModalListShare] = useState(false)
    const navigate = useNavigate()
    const [openModalShare, setOpenModalShare] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalMove, setOpenModalMove] = useState(false)
    const user = useSelector(state => state.user)

    return (
        <Grid item sm={6} lg={3} md={4} xs={12} xl={2}>
            <ModalShare isOpen={openModalShare} updateImage={props.updateImage} setOpenModalShare={setOpenModalShare} shareAlbum={false} image={props.image}></ModalShare>
            <ModalListShare updateImage={props.updateImage} isOpen={openModalListShare} setOpenModalShare={setOpenModalListShare} users={props.users} shareAlbum={false} image={props.image}></ModalListShare>
            <ModalDelete
                idAlbum={props.idAlbum}
                deleteImage={props.deleteImage}
                isOpen={openModalDelete}
                deleteAlbum={false}
                user={user}
                setOpenModalDelete={setOpenModalDelete}
                image={props.image}
            ></ModalDelete>
            <ModalMoveImage updateAlbumAfterMove={props.updateAlbumAfterMove} isOpen={openModalMove} setOpenModalMove={setOpenModalMove} nameAlbum={props.nameAlbum} image={props.image}></ModalMoveImage>
            <Card className='card-image' sx={{ maxWidth: 345 }}>
                <div className='modal-card-image'>
                    <div className='card-body'>
                        <IconButton onClick={() => { navigate(`${props.image._id}`) }} className='card-body-btn-icon' aria-label="delete">
                            <VisibilityIcon />
                        </IconButton>
                        {
                            props.isOwner && (
                                <>
                                    <IconButton onClick={() => { setOpenModalShare(true) }} className='card-body-btn-icon' aria-label="delete">
                                        <IosShareIcon />
                                    </IconButton>
                                    <IconButton onClick={() => { setOpenModalMove(true) }} className='card-body-btn-icon' aria-label="delete">
                                        <DriveFileMoveIcon />
                                    </IconButton>
                                    <IconButton onClick={() => { setOpenModalListShare(true) }} className='card-body-btn-icon' aria-label="delete">
                                        <RecentActorsIcon />
                                    </IconButton>
                                    <IconButton onClick={() => { setOpenModalDelete(true) }} className='card-body-btn-icon' aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            )
                        }

                    </div>
                </div>
                <CardMedia
                    component="img"
                    alt="green iguana"
                    height="240"
                    image={`http://localhost:5001${props.image.imgURL}`}
                />
                <CardContent>
                    <p>
                        {props.users[0].email}
                    </p>
                    <p>
                        Name: {props.image.name}
                    </p>
                    <Typography variant="button" color="text.secondary">
                        Size: {(props.image.size / 1024 / 1024).toFixed(2) + " Mb"}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>

    );
}
