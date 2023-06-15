<p align="center">
<a href="#start"><img height="30rem" src="https://raw.githubusercontent.com/arcana-network/branding/main/an_logo_light_temp.png"/></a>
<h2 align="center"> <a href="https://arcana.network/">Arcana Auth Verify </a></h2>
</p>
<br/>
<p id="banner" align="center">
<br/>
<a title="MIT License" href="https://github.com/arcana-network/license/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue"/></a>
<a title="Beta release" href="https://github.com/arcana-network/auth-verify/releases"><img src="https://img.shields.io/github/v/release/arcana-network/auth-verify?style=flat-square&color=28A745"/></a>
<a title="Twitter" href="https://twitter.com/ArcanaNetwork"><img alt="Twitter URL" src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2FArcanaNetwork"/></a>
<!---
<a title="CodeCov" href="https://codecov.io/gh/arcana-network/auth-verify"> 
 <img src="https://codecov.io/gh/arcana-network/auth-verify/branch/dev/graph/badge.svg?token=KmdjEs3enL"/></a>
-->
</p><p id="start" align="center">
<a href="https://docs.beta.arcana.network/"><img src="https://raw.githubusercontent.com/arcana-network/branding/main/an_banner_docs.png" alt="Arcana Auth Verify"/></a>
</p>

# Arcana Auth Verify

The Arcana Auth Verify is a Vue-based UI that is part of the Arcana Auth product. Auth Verify works in tandem with the Arcana Auth SDK on the client side. The `auth-verify` repo implements a wrapper that is used for the user authentication redirect page handling. 

When a user logs in to a Web3 app that is integrated with the Arcana Auth SDK through passwordless or social logins, a user verification UI is displayed once the authentication provider successfully processes the user login and redirects to `auth-verify` link. Auth Verify then passes on the verified user's parameters to the Arcana Wallet UI frame and securely fetches the key shares from the Arcana ADKG subsystem. These key shares are assembled within the Web3 app and Arcana Wallet UI context to generate the user's key for signing blockchain transactions.

In addition, Auth Verify also implements the MFA feature and assists in restoring the user's identity share across devices for enhanced wallet security.

## 🏗️ Auth Verify Developer Guide

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Installation

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 📋 Usage Prerequisites

The Arcana Auth Verify functionality cannot be used as a standalone app. It works in tandem with the Arcana Auth SDK and Arcana Wallet UI. Web3 app developers must register the app with Arcana Network, configure onboarding options using the [Arcana Developer Dashboard](https://dashboard.arcana.network/) and then install the [Auth SDK](https://github.com/arcana-network/auth) and integrate the app to onboard users, leverage the Auth Verify functionality and then allow authenticated users to use the embedded Arcana Wallet UI to sign blockchain transactions.

## 📚 Documentation

See [Arcana Network documentation](https://docs.arcana.network/) and refer to the  [Auth SDK Quick Start Guide](https://docs.arcana.network/walletsdk/wallet_qs.html), [Usage Guide](https://docs.arcana.network/walletsdk/wallet_usage.html) and [API Reference Guide](https://authsdk-ref-guide.netlify.app) to integrate a Web3 app with the Arcana Auth product. 

The [Arcana Wallet User Guide](https://docs.arcana.network/user-guides/wallet-ui/index.html) shows various Web3 wallet operations supported by the Arcana Wallet.

## 💡 Support

For any support or integration-related queries, contact [Arcana Support Team](mailto:support@arcana.network).

## 🤝 Contributing

We welcome all contributions to the Arcana Auth product and Auth Verify from the community. Read our [contributing guide](https://github.com/arcana-network/license/blob/main/CONTRIBUTING.md) to learn about the SDK development process, how to propose bug fixes and improvements, and the code of conduct that we expect the participants to adhere to. Refer to the build and test section of this readme for details on how to test and validate your changes to the Auth Verify code before submitting your contributions.

# ℹ️ License

Arcana Auth Verify is distributed under the [MIT License](https://fossa.com/blog/open-source-licenses-101-mit-license/).

For details see [Arcana License](https://github.com/arcana-network/license/blob/main/LICENSE.md).