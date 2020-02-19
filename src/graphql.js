import * as graphql from 'graphql';
import * as repository from './repository';
import * as utility from './utility';
import {graphqlErrors} from './constants';

const UserType = new graphql.GraphQLObjectType({
    name: 'user',
    fields: {
        id: {type: graphql.GraphQLString},
        username: {type: graphql.GraphQLString},
        age: {type: graphql.GraphQLInt},
        married: {type: graphql.GraphQLBoolean},
        created: {type: graphql.GraphQLString},
        updated: {type: graphql.GraphQLString}
    }
});

const QueryType = new graphql.GraphQLObjectType({
    name: 'query',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: graphql.GraphQLString}},
            resolve(_, args) {
                return repository.getUser(args.id);
            }
        },
        users: {
            type: graphql.GraphQLList(UserType),
            resolve(_, args) {
                return repository.getUsers();
            }
        }
    }
});
const MutationType = new graphql.GraphQLObjectType({
    name: 'mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                id: {type: graphql.GraphQLString},
                username: {type: graphql.GraphQLString},
                age: {type: graphql.GraphQLInt},
                married: {type: graphql.GraphQLBoolean}
            },
            resolve(_, args) {
                return repository.createUser({
                    username: args.username,
                    age: args.age,
                    married: args.married
                });
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: graphql.GraphQLString},
                username: {type: graphql.GraphQLString},
                age: {type: graphql.GraphQLInt},
                married: {type: graphql.GraphQLBoolean}
            },
            resolve(_, args) {
                return repository.updateUser({
                    id: args.id,
                    username: args.username,
                    age: args.age,
                    married: args.married
                });
            }
        },
        deleteUser: {
            type: graphql.GraphQLString,
            args: {
                id: {type: graphql.GraphQLString}
            },
            resolve(_, args) {
                return repository.deleteUser(args.id);
            }
        }
    }
});

const schema = new graphql.GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
    graphiql: true
});

export const execute = async (query) => {
    try {
        const result = await utility.executeGraphql(schema, query);
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (e) {
        let statusCode = 500;
        let errorMessage = e.message;
        const errorType = graphqlErrors.get(e.message);
        if (errorType){
            statusCode = errorType.statusCode;
            errorMessage = errorType.message;
        }
        return {
            statusCode: statusCode,
            body: JSON.stringify(errorMessage)
        };
    }
};
