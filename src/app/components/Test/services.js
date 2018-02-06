import axios from 'axios';
import { restHeaders } from "appdir/app";


const fetchHello = () => {
    let hdr = restHeaders();
    console.log(restAPI)
    return axios.get(`${restAPI}/hello`, {headers: hdr}).then(({data}) => data);
};

export default {
    fetchHello,
}
