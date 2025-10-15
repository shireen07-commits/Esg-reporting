/**
 * Authentication Service
 * 
 * Mock JWT token verification for MVP
 * In production, this would validate real JWT tokens
 */

import type { UserRoleType } from '@shared/schema';

export interface JWTPayload {
  sub: string; // user-id
  org_id: string;
  role: UserRoleType;
  permissions: string[];
  data_scope: {
    entities: string[];
    geographies: string[];
  };
  exp: number;
  iat: number;
}

/**
 * Mock JWT verification - returns user context from token
 * In production, this would use jsonwebtoken library
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // For MVP, we accept any Bearer token and return mock user data
    // In production: jwt.verify(token, process.env.JWT_SECRET)
    
    if (!token || !token.startsWith('Bearer ')) {
      return null;
    }

    // Mock decoded payload based on token suffix for demo
    const mockPayload: JWTPayload = {
      sub: 'user-123',
      org_id: 'org-456',
      role: 'ESG_ANALYST',
      permissions: [
        'read:esg_data',
        'read:reports',
        'read:audit_logs'
      ],
      data_scope: {
        entities: ['entity-dubai-hq', 'entity-abu-dhabi-plant'],
        geographies: ['UAE', 'KSA']
      },
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    };

    return mockPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate mock JWT token for testing
 */
export function generateMockToken(userId: string, role: UserRoleType): string {
  return `Bearer mock-jwt-token-${userId}-${role}`;
}

/**
 * Validate user permissions
 */
export function hasPermission(payload: JWTPayload, permission: string): boolean {
  return payload.permissions.includes(permission);
}

/**
 * Check if user can access entity
 */
export function canAccessEntity(payload: JWTPayload, entityId: string): boolean {
  return payload.data_scope.entities.includes(entityId);
}
