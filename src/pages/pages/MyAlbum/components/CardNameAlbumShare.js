import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom'
import ModalUnshareWithMe from "./ModalUnshareWithMe"
import "./CardNameAlbum.scss"


export default function CardNameAlbum(props) {
    const [openModalUnshareWithMe, setOpenModalUnshareWithMe] = useState(false)

    const renderDate = (date) => {
        let time = new Date(date)
        return time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear()
    }

    const renderSize = (images) => {
        let size = 0;
        images.forEach(image => {
            size += image.size
        })
        return (size / 1024 / 1024).toFixed(2)
    }

    return (
        <Grid item sm={6} lg={3} md={4} xs={12} >
            <Box >
                <ModalUnshareWithMe isOpen={openModalUnshareWithMe} setOpenModalUnshareWithMe={setOpenModalUnshareWithMe} unshareAlbum={true} album={props.album}></ModalUnshareWithMe>
                <Card className='card-album' sx={{ position: 'relative' }} variant="outlined">
                    <div className='card-name-album_option-icon' >
                        <MoreVertIcon sx={{ transform: 'translateY(2px)' }}></MoreVertIcon>
                        <ul>
                            <li onClick={() => { setOpenModalUnshareWithMe(true) }}>Un Share</li>
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
                        <p>Author: {props.album.users[0].email}</p>
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
