import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useCallback, useEffect } from 'react';

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Preserve inline styles and attributes
        paragraph: {
          HTMLAttributes: {
            style: 'white-space: pre-wrap;',
          },
        },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
        style: 'font-family: "Noto Sans KR", "Malgun Gothic", sans-serif;',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return <div className="p-4 text-gray-500">에디터 로딩 중...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* 툴바 */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* 텍스트 서식 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300 font-bold' : ''}`}
            title="굵게 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
            title="기울임 (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
            title="밑줄 (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
            title="취소선"
          >
            <s>S</s>
          </button>
        </div>

        {/* 제목 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            title="제목 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            title="제목 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
            title="제목 3"
          >
            H3
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
            title="왼쪽 정렬"
          >
            ⬅
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
            title="가운데 정렬"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
            title="오른쪽 정렬"
          >
            ➡
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            title="글머리 기호"
          >
            • 목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            title="번호 매기기"
          >
            1. 목록
          </button>
        </div>

        {/* 텍스트 색상 */}
        <div className="flex gap-1 border-r pr-2">
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-10 h-8 rounded cursor-pointer"
            title="글자 색"
          />
        </div>

        {/* 삽입 */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={addImage}
            className="px-3 py-1 rounded hover:bg-gray-200 text-sm"
            title="이미지 삽입"
          >
            🖼️ 이미지
          </button>
          <button
            onClick={addLink}
            className="px-3 py-1 rounded hover:bg-gray-200 text-sm"
            title="링크 삽입"
          >
            🔗 링크
          </button>
        </div>

        {/* 블록 */}
        <div className="flex gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
            title="인용구"
          >
            " 인용
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded hover:bg-gray-200 text-sm ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
            title="코드 블록"
          >
            &lt;/&gt; 코드
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-3 py-1 rounded hover:bg-gray-200 text-sm"
            title="구분선"
          >
            ― 구분선
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <EditorContent editor={editor} className="min-h-[500px]" />

      {/* 스타일 */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 10px 0;
        }
        .editor-link {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 16px;
          color: #6b7280;
          font-style: italic;
        }
        .ProseMirror pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
        .ProseMirror code {
          background: #f3f4f6;
          color: #1f2937;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}
