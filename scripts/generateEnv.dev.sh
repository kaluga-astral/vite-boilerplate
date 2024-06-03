#!/bin/bash
# Очищаем файл
> ./env.js

ENVS=''

# Читаем что находится в /dashboard/.env и отфильтровываем комментарии
for line in $(cat ../.env.local | grep -v '^#' | grep '='); do
  IFS='=' read -r k v <<< "$line"
  k="${k//\"/\\\"}"  # escape double quotes in key
  v="${v//\"/\\\"}"  # escape double quotes in value
  if [ -n "$ENVS" ]; then
    ENVS="${ENVS},\"${k}\":\"${v}\""
  else
    ENVS=\"${k}\":\"${v}\"
  fi
done

echo "window.__ENV__={${ENVS}};" >> ./env.js # генерируем файл JavaScript
