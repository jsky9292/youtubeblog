// pages/api/upload-base64.js
// base64 이미지를 Supabase Storage에 업로드

const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Data } = req.body;

    if (!base64Data) {
      return res.status(400).json({ success: false, error: 'base64 데이터가 없습니다.' });
    }

    // data:image/png;base64,xxxx 형식에서 순수 base64 추출
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, error: '잘못된 base64 형식입니다.' });
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');

    // 이미지 최적화
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70, progressive: true })
      .toBuffer();

    const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

    const { data, error } = await supabase.storage
      .from('thumbnails')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('[ERROR] Storage 업로드 실패:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    const { data: urlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(fileName);

    console.log('[INFO] base64 이미지 업로드 성공:', urlData.publicUrl);

    return res.status(200).json({
      success: true,
      url: urlData.publicUrl
    });

  } catch (error) {
    console.error('[ERROR] base64 업로드 실패:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
