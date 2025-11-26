// lib/categories.js
// 블로그 카테고리 시스템

export const categories = [
  {
    id: 'all',
    name: '전체',
    slug: 'all',
    description: '모든 카테고리의 글',
    icon: '📚'
  },
  {
    id: 'life',
    name: '생활정보',
    slug: 'life',
    description: '일상생활에 유용한 정보',
    icon: '🏠'
  },
  {
    id: 'health',
    name: '건강',
    slug: 'health',
    description: '건강과 웰빙 정보',
    icon: '💪'
  },
  {
    id: 'finance',
    name: '재테크',
    slug: 'finance',
    description: '금융과 재테크 정보',
    icon: '💰'
  },
  {
    id: 'tech',
    name: '기술',
    slug: 'tech',
    description: 'IT 및 기술 트렌드',
    icon: '💻'
  },
  {
    id: 'food',
    name: '요리/맛집',
    slug: 'food',
    description: '요리 레시피와 맛집 정보',
    icon: '🍽️'
  },
  {
    id: 'travel',
    name: '여행',
    slug: 'travel',
    description: '국내외 여행 정보',
    icon: '✈️'
  },
  {
    id: 'hobby',
    name: '취미/문화',
    slug: 'hobby',
    description: '취미와 문화 생활',
    icon: '🎨'
  }
];

/**
 * 카테고리 ID로 카테고리 정보 가져오기
 */
export function getCategoryById(id) {
  return categories.find(cat => cat.id === id) || categories[0];
}

/**
 * 카테고리 slug로 카테고리 정보 가져오기
 */
export function getCategoryBySlug(slug) {
  return categories.find(cat => cat.slug === slug) || categories[0];
}

/**
 * 모든 카테고리 목록 (전체 제외)
 */
export function getAllCategories() {
  return categories.filter(cat => cat.id !== 'all');
}
