# Contributing to tezos homebase

Thank you for your interest in contributing to tezos homebase, a web app that allows anyone to create and manage DAOs on Tezos. We welcome and appreciate any contributions, whether it is code, documentation, design, feedback, or ideas.


## How to contribute

There are many ways you can contribute to our project:

- Report bugs or suggest features by opening an [issue](https://github.com/dOrgTech/homebase-app/issues).
- Fix bugs or implement features by submitting a [pull request](https://github.com/dOrgTech/homebase-app/pulls).
- Improve the documentation or the user interface by editing the files directly on GitHub or forking the repo.
- Join our [Discord server](https://discord.gg/9cduRr5) and chat with us about the project.

## Development setup

To set up your local development environment, follow these steps:

1. Fork and clone the repo: `git clone https://github.com/<your-username>/homebase-app.git`
2. Install the dependencies: `yarn install`
3. Create a `.env` file in the root directory and add the required environment variables (see `.env.example` for reference)
4. Run the app in development mode: `yarn start`
5. Open http://localhost:3000 to view the app in the browser

## Pull request guidelines

Before you submit a pull request, please make sure that:

- Your code follows the [Prettier](https://prettier.io/) code style and format
- Your code passes the [ESLint](https://eslint.org/) checks and has no errors or warnings
- Your code is well-tested and has good coverage
- Your code is documented with comments and JSDoc annotations
- Your commit messages are clear and descriptive
- Your branch is up-to-date with the `develop` branch

To submit a pull request, follow these steps:

1. Create a new branch from the `develop` branch: `git checkout -b <branch-name>`
2. Make your changes and commit them: `git commit -m "<commit-message>"`
3. Push your branch to your fork: `git push origin <branch-name>`
4. Go to https://github.com/dOrgTech/homebase-app and create a new pull request from your branch to the `develop` branch
5. Fill out the pull request template and wait for a review

## Review process

We will review your pull request as soon as possible and provide feedback or suggestions if needed. We may ask you to make some changes before we merge your pull request. Please be patient and respectful with us and other contributors.

Thank you for reading this guide and for contributing to tezos homebase!
