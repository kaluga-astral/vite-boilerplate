#!/bin/bash
# Трансформирует содержимое .env.local в env.js файл для загрузки в рантайме

# Очищаем файл
> ./env.js

ENVS=''
ENV_PREFIX='PUBLIC_'

# Читаем что находится в .env.local и отфильтровываем комментарии
for line in $(cat ./.env.local | grep -v '^#' | grep '='); do
  IFS='=' read -r k v <<< "$line"
  k="${k//\"/\\\"}"  # escape double quotes in key
  v="${v//\"/\\\"}"  # escape double quotes in value

  # Берем все env, с префиксом и записываем в ENVS
  case "$k" in
    ${ENV_PREFIX}*)
      if [ -n "$ENVS" ]; then
        ENVS="${ENVS},\"${k}\":\"${v}\""
      else
        ENVS="\"${k}\":\"${v}\""
      fi
      ;;
  esac
done

# Генерация env.js файл и запись переменных
echo "window.__ENV__={${ENVS}};" >> ./env.js
