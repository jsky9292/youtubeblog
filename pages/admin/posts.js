// pages/admin/posts.js
// 포스트 관리 페이지

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const categoryLabels = {
  auto: '자동차보험',
  health: '실손보험',
  life: '생명보험',
  property: '재물보험',
  dispute: '분쟁해결',
  cases: '실제사례',
  tools: '보험금진단',
};

export default function PostsManagement() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts/list');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('포스트 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost({ ...post });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/posts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: editingPost.id,
          title: editingPost.title,
          content: editingPost.content,
          meta_description: editingPost.meta_description,
          category: editingPost.category,
          thumbnail_url: editingPost.thumbnail_url,
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('저장되었습니다.');
        setShowModal(false);
        fetchPosts();
      } else {
        alert('오류: ' + data.error);
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (post) => {
    if (!confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch('/api/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: post.slug })
      });

      const data = await res.json();
      if (data.success) {
        alert('삭제되었습니다.');
        fetchPosts();
      } else {
        alert('오류: ' + data.error);
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const regenerateThumbnail = () => {
    if (!editingPost) return;
    const siteUrl = 'https://youtubeblog-rho.vercel.app';
    const newUrl = `${siteUrl}/api/og?title=${encodeURIComponent(editingPost.title)}`;
    setEditingPost({ ...editingPost, thumbnail_url: newUrl });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <>
      <Head>
        <title>포스트 관리 | 보담</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin/dashboard">
                  <span className="text-gray-500 hover:text-gray-700 cursor-pointer">← 대시보드</span>
                </Link>
                <h1 className="text-xl font-bold text-gray-900">포스트 관리</h1>
              </div>
              <div className="text-sm text-gray-500">
                총 {posts.length}개
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <p className="text-gray-500">포스트가 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">썸네일</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">카테고리</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">날짜</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {post.thumbnail_url ? (
                            <img
                              src={post.thumbnail_url}
                              alt=""
                              className="w-20 h-12 object-cover rounded"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                              없음
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 max-w-xs truncate">{post.title}</div>
                          <div className="text-xs text-gray-400 truncate">{post.slug}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {categoryLabels[post.category] || post.category}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-700' :
                            post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {post.status === 'published' ? '발행됨' : post.status === 'draft' ? '임시저장' : post.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(post.published_at || post.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(post)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"
                            >
                              수정
                            </button>
                            <a
                              href={`/posts/${post.slug}`}
                              target="_blank"
                              className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100"
                            >
                              보기
                            </a>
                            <button
                              onClick={() => handleDelete(post)}
                              className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 수정 모달 */}
      {showModal && editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">포스트 수정</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">메타 설명</label>
                  <textarea
                    value={editingPost.meta_description || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    value={editingPost.category || 'life'}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* 썸네일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingPost.thumbnail_url || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, thumbnail_url: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={regenerateThumbnail}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      자동생성
                    </button>
                  </div>
                  {editingPost.thumbnail_url && (
                    <img
                      src={editingPost.thumbnail_url}
                      alt="썸네일 미리보기"
                      className="mt-2 w-full max-w-xs rounded border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>

                {/* 본문 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">본문 (HTML)</label>
                  <textarea
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
                >
                  저장
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
