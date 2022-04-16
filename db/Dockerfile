FROM postgres

ENV POSTGRES_USER=$DATABASE_USER
ENV POSTGRES_PASSWORD=$DATABASE_PASSWORD
ENV POSTGRES_DB=$DATABASE_NAME

WORKDIR /usr/src/app

RUN apt-get update -yq \
    && apt-get -yq install curl gnupg ca-certificates \
    && curl -L https://deb.nodesource.com/setup_16.x | bash \
    && apt-get update -yq \
    && apt-get install -yq \
        dh-autoreconf=19 \
        ruby=1:2.5.* \
        ruby-dev=1:2.5.* \
        nodejs

COPY package*.json ./
RUN npm install

COPY . ./

RUN chmod +x ./scripts/wait-for-it.sh ./scripts/docker-entrypoint.sh

EXPOSE 5432

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]