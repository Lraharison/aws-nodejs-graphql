import * as g from '../src/graphql';
import * as sinon from 'sinon';

import * as utility from '../src/utility';
import {errorName, graphqlErrors} from '../src/constants';

const sandbox = sinon.createSandbox();
const query = 'query';

describe('test graphql', () => {
    afterEach(() => {
        sandbox.restore();
    });

    it('should return graphql response', async () => {
        const expectedResponse =
            {
                statusCode: 200,
                body: '1'
            };
        sandbox.stub(utility, 'executeGraphql').returns(1);

        const result = await g.execute(query);

        expect(result).toEqual(expectedResponse);
    });

    it('should return error message and bad request status', async () => {
        const expectedResponse =
            {
                statusCode: 400,
                body: JSON.stringify(graphqlErrors.get(errorName.BAD_REQUEST).message)
            };
        sandbox.stub(utility, 'executeGraphql').throws(new Error(errorName.BAD_REQUEST));

        const result = await g.execute(query);

        expect(result).toEqual(expectedResponse);
    });

    it('should return error message and entity not found status', async () => {
        const expectedResponse =
            {
                statusCode: 404,
                body: JSON.stringify(graphqlErrors.get(errorName.ENTITY_NOT_FOUND).message)
            };
        sandbox.stub(utility, 'executeGraphql').throws(new Error(errorName.ENTITY_NOT_FOUND));

        const result = await g.execute(query);

        expect(result).toEqual(expectedResponse);
    });

    it('should return error message and server error status when unexpected error occurs', async () => {
        const expectedResponse =
            {
                statusCode: 500,
                body: JSON.stringify('unexpected error')
            };
        sandbox.stub(utility, 'executeGraphql').throws(new Error('unexpected error'));

        const result = await g.execute(query);

        expect(result).toEqual(expectedResponse);
    });
});
