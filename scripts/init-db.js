// scripts/init-db.js
// 데이터베이스 (JSON 파일) 초기화 스크립트

const { initDb } = require('../lib/db');

console.log('🚀 데이터베이스 초기화 시작...');

try {
  initDb();
  console.log('✅ 데이터베이스 초기화 완료!');
  console.log('\n다음 파일들이 생성되었습니다:');
  console.log('- data/posts.json (포스트 데이터)');
  console.log('- data/videos.json (발견된 영상 데이터)');
  console.log('- data/notifications.json (알림 로그)');
  console.log('\n🎉 준비 완료! 이제 개발 서버를 시작할 수 있습니다.');
  console.log('실행: npm run dev');
} catch (error) {
  console.error('❌ 초기화 실패:', error);
  process.exit(1);
}
