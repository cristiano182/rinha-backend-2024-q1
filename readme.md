# RINHA BACKEND 2024 Q1 - NODEJS


#### RUN APPLICATION

load balance listen on localhost:9999

- start docker compose
```
$ sh run.sh
```

- run performance test
```
sh stress.sh
```

#### BUILD IMAGE (optional)
```

docker buildx create --name backend --platform linux/amd64,linux/arm64
docker buildx build -t cristiano182/rinha-backend-2024-q1:latest --builder backend --push --platform linux/amd64,linux/arm64 .
```


#### ENVIRONMENTS (required)
```
PORT=3000
POSTGRES_URL=postgres://admin:123@localhost:5432/rinha
IS_PRIMARY_NODE=true
UV_THREADPOOL_SIZE=2
POSTGRES_MAX_POOL=100
POSTGRES_MIN_POOL=30
```




##### RUN TIME
- NodeJS (typescript)
##### HTTP SERVER
- Hyper-Express
##### DATABSE
- PostgresSQL
##### LOAD BALANCE
- NGINX
##### VALIDATOR
- AJV
##### DI
- Inversify



##### CONTACT
EMAIL: cristianogb182@gmail.com
