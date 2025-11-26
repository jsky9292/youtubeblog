import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { getDraftPosts } from '../../../lib/db';

export default function ReviewPost({ post }) {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  if (!post) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-red-600">포스트를 찾을 수 없습니다.</p>
        </div>
      </AdminLayout>
    );
  }

  const handlePublish = async () => {
    if (!confirm('이 글을 발행하시겠습니까?')) return;

    setPublishing(true);
    try {
      const res = await fetch('/api/posts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ 발행되었습니다!');
        router.push('/admin/dashboard');
      } else {
        alert('발행 실패: ' + data.error);
      }
    } catch (err) {
      alert('발행 중 오류 발생');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* 상단 액션 바 */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center sticky top-0 z-10">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← 돌아가기
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/editor?id=${post.id}`)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              ✏️ 편집
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {publishing ? '발행 중...' : '✅ 발행'}
            </button>
          </div>
        </div>

        {/* 포스트 미리보기 */}
        <article className="bg-white rounded-lg shadow-md p-8">
          {/* 썸네일 */}
          {post.thumbnail_url && (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full rounded-lg mb-6"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/1280/720?random=' + post.id;
              }}
            />
          )}

          {/* 제목 */}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="text-sm text-gray-500 mb-6 pb-6 border-b">
            <p>작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
            {post.meta_description && (
              <p className="mt-2 text-gray-600">📄 {post.meta_description}</p>
            )}
          </div>

          {/* 본문 */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const drafts = getDraftPosts();
  const post = drafts.find((p) => p.slug === slug);

  console.log('[Review] Slug:', slug);
  console.log('[Review] Post found:', !!post);
  console.log('[Review] Content length:', post?.content?.length || 0);

  return {
    props: {
      post: post || null
    }
  };
}
