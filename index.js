const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const pool = require('./db/conn')

console.log(pool)

const app = express()
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.set('/public', path.join(__dirname, 'public'))

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

app.use(express.static('public'))
//rota para home clientes cadastrados 


app.get('/', function (req, res) {

  res.render('home')
})

app.get('/clientesCadastros', function (req, res) {
  const query = `SELECT * FROM clientes`

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return;
    }

    res.render('clientesCadastros', { clientesCadastros: data })
  })
})
//post cliente cadastrado
app.post('/cadastrado', function (req, res) {
  const nome = req.body.nome
  const endereço = req.body.endereço
  const email = req.body.email
  const telefone = req.body.telefone

  const sql = ('INSERT INTO clientes (nome, endereco, telefone, email) VALUES (?, ?, ?, ?)')
  const data = [nome, endereço, email, telefone]
  pool.query(sql, [nome, endereço, email, telefone], function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Cliente Cadastrado com sucesso')
      res.render('clientesCadastros')
    }
  })
})

//editar dados dos clientes 

app.get('/editclientes', function (req, res) {
  res.render('editclientes');
});

app.post('/editclientes', function (req, res) {
  const id = req.body.id;
  const name = req.body.name;
  const endereco = req.body.endereco;
  const email = req.body.email;
  const telefone = req.body.phone;

  const query = `UPDATE clientes SET nome = ?, endereco = ?, email = ?, telefone = ? WHERE id = ?`;
  const data = [name, endereco, email, telefone, id];
  pool.query(query, data, function (err, result) {
    if (err) {
      console.log(err);
      res.send('Erro ao atualizar cliente');
    } else {
      console.log(`Cliente com ID ${id} atualizado com sucesso`);
      res.redirect('/clientesCadastros');
    }
  });
});

//Cadastrar Veiculos

app.get('/veiculoscadastro', function (req, res) {

  res.render('veiculoscadastro')
})

app.get('/veiculoscadastros', function (req, res) {
  const query = `SELECT * FROM veiculos`

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return;
    }

    res.render('veiculosCadastros', { veiculosCadastros: data })
  })
})
//post veiculo cadastrado

app.get('/visualizarVeiculos', function (req, res) {

  res.render('visualizarVeiculos')
})

app.post('/visualizarVeiculos', function (req, res) {
  const marca = req.body.marca
  const modelo = req.body.modelo
  const ano = req.body.ano
  const placa = req.body.placa
  const disponibilidade = req.body.disponibilidade

  const sql = ('INSERT INTO veiculos (marca, modelo, ano, placa, disponibilidade) VALUES (?, ?, ?, ?, ?, ?)')
  const data = [ marca, modelo, ano, placa, disponibilidade]
  pool.query(sql, [ marca, modelo, ano, placa, disponibilidade], function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Veiculo Cadastrado com sucesso')
      res.render('visualizarVeiculos')
    }
  })
})

//editar dados dos veiculos

app.get('/editveiculos', function (req, res) {
  res.render('editveiculos');
});

app.post('/editveiculos', function (req, res) {
  const id = req.body.id;
  const name = req.body.name;
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const ano = req.body.ano;
  const placa = req.body.placa;
  const disponibilidade = req.body.disponibilidade;

  const query = `UPDATE veiculosCadastros SET marca = ?, modelo = ?, ano = ?, placa = ?, disponibilidade =? WHERE id = ?`;
  const data = [name, marca, modelo, ano, placa, id];
  pool.query(query, data, function (err, result) {
    if (err) {
      console.log(err);
      res.send('Erro ao atualizar veiculo');
    } else {
      console.log(`Veiculo com ID ${id} atualizado com sucesso`);
      res.redirect('/veiculoCadastros');
    }
  });
});

app.listen(3000)
