
# Car Game Example

## Instalar con Docker Compose

* Hacer build de imagen de docker
    
    Mac OS / Linux / Windows:
    ```bash
    docker build -t node22 .
    ```

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

## Ejecutar

* Correr contenedor con docker compose

    Mac OS / Linux / Windows:
    ```bash
    docker compose --env-file .env up
    ```

* Abrir terminal en contenedor en ejecución

    ```bash
    docker exec -it car-game-example-webserver-1 /bin/sh
    ```

## Desinstalar  

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
