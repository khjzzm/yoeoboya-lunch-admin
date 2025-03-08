# Next.js 15 지원하는 공식 이미지 사용
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사 (의존성 캐싱 최적화)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# 의존성 설치 (캐싱 활용하여 빌드 속도 향상)
RUN npm install --frozen-lockfile

# Next.js 앱 코드 복사
COPY . .

# Next.js 빌드 실행
RUN npm run build

# 실행 단계 (경량화된 이미지 사용)
FROM node:20-alpine

WORKDIR /app

# 빌드된 파일 복사 (필요한 파일만 복사하여 용량 최적화)
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 런타임 환경 변수 적용 (빌드된 코드에서 API URL 변경 가능)
ENTRYPOINT ["sh", "-c", "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL npm run start -p 3001"]
