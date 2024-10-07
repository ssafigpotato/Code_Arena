# 1주차 - 진주원

### DB 설계

> 사용자와 그룹, 그룹에서 생성되는 라이브 인터뷰 방과 관련된 DB ERD를 설계하였습니다.
> 

![Untitled](https://lab.ssafy.com/s11-webmobile1-sub1/S11P11A807/uploads/501210df48c7a21be05db8bc1c56aa18/Untitled.png)

### Docker 구축

- dokcer-compose 파일을 통해 MySQL DB와 Kurento-media-server를 구축했습니다.

```java
services:
  db:
    image: mysql:8.0
    container_name: db
    ports:
      - 3306:3306
    env_file: .env
    environment:
      TZ: Asia/Seoul
    restart: always
    networks:
      - backend
  kurento-media-server:
    image: kurento/kurento-media-server:latest
    container_name: kurento-media-server
    restart: unless-stopped
    ports:
      - "8888:8888"
    environment:
      - KMS_STUN_IP=stun.l.google.com
      - KMS_STUN_PORT=19302
    networks:
      - backend

networks:
  backend:
```

### Group Logic

> Group과 관련된 로직을 작성하였습니다. 해당 사항은 아직 Merge되지 않아 Commit 기록과 구조로 대신하겠습니다.
> 

![Untitled](https://lab.ssafy.com/s11-webmobile1-sub1/S11P11A807/uploads/02a10491d34832588a521192d36ca4b3/Untitled_1.png)

![Untitled](https://lab.ssafy.com/s11-webmobile1-sub1/S11P11A807/uploads/fdbae6f7ce25b316c581a2ad8abdcebb/Untitled_2.png)
