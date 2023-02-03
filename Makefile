all: docker run

docker:
	docker build -t my-service-api .

# -v /mnt/data/projects/my-express-api/data:/app/data
run:
	docker run --rm -p 3000:3000 -p 3001:3001 -p 3002:3002 -v $(shell pwd)/data:/app/data --name my-service-api my-service-api

.PHONY: all
