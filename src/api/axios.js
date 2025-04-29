import axios from "axios";

const config = {
    withCredentials: true,
};

const post = async (path, data) => {
    return await axios.post(path, data, config)
}

const get = async (path) => {
    return await axios.get(path, config)
}

const deleteAxios = async (path) => {
    return await axios.delete(path, config)
}

export { post, get, deleteAxios }