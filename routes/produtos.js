const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const app = require('../app');

// criando o objeto pool(mysql://user:senha@localhost:porta/nome_do_banco)
const connection = mysql.createPool("mysql://root:admin@localhost:3306/db_backend")

//testando a conexão
connection.getConnection((error, connection) => {
    if(error) {return res.status(500).send({error: error})}
    else {
        console.log('Conexão realizada!');
    }
    connection.release();
});

router.get('/', (req, res, next) => {
    connection.getConnection((error, connection) => {
        connection.query('SELECT * FROM tb_produtos', (error, rows) => {
            if (error) {return res.status(500).send({error: error})}
            else{
                return res.status(200).send(rows)
            };
        })
    });
});

router.get('/:id', function (req, res) {
    const id = req.params.id;
    const queryStr = `SELECT * FROM tb_produtos WHERE IdProduto = ${id}`;
        connection.getConnection((error, connection) => {
            connection.query(queryStr, (error, rows) => {
                if (rows.length > 0) { return res.status(200).send(rows[0])
                }else
                    return res.status(404).send()}
            )} 
        )
})

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    const queryStr = `DELETE FROM tb_produtos WHERE IdProduto = ${id}`;
        connection.getConnection((error, connection) => {
            connection.query(queryStr, (error, rows) => {
                    if (rows.affectedRows > 0) { return res.status(204).send()
                    }else
                        return res.status(404).send()}
                )} 
            )
    })

router.post('/', (req, res, next) => { 
    connection.getConnection((error, connection) => {
        if(error) throw error;
        console.log('Entrei no POST');
        const NomeProduto = req.body.NomeProduto; 
        const Preco = req.body.Preco;
        const Quantidade = req.body.Quantidade;
        const queryStr = `INSERT INTO tb_produtos (NomeProduto, Preco, Quantidade) VALUES ("${NomeProduto}", ${Preco}, ${Quantidade})`;       
        
        connection.query(queryStr, (error, rows) => {
            if (error) throw error; 
            console.log("Numero de registro adicionados: " + rows.affectedRows)
            return res.status(200).send()}
            )     
        })      
    })

//atualizando as informações já presentes na tabela
router.put('/:id', (req, res) => {
    connection.getConnection((error, connection) => {
        if(error) throw error;
        console.log('Entrei no PUT');
        
        const id = req.params.id   
        const nome = req.body.NomeProduto
        const preco = req.body.Preco
        const qtd = req.body.Quantidade
        const queryStr = `UPDATE tb_produtos SET NomeProduto = "${nome}", Preco = ${preco}, Quantidade = ${qtd} WHERE IdProduto = ${id}`;   
                
        connection.query(queryStr, (error, rows) => {
            if (error) throw error;
            console.log(rows.affectedRows + " registros atualizados!")
            res.status(200).send()}
        )}  
    )
})


module.exports = router;