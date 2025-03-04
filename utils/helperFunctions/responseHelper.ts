
import { Response } from 'express';

export const sendReponse = (res: Response, statusCode: number,  message: string,success:boolean,data?: any,) => {
    return res.status(statusCode).json({
        status :statusCode,
        success :success,
        data,
        message
    });
}