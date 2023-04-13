const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const pool = require('./db/conn')
const port = 3000
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
      res.redirect('clientesCadastros')
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

// Rota para obter todos os veículos cadastrados no banco de dados
app.get('/cadastroVeiculos', function (req, res) {
  const query = 'SELECT * FROM veiculos';

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    res.render('cadastroVeiculos', { cadastroVeiculos: data });
  });
});

// Rota para lidar com o envio do formulário de cadastro de veículos
app.post('/cadastroVeiculos', function (req, res) {
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const ano = req.body.ano;
  const placa = req.body.placa;
  const disponibilidade = req.body.disponibilidade;

  const sql = 'INSERT INTO veiculos (marca, modelo, ano, placa, disponibilidade) VALUES (?, ?, ?, ?, ?)';
  const data = [marca, modelo, ano, placa, disponibilidade];

  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Veículo cadastrado com sucesso!');
    res.redirect('/visualizarVeiculos');
  });
});

//rota para home veiculos cadastrados erro esta aqui


app.get('/visualizarVeiculos', function (req, res) {
  const query = `SELECT * FROM veiculos`

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err)
      return;
    }

    res.render('visualizarVeiculos', { veiculosCadastros: data })
  })
})


// Rota para exibir a página de cadastro de veículos
app.get('/cadastroVeiculos', function (req, res) {
  res.render('cadastroVeiculos');
});




//editar dados dos veiculos

app.get('/editVeiculo', function (req, res) {
  res.render('editVeiculo');
});

app.post('/editVeiculo', function (req, res) {
  const id = req.body.id;
  const marca = req.body.marca;
  const modelo = req.body.modelo;
  const ano = req.body.ano;
  const placa = req.body.placa;
  const disponibilidade = req.body.disponibilidade;

  const query = `UPDATE veiculos SET marca = ?, modelo = ?, ano = ?, placa = ?, disponibilidade = ? WHERE id = ?`;
  const data = [marca, modelo, ano, placa, disponibilidade, id];
  pool.query(query, data, function (err, result) {
    if (err) {
      console.log(err);
      res.send('Erro ao atualizar veículo');
    } else {
      console.log(`Veículo com ID ${id} atualizado com sucesso`);
      res.redirect('/visualizarVeiculos');
    }
  });
});



// Rota para exibir a página de reserva de veículos
app.get('/reservas', function (req, res) {
  const query = 'SELECT * FROM veiculos WHERE disponibilidade = 1';

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    res.render('reservas', { veiculos: data });
  });
});

// Rota para lidar com o envio do formulário de reserva de veículos
app.post('/reservas', function (req, res) {
  const id_cliente = req.body.id_cliente;
  const id_veiculo = req.body.id_veiculo;
  const data_inicio = req.body.data_inicio;
  const data_fim = req.body.data_fim;

  const sql = 'INSERT INTO reservas (id_cliente, id_veiculo, data_inicio, data_fim) VALUES (?, ?, ?, ?)';
  const data = [id_cliente, id_veiculo, data_inicio, data_fim];

  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    // Atualiza a disponibilidade do veículo para 0 (indisponível)
    const query = 'UPDATE veiculos SET disponibilidade = 0 WHERE id = ?';
    const data = [id_veiculo];

    pool.query(query, data, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Veículo reservado com sucesso!');
      res.redirect('/visualizarVeiculos');
    });
  });
});



// Rota para exibir a página de visualização de reservas
app.get('/visualizarReservas', function (req, res) {
  const query = 'SELECT * FROM reservas, veiculos, clientes';

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    res.render('visualizarReservas', { reservas: data });
  });
});

// Rota para lidar com o envio do formulário de reserva de veículos
app.post('/reservas', function (req, res) {
  const id_cliente = req.body.id_cliente;
  const id_veiculo = req.body.id_veiculo;
  const data_inicio = req.body.data_inicio;
  const data_fim = req.body.data_fim;

  const sql = 'INSERT INTO reservas (id_cliente, id_veiculo, data_inicio, data_fim) VALUES (?, ?, ?, ?)';
  const data = [id_cliente, id_veiculo, data_inicio, data_fim];

  pool.query(sql, data, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    // Atualiza a disponibilidade do veículo para 0 (indisponível)
    const query = 'UPDATE veiculos SET disponibilidade = 0 WHERE id = ?';
    const data = [id_veiculo];

    pool.query(query, data, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Veículo reservado com sucesso!');
      res.redirect('/visualizarVeiculos');
    });
  });
});


// Rota para exibir a página de edição de reservas
app.get('/editReserva', function (req, res) {
  res.render('editReserva');
});

// Rota para exibir a página de edição de reservas
app.get('/editReserva/:id', function (req, res) {
  const id = req.params.id;
  const query = `SELECT * FROM reservas WHERE id = ?`;
  pool.query(query, id, function (err, result) {
    if (err) {
      console.log(err);
      res.send('Erro ao buscar reserva');
    } else {
      const reserva = result[0];
      const queryClientes = `SELECT * FROM clientes`;
      const queryVeiculos = `SELECT * FROM veiculos`;
      pool.query(queryClientes, function (errClientes, resultClientes) {
        if (errClientes) {
          console.log(errClientes);
          res.send('Erro ao buscar clientes');
        } else {
          const clientes = resultClientes;
          pool.query(queryVeiculos, function (errVeiculos, resultVeiculos) {
            if (errVeiculos) {
              console.log(errVeiculos);
              res.send('Erro ao buscar veículos');
            } else {
              const veiculos = resultVeiculos;
              res.render('editReserva', { reserva, clientes, veiculos });
            }
          });
        }
      });
    }
  });
});

app.post('/editReserva', function (req, res) {
  const id = req.body.idReserva;
  const data_inicio = req.body.dataRetirada;
  const data_fim = req.body.dataDevolucao;

  const query = `UPDATE reservas SET data_inicio = ?, data_fim = ? WHERE id = ?`;
  const data = [data_inicio, data_fim, id];
  pool.query(query, data, function (err, result) {
    if (err) {
      console.log(err);
      res.send('Erro ao atualizar reserva');
    } else {
      console.log(`Reserva com ID ${id} atualizada com sucesso`);
      res.redirect('/visualizarReservas');
    }
  });
});

// Inicia o servidor
app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});





