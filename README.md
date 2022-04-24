<div>
    <br />
    <p>
        <a href="https://www.npmjs.com/package/better-handler"><img src="https://img.shields.io/npm/v/better-handler?logo=npm" alt="npm version"></a>
        <a href="https://github.com/loldonut/better-handler"><img src ="https://img.shields.io/github/languages/code-size/loldonut/better-handler?logo=github" alt="github code size"></a>
        <img src="https://img.shields.io/npm/l/better-handler" alt="license">
    </p>
    <br />
</div>

# Better Handler

A DJS Command Handler to make it easier to handle both Prefixed Legacy Commands (e.g. `!ping`) and Slash Commands.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Parameters](#parameters)
- [Project Status](#status)

## Installation

```sh-session
npm install better-handler
```

## Setup

```js
const path = require('node:path');
// or require('path')

const { CommandHandler } = require('better-handler');

new CommandHandler(client, {
    prefix: 'PREFIX_HERE',
    path: path.join(__dirname, 'commands'),

    // If you don't want the
    // Command Handler to Log then
    // set 'log' property to false.
    log: false,
})
```

**Note: It's important to use `path.join` otherwise the command handler won't find the folder!**

### Parameters

- **client** *(Client)* - Requires you to pass in `Client` class from discord.js `Client`

- **options** *(CommandHandlerOptions)* - Options for the Command Handler
    - **CommandHandlerOptions**
        - **prefix** *(string)* - Your prefix
        - **path** *(string)* - Path to the commands folder
        - **log** *(boolean, optional)* - If you want the Command Handler to Log the status of the Handler.

## Status

Currently, `better-handler` is just your average command handler since I'm still thinking about how the design should be.
