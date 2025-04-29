import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import "./LoadingFixed.scss"
export default function LoadingFixed() {
    return (
        <div className='loading-fixed'>
            <CircularProgress
                className='circula-progress'
                sx={{
                    color: green[500],
                    position: 'absolute',
                    top: '40%',
                    left: '45%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                }}
            />
        </ div>
    )
}
