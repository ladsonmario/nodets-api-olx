<h1 align="center">API OLX em Node</h1>

## Principais Tecnologias Usadas 📓
<ul>
    <li>Node</li>
    <li>TypeScript</li>
    <li>Express</li>
    <li>MongoDB com Mongoose</li>
    <li>Passport JWT</li>
    <li>Multer</li>
</ul>

## Projeto 💻
Este projeto foi feito para fins de estudos e tem como objetivo simular o backend da OLX.

## O que a API faz ⁉
Esta API possui diversas funcionalidades como criar usuários, login, adicionar anúncios, controle de autenticação com token JWT, upload de múltiplos arquivos do tipo IMG nos anúncios através do Multer, modificações nos próprios.

## Para rodar o projeto ⏯
### Pré-requisitos globais:
```npm i -g nodemon typescript ts-node```

### Instalação de dependências:
```npm install```

### Configuração do arquivo .env (exemplo):
```
//porta onde o projeto irá rodar
PORT=5000

//url base
BASE=http://localhost:5000

//url do MongoDB para o banco de dados olx
MONGO_URL=mongodb://localhost:27017/olx

// chave secreta para usar no passport(Strategy JWT)
SECRET_KEY=12345678
```

### Para rodar o projeto:
```npm run start-dev```

### Rotas bloqueadas:
<ul>
    <li>fazer a requisição usando o token que for gerado no Headers da requisição. Ex.:</li>
    <li>KEY: Authorization VALUE: Bearer eyJhbGciOiJIUzI1Ni......</li>
</ul>

### Upload de images em anúncios:
<ul>
    <li>ao fazer upload de imagens selecionar a opção <strong>form-data</strong> e usar o fieldname <strong>photos</strong><br/></li>
    <li>pode selecionar múltiplas imagens no mesmo campo sem a necessidade de criar um campo para cada arquivo</li>
</ul>

### Banco de dados(estrutura):
No arquivo db_structure.txt está disponível a estrutura para replicação
