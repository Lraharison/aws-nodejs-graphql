import * as AWS from 'aws-sdk';
import * as utility from './utility';
import {errorName} from './constants';

const uuid = require('uuid');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}
const client = new AWS.DynamoDB.DocumentClient(options);

export const createUser = async (user) => {
    if (!utility.isInputValid(user, false)) {
        throw new Error(errorName.BAD_REQUEST);
    }
    const timestamp = new Date(Date.now()).toISOString();
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE,
        Item: {
            id: uuid.v4(),
            username: user.username,
            age: user.age,
            married: user.married,
            created: timestamp,
            updated: timestamp,
        }
    };
    await client.put(params).promise();
    return params.Item;
};

export const updateUser = async (user) => {
    if (!utility.isInputValid(user, true)) {
        throw new Error(errorName.BAD_REQUEST);
    }
    const timestamp = new Date().toISOString();
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE,
        Key: {
            id: user.id
        },
        ExpressionAttributeNames: {
            '#updated': 'updated',
            '#username': 'username',
            '#age': 'age',
            '#married': 'married'
        },
        ExpressionAttributeValues: {
            ':username': user.username,
            ':age': user.age,
            ':married': user.married,
            ':updated': timestamp
        },
        UpdateExpression: 'SET #updated = :updated, #username = :username, #age = :age, #married = :married',
        ReturnValues: 'ALL_NEW'
    };
    const result = await client.update(params).promise();
    return result.Attributes;
};

export const deleteUser = async (id) => {
    if (!id || id === '' || id === null) {
        throw new Error(errorName.BAD_REQUEST);
    } else {
        const params = {
            TableName: process.env.DYNAMO_DB_TABLE,
            Key: {
                id: id
            }
        };
        await client.delete(params).promise();
        return id;
    }
};

export const getUser = async (id) => {
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE,
        Key: {
            id: id
        }
    };

    const result = await client.get(params).promise();
    if (result.Item === undefined || result.Item === null) {
        throw new Error(errorName.ENTITY_NOT_FOUND);
    }
    return result.Item;
};

export const getUsers = async () => {
    const params = {
        TableName: process.env.DYNAMO_DB_TABLE
    };

    const result = await client.scan(params).promise();
    return result.Items;
};

export const getAWS = () => {
    return AWS;
};
