import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux"
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom'
import "./CardNameAlbum.scss"
import ModalShare from './ModalShare';
import ModalDelete from './ModalDelete';
import ModalEdit from './ModalEdit'
import ModalListShare from './ModalListShare';
export default function CardNameAlbum(props) {
    const [openModalShare, setOpenModalShare] = useState(false)
    const [openModalListShare, setOpenModalListShare] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState(false)

    const renderDate = (date) => {
        let time = new Date(date)
        return time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear()
    }

    const user = useSelector(state => state.user)

    const renderSize = (images) => {
        let size = 0;
        images.forEach(image => {
            size += image.size
        })
        return (size / 1024 / 1024).toFixed(2)
    }

    return (
        <Grid item sm={6} lg={3} md={4} xs={12} >
            <ModalShare isOpen={openModalShare} setOpenModalShare={setOpenModalShare} shareAlbum={true} album={props.album}></ModalShare>
            <ModalListShare isOpen={openModalListShare} setOpenModalShare={setOpenModalListShare} shareAlbum={true} album={props.album}></ModalListShare>
            <ModalDelete isOpen={openModalDelete} deleteAlbum={true} setOpenModalDelete={setOpenModalDelete} album={props.album} user={user}></ModalDelete>
            <ModalEdit isOpen={openModalEdit} album={props.album} nameAlbum={props.album?.name} setOpenModalEdit={setOpenModalEdit}></ModalEdit>
            <Box >
                <Card className='card-album' sx={{ position: 'relative' }} variant="outlined">
                    <div className='card-name-album_option-icon' >
                        <MoreVertIcon sx={{ transform: 'translateY(2px)' }}></MoreVertIcon>
                        <ul>
                            <li onClick={() => { setOpenModalEdit(true) }}>Edit</li>
                            <li onClick={() => { setOpenModalDelete(true) }}>Delete</li>
                            <li onClick={() => { setOpenModalShare(true) }}>Share</li>
                            <li onClick={() => { setOpenModalListShare(true) }}>List share</li>
                        </ul>
                    </div>
                    <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {props.album?.createdAt && renderDate(props.album.createdAt)}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {props.album?.name ? props.album.name : "NONAME"}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Dung lượng: {renderSize(props.album.images)}MB
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {props.album?.images?.length ? props.album.images.length : "0"} ảnh
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">
                            <Link style={{ textDecoration: 'none' }} to={`/my-album/${props.album._id}`}>Xem album</Link>
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}
