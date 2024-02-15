docker compose down
docker rm -f $(docker ps -a -q)
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -f “dangling=true” -q)
docker image rm $(docker image ls -f 'dangling=true' -q)
docker rmi cristiano182-api01 
docker rmi cristiano182-api02
docker compose up --build