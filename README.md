[![codecov](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin/branch/main/graph/badge.svg?token=N0IW1UNNIP)](https://codecov.io/gh/hebertcisco/nestjs-firebase-admin)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/hebertcisco/nestjs-firebase-admin/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/hebertcisco/nestjs-firebase-admin/tree/main)

[![Node.js build and publish package](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/npm-publish.yml)

[![Running Code Coverage](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml/badge.svg)](https://github.com/hebertcisco/nestjs-firebase-admin/actions/workflows/coverage.yml)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nestjs](https://img.shields.io/badge/Nestjs-ea2845?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Free. Built on open source. Runs everywhere.](https://img.shields.io/badge/VS_Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white)](https://code.visualstudio.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white)](https://github.com/hebertcisco/nestjs-firebase-admin/actions)

> Firebase Admin SDK for Nestjs :fire:

## Installation

> Install with yarn or npm: `yarn` or `npm`:

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

### Usage example

```ts
// common.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from 'nestjs-firebase-admin';

import { CommonService } from './common.service';

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
  providers: [CommonService],
})
export class CommonModule {}
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](issues).

## Show your support

Give a ⭐️ if this project helped you!

Or buy me a coffee 🙌🏾

<a href="https://www.buymeacoffee.com/hebertcisco">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=hebertcisco&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" />
</a>

## 📝 License

Copyright © 2022 [Hebert F Barros](https://github.com/hebertcisco).<br />
This project is [MIT](LICENSE) licensed.
