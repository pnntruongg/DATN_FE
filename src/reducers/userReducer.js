import { userConstants } from "../constants/userConstant";

const initialState = {
    dataUser: {},
    isLogin: false,
    darkmode: false,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case userConstants.CHANGE_DARK_MODE:
            return {
                ...state,
                darkmode: !state.darkmode
            }
        case userConstants.USER_UPDATE_IMAGE_AFTER_DELETE:
            state.dataUser.albums = state.dataUser.albums.map(album => {
                if (album._id === action.idAlbum) {
                    album.images = album.images.filter(image => image._id !== action.idImage)
                }
                return album
            })
            return {
                ...state
            }
        case userConstants.USER_UPDATE_NAME_USER:
            state.dataUser.name = action.name
            return {
                ...state
            }
        case userConstants.USER_UPDATE_AVATAR:
            state.dataUser.avatarURL = action.avatarURL
            return {
                ...state,
            }
        case userConstants.USER_UPDATE_ALBUM_AFTER_MOVE:
            let imageMove
            state.dataUser.albums = state.dataUser.albums.map(album => {
                if (album.name === action.payload.nameOldAlbum) {
                    album.images = album.images.filter(image => {
                        if (image._id === action.payload.idImage) {
                            imageMove = image
                        } else {
                            return image
                        }
                    })
                }
                return album
            })
            state.dataUser.albums = state.dataUser.albums.map(album => {
                if (album.name === action.payload.nameNewAlbum) {
                    album.images.push(imageMove)
                }
                return album
            })
            console.log(state)
            return {
                ...state
            }
        case userConstants.USER_UPDATE_ALBUM_AFTER_EDIT:
            state.dataUser.albums = state.dataUser.albums.map(album => {
                if (album._id === action.album._id) {
                    return action.album
                } else {
                    return album
                }
            })
            return {
                ...state
            }
        case userConstants.USER_UNSHARE_IMAGE_WITH_ME:
            return {
                ...state,
                dataUser: {
                    ...state.dataUser,
                    imagesShare: state.dataUser.imagesShare.filter(image => image._id !== action.payload.idImage)
                }
            }
        case userConstants.USER_UNSHARE_ALBUM_WITH_ME:
            return {
                ...state,
                dataUser: {
                    ...state.dataUser,
                    albumsShare: state.dataUser.albumsShare.filter(album => album._id !== action.payload.idAlbum)
                }
            }
        case userConstants.USER_LOGIN:
            return {
                dataUser: action.payload.dataUser,
                isLogin: true,
                darkmode: false
            }
        case userConstants.USER_LOGOUT:
            return {
                dataUser: {},
                isLogin: false,
                darkmode: false,
            }
        case userConstants.USER_UPDATE_ALBUM + "1":
            state.dataUser.albums = state.dataUser.albums.map(album => {
                if (album._id === action.payload.idAlbum) {
                    album.images = album.images.concat(action.payload.images)
                }
                return album
            })
            return {
                ...state,
            }
        case userConstants.USER_UPDATE_ALBUM:
            state.dataUser.albums = action.payload.albums
            return {
                ...state,
            }
        case userConstants.USER_UPDATE_ONE_ALBUM:
            const albumsUser = state.dataUser.albums
            state.dataUser.albums = albumsUser.map(album => {
                if (album._id === action.payload.album._id) {
                    return action.payload.album
                } else {
                    return album
                }
            })
            return {
                ...state
            }
        default:
            return state
    }
}

export default userReducer