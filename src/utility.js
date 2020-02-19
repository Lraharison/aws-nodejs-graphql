import {graphql} from 'graphql';

export const isInputValid = (user, updateMode) => {

    if (updateMode === true && (!user.id || user.id === '' || user.id === null)) {
        return false;
    }

    if (!user.username || user.username === '' || user.username === null) {
        return false;
    }

    if (!user.age || user.age === '' || user.age === null) {
        return false;
    }

    if (user.married === undefined || user.married === '' || user.married === null) {
        return false;
    }

    return true;
};

export const executeGraphql = async (schema, query) => {
    return graphql(schema, query);
};
