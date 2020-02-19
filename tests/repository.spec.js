import * as repository from '../src/repository';
import * as utility from '../src/utility';
import {isInputValid} from '../src/utility';
import * as sinon from 'sinon';
import {DynamoDB} from 'aws-sdk';
import {errorName} from '../src/constants';

const uuid = require('uuid');

const sandbox = sinon.createSandbox();
const today = new Date();
const expectedUsers = [{id: '1', name: 'aaa'}, {id: '2', name: 'bbb'}, {id: '3', name: 'ccc'}];
const items = {Items: expectedUsers};


describe('test repository', () => {
    beforeEach(() => {
        process.env.DYNAMO_DB_TABLE = 'users';
        sandbox.stub(uuid, 'v4').returns(1);
        sandbox.stub(Date, 'now').returns(today);
    });
    afterEach(() => {
        delete process.env.DYNAMO_DB_TABLE;
        sandbox.restore();
    });

    it('should return all users', async () => {
        sandbox.stub(DynamoDB.DocumentClient.prototype, 'scan').returns({promise: () => items});

        const result = await repository.getUsers();

        expect(result).toMatchObject(expectedUsers);
    });

    it('should return user', async () => {
        const getUserStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'get').returns({
            promise: () => {
                return {Item: expectedUsers[0]};
            }
        });

        const result = await repository.getUser('1');

        expect(expectedUsers[0]).toMatchObject(result);
        expect(getUserStub.getCall(0).args[0].TableName).toEqual('users');
    });

    it('should return error if user is not found', async () => {
        const getUserStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'get').returns({
            promise: () => {
                return {};
            }
        });

        try {
            await repository.getUser('1');
            expect(true).toEqual(false);
        } catch (e) {
            expect(e.message).toEqual(errorName.ENTITY_NOT_FOUND);
        }
        expect(getUserStub.getCall(0).args[0].TableName).toEqual('users');
    });

    it('should create user', async () => {
        sandbox.stub(utility, 'isInputValid').returns(true);
        const createStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'put').returns({
            promise: () => {
                return null;
            }
        });
        const newUser = {username: 'aaa', age: 58, married: true};
        const result = await repository.createUser(newUser);

        expect(result).toMatchObject({
            id: 1,
            username: 'aaa',
            age: 58,
            married: true,
            created: today.toISOString(),
            updated: today.toISOString()
        });
        expect(createStub.getCall(0).args[0].TableName).toEqual('users');
        expect(createStub.getCall(0).args[0].Item.username).toEqual(newUser.username);
        expect(createStub.getCall(0).args[0].Item.age).toEqual(newUser.age);
        expect(createStub.getCall(0).args[0].Item.married).toEqual(newUser.married);
    });

    it('should not create user when input is not valid', async () => {
        sandbox.stub(utility, 'isInputValid').returns(false);
        const newUser = {username: '', age: 58, married: true};

        try {
            await repository.createUser(newUser);
            expect(true).toEqual(false);
        } catch (e) {
            expect(e.message).toEqual(errorName.BAD_REQUEST);
        }
    });

    it('should update user', async () => {
        const updateStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'update').returns({
            promise: () => {
                return {
                    Attributes: {}
                };
            }
        });
        sandbox.stub(utility, 'isInputValid').returns(true);
        const newUser = {id: '1', username: 'aaa', age: 58, married: true};

        const result = await repository.updateUser(newUser);

        expect(result).toMatchObject({});
        expect(updateStub.getCall(0).args[0].TableName).toEqual('users');
        expect(updateStub.getCall(0).args[0].ExpressionAttributeValues[':username']).toEqual(newUser.username);
        expect(updateStub.getCall(0).args[0].ExpressionAttributeValues[':age']).toEqual(newUser.age);
        expect(updateStub.getCall(0).args[0].ExpressionAttributeValues[':married']).toEqual(newUser.married);
        expect(updateStub.getCall(0).args[0].UpdateExpression).toEqual('SET #updated = :updated, #username = :username, #age = :age, #married = :married');
    });

    it('should not update user if input is not valid', async () => {
        sandbox.stub(utility, 'isInputValid').returns(false);
        const newUser = {id: '', username: '', age: 58, married: true};

        try {
            await repository.updateUser(newUser);
            expect(true).toEqual(false);
        } catch (e) {
            expect(e.message).toEqual(errorName.BAD_REQUEST);
        }
    });

    it('should delete user', async () => {
        const deleteStub = sandbox.stub(DynamoDB.DocumentClient.prototype, 'delete').returns({
            promise: () => {
                return null;
            }
        });

        const result = await repository.deleteUser('1');

        expect('1').toEqual(result);
        expect(deleteStub.getCall(0).args[0].TableName).toEqual('users');
        expect(deleteStub.getCall(0).args[0].Key.id).toEqual('1');
    });

    it('should not delete if id is null or empty', async () => {
        try {
            await repository.deleteUser(null);
            expect(true).toEqual(false);
        } catch (e) {
            expect(e.message).toEqual(errorName.BAD_REQUEST);
        }
    });
});

