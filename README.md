
# Car Game Example

## Docker

* Crear imagen de docker

    ```bash
    docker build -t node22 .
    ```

* Correr contenedor de docker

    ```bash
    docker run --name test-node22 --rm -it node22 /bin/sh
    ```

## Docker Compose

* Copiar archivos de configuracion (la primera vez)

    Mac OS / Linux:
    ```bash
    cp -n .env.template .env
    ```

    Windows:
    ```cmd
    if not exist .env copy .env.template .env
    if not exist .env.bat copy .env.template .env.bat
    ```

* Crear la red de docker (la primera vez)

    Mac OS / Linux:
    ```bash
    source .env && docker network create --driver bridge ${NETWORK_NAME}
    ```

    Windows:
    ```cmd
    call .env.bat
    docker network create --driver bridge %NETWORK_NAME%
    ```

* Crear el volumen de docker (la primera vez)

    Mac OS / Linux:
    ```bash
    source .env && docker volume create --opt type=none --opt device=${WORKING_DIR} --opt o=bind ${VOLUME_NAME}
    ```

    Windows:
    ```cmd
    call .env.bat
    docker volume create --opt type=none --opt device=%WORKING_DIR% --opt o=bind %VOLUME_NAME%
    ```

* Correr contenedor con docker compose

    Mac OS / Linux / Windows:
    ```bash
    docker compose --env-file .env up
    ```

* Abrir terminal en contenedor en ejecución

    ```bash
    docker exec -it car-game-example-webserver-1 /bin/sh
    ```

* Desinstalación

    Mac OS / Linux:
    ```bash
    docker compose --env-file .env down
    source .env && docker network rm ${NETWORK_NAME}
    docker volume rm ${VOLUME_NAME}
    ```

    Windows:
    ```cmd
    call .env.bat
    docker network rm %NETWORK_NAME%
    docker volume rm %VOLUME_NAME%
    ```

### Referencia de docker

* Crear una imagen de docker a partir de node22-alpine.

    [Sitio en Docker Hub](https://hub.docker.com/_/node)

    ```bash
    docker build -f Dockerfile.22-alpine -t node22-alpine .
    ```

* Correr un contenedor utilizando la imagen creada, y abrir un shell inmediatamente.

    ```bash
    docker run --name test-node22 --rm -it node22-alpine /bin/sh
    ```

* Correr un shell en un contenedor en ejecución.

    ```bash
    docker exec -it test-node22 /bin/sh
    ```

* Eliminar contenedor manualmente.

    ```bash
    docker container rm test-node22
    ```

* Crear un volumen.

    ```bash
    docker volume create --opt type=none --opt device=C:\Users\David\Documents\workspace\car-game-example --opt o=bind car-game-volume
    ```

* Correr un contenedor utilizando un volumen

    ```bash
    docker run --name test-node22 --rm -it -v car-game-volume:/projects node22-alpine /bin/sh
    ```

* Enlazar un puerto entre el host y el contenedor

    ```bash
    docker run --name test-node22 --rm -it -p 3000:3000 node22-alpine /bin/sh
    ```

* Crear una red de docker

    ```bash
    docker network create --driver bridge car-game-net
    ```