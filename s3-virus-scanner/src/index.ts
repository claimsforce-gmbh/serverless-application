import fs from 'fs';
import AWS from 'aws-sdk'
import { S3Event, SNSEvent } from 'aws-lambda';

const NodeClam = require('clamscan');
const s3 = new AWS.S3();

interface ScanResult {
    isInfected: boolean;
}

interface Clamscan {
    isInfected(path: string): Promise<ScanResult>;
}

let clamscan: Clamscan;

const scan = async (path: string): Promise<ScanResult> => {
    if (!clamscan) {
        clamscan = await new NodeClam().init({
            clamscan: {
                path: '/usr/local/bin/clamscan',
                debugMode: false,
                active: true
            },
            preference: 'clamscan'
        });
    }

    return clamscan.isInfected(path);
};

export const handler = async (event: SNSEvent): Promise<string> => {
    const s3Event: S3Event = JSON.parse(event.Records[0].Sns.Message);
    const s3Params = {
        Bucket: s3Event.Records[0].s3.bucket.name,
        Key: s3Event.Records[0].s3.object.key,
        VersionId: s3Event.Records[0].s3.object.versionId
    };
    const { Body: objectBody } = await s3.getObject(s3Params).promise();

    const tempPath = `/tmp/${s3Event.Records[0].s3.object.eTag}`;
    fs.writeFileSync(tempPath, objectBody as Buffer);

    const { isInfected } = await scan(tempPath);
    fs.unlinkSync(tempPath);

    await s3.putObjectTagging({
        ...s3Params,
        Tagging: {
            TagSet: [{
                Key: 'av-status',
                Value: isInfected ? 'infected' : 'clean'
            }]
        }
    }).promise();

    return 'Done.';
};
