# Changelog

All notable changes to this project will be documented in this file.

## 0.9.0 - 2023-08-14

- internal code re-factoring

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
