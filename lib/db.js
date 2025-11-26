// lib/db.js
// JSON 파일 기반 데이터 저장소

const fs = require('fs');
const path = require('path');

// 데이터 디렉토리 경로
const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

/**
 * 데이터 디렉토리 초기화
 */
function initDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // 파일들이 없으면 빈 배열로 초기화
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(VIDEOS_FILE)) {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * JSON 파일 읽기
 */
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`[ERROR] JSON 파일 읽기 실패: ${filePath}`, error);
    return [];
  }
}

/**
 * JSON 파일 쓰기
 */
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[DB] JSON 파일 쓰기 완료: ${filePath} (${data.length}개 항목)`);
    return true;
  } catch (error) {
    console.error(`[ERROR] JSON 파일 쓰기 실패: ${filePath}`, error);
    return false;
  }
}

/**
 * 발행된 포스트 목록 조회
 */
function getPublishedPosts(limit = 20, offset = 0) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  const published = posts
    .filter((p) => p.status === 'published')
    .sort((a, b) => {
      const dateA = a.published_at || a.created_at || '1970-01-01';
      const dateB = b.published_at || b.created_at || '1970-01-01';
      return new Date(dateB) - new Date(dateA);
    })
    .slice(offset, offset + limit);

  return published.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    meta_description: p.meta_description,
    published_at: p.published_at || p.created_at, // null이면 created_at 사용
    created_at: p.created_at,
    view_count: p.view_count || 0,
    thumbnail_url: p.thumbnail_url || null,
    category: p.category || 'life', // 기본 카테고리
  }));
}

/**
 * 카테고리별 발행된 포스트 목록 조회
 */
function getPublishedPostsByCategory(category, limit = 20, offset = 0) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  const published = posts
    .filter((p) => p.status === 'published' && (p.category === category || (!p.category && category === 'life')))
    .sort((a, b) => {
      const dateA = a.published_at || a.created_at || '1970-01-01';
      const dateB = b.published_at || b.created_at || '1970-01-01';
      return new Date(dateB) - new Date(dateA);
    })
    .slice(offset, offset + limit);

  return published.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    meta_description: p.meta_description,
    published_at: p.published_at || p.created_at,
    created_at: p.created_at,
    view_count: p.view_count || 0,
    thumbnail_url: p.thumbnail_url || null,
    category: p.category || 'life',
  }));
}

/**
 * Slug로 포스트 조회 (발행된 포스트만)
 */
function getPostBySlug(slug) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  const videos = readJsonFile(VIDEOS_FILE);

  const post = posts.find((p) => p.slug === slug && p.status === 'published');

  if (!post) return null;

  // 영상 정보 조합
  const video = videos.find((v) => v.video_id === post.video_id);

  return {
    ...post,
    channel_name: video?.channel_name || null,
    thumbnail_url: post.thumbnail_url || video?.thumbnail_url || null,
  };
}

/**
 * Slug로 포스트 조회 (모든 상태 포함 - 관리자용)
 */
function getPostBySlugAdmin(slug) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  const videos = readJsonFile(VIDEOS_FILE);

  const post = posts.find((p) => p.slug === slug);

  if (!post) return null;

  // 영상 정보 조합
  const video = videos.find((v) => v.video_id === post.video_id);

  return {
    ...post,
    channel_name: video?.channel_name || null,
    thumbnail_url: post.thumbnail_url || video?.thumbnail_url || null,
  };
}

/**
 * Draft 포스트 목록 조회
 */
function getDraftPosts() {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  return posts
    .filter((p) => p.status === 'draft')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      meta_description: p.meta_description,
      thumbnail_url: p.thumbnail_url,
      created_at: p.created_at,
    }));
}

/**
 * 포스트 상태 업데이트
 */
function updatePostStatus(postId, status, scheduledAt = null) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    console.error(`[ERROR] 포스트를 찾을 수 없습니다: ${postId}`);
    return false;
  }

  posts[postIndex].status = status;
  posts[postIndex].updated_at = new Date().toISOString();

  if (status === 'published') {
    posts[postIndex].published_at = new Date().toISOString();
  } else if (status === 'scheduled' && scheduledAt) {
    posts[postIndex].scheduled_at = scheduledAt;
  }

  return writeJsonFile(POSTS_FILE, posts);
}

/**
 * 발행 예약된 포스트 조회
 */
function getScheduledPosts() {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  const now = new Date().toISOString();

  return posts
    .filter((p) => p.status === 'scheduled' && p.scheduled_at <= now)
    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      scheduled_at: p.scheduled_at,
    }));
}

/**
 * 모든 발행된 포스트의 slug 조회 (SSG용)
 */
function getAllPublishedSlugs() {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  return posts.filter((p) => p.status === 'published').map((p) => p.slug);
}

/**
 * 발견된 영상 저장
 */
function saveDiscoveredVideo(videoData) {
  initDataDir();
  const videos = readJsonFile(VIDEOS_FILE);

  // 이미 존재하는 영상인지 확인
  const existingIndex = videos.findIndex((v) => v.video_id === videoData.video_id);

  if (existingIndex !== -1) {
    // 업데이트
    videos[existingIndex] = {
      ...videos[existingIndex],
      ...videoData,
      updated_at: new Date().toISOString(),
    };
  } else {
    // 새로 추가
    videos.push({
      id: videos.length + 1,
      ...videoData,
      selected: false,
      created_at: new Date().toISOString(),
    });
  }

  return writeJsonFile(VIDEOS_FILE, videos);
}

/**
 * 발견된 영상 목록 조회
 */
function getDiscoveredVideos(keyword) {
  initDataDir();
  const videos = readJsonFile(VIDEOS_FILE);

  return videos
    .filter((v) => v.keyword === keyword)
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 20);
}

/**
 * 포스트 저장 (새로 생성)
 */
function createPost(postData) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);

  const newPost = {
    id: posts.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1,
    ...postData,
    status: postData.status || 'draft',
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: null, // 기본값으로 null 설정 (발행되지 않은 상태)
  };

  posts.push(newPost);
  writeJsonFile(POSTS_FILE, posts);

  return newPost;
}

/**
 * ID로 포스트 조회
 */
function getPostById(postId) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  return posts.find((p) => p.id === postId);
}

/**
 * 알림 로그 저장
 */
function saveNotification(postId, type, status, message) {
  initDataDir();
  const notifications = readJsonFile(NOTIFICATIONS_FILE);

  notifications.push({
    id: notifications.length + 1,
    post_id: postId,
    type,
    status,
    message,
    sent_at: new Date().toISOString(),
  });

  return writeJsonFile(NOTIFICATIONS_FILE, notifications);
}

/**
 * 포스트 조회 (편집용)
 */
function getPost(postId) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  return posts.find((p) => p.id === postId);
}

/**
 * 포스트 업데이트
 */
function updatePost(postId, updates) {
  initDataDir();
  const posts = readJsonFile(POSTS_FILE);
  const index = posts.findIndex((p) => p.id === postId);

  if (index === -1) {
    throw new Error('포스트를 찾을 수 없습니다.');
  }

  posts[index] = {
    ...posts[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  writeJsonFile(POSTS_FILE, posts);
  return posts[index];
}

/**
 * 데이터베이스 초기화
 */
/**
 * 포스트 삭제
 */
function deletePost(slug) {
  initDataDir();

  const posts = readJsonFile(POSTS_FILE);
  const index = posts.findIndex(p => p.slug === slug);

  if (index === -1) {
    return false;
  }

  posts.splice(index, 1);
  writeJsonFile(POSTS_FILE, posts);

  console.log(`[INFO] 포스트 삭제됨: ${slug}`);
  return true;
}

function initDb() {
  initDataDir();
  console.log('[INFO] 데이터 디렉토리 초기화 완료');
}

module.exports = {
  initDb,
  getPublishedPosts,
  getPublishedPostsByCategory,
  getPostBySlug,
  getPostBySlugAdmin,
  getDraftPosts,
  updatePostStatus,
  getScheduledPosts,
  getAllPublishedSlugs,
  saveDiscoveredVideo,
  getDiscoveredVideos,
  createPost,
  getPostById,
  getPost,
  updatePost,
  saveNotification,
  deletePost,
};
