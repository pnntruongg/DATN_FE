import { getAccessToken, setAccessToken } from "./Cookies"
import { jwtDecode } from 'jwt-decode';
import { get } from "../api/axios"
import API from "../api/config"

const CheckToken = () => {
    const token = getAccessToken("_jwt")
    const decode = jwtDecode(token);
    const expTime = decode.exp - Date.now() / 1000
    if (expTime < 60 && expTime > 0) {
        get(API.URL_GET_TOKEN)
            .then(res => {
                setAccessToken(res.data.token)
            })
            .catch(err => {
                alert(err.message)
            })
    }
}

export default CheckToken