const HapiJWT = require('hapi-jsonwebtoken');
const HapiJWTConfig = require('./config/jsonwebtoken');
const config = require('./config/config.json');
const Hapi = require("hapi");

const PORT = process.env.PORT || 8080;

const server = Hapi.Server({
    //host: "localhost",
    port: PORT
});

server.route({
    method: 'GET',
    path: '/hello',
    options : {
        auth:false
    },
    handler: (request, h) => {
        return 'Hello Hapi';
    }

});

async function start() {
    try {
        // await server.register(require('./plugin/seneca')); OR
        await server.register({ plugin: require('./plugin/seneca'), options: config.seneca });
        //Regitro de jwt////////////////////7
        await server.register(HapiJWT.plugin);
        server.auth.strategy('jwt', 'hapi-jsonwebtoken', HapiJWTConfig);
        server.auth.default('jwt');
        /////////////////////////////////////////
        await server.register({ plugin: require('./handlers/moviesHandler'), options: {} });
        await server.register({ plugin: require('./handlers/usersHandler'), options: {} });
        await server.start();
        console.log("servidor activo en " + server.info.uri);
    } catch (error) {
        console.error("error iniciado el servidor " + server.info.uri, error);
    }
}

start();