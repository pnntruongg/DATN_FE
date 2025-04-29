import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useSelector } from "react-redux";

import Profile from "./pages/pages/Profile/Profile";
import Login from "./authentication/pages/Login";
import Register from "./authentication/pages/Register";
import TheContent from "./pages/layout-components/TheContent";
import Upload from "./pages/pages/Upload/Upload";
import MyAlbum from "./pages/pages/MyAlbum/MyAlbum";
import ViewAlbum from "./pages/pages/MyAlbum/ViewAlbum";
import ViewImage from "./pages/pages/ViewImage/ViewImage";
import API from './api/config'
import { userLogin } from "./actions/userAction";
import { useDispatch } from 'react-redux'
import Loading from "./pages/layout-components/components/Loading";
import { get } from "./api/axios";
import CheckToken from "./helper/CheckToken";
const Routers = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const refreshApi = async () => {
            get(API.URL_REFRESH)
                .then(res => {
                    if (res.data.status === 1) {
                        dispatch(userLogin(res.data.user))
                        CheckToken()
                    }
                    setIsLoaded(true)
                })
                .catch(err => {
                    setIsLoaded(true)
                })
        }
        refreshApi()
    }, [dispatch])

    if (!isLoaded) return (
        <Loading></Loading>
    )


    return (
        <React.Suspense >
            <Router>
                <Routes>
                    {
                        user.isLogin ? (
                            <Route path="/" name="Upload" element={<TheContent></TheContent>}>
                                <Route path="/" name="My Album" element={<Navigate to={'/my-album'}></Navigate>}></Route>
                                <Route
                                    path="/:id"
                                    element={<MyAlbum></MyAlbum>}
                                >
                                </Route>
                                <Route
                                    path={"/my-album/:id"}
                                    element={<ViewAlbum></ViewAlbum>}
                                >
                                </Route>
                                <Route
                                    path={"/my-album/:id/:id"}
                                    element={<ViewImage></ViewImage>}
                                >
                                </Route>
                                <Route
                                    path={"/my-album/image-share/:id"}
                                    element={<ViewImage></ViewImage>}
                                >
                                </Route>
                                <Route
                                    key={'/upload'}
                                    path={'/upload'}
                                    element={<Upload></Upload>}
                                ></Route>
                                <Route
                                    key={'/my-album'}
                                    path={'/my-album'}
                                    element={<MyAlbum></MyAlbum>}
                                ></Route>
                                <Route
                                    path="/profile"
                                    element={<Profile></Profile>}
                                >
                                </Route>
                            </Route>
                        ) : (
                            <>
                                <Route path="/" name="Login" element={<Login></Login>}></Route>
                                <Route path="/login" name="Login" element={<Login></Login>}></Route>
                                <Route path="/:slug" name="Login" element={<Login></Login>}></Route>
                                <Route path="/register" name="Register" element={<Register></Register>}></Route>
                            </>
                        )
                    }
                </Routes>
                <ToastContainer></ToastContainer>
            </Router >
        </React.Suspense>
    )


}

export default Routers
