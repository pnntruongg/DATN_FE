import { userConstants } from "../constants/userConstant";
import { setAccessToken } from "../helper/Cookies";

export const ChangeDarkMode = () => dispatch => {
    dispatch({
        type: userConstants.CHANGE_DARK_MODE,
    })
}

export const updateImageAfterDelete = (idImage, idAlbum) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_IMAGE_AFTER_DELETE,
        idImage,
        idAlbum,
    })
}

export const updateNameUser = (name) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_NAME_USER,
        name
    })
}

export const updateAvatar = (avatarURL) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_AVATAR,
        avatarURL
    })
}

export const updateAlbumAfter = (nameNewAlbum, nameOldAlbum, idImage) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_ALBUM_AFTER_MOVE,
        payload: {
            nameNewAlbum,
            nameOldAlbum,
            idImage,
        }
    })
}

export const userLogin = (data, token = null) => dispatch => {
    if (token) {
        setAccessToken(token)
    }
    dispatch({
        type: userConstants.USER_LOGIN,
        payload: {
            dataUser: data
        }
    })
}


export const updateAlbumShare = (data) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_ONE_ALBUM,
        payload: {
            album: data
        }
    })
}

export const updateAlbum1 = (images, idAlbum) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_ALBUM + "1",
        payload: {
            idAlbum,
            images
        }
    })
}

export const updateAlbumAfterEdit = (album) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_ALBUM_AFTER_EDIT,
        album
    })
}

export const updateAlbum = (data) => dispatch => {
    dispatch({
        type: userConstants.USER_UPDATE_ALBUM,
        payload: {
            albums: data
        }
    })
}

export const updateDataUser = (data) => dispatch => {
    dispatch({
        type: userConstants.USER_LOGIN,
        payload: {
            dataUser: data
        }
    })
}

export const userLogOut = () => dispatch => {
    setAccessToken("avc")
    dispatch({
        type: userConstants.USER_LOGOUT
    })
}

export const unshareAlbumWithMe = (idAlbum) => dispatch => {

    dispatch({
        type: userConstants.USER_UNSHARE_ALBUM_WITH_ME,
        payload: {
            idAlbum
        }
    })
}

export const unshareImageWithMe = (idImage) => dispatch => {
    dispatch({
        type: userConstants.USER_UNSHARE_IMAGE_WITH_ME,
        payload: {
            idImage
        }
    })
}