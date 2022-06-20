tg_message()
{
    local chat_id="${TG_CHAT_ID}"
    local text="$1"
    local bot_id="${TG_BOT_ID}"

    if [ -z "$bot_id" ]; then
       echo "Empty TG_BOT_ID env variable"
       return 0
    fi

    if [ -z "$chat_id" ]; then
       echo "Empty TG_CHAT_ID env variable"
       return 0
    fi

    if [ -z "$text" ]; then
       echo "Empty text"
       return 0
    fi

    local data='{"chat_id": "'$chat_id'", "text": "'${TG_TEXT_PREFIX}' '$text'", "disable_notification": true, "disable_web_page_preview": true}'

#    echo $data

    args=(
        -X POST
         -H 'Content-Type: application/json'
         -d "$data"
         --silent --output /tmp/tg.log --show-error --fail
         https://api.telegram.org/bot$bot_id/sendMessage
    )

    curl "${args[@]}" #send message

    local FILE="$2"

    if [ -f "$FILE" ]; then #send file
        curl -F document=@"$FILE" \
        --silent --output /tmp/tg.log --show-error --fail \
        https://api.telegram.org/bot$bot_id/sendDocument?chat_id=$chat_id
    fi
}

exit_if_error()
{
    if [ "$?" != "0" ]; then
        tg_message "$1" "${DEPLOY_LOG_FILE}"
        exit 1
    fi
}

test_http()
{
    curl -s -w "%{http_code}" -o /dev/null  --connect-timeout 1 "$1"
}