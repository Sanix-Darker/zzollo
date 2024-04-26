.PHONY: docker-build docker-run

docker-build:
	docker build -t zzollo:latest -f ./Dockerfile .

docker-run:
	docker run -p 3000:80 -it zzollo:latest
