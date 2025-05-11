# Testing

This document provides instructions on how to run tests for the `nestjs-firebase-admin` project.

## Prerequisites

Ensure you have the following installed:

- **Node.js**: >= 20
- **NPM**: >= 10

Install the dependencies:

```bash
npm install
```

## Running Tests

### Unit Tests

To run unit tests, use the following command:

```bash
npm test
```

### Coverage Tests

To generate a code coverage report, run:

```bash
npm run test:cov
```

The coverage report will be available in the `coverage/` directory.

### Watch Mode Tests

To run tests in watch mode, use:

```bash
npm run test:watch
```

### Debug Tests

To debug tests, use:

```bash
npm run test:debug
```

## Testing Tools

This project uses the following tools for testing:

- **Jest**: A JavaScript testing framework.
- **@nestjs/testing**: Utilities for testing NestJS applications.

## Mocking

Mock implementations are provided for Firebase services to ensure tests do not make actual calls to Firebase. These mocks are located in the `lib/tests/mocks/` directory.

## Continuous Integration

Tests are automatically run in CI pipelines using GitHub Actions and CircleCI. Refer to the respective configuration files for more details.
