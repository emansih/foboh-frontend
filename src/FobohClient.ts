import axios from "axios";
import { FOBOH_BACKEND_URL } from "./Constants";
import { Product } from "./model/Product";
import { AdjustmentResponse } from "./model/AdjustmentResponse";


export async function getProducts(){
    const request = await axios.get(`${FOBOH_BACKEND_URL}/products`)
    return request.data as Product[]
}

export async function searchProduct(searchQuery: string){
    const request = await axios.post(`${FOBOH_BACKEND_URL}/products/search`, {
        'searchQuery': searchQuery
    })
    return request.data as Product[]
}

export async function adjustPrice(incrementType: "Fixed" | "Dynamic", adjustmentType: "Increase" | "Decrease", 
    productsToBeAdjusted: { id: string; adjustment: number }[]){
    const request = await axios.post(`${FOBOH_BACKEND_URL}/pricing/calculate`, {
        'incrementType': incrementType,
        'adjustmentType': adjustmentType,
        'productsToBeAdjusted': productsToBeAdjusted
    })
    return request.data as AdjustmentResponse[]
}