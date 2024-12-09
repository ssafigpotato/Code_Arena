# 빌드 및 배포

- 모든 기준은 clone 이후입니다.

## 로컬 환경 설정

- docker-compose로 docker 환경 구성 및 실행
- npm run dev 및 IntelliJ 백엔드 서버 실행

#### application-dev.yaml

```yaml
server:
  port: 8181
  ssl:
    enabled: true
    key-store: src/main/resources/bootsecurity.p12
    key-store-password: joowon
    key-store-type: PKCS12
    key-alias: bootsecurity

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ARENA?serverTimezone=Asia/Seoul
    username: jinjoowon
    password: root1234!
  jpa:
    database: mysql
    show-sql: true
    hibernate:
      ddl-auto: update
    generate-ddl: true
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
  redis:
    host: localhost
    port: 6379
rabbitmq:
  queue.name: arena.queue
  exchange.name: arena.exchange
  routing.key: arena.key
#spring:
#  datasource:
#    url: jdbc:h2:mem:testdb
#    driver-class-name: org.h2.Driver
#    username: sa
#    password: password
#  jpa:
#    database-platform: org.hibernate.dialect.H2Dialect
#    hibernate:
#      ddl-auto: create-drop

jwt:
  secret: vmfhaltmskdlstkfkdgodyroqkfwkdbalroqkfwkdbalaaaaaaaaaaaaaaaabbbbb
```


#### .env

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=root!
MYSQL_DATABASE=ARENA
MYSQL_USER=jinjoowon
MYSQL_PASSWORD=root1234!
SCHEMA=ARENA
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

## 배포 환경

- sudo docker-compose -f docker-compose.prod.yaml up -d 로 환경 구성
- /home/ubuntu/jenkins-data/workspace/FE/code-arena 경로에서 npm run build 이후 nohup npm start &
    - 3000 포트 실행 확인
- /home/ubuntu/jenkins-data/workspace/BE/arena 경로에서 sudo ./gradlew clean build -x test 이후 nohup sudo java --add-exports=java.base/sun.reflect.generics.reflectiveObjects=ALL-UNNAMED -jar build/libs/arena-0.0.1-SNAPSHOT.jar & 실행
    - 8181 포트 실행 확인


#### application-prod.yaml

```yaml
server:
  port: 8181
  ssl:
    enabled: true
    key-store: classpath:arena_keystore.p12
    key-store-password: mTUsTtpenoV88Old5gLO
    key-store-type: PKCS12
    key-alias: 1

spring:
  config:
    import: optional:file:.env[.properties]
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3666/ARENA?serverTimezone=Asia/Seoul
    username: ${MYSQL_USER}
    password: ${MYSQL_PASSWORD}
  jpa:
    database: mysql
    show-sql: true
    hibernate:
      ddl-auto: update
    generate-ddl: true
  rabbitmq:
    host: 127.0.0.1
    port: 8666
    username: ${RABBITMQ_DEFAULT_USER}
    password: ${RABBITMQ_DEFAULT_PASS}
    virtual-host: /
  redis:
    host: 127.0.0.1
    port: ${REDIS_PORT}

rabbitmq:
  queue.name: ${RABBITMQ_QUEUE_NAME}
  exchange.name: ${RABBITMQ_EXCHANGE_NAME}
  routing.key: ${RABBITMQ_ROUTING_KEY}

jwt:
  secret: ${JWT_SECRET}
```

#### docker-compose.prod.yaml

```yaml
services:
  db:
    image: mysql:latest
    container_name: db
    hostname: db
    ports:
      - 3666:3306
    env_file: .env
    environment:
      TZ: Asia/Seoul
    restart: always
    volumes:
      - ${DB_VOLUME}
  kurento-media-server:
    image: kurento/kurento-media-server:latest
    container_name: kurento-media-server
    restart: unless-stopped
    env_file: .env
    ports:
      - 8888:8888
    environment:
      - KMS_WS_INTERFACE=0.0.0.0
      - KMS_STUN_IP=stun.l.google.com
      - KMS_STUN_PORT=${KMS_STUN_PORT}
  redis:
    image: redis:latest
    container_name: redis
    env_file: .env
    ports:
      - ${REDIS_PORT}:6379
    restart: always
    tty: true
    volumes:
      - ${REDIS_VOLUME}:/data

  rabbitmq:
    image: rabbitmq:3-management
    hostname: rabbitmq
    container_name: rabbitmq
    volumes:
        - /home/ubuntu/rabbitmq-data/rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf
    entrypoint: >
      /bin/bash -c "
        rabbitmq-server &
        sleep 10 && rabbitmq-plugins enable rabbitmq_web_stomp &
        tail -f /dev/null
      "
    env_file: .env
    environment:
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_DEFAULT_USER}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_DEFAULT_PASS}
      RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS: "-rabbit tcp_listeners [8666]"
      ERL_EPMD_PORT: 8369
      RABBITMQ_WEB_STOMP_PORT: 8674
      RABBITMQ_STOMP_PORT: 8613
    ports:
      - 8666:8666
      - 8674:8674
      - 8369:8369
      - ${RABBITMQ_MANAGE_PORT}:15672
      - 8613:8613
    restart: always
    tty: true
  coturn:
    image: instrumentisto/coturn
    container_name: coturn
    env_file: .env
    ports:
      - 3478:3478       # TURN 서버 포트
      - 3478:3478/udp   # TURN 서버 포트 (UDP)
    environment:
      - TURN_PORT=3478
      - TURNSERVER_ENABLED=1
      - LISTEN_ON_PUBLIC_IP=0
      - TURN_USER=${COTURN_USER}
      - REALM=i11a807.p.ssafy.io
      - FINGERPRINTS=1
    volumes:
      - ${COTURN_CONF}

```

#### .env

```
SERVER_PORT=8181
SSL_KEYSTORE=src/main/resources/arena_keystore.p12
SSL_PASSWORD=mTUsTtpenoV88Old5gLO
SSL_TYPE=PKCS12
SSL_KEY_ALIAS=arena_keystore
SPRING_PROFILES_ACTIVE=prod
DB_PORT=3666
DB_USERNAME=admin_a807_hmsjhr
DB_PASSWORD=M!Qy4qmd1yB2yzgV
DB_VOLUME=/home/ubuntu/mysql-data:/var/lib/mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3666
MYSQL_ROOT_PASSWORD=M!Qy4qmd1yB2yzgV
MYSQL_DATABASE=ARENA
MYSQL_USER=admin_a807_hmsjhr
MYSQL_PASSWORD=M!Qy4qmd1yB2yzgV
MYSQL_URL=jdbc:mysql://127.0.0.1:3666/ARENA?serverTimezone=Asia/Seoul
SCHEMA=ARENA
RABBITMQ_DEFAULT_USER=a807_hdm_rabbitmq
RABBITMQ_DEFAULT_PASS=Gyg1Oo4Y40zCp5Kn6e4s
RABBITMQ_USERNAME=a807_hdm_rabbitmq
RABBITMQ_PASSWORD=Gyg1Oo4Y40zCp5Kn6e4s
RABBITMQ_HOST=127.0.0.1
RABBITMQ_PORT=8666
RABBITMQ_MANAGE_PORT=15672
RABBITMQ_RELAY_PORT=8613
RABBITMQ_QUEUE_NAME=arena.queue
RABBITMQ_EXCHANGE_NAME=arena.exchange
RABBITMQ_ROUTING_KEY=arena.key
REDIS_HOST=redis
REDIS_PORT=6300
REDIS_VOLUME=/home/ubuntu/redis-data:/data
JWT_SECRET=cy0ET5D4FlkXIWsXIhpPK32gajTcdyfLMr2qDhpE83g8fPKn4l93swCW7JvoWlUU
DC_NETWORKS=backend
DOMAIN_ADDR=i11a807.p.ssafy.io
KURENTO_PORT=8888
KMS_STUN_PORT=19302
COTURN_PORT=3400
COTURN_USER=a807_hdh_ctrn:g1xPT5EBXTc277R3HZzh
COTURN_CONF=/home/ubuntu/coturn-config/turnserver.conf:/etc/coturn/turnserver.conf

```

#### /etc/nginx/sites-available/default.conf

```
# server {
#   listen 80 default_server;
#   server_name _;
#
#   location ~* \.io {
#
#    root /home/ubuntu/jenkins-data/workspace/gitlab-deploy-token-ec2/FE;
#    index index.html index.htm;
#    try_files $uri $uri/ /index.html;
#
#    proxy_set_header X-Real-IP $remote_addr;
#    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#    proxy_set_header Host $http_host;
#    proxy_set_header X-NginX-Proxy false;
#
#    proxy_pass http://localhost:3000;
#    proxy_redirect off;
#
#    proxy_http_version 1.1;
#    proxy_set_header Upgrade $http_upgrade;
#    proxy_set_header Connection "upgrade";
#  }
#
# }

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name i11a807.p.ssafy.io;

    ssl_certificate /home/ubuntu/fullchain.pem;
    ssl_certificate_key /home/ubuntu/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location :3478/ {
        proxy_pass https://127.0.0.1:3478;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1/groupCall {
        proxy_pass https://127.0.0.1:8181;
        proxy_http_version 1.1;              # WebSocket을 지원하기 위해 HTTP/1.1 사용
        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "Upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location /api/v1/ {
        proxy_pass https://127.0.0.1:8181;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
   }

   location /api/v1/rabbitmq/ {
        proxy_pass https://127.0.0.1:8181;
        proxy_set_header Host $host;
        # proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        # proxy_set_header Connection "Upgrade";   # 연결을 업그레이드로 설정
        # proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
   }

   location /api/v1/rabbitmq/ws {
        proxy_pass https://127.0.0.1:8181;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
   }

   location /rabbitmq/ws {
        proxy_pass https://127.0.0.1:8181;

        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;

        proxy_set_header Origin "https://127.0.0.1";
        proxy_set_header X-Real-IP $remote_addr;
        add_header X-Frame-Options "";

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;  # WebSocket 연결 유지를 위한 타임아웃 설정
   }



   location /rabbitmq/ws/ {
        proxy_pass https://127.0.0.1:8181;

        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;

        proxy_set_header Origin "https://127.0.0.1";
        proxy_set_header X-Real-IP $remote_addr;
        add_header X-Frame-Options "";

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;  # WebSocket 연결 유지를 위한 타임아웃 설정
   }

   location /rabbitmq/ {
        proxy_pass https://127.0.0.1:8181;

        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;

        proxy_set_header Origin "https://127.0.0.1";
        add_header X-Frame-Options "";

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;  # WebSocket 연결 유지를 위한 타임아웃 설정
   }



   location /app/ {
        proxy_pass https://127.0.0.1:8181;

        proxy_set_header Upgrade $http_upgrade;  # WebSocket 업그레이드 처리
        proxy_set_header Connection "upgrade";   # 연결을 업그레이드로 설정
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 3600s;  # WebSocket 연결 유지를 위한 타임아웃 설정
   }

   location /sockjs-node/ {
        proxy_pass https://127.0.0.1:8181;  # Spring Boot 애플리케이션 주소

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }


}

```

# 외부 서비스 정보

- FE 내 chatGPT OpenAPI 사용 키 변경 필요

# 시연 시나리오

- UCC와 동일.