comado para correr docker 
docker run -d --name mongo-local -p 27017:27017 -v mongo-data:/data/db mongo:latest

docker start mongo-local