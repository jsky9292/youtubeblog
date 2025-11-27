// lib/db.js
// Supabase 기반 데이터 저장소

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

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

async function getPostBySlug(slug) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return null;
  return data;
}

async function getPostBySlugAdmin(slug) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}

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

async function updatePostStatus(postId, status, scheduledAt = null) {
  const db = getSupabase();
  if (!db) return false;

  const updates = { status };
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  } else if (status === 'scheduled' && scheduledAt) {
    updates.scheduled_at = scheduledAt;
  }

  const { error } = await db
    .from('posts')
    .update(updates)
    .eq('id', postId);

  return !error;
}

async function getScheduledPosts() {
  const db = getSupabase();
  if (!db) return [];

  const now = new Date().toISOString();
  const { data, error } = await db
    .from('posts')
    .select('id, title, slug, scheduled_at')
    .eq('status', 'scheduled')
    .lte('scheduled_at', now);

  if (error) return [];
  return data;
}

async function getAllPublishedSlugs() {
  const db = getSupabase();
  if (!db) return [];

  const { data, error } = await db
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  if (error) return [];
  return data.map(p => p.slug);
}

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

async function getPostById(postId) {
  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) return null;
  return data;
}

async function getPost(postId) {
  return getPostById(postId);
}

async function updatePost(postId, updates) {
  const db = getSupabase();
  if (!db) throw new Error('DB 연결 실패');

  const { data, error } = await db
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('[ERROR] 포스트 업데이트 실패:', error);
    throw new Error('포스트를 찾을 수 없습니다.');
  }

  return data;
}

async function deletePost(slug) {
  const db = getSupabase();
  if (!db) return false;

  const { error } = await db
    .from('posts')
    .delete()
    .eq('slug', slug);

  return !error;
}

async function saveDiscoveredVideo(videoData) {
  return true;
}

async function getDiscoveredVideos(keyword) {
  return [];
}

async function saveNotification(postId, type, status, message) {
  return true;
}

function initDb() {
  console.log('[INFO] Supabase 연결 준비 완료');
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
