const chai = require('chai');
chai.use(require("chai-http"));
const URL = 'http://localhost:8080';
const enviroment = {
    auth: {
        username: "leonardo",
        password: "1234",

    },
    token: ''
};

const { expect } = chai;

describe("User", function () {

    describe("POST /auth", function (done) {

        it('Los usuarios invalidos no deben obtener un token', function (done) {
            this.timeout(30000);
            chai.request(URL)
                .post('/auth')
                .send({ ...enviroment.auth, ...{ password: 'invalid' } })
                .end((err, res) => {

                    if (err) return done(err);

                    expect(res).to.have.status(401);
                    expect(res.body).to.not.have.property('token');
                    expect(res.body.token).to.be.undefined;

                    done();
                })


        });

        it('El usuario es correcto y puede obtener un token', function (done) {
            this.timeout(30000);
            chai.request(URL)
                .post('/auth')
                .send(enviroment.auth)
                .end((err, res) => {

                    if (err) return done(err);

                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.not.be.undefined;

                    enviroment.token = `Bearer ${res.body.token}`;

                    done();
                })


        });


    });

    describe("GET /users", function () {
        it('El Endpoint esta protegido por JWT', function (done) {
            chai.request(URL)
                .get("/users")
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(401);
                    done();
                });

        });

        it('Obtienen todos los usuarios cuando se pasa JWT', function (done) {
            chai.request(URL) 
                .get("/users")
                .set('Authorization',enviroment.token)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200); 
                    expect(res.body).to.be.an('array').that.is.not.empty;
                    done();
                });

        });

    });
});