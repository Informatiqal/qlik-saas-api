# Qlik Sense SaaS REST API

Node.js module to interact with Qlik Sense SaaS API

## UNDER DEVELOPMENT

### NOT AFFILIATED WITH QLIK

## Installation

`npm install qlik-saas-api`

## Authentication

At this moment only JWT authentication is supported

## Usage

Initialize the client

```javascript
import { QlikSaaSApi } from "qlik-saas-api";

const saasApi = new QlikSaaSApi.client({
  host: "tenant-url",
  authentication: {
    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
});
```

List of available methods:
![Methods](./images/methods.png)

List of apps methods:
![Apps-Methods](./images/apps-methods.png)

Details for an app:
![Apps-Methods](./images/app-details.png)

## Methods

Full list of available methods can be found [here](https://informatiqal.github.io/qlik-saas-api/modules.html)

## Breaking changes

Breaking changes will be introduced in the future v2+ of the package

- All methods that require arguments will expect the arguments to be passed as an object

  Current:

  ```javascript
  let updateResponse = await app.addToSpace("space-id-here");
  ```

  New:

  ```javascript
  let updateResponse = await app.addToSpace({ spaceId: "space-id-here" });
  ```

  There are two reasons for that:

  - consistency - the other Qlik REST API packages (Repository, Proxy etc.) are using the same approach
  - easier to use this package as part of [Automatical](https://github.com/Informatiqal/automatiqal) and [Automatical-CLI](https://github.com/Informatiqal/automatiqal-cli)

- At the moment some methods are returning the details instead of the instance. Code review will be performed and for these methods the return will be changed to class instance

> **Note**
> In order to avoid usage issues the package will be released in two versions - v1+ and v2+. All new features, fixes, patches etc will be applied to both versions. v2+ will be the default version and v1+ will be installed with:
>
> `npm install qlik-saas-api@v1`
