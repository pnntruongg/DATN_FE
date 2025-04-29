import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import "./CardNameAlbum.scss"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import API from '../../../../api/config'
import { Button } from '@mui/material';
import { post } from '../../../../api/axios';
import { useDispatch } from 'react-redux';
import { updateAlbumShare, userLogOut } from '../../../../actions/userAction';
import { toast } from "react-toastify"
import CheckToken from '../../../../helper/CheckToken';
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

export default function ModalListShare(props) {

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const handleClose = () => {
        setOpen(false);
        props.setOpenModalShare(false)
    }
    const [checked, setChecked] = React.useState([]);
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };


    const callApiUnShareAlbum = () => {
        if (checked.length !== 0) {
            post(API.URL_UNSHARE_ALBUM, {
                listUser: checked,
                idAlbum: props.album._id
            }).then(res => {
                if (res.data.status === 401) {
                    dispatch(userLogOut())
                } else {
                    CheckToken()
                    toast.success("Unshare album thành công")
                    setChecked([])
                    dispatch(updateAlbumShare(res.data.album))
                    handleClose()
                }

            }).catch(err => {
                alert(err)
            })
        } else {
            toast.warning("Vui lòng chọn user để share")
        }
    }

    const callApiUnShareImage = () => {
        if (checked.length !== 0) {
            post(API.URL_UNSHARE_IMAGE, {
                listUser: checked,
                idImage: props.image._id
            }).then(res => {
                if (res.data.status === 401) {
                    dispatch(userLogOut())
                } else {
                    CheckToken()
                    toast.success("Unshare image thành công")
                    setChecked([])
                    props.updateImage(res.data.image)
                    handleClose()
                }

            }).catch(err => {
                alert(err)
            })
        } else {
            toast.warning("Vui lòng chọn user để share")
        }
    }

    const handleUnShare = () => {
        if (props.shareAlbum) {
            callApiUnShareAlbum()
        } else {
            callApiUnShareImage()
        }

    }


    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography textAlign="center" marginBottom={2} id="server-modal-title" variant="h6" component="h2">
                    Danh sách chia sẻ {props.shareAlbum ? "album" : "image"}
                </Typography>
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: '20' }}>
                    {
                        props.shareAlbum && (props.album.users.length > 1 ? props.album.users.map((user, index) => {
                            const labelId = `checkbox-list-secondary-label-${user.email}`;
                            return (
                                <ListItem
                                    style={{ display: index === 0 ? "none" : "block" }}
                                    key={user}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(user.email)}
                                            checked={checked.indexOf(user.email) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={user.email}
                                                src={user.email}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={user.email} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        }) : (
                            <Typography textAlign="center" marginBottom={2} id="server-modal-title" variant="h6" component="h2">
                                Không có user nào
                            </Typography>
                        )
                        )
                    }
                    {

                        !props.shareAlbum && (props.image.users.length > 1 ? props.image.users.map((user, index) => {
                            const labelId = `checkbox-list-secondary-label-${user.email}`;
                            return (
                                <ListItem
                                    style={{ display: index === 0 ? "none" : "block" }}
                                    key={user}
                                    secondaryAction={
                                        <Checkbox
                                            edge="end"
                                            onChange={handleToggle(user.email)}
                                            checked={checked.indexOf(user.email) !== -1}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={user.email}
                                                src={user.email}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={user.email} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        }) : (
                            <Typography textAlign="center" marginBottom={2} id="server-modal-title" variant="h6" component="h2">
                                Không có user nào
                            </Typography>
                        )
                        )
                    }
                </List>
                {
                    checked && checked.length !== 0 ? (
                        <div style={{ display: "flex", justifyContent: 'center' }}>
                            <Button onClick={handleUnShare} variant='contained' > UnShare</Button>
                        </div>
                    ) : null
                }
            </Box>
        </Modal >
    )
}
