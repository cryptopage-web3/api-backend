# ENV variables required 
# PM2_NAME - pm2 service name
# DEPLOY_LOG_FILE - absolute path to deoploy log file
# TG_TEXT_PREFIX - text added to each tg message
# TG_CHAT_ID - telegram chatid for send messages
# TG_BOT_ID - telegram bot id for send messages

#unclude utils
. $(dirname "$0")/utils.sh

echo "log file: ${DEPLOY_LOG_FILE}, ${TG_BOT_ID}|${TG_TEXT_PREFIX}|${TG_CHAT_ID}|${DEPLOY_DIR}|${DEPLOY_PORT}|${RUN_DIR}|${RUN_PORT}|${PM2_NAME}"

deploy_dir=${DEPLOY_DIR}
run_dir=${RUN_DIR}
deploy_port=${DEPLOY_PORT}
run_port=${RUN_PORT}

pm2_run_name="${PM2_NAME}"
pm2_deploy_name="${PM2_NAME}_deploy"

tg_message "Deploy started"

echo "Stop server"

pm2 stop $pm2_deploy_name
pm2 delete $pm2_deploy_name

cd $deploy_dir 2>&1

echo "deploy dir: $deploy_dir; run dir $run_dir"

echo "cleanup"

tg_message "pull changes from git started"

git checkout .

git pull 2>&1

exit_if_error "git pull failed"

rm -rf node_modules dist

echo "install dependencies"

tg_message "install dependencies started"

npm i 2>&1

exit_if_error "install dependencies failed"

tg_message "build started"

npm run build 2>&1

exit_if_error "build failed"

tg_message "Start integration tests"

echo "Start integration tests"

npm t 2>&1

exit_if_error "integration tests failed"

npm run db:sync 2&>1

exit_if_error "database update failed"

echo "Start deploy test server, port $deploy_port"

export NODE_ENV=production
export PORT=$deploy_port

pm2 start --name=$pm2_deploy_name dist/index.js

echo "Sleep 5 sec"

sleep 5

http_response=$(curl -s -w "%{http_code}" -o /dev/null  --connect-timeout 1  "http://127.0.0.1:$deploy_port")

echo "port $deploy_port response: $http_response"

if [ "$http_response" != "200" ]; then
    tg_message "Server test start failed"
    exit 1
fi

tg_message "Build test: OK; start update site"

pm2 stop $pm2_deploy_name
pm2 delete $pm2_deploy_name

pm2 stop $pm2_run_name
pm2 delete $pm2_run_name

rm -rf $run_dir/node_modules $run_dir/dist

cp -rf $deploy_dir/node_modules $run_dir/node_modules 2>/dev/null
cp -rf $deploy_dir/dist $run_dir/dist 2>/dev/null

cd $run_dir

git pull 2>&1

export NODE_ENV=production
export PORT=$run_port

pm2 start --name=$pm2_run_name dist/index.js

sleep 5

echo sleep 5 sec

http_response=$(curl -s -w "%{http_code}" -o /dev/null  --connect-timeout 1  "http://127.0.0.1:$run_port")

echo "port $run_port response: $http_response"

if [ "$http_response" != "200" ]; then
    tg_message "Server start failed"
    exit 1
fi

echo "Server started on port: $run_port"

tg_message "deploy completed"

exit
exit
exit

exit
exit
exit
