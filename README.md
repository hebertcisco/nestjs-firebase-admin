[![codecov](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin/branch/main/graph/badge.svg?token=N0IW1UNNIP)](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/hebertcisco/nestjs-firebase-admin/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/hebertcisco/nestjs-firebase-admin/tree/main)

[![Node.js build and publish package](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml)

[![Running Code Coverage](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nestjs](https://img.shields.io/badge/Nestjs-ea2845?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Free. Built on open source. Runs everywhere.](https://img.shields.io/badge/VS_Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white)](https://code.visualstudio.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white)](https://github.com/hebertcisco/nestjs-firebase-admin/actions)

> Firebase Admin SDK para NestJS :fire:

## Requisitos

- **Node.js**: >= 20
- **NPM**: >= 10
- **NestJS**: >= 7.0.0

## Instalação

Instale o pacote usando `yarn`, `npm` ou `pnpm`:

```bash
# yarn
yarn add nestjs-firebase-admin
```

```bash
# npm
npm i nestjs-firebase-admin --save
```

```bash
# pnpm
pnpm add nestjs-firebase-admin --save
```

## Exemplo de Uso

Aqui está um exemplo de como configurar o módulo `AdminModule` no NestJS:

```ts
// common.module.ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.register({
      credential: {
        projectId: 'my-project-id',
        clientEmail: 'my-client-email',
        privateKey: 'my-private-key',
      },
      databaseURL: 'https://my-project-id.firebaseio.com',
    }),
  ],
})
export class CommonModule {}
```

### Registro Assíncrono

Se você precisar de uma configuração assíncrona, use o método `registerAsync`:

```ts
import { Module } from '@nestjs/common';
import { AdminModule } from 'nestjs-firebase-admin';

@Module({
  imports: [
    AdminModule.registerAsync({
      useFactory: async () => ({
        credential: {
          projectId: 'my-project-id',
          clientEmail: 'my-client-email',
          privateKey: 'my-private-key',
        },
        databaseURL: 'https://my-project-id.firebaseio.com',
      }),
    }),
  ],
})
export class AppModule {}
```

## Testagem

Para rodar os testes, use os seguintes comandos:

### Testes Unitários

```bash
npm test
```

### Testes com Cobertura

```bash
npm run test:cov
```

### Testes em Modo Watch

```bash
npm run test:watch
```

### Debug de Testes

```bash
npm run test:debug
```

## Scripts Disponíveis

Os scripts disponíveis no `package.json` incluem:

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Release**: `npm run release`

## Contribuindo

Contribuições, issues e solicitações de funcionalidades são bem-vindas!<br />Sinta-se à vontade para verificar a [página de issues](https://github.com/hebertcisco/nestjs-firebase-admin/issues).

## Mostre seu Apoio

Dê uma ⭐️ se este projeto foi útil para você!

Ou compre um café para o autor 🙌🏾

<a href="https://www.buymeacoffee.com/hebertcisco">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=hebertcisco&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" />
</a>

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).
