import {execute} from './graphql';

export const graphql = async (event) => {
    return await execute(event.queryStringParameters.query);
};
