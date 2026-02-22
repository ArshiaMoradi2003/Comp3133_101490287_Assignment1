require('dotenv').config();
const express = require('express');
const { ApolloServer} = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./schema/typedefs');
const resolvers = require('./resolvers/resolvers');

const startServer = async () => {
    await connectDB();

    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,

        formatError: (err) => {
            console.error(err);
            return {message: err.message}
        }
    });

    await server.start();
    server.applyMiddleware({app});

    app.listen(4000, () => {
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
    });
};

startServer();