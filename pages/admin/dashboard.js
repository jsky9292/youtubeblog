// pages/admin/dashboard.js
// 토스/뱅크샐러드 스타일 관리자 대시보드

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { getDraftPosts, getPublishedPosts } from '../../lib/db';
import { categories } from '../../lib/categories';

export default function Dashboard({ draftPosts: initialDrafts, publishedPosts: initialPublished, apiStatus }) {
  const [draftPosts, setDraftPosts] = useState(initialDrafts);
  const [publishedPosts, setPublishedPosts] = useState(initialPublished);
  const [selectedCategories, setSelectedCategories] = useState({});
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) { router.push('/admin/login'); return; }
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
        });
        const data = await res.json();
        if (data.success) { setIsAuthenticated(true); }
        else { localStorage.removeItem('adminToken'); router.push('/admin/login'); }
      } catch (err) { router.push('/admin/login'); }
      finally { setIsLoading(false); }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    try { await fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } }); } catch (err) {}
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleAction = async (postId, action, scheduledAt = null, category = null) => {
    try {
      const response = await fetch(`/api/posts/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, scheduledAt, category: category || selectedCategories[postId] || 'life' }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setDraftPosts(draftPosts.filter((p) => p.id !== postId));
      } else {
        alert('오류: ' + data.error);
      }
    } catch (error) {
      alert('오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;
    try {
      const response = await fetch('/api/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setPublishedPosts(publishedPosts.filter((p) => p.slug !== slug));
      } else {
        alert('오류: ' + data.error);
      }
    } catch (error) {
      alert('오류가 발생했습니다: ' + error.message);
    }
  };

  const handleSchedule = (postId) => {
    const scheduledAt = prompt('예약 시간을 입력하세요 (YYYY-MM-DD HH:MM):');
    if (scheduledAt) handleAction(postId, 'schedule', scheduledAt);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Layout title="관리자">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
              <p className="text-sm text-gray-500 mt-1">콘텐츠를 관리하세요</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/settings">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  설정
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* API 상태 알림 */}
          {(!apiStatus.youtube || !apiStatus.gemini) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">API 키 설정 필요</p>
                  <p className="text-sm text-amber-600 mt-1">
                    시스템을 사용하려면 API 키 설정이 필요합니다.{' '}
                    <Link href="/admin/settings" className="underline hover:no-underline">
                      설정으로 이동
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Link href="/admin/consultations">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-sm text-blue-600 mb-1">문의 관리</div>
                <div className="text-2xl font-bold text-blue-700">📋 보기</div>
              </div>
            </Link>
            <Link href="/admin/posts">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 hover:border-green-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-sm text-green-600 mb-1">포스트 관리</div>
                <div className="text-2xl font-bold text-green-700">📝 {publishedPosts.length}개</div>
              </div>
            </Link>
            <Link href="/">
              <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="text-sm text-gray-500 mb-1">블로그</div>
                <div className="text-2xl font-bold text-gray-900">보기 →</div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Draft 포스트 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">검토 대기</h2>
                <span className="text-sm text-gray-400">{draftPosts.length}개</span>
              </div>

              {draftPosts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-400 mb-4">검토할 포스트가 없습니다</p>
                  <Link href="/admin/discover">
                    <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      영상 검색하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {draftPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-gray-400 mb-3">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </p>

                      {/* 카테고리 선택 */}
                      <div className="mb-4">
                        <select
                          value={selectedCategories[post.id] || 'life'}
                          onChange={(e) => setSelectedCategories({...selectedCategories, [post.id]: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        >
                          {categories.filter(c => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/review/${post.slug}`}>
                          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            미리보기
                          </button>
                        </Link>
                        <Link href={`/admin/editor?id=${post.id}`}>
                          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            편집
                          </button>
                        </Link>
                        <button
                          onClick={() => handleAction(post.id, 'approve')}
                          className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          발행
                        </button>
                        <button
                          onClick={() => handleSchedule(post.id)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          예약
                        </button>
                        <button
                          onClick={() => { if (confirm('삭제하시겠습니까?')) handleAction(post.id, 'reject'); }}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 최근 발행 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">최근 발행</h2>
                <span className="text-sm text-gray-400">{publishedPosts.length}개</span>
              </div>

              {publishedPosts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-400">발행된 포스트가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {publishedPosts.slice(0, 10).map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-200 transition-colors">
                      <Link href={`/posts/${post.slug}`}>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>{new Date(post.published_at).toLocaleDateString('ko-KR')}</span>
                        <span>조회 {post.view_count}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/posts/${post.slug}`}>
                          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            보기
                          </button>
                        </Link>
                        <Link href={`/admin/editor?slug=${post.slug}`}>
                          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            수정
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const { validateApiKeys } = require('../../lib/config');
    const draftPosts = await getDraftPosts();
    const publishedPosts = await getPublishedPosts(10, 0);
    const apiStatus = validateApiKeys();

    return {
      props: { draftPosts, publishedPosts, apiStatus },
    };
  } catch (error) {
    console.error('관리자 대시보드 데이터 조회 실패:', error);
    return {
      props: {
        draftPosts: [],
        publishedPosts: [],
        apiStatus: { youtube: false, gemini: false, telegram: false },
      },
    };
  }
}
