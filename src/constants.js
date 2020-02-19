export const errorName = {
    BAD_REQUEST: 'BAD_REQUEST',
    ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND'
};

export const  graphqlErrors = new Map([
    [errorName.BAD_REQUEST, {
        message: 'Input parameters are invalid',
        statusCode: 400
    }],
    [errorName.ENTITY_NOT_FOUND, {
        message: 'Cannot found searching entity',
        statusCode: 404
    }]
]);
