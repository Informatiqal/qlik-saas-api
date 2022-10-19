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

## Rate limit

From 01/11/2022 Qlik is introducing rate limits when using SaaS REST API. If the response is with status 429 then the rate limit is reached and the script have to wait before continue.

(from community.qlik)
| Tier | Limit | Description |
| ------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tier 1 | 600+ per minute | Supports majority of requests for data consumption with generous bursting. |
| Tier 2 | 60+ per minute | Create, update, and delete resource endpoints with occasional bursts of more requests. |
| Special | Varies | Rate limiting conditions are unique for methods with this tier. Consult the method's documentation to better understand its rate limiting conditions. |

For more information please check these links:

- [qlik.dev blog post](https://community.qlik.com/t5/Support-Updates/Important-Changes-to-Qlik-Cloud-REST-API-starting-November-1st/ba-p/1991505)
- [qlik community post](https://community.qlik.com/t5/Official-Support-Articles/Qlik-Cloud-API-rate-limits-enforced-starting-on-November-1st/ta-p/1991382)
