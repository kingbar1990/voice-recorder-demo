### Build project

1. Build docker
```bash
docker-compose build
```

2. Create database
```bash
docker-compose up -d database
```

3. Make database migrations
```bash
docker-compose run server python manage.py migrate
```

4. Install node modules
```bash
docker-compose run client yarn
```

5. Run the project
```bash
docker-compose up
```

6. Open in your browser
```bash
Client:
```
http://localhost:3000/
```bash
Server:
```
http://localhost:8000/

```bash
  Make sure you grant an access to the mic in your browser
```
http://dl3.joxi.net/drive/2019/06/21/0017/3284/1129684/84/9cd9d3eb3a.jpg
