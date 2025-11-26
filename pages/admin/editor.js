import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import TiptapEditor from '../../components/TiptapEditor';
import { getAllCategories } from '../../lib/categories';

export default function PostEditor() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [category, setCategory] = useState('life');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/posts/get?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setPost(data.post);
        setTitle(data.post.title);
        setContent(data.post.content);
        setMetaDescription(data.post.meta_description || '');
        setCategory(data.post.category || 'life');
        setThumbnailUrl(data.post.thumbnail_url || '');
      }
    } catch (err) {
      console.error('포스트 로드 실패:', err);
      alert('포스트를 불러올 수 없습니다.');
    }
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id),
          title,
          content,
          meta_description: metaDescription,
          category,
          thumbnail_url: thumbnailUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ 저장되었습니다!');
        router.push('/admin/dashboard');
      } else {
        alert('저장 실패: ' + data.message);
      }
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const regenerateThumbnail = async () => {
    if (!confirm('썸네일을 다시 생성하시겠습니까?')) return;

    const prompt = window.prompt('썸네일 프롬프트를 입력하세요 (영어):', '');
    if (!prompt) return;

    setSaving(true);
    try {
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postTitle: title, thumbnailPrompt: prompt })
      });
      const data = await res.json();
      if (data.success) {
        setThumbnailUrl(data.imageUrl);
        alert('✅ 썸네일이 생성되었습니다!');
      } else {
        alert('생성 실패: ' + data.message);
      }
    } catch (err) {
      alert('썸네일 생성 실패');
    } finally {
      setSaving(false);
    }
  };

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">✏️ 포스트 편집</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              취소
            </button>
            <button
              onClick={savePost}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? '저장 중...' : '💾 저장'}
            </button>
          </div>
        </div>

        {/* 썸네일 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🖼️ 썸네일 이미지</h2>
          <div className="mb-4">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="썸네일"
                className="w-full max-w-2xl rounded-lg border shadow-sm"
                onError={(e) => {
                  e.target.src = 'https://picsum.photos/1280/720?random=' + post.id;
                }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="썸네일 URL"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={regenerateThumbnail}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              🎨 AI 재생성
            </button>
          </div>
        </div>

        {/* 제목 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📝 제목</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg font-medium"
            placeholder="블로그 제목"
          />
        </div>

        {/* 카테고리 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📂 카테고리</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-lg"
          >
            {getAllCategories().map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 메타 설명 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 메타 설명 (SEO)</h2>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows="3"
            placeholder="SEO용 메타 설명 (130-150자)"
          />
          <p className="text-sm text-gray-500 mt-2">
            현재 {metaDescription.length}자 / 권장 130-150자
          </p>
        </div>

        {/* 본문 에디터 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📄 본문 내용</h2>
          <TiptapEditor content={content} onChange={setContent} />
          <p className="text-sm text-gray-500 mt-4">
            💡 네이버 블로그처럼 편집하세요. 이미지, 링크, 표, 동영상, 서식 모두 가능합니다.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
