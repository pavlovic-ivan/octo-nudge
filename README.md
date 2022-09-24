tos
# About

Octo Nudge is a Github Action that integrates with Slack and Discord and sends notifications to selected channels about you workflow. If your workflofw fails, or succeeds and you want to know about it, Octo Nudge will send a notificatio. Also, you can choose which events to listen to, and those are `push` and `schedule`.

# Action input arguments

The following table documents action input arguments:

| Input         | Required | Possible values      | Default          | Description                                                                           |
| ------------- | -------- | -------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| webhooks      | yes      |                      |                  | A comma separated list of Slack/Discord webhooks to which to send the nudge           |
| events        | no       | 'push,schedule'      | 'push,schedule'  | A comma separated list of workflow run events you want to listen to and react to      |
| conclussions  | no       | 'failure,success'    | 'failure'        | A comma separated list of workflow run conclusions you want to listen to and react to |
| nudge-blocks  | no       | 'commit,message'     | 'commit,message' | A comma separated list of blocks you want to see in the nudge message                 |
| success-color | no       | any valid hex code   | '#228c22'        | Hex value of the color for successfull workflow run conclusions                       |
| failure-color | no       | any valid hex code   | '#990f02'        | Hex value of the color for failed workflow run conclusions                            |
# Quick usage

Here is a quick usage example of the action:

```
name: Nudge

on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    environment: protected
    steps:
      - name: Send message
        uses: pavlovic-ivan/octo-nudge@main
        with:
          webhooks: ${{ secrets.WEBHOOKS }}
```

> **NOTE**
> Create a protected environment with webhooks as secrets. It is not suggested to commit webhooks in freetext to the repository