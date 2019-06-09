const test = require('tape')
const supertest = require('supertest')
const index = require('./index')

test('Somar 2 numeros', (t) => {
    t.assert(index.fazAlgo(10,5) === 15, "Somou corretamente")
    t.end()
})

test('GET /api/tempo?city=london&prevision=3', (t) => {
    supertest(index.app)
        .get('/api/tempo?city=london&prevision=2')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.status === 200, "Status 200")
            t.assert(res.body.previsions[0].weather_state != null, "weather_state Ok")
            t.assert(res.body.previsions[1].weather_state != null, "weather_state Ok")
            t.assert(res.body.previsions[2] == undefined, "weather_state Ok")
            t.end()
        })
})

test('GET /api/tempo?city=london&prevision=0', (t) => {
    supertest(index.app)
        .get('/api/tempo?city=london&prevision=0')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.status === 200, "Status 200")
            t.assert(res.body.previsions[0] == undefined, "weather_state Ok")
            t.end()
        })
})

test('GET /api/tempo?city=london', (t) => {
    supertest(index.app)
        .get('/api/tempo?city=london')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.status === 200, "Status 200")
            t.assert(res.body.previsions[0].weather_state != null, "weather_state Ok")
            t.end()
        })
})

test('GET /api/tempo', (t) => {
    supertest(index.app)
        .get('/api/tempo')
        .expect('Content-Type', /json/)
        .expect(403)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.status === 403, "Status 403")
            t.end()
        })
})