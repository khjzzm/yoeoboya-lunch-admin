export interface TokenIgnore {
  id: number;
  url: string;
  isIgnore: boolean;
}

export interface RoleResource {
  roleResourceId: number; // RoleResources 테이블의 ID
  roleDesc: string; // Role 설명
  resourceId: number; // Resource 테이블의 ID
  resourceName: string; // 리소스 이름
  resourceDesc: string; // 리소스 설명
  orderNum: number; // 리소스 순서
  resourceType: string; // 리소스 타입
  httpMethod: string; // HTTP 메서드 (GET, POST 등)
}

export interface AccessIpRequest {
  ipAddress: string;
  block: boolean;
  reason?: string;
  expiresAt?: string; // ISO 8601 형식의 문자열 (예: 2025-04-10T12:34:56)
  hitCount?: number;
}

export interface AccessIpResponse {
  id: number;
  ipAddress: string;
  block: boolean;
  reason?: string;
  expiresAt?: string;
  hitCount: number;
}

import { Dayjs } from "dayjs";
export interface AccessIpFormFields {
  ipAddress: string;
  block: boolean;
  reason?: string;
  expiresAt?: Dayjs;
}

export interface Role {
  loginId: string;
  email: string;
  name: string;
  provider: string;
  roleDesc: string;
  authority: string;
  enabled: boolean;
  accountNonLocked: boolean;
}
