# FlagSync SDK for JavaScript

At [FlagSync](https://www.flagsync.com), we believe the power of feature flags and A/B testing should be accessible to everyone, regardless of business size or budget.

That's why we developed an affordable, user-friendly platform that delivers the core functionality needed by indie hackers and growing businesses, without unnecessary complexity. [Get started](https://docs.flagsync.com/getting-started/set-up-flagsync) using FlagSync today!

[![npm version](https://badge.fury.io/js/%40flagsync%2Fjs-sdk.svg)](https://badge.fury.io/js/%40flagsync%2Fjs-sdk)
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/flagsync.svg?style=social&label=Follow%20%40flagsync)](https://twitter.com/flagsync)

---
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [React](#react)

---
## Compatibility
This SDK is an isomorphic library capable of running on Node.js and web browsers. 
However, it is meant for single-user contexts in browser environments, such as mobile or desktop web applications. 

Compatible with Node.js 16+ and ES5.

> **Note on Node.js**
>
> While this SDK is stable in Node.js 16+, this is to support uncommon, one-off cases where you may need to initialize feature flags for 
> a single user server-side.
> 
> For server-side applications, including SSR web applications, we strongly recommend using the [Node.js SDK](https://github.com/flagsync/node-client).

## Installation

```bash
# npm
npm install @flagsync/js-sdk

# yarn
yarn add @flagsync/js-sdk

# pnpm
pnpm add @flagsync/js-sdk
```

## Getting Started

Refer to the [SDK documentation](https://docs.flagsync.com/sdks/node-javascript) for more information on how to use this library.


## React

This SDK is not framework-specific and is intended to be used in browser environments. For React applications, we provide a separate [React SDK](https://github.com/flagsync/react-client) that integrates better with the React ecosystem.


