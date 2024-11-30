import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
import cors from 'cors';

dotenv.config();

import Sequelize from "sequelize";

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432
});



const app = express();
app.use(express.json());


app.use(cors({
    origin: true,
    methods: 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
    allowedHeaders: 'Origin, Content-Type, Accept, Authorization, X-Request-With, Content-Range, Content-Disposition, Content-Description',
    credentials: true
}));

// Rota para buscar SVG do estado e município
app.get('/svg/:estado/:cidade', async (req, res) => { 
        let estado = req.params.estado;
        let cidade = req.params.cidade;

        console.log(`estado: ${estado}, Cidade: ${cidade}`);

        let pathEstado = await sequelize.query(`SELECT ST_AsSVG(geom) FROM estado WHERE nome ILIKE '${estado}'`, {
            replacements: [estado],  
            type: sequelize.QueryTypes.SELECT
        });

         let pathcidade = await sequelize.query(`SELECT ST_AsSVG(geom) FROM cidade WHERE nome ILIKE '${cidade}'`, {
             replacements: [cidade],
             type: sequelize.QueryTypes.SELECT
         });

        let viewBox = await sequelize.query(`SELECT getViewBox('${estado}')`, {
             replacements: [estado], 
             type: sequelize.QueryTypes.SELECT
        });

        res.json({
            pathestados: pathEstado[0].st_assvg || null,
            pathmunicipios: pathcidade[0].st_assvg || null,
            viewBox: viewBox[0].getviewbox || null
        });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});