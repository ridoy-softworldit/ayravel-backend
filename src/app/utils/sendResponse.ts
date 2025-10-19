import { Response } from "express";

type TResponse<T> = {
    statusCode : number;
    success : boolean;
    message : string;
    data : T 
}

const sendResponse = <T>(res : Response , data : TResponse<T>) => {

    // Set the status code and send the response
    res.status(data?.statusCode || 200).json({
        success : data?.success || true,
        message : data?.message || "Success",
        data : data?.data || null
    })
}

export default sendResponse;