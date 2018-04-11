# bogobogo-server
bogobogo.cn server
## run
node --icu-data-dir=node_modules/full-icu app
## forever run
forever start -c 'node --icu-data-dir=node_modules/full-icu' app.js