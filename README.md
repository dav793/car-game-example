
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