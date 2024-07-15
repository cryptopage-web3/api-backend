tg_message()
{
    local wd=$(dirname "$0")
    local chat_id="${TG_CHAT_ID}"
    local text="$1"
    local bot_id="${TG_BOT_ID}"
    local msg_log="$wd/tg-msg.log"
    local file_send_log="$wd/tg-file-send.log"

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
         --connect-timeout 4
         --silent --show-error
         https://api.telegram.org/bot$bot_id/sendMessage
    )

    curl "${args[@]}" >> $msg_log #send message

    echo "" >> $msg_log

    local FILE="$2"

    if [ -f "$FILE" ]; then #send file
        echo "Send file to tg: $FILE"
        
        curl -F document=@"$FILE" \
        --connect-timeout 4 \
        --silent --show-error \
        https://api.telegram.org/bot$bot_id/sendDocument?chat_id=$chat_id >> $file_send_log

        echo "" >> $file_send_log
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