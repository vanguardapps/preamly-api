import jwt from 'jsonwebtoken';
import fs, { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { AuthenticationError, convertToValidError } from './utils/api-error.js';
import resolvers from './graphql/resolvers.js';
import connectDB from './utils/connect-db.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const startApolloServer = async () => {
    var _a;
    // create websocket server
    const wsServer = new WebSocketServer({
        noServer: true,
    });
    const typeDefs = readFileSync(path.join(__dirname, "./graphql/schema.graphql"), { encoding: "utf-8" });
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const serverCleanup = useServer({ schema }, wsServer);
    // create the Apollo Server and set up proper cleanup for the websocket
    // server that we are using for subscriptions
    const server = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    const contextMiddleware = async ({ req, res }) => {
        var _a;
        var _b;
        // create context object with default values
        let context = { userId: null, roles: null, error: null };
        try {
            if (req.method === "OPTIONS") {
                res.end();
                return context;
            }
            if (res.socket) {
                (_b = res.socket.server).ws || (_b.ws = (() => {
                    res.socket.server.on("upgrade", function (request, socket, head) {
                        wsServer.handleUpgrade(request, socket, head, function (ws) {
                            wsServer.emit("connection", ws, request);
                        });
                    });
                    return wsServer;
                })());
            }
            // retrieve token from request into variable token (if it exists)
            const token = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization)
                ? req.headers.authorization.split(/ +/)[1]
                : null;
            if (!token) {
                process.env.PREAMLY_DEBUG_MODE && console.log("User is not logged in.");
            }
            else {
                // test if token is valid
                const key = fs.readFileSync(path.join(__dirname, `./keys/${process.env.JWT_ACCESS_PRIVATE_KEYFILE}`));
                if (key) {
                    // !!! REMOVE THIS LINE BEFORE PROMOTING TO PRODUCTION !!!
                    process.env.PREAMLY_DEBUG_MODE &&
                        console.log("Contents of access key: ", key);
                    try {
                        const decoded = jwt.verify(token, key);
                        process.env.PREAMLY_DEBUG_MODE && console.log(decoded);
                        context.userId = decoded.payload.userId;
                        context.roles = decoded.payload.roles;
                        process.env.PREAMLY_DEBUG_MODE &&
                            console.log("User logged in successfully.");
                    }
                    catch (err) {
                        if (err.name === "TokenExpiredError") {
                            // TODO if token is expired, try to use refresh token.
                            // if not, we need to direct user to the login screen
                            // maybe this is a use case for TokenExpiredError afterall
                            throw new AuthenticationError(`Token is expired. ${process.env.PREAMLY_DEBUG_MODE === "true" &&
                                "Client should attempt to refresh token or reauthenticate."}`);
                        }
                        else {
                            throw new AuthenticationError("Token is invalid.");
                        }
                    }
                }
            }
        }
        catch (err) {
            if (err.code === "ENOENT") {
                context.error = new AuthenticationError(`Key file not found. ${process.env.PREAMLY_DEBUG_MODE === "true" &&
                    "Access key file not found in keys directory."}`);
            }
            else
                context.error = convertToValidError(err);
        }
        await connectDB();
        return context;
    };
    const { url } = await startStandaloneServer(server, {
        context: contextMiddleware,
        listen: { port: parseInt(((_a = process.env.API_PORT) !== null && _a !== void 0 ? _a : 4000)) },
    });
    return url;
};
const url = await startApolloServer();
console.log(`🚀  Server ready at: ${url}`);
//# sourceMappingURL=main.js.map
