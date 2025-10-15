/**
 * Seed Data Service
 * 
 * Initializes storage with sample ESG data, user contexts,
 * and preloaded demo content for MVP
 */

import { storage } from '../storage';
import { UserRole } from '@shared/schema';
import { 
  sampleAnomalies, 
  sampleAuditLogs, 
  sampleComplianceContexts 
} from '../../client/src/lib/sampleData';

export async function seedInitialData() {
  console.log('📊 Seeding initial ESG data...');

  // Create demo user contexts
  const userContexts = [
    {
      userId: 'user-123',
      role: UserRole.ANALYST,
      organizationId: 'org-456',
      organizationName: 'Acme Sustainability Corp',
      permissions: ['read:esg_data', 'read:reports', 'read:audit_logs', 'write:data'],
      dataScope: {
        entities: ['entity-dubai-hq', 'entity-abu-dhabi-plant', 'entity-sharjah-warehouse'],
        geographies: ['UAE', 'KSA']
      },
      preferences: {
        language: 'en',
        timezone: 'Asia/Dubai',
        notifications: true
      }
    },
    {
      userId: 'user-456',
      role: UserRole.AUDITOR,
      organizationId: 'org-456',
      organizationName: 'Acme Sustainability Corp',
      permissions: ['read:esg_data', 'read:reports', 'read:audit_logs'],
      dataScope: {
        entities: ['entity-dubai-hq', 'entity-abu-dhabi-plant', 'entity-sharjah-warehouse'],
        geographies: ['UAE', 'KSA']
      },
      preferences: {
        language: 'en',
        timezone: 'Asia/Dubai',
        notifications: true
      }
    },
    {
      userId: 'user-789',
      role: UserRole.SUPPLIER,
      organizationId: 'org-789',
      organizationName: 'Green Energy Supplies Ltd',
      permissions: ['read:esg_data', 'write:supplier_data'],
      dataScope: {
        entities: ['entity-supplier-456'],
        geographies: ['UAE']
      },
      preferences: {
        language: 'en',
        timezone: 'Asia/Dubai',
        notifications: false
      }
    }
  ];

  for (const context of userContexts) {
    try {
      await storage.createUserContext(context);
      console.log(`  ✓ Created user context for ${context.role}`);
    } catch (error) {
      console.log(`  - User context for ${context.userId} already exists`);
    }
  }

  console.log('✅ Initial data seeded successfully');
}

export async function seedOnStartup() {
  try {
    await seedInitialData();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
