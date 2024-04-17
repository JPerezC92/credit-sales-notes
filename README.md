<h1 align="center">
  NestJS Template
</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
<div align="center">
<a href="https://nestjs.com/">
	<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
</a>
<a href="https://www.typescriptlang.org/">
	<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</a>
<a href="https://eslint.org/">
	<img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</a>
<a href="https://prettier.io/">
	<img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white" alt="Prettier" />
</a>
<a href="https://pnpm.io/">
	<img src="https://img.shields.io/badge/pnpm-0F111A?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</a>

<p>
Template for creating a NestJS app with TypeScript, ESLint, and Prettier. Pre-configured with Jest and supertest for testing. 
</p>
</div>

## 🚀 Using this template
1. Create your project based on this template:
    - a) If you want to create a GitHub repository, we would recommend to use the GitHub "Use this template" button and clone your newly created repository
    - b) If you don't want to create a GitHub repository, you can use the [degit](https://github.com/Rich-Harris/degit) tool to clone this repository without the Git history:
        ```bash
        npx degit JPerezC92/nestjs-template#main my-nextjs-app
        ```

2. Start the app:
    ```bash
    cd my-nextjs-app    
    pnpm install
    pnpm start:dev
    ```    

3. Start coding!

## 🧪 Testing
### Unit Testing
This template uses [Jest](https://jestjs.io/) for unit testing. To run the tests:
```bash
pnpm test:watch
```

### E2E Testing
This template uses [SuperTest](https://github.com/ladjs/supertest) for E2E testing. To run the tests:

```bash
pnpm test:e2e
```

## 📦 Building for production
To build the app for production:
```bash
pnpm build
pnpm start:prod
```

## 🧹 Linting
To lint the app:
```bash
pnpm lint
```

## 📝 Formatting
To format the app:
```bash
pnpm format
```

## 📚 Documentation

- [Nestjs](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Zod](https://zod.dev)
- [Jest](https://jestjs.io/docs/getting-started)
- [SuperTest](https://github.com/ladjs/supertest)
- [ESLint](https://eslint.org/docs/user-guide/getting-started)
- [Prettier](https://prettier.io/docs/en/index.html)
