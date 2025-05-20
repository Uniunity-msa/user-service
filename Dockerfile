# 1. Node.js 베이스 이미지 사용
FROM node:18

# 2. 컨테이너 내부 작업 디렉토리 지정
WORKDIR /app

# 3. package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 코드 복사
COPY . .

# 5. 앱이 사용하는 포트 열기 (ex: 3000)
# 마이크로 서비스마다 포트 번호 다르게 하기
EXPOSE 3004

# 6. 서버 실행
CMD node server.js 
