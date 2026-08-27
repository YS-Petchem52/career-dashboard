// scripts/migrate-to-supabase.ts
// Supabase로 mockData 마이그레이션 스크립트

import { createClient } from '@supabase/supabase-js';
import {
  COMPANIES_DATA,
  CERTIFICATIONS_DATA,
  CERTIFICATION_ROUTES,
  SECTOR_TRENDS,
  USER_CERTIFICATIONS,
} from '../src/data/mockData';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface MigrationStats {
  tableName: string;
  total: number;
  success: number;
  failed: number;
}

const stats: MigrationStats[] = [];

/**
 * Companies 테이블 마이그레이션
 */
async function migrateCompanies() {
  console.log('\n📦 Companies 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    try {
      const { error } = await supabase
        .from('companies')
        .insert({
          id: company.id,
          name: company.name,
          english_name: company.englishName,
          logo_url: company.logo,
          industry: company.industry,
          industry_detail: company.industryDetail,
          location: company.location,
          sector: company.sector,
          is_popular_rank: company.isPopularRank || null,
          description: company.description,
          business_process: company.businessProcess,
          openings_count: company.openingsCount,
        });

      if (error) {
        console.error(`  ❌ ${company.name} 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${company.name} 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Companies: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'companies', total: COMPANIES_DATA.length, success, failed });
}

/**
 * Company_Characteristics 테이블 마이그레이션
 */
async function migrateCharacteristics() {
  console.log('\n📦 Company_Characteristics 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    try {
      const { error } = await supabase
        .from('company_characteristics')
        .insert({
          company_id: company.id,
          salary: company.characteristics.salary,
          welfare: company.characteristics.welfare,
          work_life_balance: company.characteristics.workLifeBalance,
          safety: company.characteristics.safety,
          growth: company.characteristics.growth,
          stability: company.characteristics.stability,
        });

      if (error) {
        console.error(`  ❌ ${company.name} 특성 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${company.name} 특성 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Company_Characteristics: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'company_characteristics', total: COMPANIES_DATA.length, success, failed });
}

/**
 * Company_Stats 테이블 마이그레이션
 */
async function migrateStats() {
  console.log('\n📦 Company_Stats 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    try {
      const { error } = await supabase
        .from('company_stats')
        .insert({
          company_id: company.id,
          employees: company.stats.employees,
          avg_salary: company.stats.avgSalary,
          established_year: company.stats.establishedYear,
          shift_system: company.stats.shiftSystem,
        });

      if (error) {
        console.error(`  ❌ ${company.name} 통계 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${company.name} 통계 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Company_Stats: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'company_stats', total: COMPANIES_DATA.length, success, failed });
}

/**
 * Company_Benefits 테이블 마이그레이션
 */
async function migrateCompanyBenefits() {
  console.log('\n📦 Company_Benefits 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    for (let index = 0; index < (company.benefits?.length || 0); index++) {
      const benefit = company.benefits![index];
      try {
        const { error } = await supabase
          .from('company_benefits')
          .insert({
            company_id: company.id,
            icon: benefit.icon,
            title: benefit.title,
            description: benefit.description,
            order_index: index,
          });

        if (error) {
          console.error(`  ❌ ${company.name} 복지 실패:`, error.message);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error(`  ❌ ${company.name} 복지 오류:`, err);
        failed++;
      }
    }
  }

  console.log(`✅ Company_Benefits: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'company_benefits', total: COMPANIES_DATA.reduce((sum, c) => sum + (c.benefits?.length || 0), 0), success, failed });
}

/**
 * Company_Reviews 테이블 마이그레이션
 */
async function migrateCompanyReviews() {
  console.log('\n📦 Company_Reviews 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    for (const review of company.reviews || []) {
      try {
        const { error } = await supabase
          .from('company_reviews')
          .insert({
            company_id: company.id,
            rating: review.rating,
            review_date: review.date,
            role: review.role,
            title: review.title,
            content: review.content,
          });

        if (error) {
          console.error(`  ❌ ${company.name} 리뷰 실패:`, error.message);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error(`  ❌ ${company.name} 리뷰 오류:`, err);
        failed++;
      }
    }
  }

  console.log(`✅ Company_Reviews: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'company_reviews', total: COMPANIES_DATA.reduce((sum, c) => sum + (c.reviews?.length || 0), 0), success, failed });
}

/**
 * Company_Tags 테이블 마이그레이션
 */
async function migrateCompanyTags() {
  console.log('\n📦 Company_Tags 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const company of COMPANIES_DATA) {
    for (let index = 0; index < (company.tags?.length || 0); index++) {
      const tag = company.tags![index];
      try {
        const { error } = await supabase
          .from('company_tags')
          .insert({
            company_id: company.id,
            tag: tag,
            order_index: index,
          });

        if (error) {
          console.error(`  ❌ ${company.name} 태그 실패:`, error.message);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error(`  ❌ ${company.name} 태그 오류:`, err);
        failed++;
      }
    }
  }

  console.log(`✅ Company_Tags: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'company_tags', total: COMPANIES_DATA.reduce((sum, c) => sum + (c.tags?.length || 0), 0), success, failed });
}

/**
 * Sector_Trends 테이블 마이그레이션
 */
async function migrateSectorTrends() {
  console.log('\n📦 Sector_Trends 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const trend of SECTOR_TRENDS) {
    try {
      const { error } = await supabase
        .from('sector_trends')
        .insert({
          sector: trend.sector,
          english_name: trend.englishName,
          icon: trend.icon,
          current_status: trend.currentStatus,
          market_size: trend.marketSize,
          growth_rate: trend.growthRate,
          outlook_status: trend.outlookStatus,
          future_outlook: trend.futureOutlook,
          salary_trend: trend.salaryTrend,
          job_outlook: trend.jobOutlook,
        });

      if (error) {
        console.error(`  ❌ ${trend.sector} 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${trend.sector} 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Sector_Trends: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'sector_trends', total: SECTOR_TRENDS.length, success, failed });
}

/**
 * Certifications 테이블 마이그레이션
 */
async function migrateCertifications() {
  console.log('\n📦 Certifications 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const cert of CERTIFICATIONS_DATA) {
    try {
      const { error } = await supabase
        .from('certifications')
        .insert({
          id: cert.id,
          name: cert.name,
          category: cert.category,
          issuer: cert.issuer,
          difficulty: cert.difficulty,
          test_type: ['cert-7', 'cert-9', 'cert-10', 'cert-11', 'cert-12'].includes(cert.id) ? 'written' : 'practical',
          passing_rate: cert.passingRate,
          exam_fee: cert.examFee,
        });

      if (error) {
        console.error(`  ❌ ${cert.name} 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${cert.name} 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Certifications: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'certifications', total: CERTIFICATIONS_DATA.length, success, failed });
}

/**
 * Certification_Routes 테이블 마이그레이션
 */
async function migrateCertificationRoutes() {
  console.log('\n📦 Certification_Routes 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const route of CERTIFICATION_ROUTES) {
    try {
      const { error } = await supabase
        .from('certification_routes')
        .insert({
          id: route.id,
          title: route.title,
          description: route.description,
          estimated_duration: route.estimatedDuration,
          difficulty: route.difficulty,
          priority: route.priority,
        });

      if (error) {
        console.error(`  ❌ ${route.title} 실패:`, error.message);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error(`  ❌ ${route.title} 오류:`, err);
      failed++;
    }
  }

  console.log(`✅ Certification_Routes: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'certification_routes', total: CERTIFICATION_ROUTES.length, success, failed });
}

/**
 * Certification_Routes_Items 테이블 마이그레이션
 */
async function migrateCertificationRoutesItems() {
  console.log('\n📦 Certification_Routes_Items 마이그레이션 시작...');
  
  let success = 0;
  let failed = 0;

  for (const route of CERTIFICATION_ROUTES) {
    for (let index = 0; index < (route.route?.length || 0); index++) {
      const certId = route.route![index];
      try {
        const { error } = await supabase
          .from('certification_routes_items')
          .insert({
            route_id: route.id,
            certification_id: certId,
            order_index: index,
          });

        if (error) {
          console.error(`  ❌ ${route.title} - ${certId} 실패:`, error.message);
          failed++;
        } else {
          success++;
        }
      } catch (err) {
        console.error(`  ❌ ${route.title} - ${certId} 오류:`, err);
        failed++;
      }
    }
  }

  console.log(`✅ Certification_Routes_Items: ${success}개 저장, ${failed}개 실패`);
  stats.push({ tableName: 'certification_routes_items', total: CERTIFICATION_ROUTES.reduce((sum, r) => sum + (r.route?.length || 0), 0), success, failed });
}

/**
 * 마이그레이션 실행
 */
async function runMigration() {
  console.log('🚀 Supabase 마이그레이션 시작...\n');

  try {
    await migrateCompanies();
    await migrateCharacteristics();
    await migrateStats();
    await migrateCompanyBenefits();
    await migrateCompanyReviews();
    await migrateCompanyTags();
    await migrateSectorTrends();
    await migrateCertifications();
    await migrateCertificationRoutes();
    await migrateCertificationRoutesItems();

    // 결과 요약
    console.log('\n\n📊 마이그레이션 결과 요약:');
    console.log('═'.repeat(60));
    
    const totalRows = stats.reduce((sum, s) => sum + s.total, 0);
    const totalSuccess = stats.reduce((sum, s) => sum + s.success, 0);
    const totalFailed = stats.reduce((sum, s) => sum + s.failed, 0);

    stats.forEach(stat => {
      const successRate = ((stat.success / stat.total) * 100).toFixed(1);
      console.log(`${stat.tableName.padEnd(30)} | 총: ${stat.total.toString().padEnd(4)} | 성공: ${stat.success.toString().padEnd(4)} | 실패: ${stat.failed.toString().padEnd(4)} | ${successRate}%`);
    });

    console.log('═'.repeat(60));
    console.log(`전체: ${totalRows}개 | 성공: ${totalSuccess}개 | 실패: ${totalFailed}개 | ${((totalSuccess / totalRows) * 100).toFixed(1)}%`);
    console.log('\n✅ 마이그레이션 완료!');

  } catch (error) {
    console.error('\n❌ 마이그레이션 중 오류 발생:', error);
    process.exit(1);
  }
}

// 실행
runMigration().catch(console.error);
