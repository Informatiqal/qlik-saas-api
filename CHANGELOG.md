# Changelog

All notable changes to this project will be documented in this file.

## 0.19.0 - 2024-11-26

- data integration projects - `import` and `export` actions
- dependency updates

## 0.18.4 - 2024-08-22

- dependency updates

## 0.18.3 - 2024-02-18

- `Encryption` methods are replaced to be `Encryptions`
- dependency updates

## 0.18.2 - 2024-01-11

- mark `POST /sharing-tasks` `appName` argument as deprecated. [Blog post](https://qlik.dev/changelog/77-api-deprecation-sharing-tasks/)
- dependency update

## 0.18.1 - 2024-01-11

- security audit fix

## 0.18.0 - 2024-01-11

- `Data Integrations` - new API endpoints implementation [post](https://qlik.dev/changelog/76-api-updates-di-projects/)
- dependency updates

## 0.17.0 - 2023-12-20

- `Encryption` - new API endpoints implementation [post](https://qlik.dev/changelog/75-encryption-api/)
- dependency update

## 0.16.0 - 2023-12-17

- dependency updates
- new tabular reporting related endpoints implementations

## 0.15.0 - 2023-12-09

- `AutomationConnections` - new API endpoints implementation [post](https://qlik.dev/changelog/68-api-updates-automation-connections/)
- dependency updates

## 0.14.6 - 2023-09-20

- space assignments
  - in their own classes - `Assignments` and `Assignment`
  - accessible under Space instance
  - the usual methods - get, getAll, getFilter, update, create and remove

## 0.14.5 - 2023-09-20

- `reloads.getFilter()` [qlik.dev post](https://qlik.dev/changelog/57-reloads-api-improvements)
  - `filter` argument is now passed as it is. Qlik itself allows this argument
  - `log` - optional parameter. Default is `true`. If passed and set to `false` the response will not include the script log
- `reloads.getAll()` - optional `log` argument. See above
- dependency updates

## 0.14.4 - 2023-09-05

- [#220](https://github.com/Informatiqal/qlik-saas-api/issues/220) Export/download methods that actually return some file(s) now return extra data as well (to bring inline with `qlik-repo-api`) package

## 0.14.3 - 2023-09-04

- [#219](https://github.com/Informatiqal/qlik-saas-api/issues/219) `saasClient` and `id` are private and should not be available

## 0.14.2 - 2023-08-29

- [#217](https://github.com/Informatiqal/qlik-saas-api/issues/217) import and update extension methods implemented

## 0.14.1 - 2023-08-28

- `apiKey.update` correctly passes an array with one element instead of an object only (Qlik responds with 400 in that case)

## 0.14.0 - 2023-08-28

- [#82](https://github.com/Informatiqal/qlik-saas-api/issues/82) internal change. When performing `update` instead of just return the status first call `init` method to get the latest "true" version of the data from Qlik
- dependency updates

## 0.13.4 - 2023-08-27

- [#214](https://github.com/Informatiqal/qlik-saas-api/issues/214) `WebHooks` methods updated with the latest request and response types

## 0.13.3 - 2023-08-25

- [#211](https://github.com/Informatiqal/qlik-saas-api/issues/211) issue with `app.update` method return data - was returning array instead of the first (and only) element of the array

## 0.13.2 - 2023-08-25

- [#209](https://github.com/Informatiqal/qlik-saas-api/issues/209) internal code change to check if details exists when initializing entity. Until now the only check was if the details exists but its possible that the details exists and are empty object. And because of this we have to check if there are actually properties in the details object as well.
- dependency updates

## 0.13.0 - 2023-08-24

- [#207](https://github.com/Informatiqal/qlik-saas-api/issues/207) reactivate and deactivate tenants methods implemented

## 0.12.0 - 2023-08-24

- [#204](https://github.com/Informatiqal/qlik-saas-api/issues/204) as the issue stated there is no way (for now) to get the list of all apps. The only way is through the `items` endpoints and the data format is different (compared with `/apps/{appId}`). Because of this all methods that return instance of an `App` will now be compatible with `IItem` type. This will be the situation until Qlik make `/apps` publicly available
- [#206](https://github.com/Informatiqal/qlik-saas-api/issues/206) internally all `getAll()` methods will call SaaS API with `limit=50`. This will reduce the time to extract all data for larger datasets and will reduce the requests in overall (reduced chance for hitting the rate limit)

## 0.11.1 - 2023-08-21

- additional condition to the filter parsing process - check not only of double but for single quotes as well

## 0.11.0 - 2023-08-20

- **BREAKING** [#199](https://github.com/Informatiqal/qlik-saas-api/issues/199) introduction to common `getFilter` methods for majority of methods. For methods that already had `getFilter` this method is renamed to `getFilterNative`. The new `getFilter` methods is behaving similarly to the QSEoW Repository API filter endpoints where filters criteria can be passed as "readable" text eg. `name eq "something" and published ne true`. Methods that dont have the new `getFilter` will be evaluated in the next release
- internal change around using generics when using `qlik-rest-api` methods [#81](https://github.com/Informatiqal/qlik-saas-api/issues/81)

## 0.10.0 - 2023-08-15

- **BREAKING** arguments for all public methods are not an object instead of named parameters [#194](https://github.com/Informatiqal/qlik-saas-api/issues/194)

## 0.9.0 - 2023-08-14

- internal code re-factoring [#195](https://github.com/Informatiqal/qlik-saas-api/issues/195)

## 0.8.0 - 2023-08-14

- `tsconfig.json` - `strict: true`. If (when) `zod` is used it requires strict to be true

## 0.7.0 - 2023-08-13

- brands endpoints [#155](https://github.com/Informatiqal/qlik-saas-api/issues/155)
- dependency updates

## 0.6.6 - 2023-08-03

- user invite endpoint [#156](https://github.com/Informatiqal/qlik-saas-api/issues/156)

## 0.6.5 - 2023-08-03

- [#184](https://github.com/Informatiqal/qlik-saas-api/issues/184)
  - tenants - update tenant method
  - users - create or patch users with assigned roles by name, instead of by role ID
  - groups - able to create or patch groups (in general) with assigned roles by name and ID

## 0.6.2 - 2023-08-03

- change app object owner [#157](https://github.com/Informatiqal/qlik-saas-api/issues/157)

## 0.6.0 - 2023-01-29

- `app/create` correctly passes the attributes [#107](https://github.com/Informatiqal/qlik-saas-api/issues/107)
- `app/{id}/scripts` endpoints are implemented [#108](https://github.com/Informatiqal/qlik-saas-api/issues/108)
- `app/{id}/reloads` endpoints are implemented [#109](https://github.com/Informatiqal/qlik-saas-api/issues/109)
- started `app` tests
- dependency updates

## 0.5.1 - 2022-12-27

- dependency updates
- required NodeJS version >= 16.0.0

## 0.5.0 - 2022-11-07

- [#96](https://github.com/Informatiqal/qlik-saas-api/issues/96) implemented latest API changes from [qlik.dev post](https://qlik.dev/changelog/new-api---transport)
- updated generic types for few methods

## 0.4.0 - 2022-09-18

- [fix] [#78](https://github.com/Informatiqal/qlik-saas-api/issues/78) add `cancel` method for `Reload`
- [add] [#77](https://github.com/Informatiqal/qlik-saas-api/issues/77) for `App` instance new method is available `_actions`. This method will expose extra methods that are associated with apps but are not part of the `/apps` endpoints
  - reload - start app reload. Originally part of the `/reloads` endpoints. `Reload` entity will be returned
  - createReloadTask - create new scheduled reload task for the current app. Thanks to the new `/reload-tasks` endpoints
  - getReloadTasks - get all reload tasks associated with the current app. Each task will be instance of the `ReloadTask` entity

## 0.3.0 - 2022-09-17

- [#76](https://github.com/Informatiqal/qlik-saas-api/issues/76) implemented latest API changes from [qlik.dev post](https://qlik.dev/changelog/new-api---reload-tasks)
  - new method - `reloadTasks` and `reloadTask`

## 0.2.1 - 2022-09-15

- implemented latest API changes from [qlik.dev post](https://qlik.dev/changelog/deprecation-of-the-evaluations-api)
  - `evaluations` methods is marked as deprecated
  - added new methods for an `App` instance
    - `evaluations.getAll()` - get all evaluations for the app id
    - `evaluations.create()` - queue new evaluation for the app
  - new method for `Apps` method
    - `getEvaluation()` - returns `Evaluation` instance
    - `Evaluation` instance have two methods - `compare` and `download`

## 0.1.4 - 2022-08-14

- (add) Notifications API

## 0.1.3 - 2022-08-14

- review and changes (where was necessary) to WebHooks

## 0.1.2 - 2022-08-14

- (add) Web Integrations API

## 0.1.1 - 2022-08-12

- (add) Tenant API

## 0.1.0 - 2022-08-12

- (add) Automations API [#60](https://github.com/Informatiqal/qlik-saas-api/issues/60)

## 0.0.6 - 2022-08-09

- (add) Data alerts API [#61](https://github.com/Informatiqal/qlik-saas-api/issues/61)

## 0.0.5 - 2022-07-18

- (change) `Users` endpoints changes to reflect the latest [API changes](https://qlik.dev/changelog/api-updates---users-groups-and-roles#api-deprecations-users) from Qlik [#57](https://github.com/Informatiqal/qlik-saas-api/issues/57) [#53](https://github.com/Informatiqal/qlik-saas-api/issues/53)

## 0.0.4 - 2022-07-17

- (add) `Groups` - new API endpoints implementation [#56](https://github.com/Informatiqal/qlik-saas-api/issues/56) [#53](https://github.com/Informatiqal/qlik-saas-api/issues/53)

## 0.0.3 - 2022-07-17

- (add) `Roles` - new API endpoints implementation [#55](https://github.com/Informatiqal/qlik-saas-api/issues/55) [#53](https://github.com/Informatiqal/qlik-saas-api/issues/53)

## 0.0.26 - 2022-05-09

- (fix) export all types (used in documentation)

## 0.0.25 - 2022-05-09

- merged [#41 Add groups and assignedGroups fields to IUser](https://github.com/Informatiqal/qlik-saas-api/pull/41). Thanks [mikara89](https://github.com/mikara89)
- dependencies updates

## 0.0.24 - 2022-03-31

- merged [#14 Creating assignment fix](https://github.com/Informatiqal/qlik-saas-api/pull/14)

## 0.0.23 - 2022-03-31

### Fix

- Space assignments method changed - from `Delete` to `Get` [#13](https://github.com/Informatiqal/qlik-saas-api/issues/13)

## 0.0.21 - 2021-11-26

### Fix

- updated `qlik-rest-api` to `1.3.1`

## 0.0.19 - 2021-08-29

### Added

- `conditions` endpoints

## 0.0.18 - 2021-08-28

### Added

- base of `identityProviders` (identity-providers) endpoints. The documentation is incomplete

## 0.0.17 - 2021-08-28

### Added

- `collections` endpoints

## 0.0.16 - 2021-08-27

### Added

- `oauthTokens` (oauth-tokens) endpoints

## 0.0.15 - 2021-08-27

### Added

- `webhooks` endpoints

## 0.0.14 - 2021-08-27

### Added

- `users` endpoints

## 0.0.13 - 2021-08-27

### Added

- `licenses` endpoints

## 0.0.12 - 2021-08-27

### Added

- `dataCredentials` (data-credentials) endpoints

## 0.0.11 - 2021-08-27

### Added

- `dataConnections` (data-connections) endpoints

## 0.0.10 - 2021-08-27

### Added

- `reloads` endpoints

## 0.0.9 - 2021-08-27

### Added

- `naturalLanguage` (questions/actions/ask) endpoints

## 0.0.8 - 2021-08-26

### Added

- `apiKeys` (api-keys) endpoints

## 0.0.7 - 2021-08-26

### Added

- `evaluations` endpoints

## 0.0.6 - 2021-08-26

### Added

- `origins` (csp-origins) endpoints

## 0.0.5 - 2021-08-26

### Added

- `quotas` endpoints
