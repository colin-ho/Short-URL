# URL-Shortener

This web app converts long urls into short urls. 

## How to run
1. [Install docker compose](https://docs.docker.com/compose/install/)
2. Clone this repository
   ```bash
   git clone https://github.com/colin-ho/URL-Shortener.git
   ```
3. Run `docker-compose up`

## Details
This app uses 3 services:
1. Database - PostgreSQL to store the shortened urls.
2. Backend - Django to provide api for shortening and redirecting.
3. Frontend - React (create-react-app) for front-end UI.
