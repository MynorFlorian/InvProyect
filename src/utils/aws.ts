import { v4 } from "uuid";

import { Credentials } from "aws-sdk";
import * as AWS from "aws-sdk";

export const access = new Credentials({
    accessKeyId: `${process.env.ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
});

export const s3 = new AWS.S3({
    credentials: access,
    region: `${process.env.REGION}`,
    signatureVersion: "v4",
    endpoint: 's3.amazonaws.com',
});

export const getUrlUpload = async (fileName: string, type: string) => {
    try {
        console.log({region: process.env.REGION});
        let id = v4().toString();
        let extension = fileName ? '.' + fileName.split('.').pop() : fileName ? '.' + fileName.split('.').pop() : '.jpg';
        let name = id + extension;

        // Get signed URL from S3
        const s3Params = {
            Bucket: 'Inventario-bucket/images',
            Key: name,
            Expires: 900,
            ContentType: type,
            ACL: 'public-read'
        }
        const uploadURL = await s3.getSignedUrlPromise('putObject', {...s3Params})

        let result = { id, extension, uploadURL };
        
        return ({ error: false, result: result });
    } catch (error: any) {
        return ({ error: true, message: "Error: "+ error.message });
    }
}

