Criei o `README.md` detalhado para o seu backend, seguindo suas instruções. Ele explica a configuração, as variáveis de ambiente, a inicialização do banco de dados e os endpoints da API.

-----

### `README.md`

# Simulador de Votos para Mídias (Backend)

Este é o backend da aplicação de um simulador de votos para filmes e séries, construído com **Node.js**, **Express** e **PostgreSQL**. A API gerencia a criação, listagem e votação de mídias, além da autenticação de usuários.

## Configuração do Projeto

### Pré-requisitos

  - Node.js (versão 14 ou superior)
  - PostgreSQL (necessário ter um banco de dados e usuário configurados)

### Instalação

1.  Clone este repositório:

    ```bash
    git clone https://github.com/GabrielXavierOliveira/Filmes-Series-BackEnd.git
    cd Filmes-Series-BackEnd
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

## Variáveis de Ambiente

Este projeto utiliza o arquivo `.env` para gerenciar as variáveis de ambiente, especialmente as credenciais de conexão com o banco de dados.
Para fins de demonstração e facilidade de uso deste projeto de exemplo, ele não foi ignorado, permitindo uma inicialização mais simples.

## Inicialização e Funcionalidades

### Script de Inicialização do Banco de Dados

Este projeto inclui um script de inicialização (`setup.js`) que é executado automaticamente ao iniciar o servidor. Ele é responsável por:

  - Verificar e criar as tabelas `medias`, `usuarios` e `votos`, caso não existam.
  - Criar um usuário padrão `admin` com a senha `admin` para facilitar os testes iniciais.

Você pode iniciar o servidor e a inicialização do banco de dados com um único comando:

```bash
npm start
```

## Endpoints da API
O projeto contem uma collection (`api.postman_collectin.json`) para orientar as URLs, corpo das requições e formato de autenticação dos endpoint disponveis da aplicação.