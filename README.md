# @socialgouv/datafiller-data

![Node.js CI](https://github.com/SocialGouv/datafiller-data/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/SocialGouv/datafiller-data/branch/master/graph/badge.svg)](https://codecov.io/gh/SocialGouv/datafiller-data)

## Usage

```js
const glossary = require("@socialgouv/datafiller-data/data/glossary.json");
const agreements = require("@socialgouv/datafiller-data/data/agreements.json");
const highlights = require("@socialgouv/datafiller-data/data/highlights.json");
const requests = require("@socialgouv/datafiller-data/data/requests.json");
const themes = require("@socialgouv/datafiller-data/data/themes.json");
```

## Dev

Pour mettre à jour les fiches :

```sh
yarn start
```

## Release policy

The release job is schedule every day at 23.00PM ans also trigger after each commit in the master branch.
If data had changed, a new release will be made.

### Manual release

If you need to trigger the release job manually, you can do it using curl
You will need to provide a valid token.

```sh
curl -H "Accept: application/vnd.github.everest-preview+json" \
    -H "Authorization: token <your-token-here>" \
    --request POST \
    --data '{"event_type": "manual_release"}' \
    https://api.github.com/repos/SocialGouv/datafiller-data/dispatches
```
