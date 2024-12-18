import axios from "axios";
import { FOBOH_BACKEND_URL } from "./Constants";
import { Product } from "./model/Product";


export async function getProducts(){
    const request = await axios.get(`${FOBOH_BACKEND_URL}/products`)
    return request.data as Product[]
}