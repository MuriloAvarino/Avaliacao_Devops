
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Conexão com MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'livraria',
    waitForConnections: true,
    connectionLimit: 10
});

// Verificar funcionamento da API
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        mensagem: 'API funcionando!'
    });
});

// Criar tabela e iniciar servidor
async function iniciarServidor() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS livros (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                autor VARCHAR(255) NOT NULL,
                preco DECIMAL(10,2) NOT NULL,
                quantidade INT NOT NULL
            )
        `);

        console.log('Conectado ao MySQL!');

        app.listen(3000, '0.0.0.0', () => {
            console.log('API executando na porta 3000');
        });

    } catch (error) {
        console.error('Erro ao conectar ao MySQL:', error.message);
        process.exit(1);
    }
}

// POST /livro - Cadastrar livro
app.post('/livro', async (req, res) => {
    try {
        const { titulo, autor, preco, quantidade } = req.body;

        if (
            typeof titulo !== 'string' || !titulo.trim() ||
            typeof autor !== 'string' || !autor.trim() ||
            preco === undefined || preco === null ||
            !Number.isFinite(Number(preco)) || Number(preco) < 0 ||
            !Number.isInteger(quantidade) || quantidade < 0
        ) {
            return res.status(400).json({
                erro: 'Informe título, autor, preço válido e quantidade inteira não negativa.'
            });
        }

        const [resultado] = await db.execute(
            `INSERT INTO livros (titulo, autor, preco, quantidade)
             VALUES (?, ?, ?, ?)`,
            [titulo.trim(), autor.trim(), Number(preco), quantidade]
        );

        res.status(201).json({
            mensagem: 'Livro cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: 'Erro ao cadastrar livro.'
        });
    }
});

// GET /livros - Listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const [livros] = await db.query(
            'SELECT * FROM livros ORDER BY id DESC'
        );

        res.json(livros);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            erro: 'Erro ao consultar livros.'
        });
    }
});

// Iniciar aplicação
iniciarServidor();
