// lib/db.js
// Supabase 기반 데이터 저장소

const { createClient } = require('@supabase/supabase-js');

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

/**
 * 발행된 포스트 목록 조회
 */
async function getPublishedPosts(limit = 20, offset = 0) {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, meta_description, published_at, created_at, view_count, thumbnail_url, category')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[ERROR] 포스트 조회 실패:', error);
    return [];
  }

  return data.map(p => ({
    ...p,
    published_at: p.published_at || p.created_at,
    view_count: p.view_count || 0,
    category: p.category || 'life',
  }));
}

/**
 * 카테고리별 발행된 포스트 목록 조회
 */
async function getPublishedPostsByCategory(category, limit = 20, offset = 0) {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, meta_description, published_at, created_at, view_count, thumbnail_url, category')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[ERROR] 카테고리별 포스트 조회 실패:', error);
    return [];
  }

  return data.map(p => ({
    ...p,
    published_at: p.published_at || p.created_at,
    view_count: p.view_count || 0,
    category: p.category || 'life',
  }));
}

/**
 * Slug로 포스트 조회 (발행된 포스트만)
 */
async function getPostBySlug(slug) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('[ERROR] 포스트 조회 실패:', error);
    return null;
  }

  return data;
}

/**
 * Slug로 포스트 조회 (모든 상태 포함 - 관리자용)
 */
async function getPostBySlugAdmin(slug) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('[ERROR] 포스트 조회 실패:', error);
    return null;
  }

  return data;
}

/**
 * Draft 포스트 목록 조회
 */
async function getDraftPosts() {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, content, meta_description, thumbnail_url, created_at')
    .eq('status', 'draft')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ERROR] 드래프트 조회 실패:', error);
    return [];
  }

  return data;
}

/**
 * 포스트 상태 업데이트
 */
async function updatePostStatus(postId, status, scheduledAt = null) {
  const db = getSupabase();
  if (!db) return false;

  const updates = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  } else if (status === 'scheduled' && scheduledAt) {
    updates.scheduled_at = scheduledAt;
  }

  const { error } = await db
    .from('posts')
    .update(updates)
    .eq('id', postId);

  if (error) {
    console.error('[ERROR] 상태 업데이트 실패:', error);
    return false;
  }

  return true;
}

/**
 * 발행 예약된 포스트 조회
 */
async function getScheduledPosts() {
  const db = getSupabase();
  if (!db) return [];

  const now = new Date().toISOString();

  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, scheduled_at')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('[ERROR] 예약 포스트 조회 실패:', error);
    return [];
  }

  return data;
}

/**
 * 모든 발행된 포스트의 slug 조회 (SSG용)
 */
async function getAllPublishedSlugs() {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.error('[ERROR] Slug 조회 실패:', error);
    return [];
  }

  return data.map(p => p.slug);
}

/**
 * 포스트 저장 (새로 생성)
 */
async function createPost(postData) {
  const db = getSupabase();
  if (!db) return null;

  const newPost = {
    ...postData,
    status: postData.status || 'draft',
    view_count: 0,
    created_at: new Date().toISOString(),
    published_at: null,
  };

  const { data, error } = await db
    .from('posts')
    .insert(newPost)
    .select()
    .single();

  if (error) {
    console.error('[ERROR] 포스트 생성 실패:', error);
    return null;
  }

  return data;
}

/**
 * ID로 포스트 조회
 */
async function getPostById(postId) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('[ERROR] 포스트 조회 실패:', error);
    return null;
  }

  return data;
}

/**
 * 포스트 조회 (편집용)
 */
async function getPost(postId) {
  return getPostById(postId);
}

/**
 * 포스트 업데이트
 */
async function updatePost(postId, updates) {
  const db = getSupabase();
  if (!db) throw new Error('DB 연결 실패');

  const { data, error } = await db
    .from('posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('[ERROR] 포스트 업데이트 실패:', error);
    throw new Error('포스트를 찾을 수 없습니다.');
  }

  return data;
}

/**
 * 포스트 삭제
 */
async function deletePost(slug) {
  const db = getSupabase();
  if (!db) return false;

  const { error } = await db
    .from('posts')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('[ERROR] 포스트 삭제 실패:', error);
    return false;
  }

  console.log('[INFO] 포스트 삭제됨: ' + slug);
  return true;
}

/**
 * 조회수 증가
 */
async function incrementViewCount(slug) {
  const db = getSupabase();
  if (!db) return false;

  const { data: post } = await db
    .from('posts')
    .select('view_count')
    .eq('slug', slug)
    .single();

  if (!post) return false;

  const { error } = await db
    .from('posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('slug', slug);

  return !error;
}

/**
 * 데이터베이스 초기화
 */
function initDb() {
  console.log('[INFO] Supabase 연결 준비 완료');
}

// 비디오 및 알림 관련 함수들 (필요시 나중에 테이블 추가)
async function saveDiscoveredVideo(videoData) {
  console.log('[INFO] 비디오 저장 - 미구현');
  return true;
}

async function getDiscoveredVideos(keyword) {
  return [];
}

async function saveNotification(postId, type, status, message) {
  console.log('[INFO] 알림 저장 - 미구현');
  return true;
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
  incrementViewCount,
};
