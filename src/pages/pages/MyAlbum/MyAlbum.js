import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import "./MyAlbum.scss"
import CardNameAlbum from './components/CardNameAlbum';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from "react-redux"
import API from '../../../api/config'
import { updateAlbum, userLogOut } from '../../../actions/userAction';
import { toast } from "react-toastify"
import Search from './components/Search';
import { post } from '../../../api/axios';
import CardNameAlbumShare from "./components/CardNameAlbumShare"
import CardImageShare from './components/CardImageShare';
import CheckToken from '../../../helper/CheckToken';
import RemoveAccents from '../../../helper/RemoveAccents';
import { Divider } from '@mui/material';
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
export default function MyAlbum() {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const darkmode = useSelector(state => state.user.darkmode)
    const [nameAlbum, setNameAlbum] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleBlurNameAlbum = (e) => {
        setNameAlbum(e.target.value)
    }
    const handleClickAddAlbum = () => {
        if (nameAlbum !== "") {
            post(API.URL_ADD_ALBUM, { nameAlbum, email: user.dataUser.email })
                .then(res => {
                    if (res.data.status === 401) {
                        dispatch(userLogOut())
                    }
                    if (res.data.status === 1) {
                        CheckToken()
                        dispatch(updateAlbum(res.data.dataUser.albums))
                        toast.success("Tạo album thành công!")
                        handleClose()
                    } else {
                        toast.error("Album tồn tại!")
                    }
                })
                .catch(err => {

                })
        } else {
            toast.warning("Nhập đầy đủ các trường!")
        }
    }
    useEffect(() => {
        document.title = "My Album"

    }, [])
    const [search, setSearch] = useState("");
    const [ownAlbumSearch, setOwnAlbumSearch] = useState([])
    const [shareAlbumSearch, setShareAlbumSearch] = useState([])
    const [shareImageSearch, setShareImageSearch] = useState([])
    useEffect(() => {
        let searchRemoveAccents = RemoveAccents(search)
        console.log(user.dataUser)
        console.log(RemoveAccents(search));
        user.dataUser.albums.length !== 0 && setOwnAlbumSearch(() => {
            let arr = user.dataUser.albums.filter(album => {
                let date = new Date(album.createdAt)
                if (RemoveAccents(album.name).includes(searchRemoveAccents)) {
                    return album
                }
                let hash = searchRemoveAccents.split("/")
                if (Number(hash[0]) === date.getDate() && Number(hash[1]) === date.getMonth() + 1 && Number(hash[2]) === date.getFullYear()) {
                    return album
                }
            })
            return arr
        })
        user.dataUser.albumsShare.length !== 0 && setShareAlbumSearch(() => {
            let arr = user.dataUser.albumsShare.filter(album => {
                let date = new Date(album.createdAt)
                if (RemoveAccents(album.name).includes(searchRemoveAccents) || RemoveAccents(album.users[0].email).includes(searchRemoveAccents)) {
                    return album
                }
                let hash = searchRemoveAccents.split("/")
                if (Number(hash[0]) === date.getDate() && Number(hash[1]) === date.getMonth() + 1 && Number(hash[2]) === date.getFullYear()) {
                    return album
                }
            })
            return arr
        })
        user.dataUser.imagesShare.length !== 0 && setShareImageSearch(() => {
            let arr = user.dataUser.imagesShare.filter(image => {
                let date = new Date(image.createdAt)
                if (RemoveAccents(image.name).includes(searchRemoveAccents) || RemoveAccents(image.users[0].email).includes(searchRemoveAccents)) {
                    return image
                }
                let hash = searchRemoveAccents.split("/")
                if (Number(hash[0]) === date.getDate() && Number(hash[1]) === date.getMonth() + 1 && Number(hash[2]) === date.getFullYear()) {
                    return image
                }
            })
            return arr
        })
    }, [search])

    const handleTest = () => {
        const arr = Array.from(Array(5000).keys())
        arr.map(value => {
            post(API.URL_ADD_ALBUM, { nameAlbum: "a" + value, email: user.dataUser.email })
                .then(res => {

                })
                .catch(err => {

                })
        })
    }

    return (
        <div style={{ backgroundColor: darkmode ? "white" : "#1f2125" }} className='my-album'>
            <Search search={search} setSearch={setSearch}></Search>
            {search && <div style={{ margin: "40px 0" }}>
                <Typography sx={{ fontSize: 20, fontWeight: '600', marginBottom: '30px', color: darkmode ? "black" : "#F6CB18" }} variant="h3" color="text.secondary" gutterBottom>
                    Kết quả tìm kiếm
                </Typography>
                <Grid container spacing={5}>
                    {
                        ownAlbumSearch && ownAlbumSearch.length !== 0 ? ownAlbumSearch.map((infoAlbum, index) => (
                            <CardNameAlbum album={infoAlbum} key={index}></CardNameAlbum>
                        )) : ""
                    }
                    {
                        shareAlbumSearch && shareAlbumSearch.length !== 0 ? shareAlbumSearch.map((infoAlbum, index) => (
                            <CardNameAlbumShare album={infoAlbum} key={index}></CardNameAlbumShare>
                        )) : ""
                    }
                    {
                        shareImageSearch && shareImageSearch.length !== 0 ? shareImageSearch.map((infoImage, index) => (
                            <CardImageShare image={infoImage} key={index}></CardImageShare>
                        )) : ""
                    }
                    {
                        ownAlbumSearch.length === 0 && shareAlbumSearch.length === 0 && shareImageSearch.length === 0 ?
                            (<Grid item xs={12}>
                                <h2 style={{ textAlign: 'center', margin: '40px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Kết quả tìm kiếm trống</h2>
                            </Grid>
                            ) : ""
                    }
                </Grid>
                <Divider style={{ margin: '60px 0', backgroundColor: darkmode ? "black" : "#F6CB18" }}></Divider>
            </div>}

            <div className='my-album-is-me'>
                <Typography onClick={handleTest} sx={{ fontSize: '20px', fontWeight: '600', color: darkmode ? "black" : "#F6CB18" }} variant="h3" color="text.secondary" gutterBottom>
                    Album của bạn
                </Typography>
                <Fab style={{ background: darkmode ? "#1976d2" : "#F6CB18" }} onClick={handleOpen} color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="server-modal-title" variant="h6" component="h2">
                            Thêm album
                        </Typography>
                        <TextField fullWidth onBlur={handleBlurNameAlbum} id="outlined-basic" label="Tên album" variant="outlined" />
                        <Button onClick={handleClickAddAlbum} variant="contained" sx={{ width: '100%', marginTop: '10px' }}>Thêm</Button>
                    </Box>
                </Modal>

            </div>
            <Grid container spacing={5}>
                {
                    user.dataUser.albums && user.dataUser.albums.length !== 0 ? user.dataUser.albums.map((infoAlbum, index) => (
                        <CardNameAlbum album={infoAlbum} key={index}></CardNameAlbum>
                    )) : (<Grid item xs={12}>
                        <h2 style={{ textAlign: 'center', margin: '20px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Bạn chưa có album nào</h2>
                    </Grid>
                    )
                }
            </Grid>
            <Typography sx={{ fontSize: "20px", fontWeight: '600', margin: '40px 0', color: darkmode ? "black" : "#F6CB18" }} variant="h3" color="text.secondary" gutterBottom>
                Album bạn được chia sẻ
            </Typography>
            <Grid container spacing={2}>
                {
                    user.dataUser.albumsShare && user.dataUser.albumsShare.length !== 0 ? user.dataUser.albumsShare.map((infoAlbum, index) => (
                        <CardNameAlbumShare album={infoAlbum} key={index}></CardNameAlbumShare>
                    )) : (<Grid item xs={12}>
                        <h2 style={{ textAlign: 'center', margin: '40px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Bạn chưa có album chia sẻ nào</h2>
                    </Grid>
                    )
                }
            </Grid>
            <Typography sx={{ fontSize: "20px", fontWeight: '600', marginTop: '50px', color: darkmode ? "black" : "#F6CB18" }} variant="h3" color="text.secondary" gutterBottom>
                Ảnh bạn được chia sẻ
            </Typography>
            <Grid container spacing={2}>
                {
                    user.dataUser.imagesShare && user.dataUser.imagesShare.length !== 0 ? user.dataUser.imagesShare.map((infoImage, index) => (
                        <CardImageShare image={infoImage} key={index}></CardImageShare>
                    )) : (<Grid item xs={12}>
                        <h2 style={{ textAlign: 'center', margin: '40px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Bạn chưa có ảnh chia sẻ nào</h2>
                    </Grid>
                    )
                }
            </Grid>
        </div >
    )
}
