# ✅ Next.js 15 지원하는 공식 이미지 사용
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# 의존성 설치
RUN npm install --frozen-lockfile

# 앱 코드 복사
COPY . .

# 환경 변수 빌드 시점에 설정
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Next.js 빌드
RUN npm run build

# 실행 단계 (작은 이미지로)
FROM node:20-alpine

WORKDIR /app

# 빌드된 파일 복사
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 포트 노출
EXPOSE 3001

# Next.js 실행
CMD ["npm", "run", "start"]