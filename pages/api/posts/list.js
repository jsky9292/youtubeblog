// pages/api/posts/list.js
// 모든 포스트 조회 API (관리자용)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 필요한 필드만 선택하여 타임아웃 방지
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, meta_description, thumbnail_url, category, status, view_count, published_at, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      posts: data || []
    });
  } catch (error) {
    console.error('포스트 조회 오류:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      posts: []
    });
  }
}
