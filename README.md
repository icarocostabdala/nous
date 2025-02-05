# Nome do Projeto

Nous

## Pré-requisitos

Antes de começar, certifique-se de que você tem o seguinte instalado:

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/en) v20.18.2

## Passos para Configuração

### 1. Clone do Repositório

git clone https://github.com/icarocostabdala/nous

### 2. Execução dos containers

docker-compose build

docker-compose up -d

### 3. Aplicação

- Lista os filmes de acordo com a regra.

GET - http://localhost:3000/movies/producers-intervals

curl --location 'http://localhost:3000/movies/producers-intervals'

- Faz o upload do arquivo .csv

POST - http://localhost:3000/movies/upload-csv

curl --location 'http://localhost:3000/movies/upload-csv' \
--form 'file=@"/caminho-do-arquivo"'

### 4. Acesso ao mongodb

$ docker exec -it nous-mongo bash
$ mongosh

> use nousdb
> db.movies.find().pretty()

### 5. Execução dos testes

npm run test
