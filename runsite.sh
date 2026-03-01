docker build -t mysite . && \
docker run --rm -p 5000:5000 \
  -v mysite_node_modules:/app/node_modules \
  mysite
