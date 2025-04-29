import React, { useEffect } from 'react'
import { Grid, Container, Divider } from '@mui/material'
import "./Profile.scss"
import AvatarComponent from './components/AvatarComponent'
import InfoDetail from './components/InfoDetail'
import StatusImage from './components/StatusImage'
import { useSelector } from 'react-redux'
export default function Profile() {
    const darkmode = useSelector(state => state.user.darkmode)
    useEffect(() => {
        document.title = "Profile"
    }, [])

    return (
        <div style={{ backgroundColor: darkmode ? "white" : "#1f2125" }} >
            <Container className='profile' maxWidth={'md'}>
                <Grid display={'flex'} justifyContent="center" item md={12}>
                    <div className='profile-header'>
                        <AvatarComponent></AvatarComponent>
                        <InfoDetail></InfoDetail>
                    </div>
                </Grid>
                <Grid item md={12}>
                    <Divider style={{ marginTop: '80px', backgroundColor: !darkmode ? "#F6CB18" : "white" }}></Divider>
                </Grid>
                <Grid item md={12}>
                    <Divider style={{ marginTop: '80px' }}></Divider>
                </Grid>
                <Grid item md={12}>
                    <StatusImage></StatusImage>
                </Grid>
            </Container>
        </div>

    )
}
