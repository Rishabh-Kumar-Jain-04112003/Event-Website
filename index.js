// index.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB();

exports.handler = async (event) => {
    try {
        // Extracting information from the S3 event
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        // Retrieve the content of the uploaded file
        const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        const eventData = JSON.parse(data.Body.toString());

        // Store event details in DynamoDB (modify as needed)
        await dynamoDB.putItem({
            TableName: 'YourDynamoDBTableName',
            Item: {
                EventId: { S: eventData.eventId },
                EventName: { S: eventData.eventName },
            },
        }).promise();

        return {
            statusCode: 200,
            body: 'Event details uploaded successfully!',
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: 'Error uploading event details.',
        };
    }
};
