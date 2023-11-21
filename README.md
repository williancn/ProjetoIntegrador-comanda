## 💻 Sobre o projeto

🍽️  O projeto representa uma ideia inovadora para uma aplicação web e móvel que visa criar um sistema eficiente de cardápio e comandas. Desenvolvido como parte do PROJETO INTEGRADOR: ANÁLISE DE SOLUÇÕES INTEGRADAS PARA ORGANIZAÇÕES do Senac EAD, o objetivo principal é contribuir para que garçons em estabelecimentos possam realizar e gerenciar pedidos de forma eficiente, agilizando e organizando processos que anteriormente eram mais ineficientes.

Grupo:
 Grupo 17
 </br>
Nome dos integrantes:
- WILLIAN CASANOVA
- DAVID DE LIMA SILVA 
- GUILHERME HENRIQUE BONILHA ROGANTE
- RONEY JOSE SANTOS
- CLEVERSON LUIZ PIRES LOPES


## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:
- NodeJs
- PostgreSQL
- ReactJS
- Next JS
- React Native

## 🚀 Como executar o projeto
### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- Para Ambos:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en).
- Para o Backend:
[PostgreSQL](https://www.postgresql.org/),
- Para o FrontEnd Web:

- Para o FrontEnd Mobile:
[Android Studio](https://developer.android.com/studio?gclid=CjwKCAiAx_GqBhBQEiwAlDNAZl7PZNDYihvieM8WlZkRx82kRlQEafnF1krVkOgtipCN79yyb2sKuBoCtlQQAvD_BwE&gclsrc=aw.ds&hl=pt-br),
### 🧭 Rodando a aplicação

```bash
# Clone este repositório
$ git clone https://github.com/williancn/ProjetoIntegrador-comanda

#Instale primeiro backend, para que ao acessar a pagina incial do frontend web o usuario teste seja criado
#Instale e rode uma Virtual Device pelo Android Studio para rodar o projeto emulado num celular

#BACKEND
# Apos a instação do PostgreSQL, crie um banco de dados e então dentro raiz do projeto Backend crie um arquvio .env com os seguintes dados:
$ DATABASE_URL="postgresql://<usuario-do-banco>:<senha-do-banco>@localhost:5432/<nome-do-banco>?schema=public"
$ JWT_SECRET=<token-secreto-de-sua-preferencia>

# Abra o terminal na raiz do projeto Backend e instale as dependências
$ npm install

# Apos ter instalado rode o comando abaixo para criar o banco de dados
$ npx prisma migrate dev –-name create_db

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# A Api será aberta na porta:3333

#FRONTEND WEB
# Abra o terminal na raiz do projeto Frontend e instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# A aplicação será aberta na porta:3000 - acesse http://localhost:3000

#Ao acessar a url do FrotEnd Web sera criado um usuario com as seguintes credencias:
#Email: teste@teste.com
#Senha: teste

#FRONTEND MOBILE
# Abra o terminal na raiz do projeto Mobile e instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run start

# A aplicação será ira rodar e possibilitar pressionar a letra "W" no console para uma versao mobile na web, ou a letra "A" para abrir no emulador do Android Studio
```
