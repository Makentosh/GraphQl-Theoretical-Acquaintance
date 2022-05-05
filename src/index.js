const { PrismaClient } = require('@prisma/client');
const { ApolloServer, PubSub } = require('apollo-server')
const fs = require('fs');
const path = require('path');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');
const Subscription = require('./resolvers/Subscription');

const prisma = new PrismaClient();
const pubsub = new PubSub();

const { getUserId } = require('./utils');

const resolvers = {
    Query,
    Mutation,
    Link,
    User,
    Subscription
}


const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null
        }
    },
})

server.listen()
    .then(({ url }) => {
        console.log(url);
    })