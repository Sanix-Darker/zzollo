# Zolo

A simple ReactJs-SearchEngine for Open-sources projects on Github, GitLab and Bitbucket !

<a href="https://zzollo.co"><img src="./public/screenshot.png" /></a>

<br>

[DEMO-VIDEO](https://www.loom.com/share/6ffd428b077f4ffeb7c35f2f1d56d74b)

[SEARCH-ENGINE-LINK](https://zollo.sanixdk.xyz/)

## REQUIREMENTS

- yarn/npm || docker
- create-react-app

## CLONE THE REPOSITORY

```bash
$ git clone https://github.com/Sanix-Darker/zzollo.git && cd zzollo
```

## WITH DOCKER

```bash
$ docker build -t zzollo:latest -f ./Dockerfile .
$ docker run -p 3000:80 -it zzollo:latest

## or with the Makefile
$ make docker-build
$ make docker-run
```

## HOW TO INSTALL & RUN

You just have to run :

```bash
$ yarn install
$ yarn start

# Using zolo.sh(this will install all deps, then build and serve)
# this will install globally 'serve' lib.
$ ./zolo.sh
```

## APPLICATION WILL BE RUNNING ON

[http://localhost:3007](http://localhost:3007)

## How to contribute

Just follow these steps :

- Create an issue with your fix/feature/improvement (Optionnal but recommended).
- Fork the project.
- Create a branch for your feature/update/fix(Make sure to have the latest master-branch updates).
- Create a Pull Request to develop branch.
- After a check, it will be merged to the project.

## Author

- [Sanix-darker](https://github.com/Sanix-Darker)
