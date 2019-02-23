const Joi = require('joi');

const plugin = {
    name: 'usersHandler',
    version: '1.0.0',
    register: (server, options) => {
        server.route([
            {
                method: 'POST',
                path: '/auth',
                handler: auth,
                options: {
                    auth: false,
                    validate: {  
                        //payload|params|query
                        payload: { 
                            username: Joi.string().min(3).max(30).required(),
                            password: Joi.string().min(3).max(50).required()
                        }
                    }   
                }
            },
 
            {
                method: 'GET',
                path: '/users',
                handler: getAll
            },
            {
                method: 'GET',
                path: '/users/{username}',
                handler: getByUserName
            }
        ]);
    }
}


async function auth(req, h) {
    try {

        const payload = { args: req.payload };
        const user = await h.act({ role: 'users', cmd: 'auth' }, payload);
        const token = req.server.methods.jwtSign(user);
        return { ...user, token };

    } catch (error) {
        return h.response({ msj: error.message }).code(401);
    }
}

async function getAll(req, h) {
    return await h.act({ role: 'users', cmd: 'getAll' });
}

async function getByUserName(req, h) {
    const payload = { args: req.params };
    return await h.act({ role: 'users', cmd: 'getByUserName' }, payload);
}


module.exports = plugin;