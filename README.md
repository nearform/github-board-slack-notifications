![CI](https://github.com/nearform/github-board-slack-notifications/actions/workflows/ci.yml/badge.svg?event=push)
![CD](https://github.com/nearform/github-board-slack-notifications/actions/workflows/cd.yml/badge.svg?event=push)

# github-board-slack-notifications
The purpose of this project is to sent notifications to a Slack channel for any changes that are performed in a GitHub board (Projects beta).
The Slack channel is configurable with env variable.

## Configuring the slack channel for a project
The webhook will receive events from all projects inside the organisation where the GitHub App is installed.
In order to configure the Slack channel(s) that get notified when changes are done on project boards, a custom field must be added inside the projects' settings.
The field must be named `SlackChannel` with the type `Single select`. The configured options will be the channels that will receive the notification.

![](diagrams/setting_project_slack_channel.png)

The Slack bot should be added to those channels otherwise message sending will fail.
