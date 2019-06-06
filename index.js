// CONFIGURAÇÃO BÁSICA
// ======================================

// IMPORTANDO OS PACKAGES --------------------
const express = require('express') // importando o express
const app = express() // definindo nosso app para usar o express
const bodyParser = require('body-parser') // importando body-parser
const morgan = require('morgan') // vamos usar para logar as requests
const mongoose = require('mongoose') // para trabalhar com nossa database
const port = process.env.PORT || 8000 // configurando a porta do serviço
const User = require('./domain/user')

mongoose.connect('mongodb://root:123456a@ds127429.mlab.com:27429/user', { useNewUrlParser: true })
mongoose.set('useCreateIndex', true);
//mongoose.connect('mongodb://localhost:27017/db_name');

// CONFIGURANDO O SERVIÇO ---------------------
// usando o parser para pegar a informação do POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// configurando as chamadas CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
    next()
})

// logando as requisições no console
app.use(morgan('dev'))

// ROTAS PARA API
// =============================

// pegando uma instância do express router
const apiRouter = express.Router()

// rota básica para home page
app.get('/', (req, res) => {
    res.send('Bem-vindo à home page!')
})

// middleware usado por todas as requisições
apiRouter.use(function (req, res, next) {

    console.log('foi feita uma requisição para nossa API!')

    // vamos adicionar mais coisas aqui mais tardez
    // é aqui que vamos varificar a autenticação dos usuários

    next() // garantir que vamos para a próxima rota
})

// roteamento de teste
// acesse GET http://localhost:8000/api
apiRouter.get('/', (req, res) => {
    res.json({ message: 'essa é nossa api!' })
})

//--------------------------------------//
var middlewarePost = function (req, res, next) {
  console.log('antes do post!')
  
  if(req.body.password.length >= 6){
    next()
  }else{
    res.status(400).json({message:"A senha deve ter 6 caracteres."}) 
  }
  
  // get param :xqdele
  //req.params.xqdele

  // get others param URL
  // localhost:8080/user?filter=name
  // console.log(req.query.name)
}

// rotas terminadas em /users
// ----------------------------------------------------
  apiRouter.route('/users')
  // criar usuário (POST http://localhost:8000/api/users)
  .post(middlewarePost, function (req, res) { 
      
    // criar uma nova instância do Usuário
    var user = new User()

     // informações do usuário (na request)
     user.name = req.body.name
     user.username = req.body.username
     user.password = req.body.password

    // salvar e verificar erros
    user.save(function (err) {
        if (err) {
            // usuário duplicado
            if (err.code === 11000) {
                return res.json({
                success: false,
                message: 'Um usuário com esse username já existe.'
                })
            } else {
                return res.send(err)
            }
        }
        res.json({ message: 'Usuário criado!' }).send()
    })
  })

  // returna todos os usuários (GET http://localhost:8000/api/users)
  .get(function (req, res) {
    User.find(function (err, users) {
      if (err) res.send(err)
      // retorna os usuários
      res.json(users)
    })
  })
  
// rotas terminadas em /users/:id
// ----------------------------------------------------
apiRouter.route('/users/:id')
  // retorna o usuário com o id (GET http://localhost:8000/api/users/:id)
  .get(function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) res.send(err)
      // retorna o usuário
      res.json(user)
    })
  })

  // atualiza o usuário com o id (PUT http://localhost:8000/api/users/:id)
  .put(middlewarePost, function (req, res) {
    User.findById(req.params.id, function (err, user) {
      if (err) res.send(err)
      // atualiza as informações do usuário
      if (req.body.name) user.name = req.body.name
      if (req.body.username) user.username = req.body.username
      if (req.body.password) user.password = req.body.password

      // salva o usuário
      user.save(function (err) {
        if (err) res.send(err)
        // retorna uma menssagem de sucesso
        res.json({ message: 'Usuário atalizado!' })
      })
    })
  })

  // apaga o usuário com o id (DELETE http://localhost:8080/api/users/:id)
  .delete(function (req, res) {
    User.remove({ _id: req.params.id }, function (err, user) {
      if (err) return res.send(err)
      res.json({ message: 'Apagado com sucesso!' })
    })
  })

  // rotas terminadas em /users
// ----------------------------------------------------


//--------------------------------------//

// REGISTRANDO AS ROTAS -------------------------------
// as rotas serão prefixadas com /api
app.use('/api', apiRouter)

// INICIANDO O SERVIÇO
// ===============================
app.listen(port)
console.log('A mágica acontece na porta ' + port)