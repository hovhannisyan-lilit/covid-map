import axios from "axios";

const api = axios.create({
    baseURL: "https://api.covidtracking.com/v1/",
    headers: {
    },
});

export default class Api {
    static getAllData(){
        return api.get('/states/current.json')
    }
}
