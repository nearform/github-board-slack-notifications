![CI](https://github.com/nearform/github-board-slack-notifications/actions/workflows/ci.yml/badge.svg?event=push)
![CD](https://github.com/nearform/github-board-slack-notifications/actions/workflows/cd.yml/badge.svg?event=push)

# github-board-slack-notifications
The purpose of this project is to sent notifications to a Slack channel for any changes that are performed in a GitHub board (Projects beta).
The Slack channel is configurable with env variable.

# ENV Variables

The application uses several `ENV` variables,

- `SLACK_TOKEN`, this can be retrieved from bitwarden. Please contact Simone for access.

- `APP_PRIVATE_KEY` can be found in bitwarden. It is stored as base64 to ensure new lines are kept. When it's used in the app, it is decoded.
