# AskMe

Anonymously ask question, send songs / images / drawing to specific instagram account

## Stacks

### Fullstack Framework

- NextJS

### Frontend

- React
- TailwindCSS

### API

  - RestAPI

### Database

- mongodb
- prisma

### Hosting

- Vercel
- Netlity
- Google Cloud
- Deploys.app
- Cloudflare Pages

## Getting Started

### Prerequisites

- npm: Install required package

```sh
npm install
```

- mongodb: Install development database server

  - Download mongdb community server
  - Extact its folder into project and rename the folder to `mongodb`
  - Create folder `database` inside `mongodb` folder
 
- mongodb: Setting up user & password (optional), and create replica set

```sh
use test
db.createUser(
  {
    user: "myTester",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)
```

```sh
rs.initiate( {    _id : "rs0", members: [ { _id: 0, host: "localhost:27017" } ] })
```

- [auth0](https://auth0.com/docs/quickstart/webapp/nextjs/01-login): Setting ClientId, ClientSecret, Domain into `.env.local`

### Installation

- Build production website

```sh
npm run build
```

- Run production server

```sh
npm start
```

## Usage

*https://[Domain]/ask/[AccountID]*

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
