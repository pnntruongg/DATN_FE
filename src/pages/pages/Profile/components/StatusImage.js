import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { get } from '../../../../api/axios';
import API from "../../../../api/config"
import Loading from "../../../layout-components/components/Loading"
import { useNavigate } from 'react-router-dom';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function StatusImage() {
    const [images, setImages] = useState([])
    const hook = useRef()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [step, setStep] = useState(0);
    const [stillImage, setStillImage] = useState(true)
    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (stillImage) {
                    setStep(prev => prev + 1)
                }
            }
        });
    });

    useEffect(() => {
        const fetApi = async () => {
            await get(API.URL_GET_ALL_STATUS_IMAGE + `?step=${step}`)
                .then(res => {
                    setIsLoading(false)
                    if (res.data.images.length < 5) {
                        console.log("vào đây ")
                        setStillImage(false)
                    }
                    console.log(res.data.step)
                    console.log(images.length)
                    if (res.data.step === "0" && images.length === 0) {

                        console.log("vô đây")
                        setImages(res.data.images)
                    } else {
                        setImages(prev => [
                            ...prev,
                            ...res.data.images,
                        ])
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        if (stillImage) {
            fetApi()
        }
    }, [step])

    useEffect(() => {
        if (!isLoading)
            observer.observe(hook.current)
    }, [isLoading])





    const render = (time, color) => {
        return (
            <div style={{ fontSize: '11px', fontWeight: '800', padding: "4px", backgroundColor: `${color}`, borderRadius: "8px" }}>{time.toString()}</div>
        )
    }

    const renderCreate = (date) => {
        const now = new Date()
        const time = new Date(date)
        let timeAgo = ((now - time) / 1000).toFixed()
        if (timeAgo < 60) {
            return render(timeAgo + " seconds ago", '#dce775')
        } else if (timeAgo < 3600) {
            return render((timeAgo / 60).toFixed() + " minnutes ago", '#ffea00')
        } else if (timeAgo < 86400) {
            return render((timeAgo / 60 / 60).toFixed() + " hours ago", '#ffd600')
        } else if (timeAgo < 604800) {
            return render((timeAgo / 60 / 60 / 24 / 7).toFixed() + " days ago", '#ffc400')
        } else if (timeAgo < 604800 * 4) {
            return render((timeAgo / 604800).toFixed() + " weeks ago", '#ffab00')
        } else if (timeAgo > 86400 * 30 && timeAgo < 86400 * 60) {
            return render(1 + " month ago", '#ff9100')
        } else {
            return render(`${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`, '#ff6d00')
        }
    }

    const renderStatus = (initImage) => {
        if (initImage === "0") {
            return (
                <div style={{ fontSize: '12px', fontWeight: '800', padding: "5px 5px", backgroundColor: '#e1e164b3', borderRadius: "8px" }}>Loading...</div>
            )
        } else if (initImage === "1") {
            return (
                <div style={{ fontSize: '12px', fontWeight: '800', padding: "5px 5px", backgroundColor: '#22d32294', borderRadius: "8px" }}>Success</div>
            )
        } else {
            return (
                <div style={{ fontSize: '12px', fontWeight: '800', padding: "5px 5px", backgroundColor: "#ff000061", borderRadius: "8px" }}>Failed</div>
            )
        }
    }

    const renderSize = (size) => {
        return (
            <div><span style={{ fontWeight: '700' }}>{(size / 1024 / 1024).toFixed(2)}</span> Mb</div>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='center' style={{ width: '10px' }}>STT</StyledTableCell>
                        <StyledTableCell align='center'>Image</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Album</StyledTableCell>
                        <StyledTableCell align="center">Created</StyledTableCell>
                        <StyledTableCell align="center">Size</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {images.map((image, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell align="center">
                                <span style={{ color: "#F6CB18", fontWeight: '700' }}>{index + 1}</span>
                            </StyledTableCell>
                            <StyledTableCell align='center' style={{ cursor: "pointer" }} onClick={() => { navigate(`/my-album/${image.album._id}/${image._id}`) }} component="th" scope="row">
                                <img style={{ borderRadius: '8px' }} height={100} width={100} src={`http://localhost:5001${image.imgURL}`}></img>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <p style={{ fontSize: '16px', fontWeight: '600' }}>{image.name}</p>
                            </StyledTableCell>
                            <StyledTableCell align="center">{image.album.name}</StyledTableCell>
                            <StyledTableCell align="center">{renderCreate(image.createdAt)}</StyledTableCell>
                            <StyledTableCell align="center">{renderSize(image.size)}</StyledTableCell>
                            <StyledTableCell align="center">{renderStatus(image.initImage)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            {
                isLoading ? (<Loading></Loading>) : (
                    <div ref={hook} style={{ height: "20px", width: "100%" }}></div>
                )
            }
        </TableContainer>
    );
}
