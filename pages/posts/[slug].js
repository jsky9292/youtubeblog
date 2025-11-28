// pages/posts/[slug].js
// 포스트 상세 페이지

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getPostBySlug, getAllPublishedSlugs } from '../../lib/db';

export default function Post({ post }) {
  if (!post) {
    return (
      <Layout title="포스트를 찾을 수 없습니다">
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">포스트를 찾을 수 없습니다</h1>
          <a href="/" className="text-purple-600 hover:underline">홈으로 돌아가기</a>
        </div>
      </Layout>
    );
  }

  const [viewCount, setViewCount] = useState(post?.view_count || 0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (post?.slug) {
      // 페이지뷰 증가
      fetch('/api/increment-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: post.slug })
      }).then(res => res.json()).then(data => {
        if (data.success) setViewCount(data.view_count);
      }).catch(() => {});

      // 소셜 데이터 로드
      fetch(`/api/social-action?slug=${post.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLikes(data.data.likes || 0);
            setComments(data.data.comments || []);
          }
        }).catch(() => {});
    }
  }, [post?.slug]);

  const handleLike = async () => {
    if (liked) return;
    const res = await fetch(`/api/social-action?slug=${post.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like' })
    });
    const data = await res.json();
    if (data.success) {
      setLikes(data.likes);
      setLiked(true);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await fetch(`/api/social-action?slug=${post.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', comment: newComment, author: commentAuthor || '익명' })
    });
    const data = await res.json();
    if (data.success) {
      setComments([...comments, data.comment]);
      setNewComment('');
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post.title;
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다!');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else if (platform === 'kakao') {
      window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}`);
    }
  };

  if (!post) {
    return (
      <Layout title="포스트를 찾을 수 없습니다">
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            포스트를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600">요청하신 포스트가 존재하지 않습니다.</p>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString(
    'ko-KR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youtubeblog-rho.vercel.app';
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return (
    <Layout
      title={post.title}
      description={post.meta_description}
      keywords={Array.isArray(post.keywords) ? post.keywords.join(', ') : post.keywords}
      ogImage={post.thumbnail_url}
      article={true}
      publishedTime={post.published_at}
      modifiedTime={post.updated_at}
    >
      <Head>

        {/* Schema.org BlogPosting */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.meta_description,
              image: post.thumbnail_url || '',
              author: {
                '@type': 'Organization',
                name: '보험 & 손해사정 블로그',
              },
              publisher: {
                '@type': 'Organization',
                name: '보험 & 손해사정 블로그',
              },
              datePublished: post.published_at,
              dateModified: post.updated_at || post.published_at,
            }),
          }}
        />
      </Head>

      <article className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <time dateTime={post.published_at}>{formattedDate}</time>
              {post.channel_name && <span>출처: {post.channel_name}</span>}
              <span>조회수 {viewCount.toLocaleString()}</span>
            </div>
          </header>

            {/* 썸네일 */}
            {post.thumbnail_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}

            {/* 본문 */}
            <div
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />


            {/* 좋아요 & 공유 */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition ${
                    liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
                  <span className="font-medium">좋아요 {likes}</span>
                </button>

                <div className="flex gap-2">
                  <button onClick={() => handleShare('copy')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">📋 링크복사</button>
                  <button onClick={() => handleShare('twitter')} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm">𝕏</button>
                  <button onClick={() => handleShare('facebook')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">f</button>
                  <button onClick={() => handleShare('kakao')} className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm">💬</button>
                </div>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-6">댓글 {comments.length}개</h3>

              {/* 댓글 작성 폼 */}
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex gap-4 mb-3">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="닉네임 (선택)"
                    className="px-4 py-2 border border-gray-300 rounded-lg w-40"
                  />
                </div>
                <div className="flex gap-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해주세요..."
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 h-fit"
                  >
                    등록
                  </button>
                </div>
              </form>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{c.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">첫 댓글을 작성해보세요!</p>
                )}
              </div>
            </div>
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const slugs = await getAllPublishedSlugs();

    return {
      paths: slugs.map((slug) => ({
        params: { slug },
      })),
      fallback: 'blocking', // 새 글도 SSG
    };
  } catch (error) {
    console.error('getStaticPaths 에러:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        post,
      },
      revalidate: 3600, // 1시간마다 재생성
    };
  } catch (error) {
    console.error('getStaticProps 에러:', error);
    return {
      notFound: true,
      revalidate: 60,
    };
  }
}
