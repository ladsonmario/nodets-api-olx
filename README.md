<h1 align="center">API OLX em Node v2.0</h1>

## Principais Tecnologias Usadas 📓
<ul>
    <li>Node</li>
    <li>TypeScript</li>
    <li>Express</li>
    <li>MongoDB com Mongoose</li>
    <li>Passport JWT</li>
    <li>Multer</li>
    <li>Sharp</li>
    <li>Express-Validator</li>
    <li>uuid(v4)</li>
</ul>

## Projeto 💻
Este projeto foi feito para fins de estudos e tem como objetivo simular o backend da OLX. Foi usado o conceito de MVC na estrutura a nível de código para manter uma melhor organização.

## O que a API faz ⁉
Esta API possui diversas funcionalidades como criar usuários, excluir usuário, fazer login, operações CRUD para anúncios e usuário, operações CRD para categorias e estados, controle de autenticação com token JWT, upload de múltiplos arquivos do tipo IMG nos anúncios através do Multer. E muito mais!

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
DATABASE=mongodb://localhost:27017/olx

// chave secreta para usar no passport(Strategy JWT)
SECRET_KEY=12345678
```

### Para rodar o projeto:
```npm start```

### Rotas bloqueadas:
<ul>
    <li>fazer a requisição usando o token que for gerado ao criar uma conta ou fazendo login, enviar token no Headers da requisição. Ex.:</li>
    <li>KEY: Authorization VALUE: Bearer eyJhbGciOiJIUzI1Ni......</li>
</ul>

### Upload de image em categorias:
<ul>
    <li>ao criar uma categoria é necessário inserir uma única imagem para ser ícone desta categoria, selecionar a opçao <strong>form-data</strong> e usar o fieldname <strong>img</strong></li>    
</ul>

### Upload de images em anúncios:
<ul>
    <li>ao fazer upload de imagens selecionar a opção <strong>form-data</strong> e usar o fieldname <strong>img</strong><br/></li>
    <li>pode selecionar múltiplas imagens no mesmo campo sem a necessidade de criar um campo para cada arquivo</li>
</ul>


### Banco de dados(estrutura):
No arquivo db_structure.txt está disponível a estrutura para replicação

## Endpoints e suas funcionalidades

### <strong>/states/list</strong> () => lista todos os estados
- method: GET
- private: false

### <strong>/states/add</strong> () => adiciona estado
- method: POST
- private: true
- somente administradores possuem permissão

### <strong>/states/:id</strong> () => deleta estado
- method: DELETE
- private: true
- somente administradores possuem permissão

### <strong>/user/signin</strong> () => faz login
- method: POST
- private: false
- enviar na requisição: email e password

### <strong>/user/signup</strong> () => cria usuário
- method: POST
- private: false
- enviar na requisição: name, email, password e state(value: id)

### <strong>/user/me</strong> () => pega informações do usuário
- method: GET
- private: true

### <strong>/user/me</strong> () => edita dados do usuário
- method: PUT
- private: true
- enviar na requisição: name(opcional), email(opcional), password(opcional) e state(value: id)(opcional)

### <strong>/user/admin</strong> () => torna usuário um administrador
- method: PUT
- private: true
- enviar na requisição: id do usuário
- somente administradores possuem permissão

### <strong>/user/:id</strong> () => deleta usuário
- method: DELETE
- private: true
- enviar pelo parâmetro id do usuário
- o próprio usuário precisa está fazendo essa requisição(logado)

### <strong>/category/list</strong> () => lista todas as categorias
- method: GET
- private: false

### <strong>/category/add</strong> () => adiciona nova categoria
- method: POST
- private: true
- codificação: multipart/form-data
- enviar na requisição: name, slug(nome da categoria em inglês) e img(icone da categoria)

### <strong>/category/:id</strong> () => deleta categoria
- method: DELETE
- private: true
- enviar pelo parâmetro id da categoria
- somente administradores possuem permissão

### <strong>/ad/add</strong> () => cria um nono anúncio
- method: POST
- private: true
- codificação: multipart/form-data
- enviar na requisição: title, cat(categoria value: id), priceneg(opcional), price(opcional), desc(descrição) e img(multiple)

### <strong>/ad/list</strong> () => lista anúncios (com filtros)
- method: GET
- private: false
- aceita filtros que são enviados através de query
- sort = 'ASC' | 'DESC' (para configuração de exibição)
- limit = quantos anúncios serão exibidos (para configuração de exibição)
- offset = quantos anúncios serão pulados na paginação (para configuração de exibição)
- q = pesquisar anúncio por nome (filtra pela query)
- cat = pesquisa por categoria (filtra pela query)
- state = pesquisa por estado (filtra pela query)

- <strong>obs.: se enviar a requesição sem as query ele irá retornar todos os anúncios</strong>

// exemplo de endpoint de pesquisa com filtro<br/>
```/ad/list?q=uno&cat=cars&state=pa```

### <strong>/ad/:id</strong> () => pega informações de SOMENTE 1 anúncio
- method: GET
- private: false
- enviar pelo parâmetro id do anúncio

### <strong>/ad/:id</strong> () => atualiza dados de um anúncio
- method: PUT
- private: true
- codificação: multipart/form-data (se for enviar img)
- somente o proprietário do anúncio pode fazer sua edição
- enviar na requisição: title(opcional), cat(opcional)(categoria value: id), priceneg(opcional), price(opcional), desc(opcional)(descrição) e img(opcional)(multiple)

### <strong>/ad/:id</strong> () => deleta anúncio
- method: DELETE
- private: true
- enviar pelo parâmetro id do anúncio
- Somente o proprietário pode remover o anúncio