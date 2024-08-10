This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, install dependencies

```bash
yarn install
```

deploy

```bash
yarn run deploy
```

update your secrets =>
 - go to Cloudflare Dashboard
 - go to Workers & Pages
 - select the project you just deployed
 - go to Settings
 - add following two environment variables
 - TURNSTILE_SECRET_KEY  <== your Turnstile Secret Key
 - TURNSTILE_SITE_KEY <== your Turnstile Site Key

Finally, Connect Custom domain as you configured on Turnstile

Done!
