# e2e-bot

# Firebase rule
```
{
  "rules": {
    "isRunning": {
      	".read": true,
      	".write": true,
        ".validate": "data.child('isRunning').isBoolean()"
    },
    "runner": {
      "branch": {
        ".validate": "data.isString()"
      },
      "timestamp": {
        ".validate": "data.isNumber()"
      },
      "type": {
        ".validate": "data.isString()"
      },
      ".read": true,
      ".write": true,
    },
    ".read": true,
    ".write":"!newData.exists()",
  }
}
```