import React, { useState, useRef, useEffect } from 'react'
import API from "../../../api/config"
import { useSelector } from 'react-redux';
import { TextField, Grid, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import "./Upload.scss"
import FormData from 'form-data';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { post } from "../../../api/axios"
import CircularProgress from '@mui/material/CircularProgress';
import Resizer from "react-image-file-resizer";
import { updateAlbum1 } from '../../../actions/userAction';
import { toast } from 'react-toastify';
import CheckToken from '../../../helper/CheckToken';
import LoadingFixed from '../../layout-components/components/LoadingFixed';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const styles = theme => ({
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500
    },
    input: {
        color: 'white'
    }
});

export default function Upload(props) {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const refBtn = useRef()
    const navigate = useNavigate()
    const [album, setAlbum] = React.useState('');
    const [nameImage, setNameImage] = React.useState('');
    const handleChange = (event) => {
        setAlbum(event.target.value);
    };
    const [isLoading, setIsLoading] = useState(false)

    //////////////////
    const [files, setFiles] = useState([]);
    const [arrFiles, setArrFiles] = useState([])
    const [previewUrl, setPreviewUrl] = useState([])
    const [statusLoad, setStatusLoad] = useState(null)

    useEffect(() => {
        document.title = "Upload Image"
    }, [])
    useEffect(() => {
        const init = async (i) => {
            if (i === arrFiles.length) return
            await Resizer.imageFileResizer(
                arrFiles[i],
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => {
                    setPreviewUrl(oldState => [
                        ...oldState,
                        uri,
                    ])
                    init(i + 1)
                },
                "base64",
                200,
                200
            );
        }
        init(0)
    }, [arrFiles])

    // useEffect(() => {
    //     return async () => {
    //         console.log("calll api clear rasc")
    //         await axios.get(API.URL_CLEAR_IMAGE_TRASH)
    //     }
    // }, [])

    const filePickerRef = useRef()
    const pickedHandler = (e) => {
        if ([...e.target.files].length <= 20) {
            setArrFiles([...e.target.files])
            console.log(e.target.files)
            setFiles((oldState) => {
                return [
                    ...oldState,
                    ...e.target.files
                ]
            })
        } else {
            toast.error("Bạn được nhập tối đa 20 file ảnh")
        }
    }

    const handleClickDeleteImage = (index) => {
        setPreviewUrl(oldState => oldState.filter((preview, key) => key !== index))
        setFiles(oldState => oldState.filter((files, key) => key !== index))
        toast.success("Xóa ảnh thành công!")
    }

    const submitForm = async (e) => {
        e.preventDefault()
        if (files.length === 0) {
            toast.warning("Vui lòng nhập file!")
        } else if (files.length > 20) {
            toast.warning("Tối đa 20 files!")

        } else if (!loading && !statusLoad) {
            setStatusLoad(new Array(files.length).fill("0"))
            const data = new FormData()
            for (let x = 0; x < files.length; x++) {
                data.append('file', files[x])
            }
            data.append("email", user.dataUser.email)
            data.append("nameImage", nameImage)
            data.append("albumId", album)
            setSuccess(false);
            setLoading(true);
            setIsLoading(true)
            axios({
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                method: "POST",
                data: data,
                url: "/api/v1/image/upload1", // route name
                baseURL: "http://localhost:5001", //local url
                onUploadProgress: (progress) => {
                    const { total, loaded } = progress;
                    const totalSizeInMB = total / 1000000;
                    const loadedSizeInMB = loaded / 1000000;
                    const uploadPercentage = (loadedSizeInMB / totalSizeInMB) * 100;
                    setProgress(uploadPercentage.toFixed())
                    if (total == loaded) {
                        toast.success("Request gửi lên server thành công")
                        setSuccess(true);
                        setLoading(false);
                    }
                },
                encType: "multipart/form-data",
            }).then(res => {

                if (res.data.status === 1) {
                    setIsLoading(false)
                    CheckToken()
                    callCheckUpLoad1(res.data.listImage)
                }

            }).catch(err => {
                alert(err)
            })
        }
    }

    const callCheckUpLoad1 = (listImage) => {
        let timer = setInterval(async () => {
            await post(API.URL_CHECK_UPLOAD_IMAGE + "1", { listImage })
                .then(async (res) => {
                    if (res.data.status === 1) {
                        CheckToken()
                        let status = res.data.images.map(image => image.initImage)
                        setStatusLoad(status)
                        console.log(status[status.length - 1])
                        if (status[status.length - 1] !== "0") {
                            toast.success("Upload thành công")
                            let imageSuccess = await res.data.images.filter(image => image.initImage === "1")
                            dispatch(updateAlbum1(imageSuccess, album))
                            setTimeout(() => {
                                navigate("/my-album")
                            }, 2000)
                            clearInterval(timer)
                        }
                    }
                })
        }, 500)
    }

    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    const handleButtonClick = () => {
        refBtn.current.click()
    };

    const darkmode = useSelector(state => state.user.darkmode)

    const handleTest = () => {
        const arr = Array.from(Array(500).keys())
        arr.map(value => {
            const data = new FormData()
            for (let x = 0; x < files.length; x++) {
                data.append('file', files[x])
            }
            data.append("email", user.dataUser.email)
            data.append("nameImage", nameImage)
            data.append("albumId", album)
            axios({
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                method: "POST",
                data: data,
                url: "/api/v1/image/upload1", // route name
                baseURL: "http://localhost:5001", //local url
                encType: "multipart/form-data",
            }).then(res => {

            }).catch(err => {
                alert(err)
            })
        })
    }

    return (
        <div style={{ backgroundColor: darkmode ? "white" : "#1f2125", paddingBottom: '200px ' }} className='upload'>
            {isLoading && <LoadingFixed></LoadingFixed>}
            <div className='modal'>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <p style={{ textAlign: 'center', color: "#F6CB18" }} onClick={handleTest} className='title'>IMAGE UPLOAD</p>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={submitForm} method="post" action={`${API.URL_UPLOAD_USER}`} target="dummyframe" encType="multipart/form-data">
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <div className='image-review'>
                                        <Grid container spacing={2}>
                                            {previewUrl.map((url, index) => (
                                                <Grid className='card-image-add' key={index} style={{ position: "relative" }} item xs={6}>
                                                    <img src={url} style={{ height: '200px', borderRadius: '8px' }} alt='preview-image1'>
                                                    </img>
                                                    {
                                                        !statusLoad && (<div className='delete-icon' onClick={() => handleClickDeleteImage(index)}>
                                                            <DeleteIcon style={{ width: '50px', height: '50px' }}></DeleteIcon>
                                                        </div>)
                                                    }

                                                    {
                                                        statusLoad ? statusLoad[index] === "0" ? (
                                                            <div className='upload-background'>
                                                                <CircularProgress style={{ height: '60px ', width: '60px ' }} color="success" />
                                                            </div>
                                                        ) : (
                                                            statusLoad[index] === "1" ? (
                                                                <div style={{ color: 'greenyellow' }} className='upload-background'>
                                                                    <CheckBoxIcon style={{ fontSize: '40px' }}> </CheckBoxIcon>
                                                                </div>
                                                            ) : (
                                                                <div style={{ color: 'red' }} className='upload-background'>
                                                                    <CancelIcon style={{ fontSize: '40px' }}></CancelIcon>
                                                                </div>
                                                            )
                                                        ) : ""
                                                    }
                                                </Grid>
                                            ))}
                                            <Grid item xs={6}>
                                                <img className='add-image' onClick={() => { filePickerRef.current.click() }} src={"./add-image.png"} style={{ height: '200px', borderRadius: '50%', backgroundColor: "#00000000", border: "4px solid #00000000" }} alt='preview-image123'>
                                                </img>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <TextField
                                            required
                                            onChange={(e) => { setNameImage(e.target.value) }}
                                            className={"upload-input " + styles.textField} name='nameImage'
                                            id="outlined-basic"
                                            label="Name Image"
                                            variant="outlined"
                                            size='small'
                                            style={{
                                                backgroundColor: "white",
                                                borderRadius: '8px'
                                            }}
                                            InputProps={{
                                                style: {
                                                    borderColor: 'white'
                                                }
                                            }}
                                        />
                                        <FormControl style={{ backgroundColor: "white", borderRadius: '8px' }} className="upload-input" fullWidth>
                                            <InputLabel id="demo-simple-select-label">Album</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={album}
                                                required
                                                name='albumId'
                                                label="Album"
                                                onChange={handleChange}
                                                size='small'
                                            >
                                                {
                                                    user.dataUser.albums.length !== 0 && user.dataUser.albums.map((album, index) => (
                                                        <MenuItem key={index} value={album._id}>{album.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                        <input style={{ display: 'none' }} className="upload-input-file" multiple type="file" name="image" accept='.jpg,.png,.jpeg,.gif' onChange={pickedHandler} ref={filePickerRef} />
                                        {files.length > 0 && <p style={{ color: !darkmode ? "white" : "black" }}>Bạn chọn <span style={{ color: "#F6CB18", fontWeight: "600" }}>{files.length}</span> files</p>}
                                        <Button onClick={() => { filePickerRef.current.click() }} variant="outlined"
                                            style={{ color: !darkmode ? "#F6CB18" : "#1976d2", borderColor: !darkmode ? "#F6CB18" : "#1976d2" }}
                                            startIcon={<InsertDriveFileIcon />}>
                                            Choose file
                                        </Button>
                                        <br /><br />
                                        <Button style={{ display: 'none' }} type="submit" ref={refBtn} variant="contained">Upload</Button>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress variant="determinate" value={progress} />
                                        </div>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box sx={{ m: 1, position: 'relative' }}>
                                                <Fab
                                                    aria-label="save"
                                                    color="primary"
                                                    sx={buttonSx}
                                                    type="submit"
                                                    style={{ backgroundColor: !darkmode ? "#F6CB18" : "#1976d2" }}
                                                    onClick={handleButtonClick}
                                                >
                                                    {success ? <CheckIcon /> : <SaveIcon />}
                                                </Fab>
                                                {loading && (
                                                    <CircularProgress
                                                        size={68}
                                                        sx={{
                                                            color: green[500],
                                                            position: 'absolute',
                                                            top: -6,
                                                            left: -6,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Box sx={{ m: 1, position: 'relative' }}>
                                                <Button
                                                    variant="contained"
                                                    sx={buttonSx}
                                                    disabled={loading}
                                                    style={{ backgroundColor: !darkmode ? "#F6CB18" : "#1976d2" }}
                                                    onClick={handleButtonClick}
                                                >
                                                    Upload
                                                </Button>
                                                {loading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{
                                                            color: green[500],
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            marginTop: '-12px',
                                                            marginLeft: '-12px',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}
