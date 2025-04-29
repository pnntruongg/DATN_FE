import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import "./CardNameAlbum.scss"
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import API from '../../../../api/config'
import { Button } from '@mui/material';
import { get, post } from '../../../../api/axios';
import { useDispatch } from 'react-redux';
import { updateAlbumShare } from '../../../../actions/userAction';
import { toast } from "react-toastify"
import { userLogOut } from '../../../../actions/userAction';
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

export default function ModalShare(props) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const handleClose = () => {
        setOpen(false);
        props.setOpenModalShare(false)
    }

    const [checked, setChecked] = React.useState([]);
    const [listUser, setListUser] = React.useState(null);
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



    const [search, setSearch] = useState("")
    const handleSearchUser = () => {
        if (search.length !== 0) {
            get(API.URL_SEARCH_USER + `?email=${search}`)
                .then(res => {
                    if (res.data.status === 401) {
                        dispatch(userLogOut())
                    } else {
                        setListUser(res.data.user)
                    }
                })
                .catch(err => {
                    alert(err)
                })
        } else {
            toast.warning("Nhập email cần chia sẻ")
        }
    }
    const callApiShareAlbum = () => {
        post(API.URL_SHARE_ALBUM, { listUser: checked, idAlbum: props.album._id })
            .then(res => {
                if (res.data.status === 401) {
                    dispatch(userLogOut())
                }
                if (res.data.status === 1) {
                    CheckToken()
                    toast.success("Chia sẻ album thành công")
                    setChecked([])
                    setListUser(null)
                    dispatch(updateAlbumShare(res.data.album))
                    handleClose()
                }
            })
            .catch(err => {
                toast.error("Lỗi hệ thống")
                alert(err)
            })
    }
    const callApiShareImage = () => {
        post(API.URL_SHARE_IMAGE, { listUser: checked, idImage: props.image._id })
            .then(res => {
                if (res.data.status === 401) {
                    dispatch(userLogOut())
                }
                if (res.data.status === 1) {
                    toast.success("Chia sẻ image thành công")
                    CheckToken()
                    setChecked([])
                    setListUser(null)
                    props.updateImage(res.data.image)
                    handleClose()
                }
            })
            .catch(err => {
                toast.error("Lỗi hệ thống")
                alert(err)
            })


    }
    const handleShare = () => {
        if (checked.length !== 0) {
            if (props.shareAlbum) {
                callApiShareAlbum()
            } else {
                callApiShareImage()
            }
        } else {
            toast.warning("Không có user để sharee")
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
                    Chia sẻ {props.shareAlbum ? "album" : "image"}
                </Typography>
                <Paper
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, marginBottom: '10px   ' }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        onBlur={(e) => { setSearch(e.target.value) }}
                        placeholder="Ex: lngthinphc@gmail.com"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton onClick={handleSearchUser} type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Paper>
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginTop: '20' }}>
                    {
                        listUser && (
                            listUser.length !== 0 ? listUser.map((user, index) => {
                                const labelId = `checkbox-list-secondary-label-${user.email}`;
                                return (
                                    <ListItem
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
                    listUser && listUser.length !== 0 ? (
                        <div style={{ display: "flex", justifyContent: 'center' }}>
                            <Button onClick={handleShare} variant='contained' > Share</Button>
                        </div>
                    ) : null
                }
            </Box>
        </Modal >
    )
}
