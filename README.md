[![codecov](https://codecov.io/gh/hebertcisco/nestjs-lib-boilerplate/branch/master/graph/badge.svg?token=37AZT89NP3)](https://codecov.io/gh/hebertcisco/nestjs-lib-boilerplate)

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/hebertcisco/nestjs-lib-boilerplate/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/hebertcisco/nestjs-lib-boilerplate/tree/master)

[![Node.js build and publish package](https://github.com/hebertcisco/nestjs-lib-boilerplate/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/hebertcisco/nestjs-lib-boilerplate/actions/workflows/npm-publish.yml)

[![Running Code Coverage](https://github.com/hebertcisco/nestjs-lib-boilerplate/actions/workflows/coverage.yml/badge.svg)](https://github.com/hebertcisco/nestjs-lib-boilerplate/actions/workflows/coverage.yml)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nestjs](https://img.shields.io/badge/Nestjs-ea2845?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Free. Built on open source. Runs everywhere.](https://img.shields.io/badge/VS_Code-0078D4?style=flat&logo=visual%20studio%20code&logoColor=white)](https://code.visualstudio.com/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white)](https://github.com/hebertcisco/nestjs-lib-boilerplate/actions)

> This is an Nestjs boilerplate package..

## Installation

> Install with yarn or npm: `yarn` or `npm`:

```bash
# yarn
yarn add nestjs-lib-boilerplate
```

```bash
# npm
npm i nestjs-lib-boilerplate --save
```

```bash
# pnpm
pnpm add nestjs-lib-boilerplate --save
```

### Usage example:

```ts
// common.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CatModule } from 'nestjs-lib-boilerplate';

import { CommonService } from './common.service';

@Module({
  imports: [
    CatModule.register({
      message: 'Hello World',
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
