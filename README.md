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

### 使用方式

- yarn run start 開啟 server
- slack e2e-bot channel 輸入以下格式： /e2e app origin/develop (/e2e ${type} ${branch})
- 若要測試遠端 branch 需加 origin.
