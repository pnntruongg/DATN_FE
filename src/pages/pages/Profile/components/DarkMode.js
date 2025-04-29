import * as React from 'react';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeDarkMode } from '../../../../actions/userAction';
export default function DarkMode() {
    const dispatch = useDispatch()
    const darkmode = useSelector(state => state.user.darkmode)
    return (
        <Box>
            <IconButton onClick={() => {
                dispatch(ChangeDarkMode())
            }} color="inherit">
                {darkmode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
    );
}
