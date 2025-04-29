import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import "./CardImage.scss"
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ModalUnshareWithMe from "./ModalUnshareWithMe"
import { useNavigate } from 'react-router-dom';
export default function CardImageShare(props) {
    const navigate = useNavigate()
    const [openModalUnshareWithMe, setOpenModalUnshareWithMe] = useState(false)

    return (
        <Grid item sm={6} lg={3} md={4} xs={12}>
            <ModalUnshareWithMe isOpen={openModalUnshareWithMe} setOpenModalUnshareWithMe={setOpenModalUnshareWithMe} unshareAlbum={false} image={props.image}></ModalUnshareWithMe>
            <Card className='card-image' >
                <div className='modal-card-image'>
                    <div className='card-body'>
                        <IconButton onClick={() => { navigate(`image-share/${props.image._id}`) }} className='card-body-btn-icon' aria-label="delete">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => { setOpenModalUnshareWithMe(true) }} className='card-body-btn-icon' aria-label="delete">
                            <StopScreenShareIcon />
                        </IconButton>
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
                        Author: {props.image.users[0].email}
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
