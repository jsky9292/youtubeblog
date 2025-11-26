-- 보험 블로그 자동화 데이터베이스 스키마
-- SQLite 3

-- 키워드 관리 테이블
CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT UNIQUE NOT NULL,
    search_count INTEGER DEFAULT 0,
    last_searched TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 발굴된 영상 테이블
CREATE TABLE IF NOT EXISTS discovered_videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT UNIQUE NOT NULL,
    keyword TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_name TEXT,
    view_count INTEGER,
    like_count INTEGER,
    published_at TIMESTAMP,
    thumbnail_url TEXT,
    selected BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 포스트 테이블
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id TEXT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    keywords TEXT,
    status TEXT DEFAULT 'draft', -- draft, scheduled, published
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES discovered_videos(video_id)
);

-- 알림 로그 테이블
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    type TEXT, -- telegram, email
    status TEXT, -- success, failed
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_videos_keyword ON discovered_videos(keyword);
CREATE INDEX IF NOT EXISTS idx_videos_video_id ON discovered_videos(video_id);

-- 초기 데이터 (테스트용 키워드)
INSERT OR IGNORE INTO keywords (keyword) VALUES
    ('손해사정사 비용'),
    ('자동차 보험 청구 방법'),
    ('실손보험 청구 서류');

-- 데이터베이스 최적화 설정
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;
PRAGMA temp_store = MEMORY;
