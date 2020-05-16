import qs from 'qs'
import axios from 'axios';
import "../config/config"

const host = global.host;

axios.defaults.withCredentials = true;

export const postRequest = (url, params) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "post",
            url: `${host}${url}`,
            data: qs.stringify(params),
            type:'json',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(res => resolve(res.data))
            .catch(reject);

    })
}

export const getRequest = (url, params) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "get",
            url: `${host}${url}`,
            params: params,
        }).then(res => resolve(res.data))
            .catch(reject)
    })
}
