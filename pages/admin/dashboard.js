// pages/admin/dashboard.js
// 관리자 대시보드 (개선된 UI)

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

  // 인증 체크
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

  // 로그아웃
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, scheduledAt, category: category || selectedCategories[postId] || 'life' }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        // Draft 목록에서 제거
        setDraftPosts(draftPosts.filter((p) => p.id !== postId));
      } else {
        alert('오류: ' + data.error);
      }
    } catch (error) {
      alert('오류가 발생했습니다: ' + error.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await fetch('/api/posts/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        // 목록에서 제거
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
    if (scheduledAt) {
      handleAction(postId, 'schedule', scheduledAt);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 미인증
  if (!isAuthenticated) { return null; }

  return (
    <Layout title="관리자 대시보드">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">블로그 콘텐츠를 관리하세요</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/settings">
                <button className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
                  <span className="mr-2">⚙️</span>
                  설정
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                🚪 로그아웃
              </button>
            </div>
          </div>

          {/* API 상태 알림 */}
          {(!apiStatus.youtube || !apiStatus.gemini) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    API 키 설정 필요
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>시스템을 사용하려면 API 키 설정이 필요합니다.</p>
                    <Link href="/admin/settings">
                      <span className="font-medium text-yellow-800 hover:text-yellow-900 underline cursor-pointer">
                        설정 페이지로 이동 →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/discover">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">영상 검색</p>
                    <p className="text-3xl font-bold mt-2">🔍</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-blue-100 text-sm mt-4">YouTube에서 인기 영상 찾기</p>
              </div>
            </Link>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">검토 대기</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {draftPosts.length}
                  </p>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <span className="text-3xl">📝</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">Draft 포스트</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">발행 완료</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {publishedPosts.length}
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">Published 포스트</p>
            </div>

            <Link href="/">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">블로그 보기</p>
                    <p className="text-3xl font-bold mt-2">🏠</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
                <p className="text-purple-100 text-sm mt-4">공개 블로그로 이동</p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Draft 포스트 목록 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">📝 검토 대기</h2>
                <span className="text-sm text-gray-500">{draftPosts.length}개</span>
              </div>

              {draftPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500">검토할 포스트가 없습니다</p>
                  <Link href="/admin/discover">
                    <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                      영상 검색하기
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </p>

                      {/* 카테고리 선택 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 선택</label>
                        <select
                          value={selectedCategories[post.id] || 'life'}
                          onChange={(e) => setSelectedCategories({...selectedCategories, [post.id]: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {categories.filter(c => c.id !== 'all').map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/review/${post.slug}`}>
                          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm">
                            👁️ 미리보기
                          </button>
                        </Link>
                        <Link href={`/admin/editor?id=${post.id}`}>
                          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm">
                            ✏️ 편집
                          </button>
                        </Link>
                        <button
                          onClick={() => handleAction(post.id, 'approve')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          ✅ 즉시 발행
                        </button>
                        <button
                          onClick={() => handleSchedule(post.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          📅 예약
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('정말 삭제하시겠습니까?')) {
                              handleAction(post.id, 'reject');
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          🗑️ 삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 최근 발행 포스트 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">✅ 최근 발행</h2>
                <span className="text-sm text-gray-500">{publishedPosts.length}개</span>
              </div>

              {publishedPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500">발행된 포스트가 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedPosts.slice(0, 10).map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all">
                      <Link href={`/posts/${post.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>
                          📅 {new Date(post.published_at).toLocaleDateString('ko-KR')}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {post.view_count}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/posts/${post.slug}`}>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm">
                            👁️ 보기
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                        >
                          🗑️ 삭제
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
      props: {
        draftPosts,
        publishedPosts,
        apiStatus,
      },
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
