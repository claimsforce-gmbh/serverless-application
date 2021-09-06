import AWS from 'aws-sdk';
import chromium from 'chrome-aws-lambda';
import contentDisposition from 'content-disposition';
import md5 from 'md5';
import puppeteer from 'puppeteer-core';
import { pdfPage } from 'puppeteer-report';

const { ASSET_BUCKET } = process.env as Record<string, string>;
const s3 = new AWS.S3();

interface RequestEvent {
    content: string;
    fileName: string;
    ttl?: number;
    contentDispositionType?: 'attachment' | 'inline';
}

interface Response {
    url: string;
}

export const handler = async (event: RequestEvent): Promise<Response> => {
    const objectKey = md5(event.content).toString();

    try {
        await s3
            .getObject({
                Bucket: ASSET_BUCKET,
                Key: objectKey
            })
            .promise();
    } catch (e) {
        if (e.code !== 'NoSuchKey') {
            throw e;
        }

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless
        });

        const tab = await browser.newPage();

        await tab.setContent(event.content, {
            waitUntil: 'networkidle0'
        });

        const pdf = Buffer.from(
            // @ts-ignore
            await pdfPage(tab, {
                format: 'a4',
                margin: { bottom: 32, top: 32, left: 32, right: 32 }
            })
        );
        await browser.close();

        await s3.putObject({
            Bucket: ASSET_BUCKET,
            Key: objectKey,
            Body: pdf,
            ContentType: 'application/pdf',
            ACL: 'private'
        }).promise();
    }

    const fileName = event.fileName.endsWith('.pdf') ? event.fileName : `${event.fileName}.pdf`;
    return {
        url: s3.getSignedUrl('getObject', {
            Bucket: ASSET_BUCKET,
            Key: objectKey,
            Expires: event.ttl || 300, // default 5 mins
            ResponseContentDisposition: contentDisposition(fileName, {
                type: event.contentDispositionType || 'inline'
            })
        })
    };
};
