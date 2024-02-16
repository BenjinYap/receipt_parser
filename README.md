https://receiptparser.net

sam local start-api --host 0.0.0.0

## things to do/fix by priority
* add a changelogs feature
* add ability to delete photos (most likely to be used due to a bad photo causing text to be parsed poorly)
* add missing colors for the summary table for all the new categories
* keyboard shortcuts to cycle between the brushes would be nice
* restructure everything api related so it's more rest-like, better status codes and stuff
* revisit all the error handling due to this
* update help section to include screenshots
* add brush customization
* add camera selection
* add iac and deploy pipeline
* fix the mock file loading for the lambda cause it doesn't work anymore
* re-enable cloudfornt caching but auto invalidate /index.html on deploy or something

