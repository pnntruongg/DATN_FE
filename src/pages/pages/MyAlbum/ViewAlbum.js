import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import "./MyAlbum.scss"
import CardImage from './components/CardImage';
import API from '../../../api/config'
import Search from './components/Search';
import { useParams } from 'react-router-dom';
import { get } from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CheckToken from '../../../helper/CheckToken';
import { userLogOut } from '../../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import RemoveAccents from "../../../helper/RemoveAccents"
import { Divider } from '@mui/material';

export default function ViewAlbum() {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const darkmode = useSelector(state => state.user.darkmode)
    const [album, setAlbum] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [page, setPage] = useState(1)
    const [isOwner, setIsOwner] = useState(false);
    const handleChangePage = (e, num) => {
        setPage(num)
    }

    useEffect(() => {
        document.title = album?.name ? album.name : "Loading...."
    }, [album])

    const renderCount = () => {
        let index = album.images.length
        if (index % 12 === 0) {
            return Number(index / 12)
        } else {
            return Number(Math.floor(index / 12) + 1)
        }
    }

    const updateImage = (imageUpdate) => {
        const imgs = album.images.map(image => {
            if (image._id === imageUpdate._id) {
                return imageUpdate
            } else {
                return image
            }
        })
        setAlbum((state) => {
            return {
                ...state,
                images: imgs
            }
        })
    }

    const deleteImage = (idImage) => {
        const imgs = album.images.filter(image => image._id !== idImage)
        setAlbum((state) => {
            return {
                ...state,
                images: imgs
            }
        })
    }

    const updateAlbumAfterMove = (idImage) => {
        console.log(album)
        setAlbum(state => {
            state.images = state.images.filter(image => image._id !== idImage)
            console.log(state)
            return {
                ...state
            }
        })
    }

    useEffect(() => {
        get(API.URL_GET_IMAGES_ALBUM + `?id=${params.id}`)
            .then(res => {
                if (res.data.status === 401) {
                    dispatch(userLogOut())
                }
                if (res.data.status === 1) {
                    CheckToken()
                    setAlbum(res.data.album)
                    setIsLoaded(true)
                    setIsOwner(res.data.isOwner)
                }
            })
            .catch(err => {
                alert(err.message)
            })
    }, [params.id, dispatch])

    const [search, setSearch] = useState("");
    const [ownImageSearch, setOwnImageSearch] = useState([])

    useEffect(() => {
        console.log(album.images)
        let searchRemoveAccents = RemoveAccents(search)
        album.images && album.images.length !== 0 && setOwnImageSearch(() => {
            let arr = album.images(image => {
                let date = new Date(image.createdAt)
                if (RemoveAccents(image.name).includes(searchRemoveAccents)) {
                    return image
                }
                let hash = searchRemoveAccents.split("/")
                if (Number(hash[0]) === date.getDate() && Number(hash[1]) === date.getMonth() + 1 && Number(hash[2]) === date.getFullYear()) {
                    return image
                }
            })
            return arr
        })
    }, [search, album.images, album])

    return (
        <div style={{ backgroundColor: darkmode ? "white" : "#1f2125" }} className='my-album'>
            <Search search={search} setSearch={setSearch}></Search>

            <div className='my-album-is-me'>
                <Typography sx={{ fontSize: 20, fontWeight: '600', display: 'flex', alignItems: 'center', color: darkmode ? "black" : "white" }} variant="h3" color="text.secondary" gutterBottom>
                    <IconButton style={{ color: darkmode ? "black" : "white" }} onClick={() => { navigate("/my-album") }} aria-label="delete">
                        <ArrowBackIcon />
                    </IconButton>
                    <p style={{ transform: "translateY(+1px)", marginLeft: '10px ' }}>
                        {album.name}
                    </p>
                </Typography>
            </div>

            {search && <div style={{ margin: "40px 0" }}>
                <Typography sx={{ fontSize: 20, fontWeight: '600', marginBottom: '30px', color: darkmode ? "black" : "white" }} variant="h3" color="text.secondary" gutterBottom>
                    Tìm kiếm được <span style={{ color: "#F6CB18", padding: '0 5px', fontWeight: "700" }}>{ownImageSearch.length}</span> kết quả
                </Typography>
                <Grid container spacing={5}>
                    {
                        ownImageSearch && ownImageSearch.length !== 0 ? ownImageSearch.map((image, index) => (
                            <CardImage isOwner={isOwner} updateAlbumAfterMove={updateAlbumAfterMove} updateImage={updateImage} deleteImage={deleteImage} image={image} nameAlbum={album.name} users={album.users} key={index}></CardImage>
                        )) : ""
                    }
                    {
                        ownImageSearch.length === 0 ?
                            (<Grid item xs={12}>
                                <h2 style={{ textAlign: 'center', margin: '40px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Kết quả tìm kiếm trống</h2>
                            </Grid>
                            ) : ""
                    }
                </Grid>
                <Divider style={{ margin: '60px 0', backgroundColor: darkmode ? "black" : "#F6CB18" }}></Divider>
            </div>}
            {
                isLoaded && <div style={{ fontSize: "25px", marginBottom: '30px', fontWeight: '600', color: 'gray' }}>Bạn có tổng
                    <span style={{ color: "#F6CB18", padding: '0 5px', fontWeight: "700" }}>{album.images.length}</span>
                    ảnh
                </div>
            }
            <Grid container spacing={4}>
                {
                    isLoaded ? (
                        album.images && album.images.length !== 0 ? album.images.map((image, index) => {
                            if (index < page * 12 && index >= (page - 1) * 12) {
                                return (
                                    <CardImage isOwner={isOwner} updateAlbumAfterMove={updateAlbumAfterMove} updateImage={updateImage} deleteImage={deleteImage} nameAlbum={album.name} image={image} users={album.users} idAlbum={album._id} key={index}></CardImage>
                                )
                            }
                            return null;
                        }) : (<Grid item xs={12}>
                            <h2 style={{ textAlign: 'center', margin: '20px 0', color: darkmode ? "black" : "rgb(246 203 24 / 58%)" }}>Album rỗng</h2>
                        </Grid>
                        )
                    ) : (
                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress style={{ height: '100px ', width: '100px ' }} color="success" />
                            </div>
                        </Grid>
                    )
                }
            </Grid>
            {
                isLoaded && album.images && album.images.length !== 0 ? (
                    <Stack justifyContent={'center'} alignItems={"center"} marginTop="40px" spacing={2}>
                        <Pagination onChange={handleChangePage} count={renderCount()} variant="outlined" size='large' color="secondary" />
                    </Stack>
                ) : ("")
            }
        </div >
    )
}
