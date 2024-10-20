const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');
const app = express();
const porta = 8080;
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());


app.post('/cadastro', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios');
    }

    // Criptografa a senha imediatamente após recebê-la
    bcrypt.hash(senha, saltRounds, (err, hashedSenha) => {
        if (err) {
            return res.status(500).send('Erro ao criptografar senha');
        }

        const sql1 = 'SELECT * FROM usuario WHERE email = ?';
        const sql2 = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';

        // Verifica se o e-mail já existe
        db.query(sql1, [email], (err, results) => {
            if (err) {
                return res.status(500).send('Erro ao verificar e-mail');
            }

            if (results.length > 0) {
                return res.status(409).send('E-mail já existe');
            } else {
                // Insere o novo usuário com a senha já criptografada
                db.query(sql2, [email, hashedSenha], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Erro ao cadastrar usuário');
                    }
                    res.status(201).send('Usuário cadastrado com sucesso');
                });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Consulta o banco apenas pelo e-mail
    const sql = 'SELECT * FROM usuario WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao verificar e-mail');
        }

        if (result.length > 0) {
            const usuario = result[0];

            // Compara a senha digitada com o hash armazenado no banco de dados
            bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
                if (err) {
                    return res.status(500).send('Erro ao verificar senha');
                }

                if (isMatch) {
                    res.status(200).send('Login realizado com sucesso');
                } else {
                    res.status(401).send('E-mail ou senha incorretos');
                }
            });
        } else {

            res.status(401).send('E-mail ou senha incorreto');
        }
    });
});

app.get('/', (req, res) => {
    res.send("Deu certo");
});
app.listen(porta, (res, error) => {
    if (error) {
        console.log("Não deu certo");
    } else {
        console.log("Servidor rodando");
    }
});