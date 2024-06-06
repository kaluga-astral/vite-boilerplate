#!/bin/sh

# Скрипт упадет, если какая-либо операция завершалась не удачно. Не позволит запуститься nginx с кривыми envs
set -e

# Переходим в директорию с билдом для nginx
cd /usr/share/nginx/html

# Генерация env.js для загрузки env в runtime
ENVS=''
ENV_PREFIX='PUBLIC_'

# Читаем что находится в env, разделяем на фрагменты ключ-значение
for line in $(env | grep '='); do
  k=${line%%=*}
  v=${line#*=}

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

# Вычисляем md5-хеш из переменной ENVS с помощью openssl
hash=$(printf "%s" "${ENVS}" | openssl dgst -md5 | awk '{print $2}')

# Создаем файл с хэшом в имени. Хэш необходим для правильной работы http cache
printf "window.__ENV__={%s};\n" "${ENVS}" > ./env."$hash".js

# Модифицируем ссылку на env.js файл, чтобы в названии был нужный хэш

# Читаем файл
html="./index.html"

# Читаем content файла
content=$(cat "$html")

# Заменяем в html ссылку на env.js
newContent=$(echo "$content" | sed "s/env.js/env.$hash.js/")

# Перезаписываем html с новым содержимым
echo "$newContent" > "$html"

# Подстановка переменных в nginx.conf

# Необходимо экспортировать, тк envsubst является разветвленным процессом и не знает неэкспортируемых переменных
export PUBLIC_WS_URL

# Подмена указанных переменные в nginx.conf.template и копирование всего файла в nginx.conf
envsubst "${PUBLIC_WS_URL}" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Запуск nginx
nginx -g 'daemon off;'
