-- =========================================================
-- 「社内SE」「情シス」をサイト全体（DBの記事本文・タイトル・タグ）から削除
-- v4 のテーマ再編（Money / Touring / Tech）に合わせた文言整理
-- =========================================================

-- タイトル
UPDATE posts SET title = REPLACE(title, '社内SEが生成AIを社内展開して', '生成AIを全社展開して') WHERE title LIKE '%社内SE%';
UPDATE posts SET title = REPLACE(title, '情シスのPC資産棚卸し', 'PC資産棚卸し') WHERE title LIKE '%情シス%';
UPDATE posts SET title = REPLACE(title, '社内SE', '業務効率化') WHERE title LIKE '%社内SE%';
UPDATE posts SET title = REPLACE(title, '情シス', '社内IT') WHERE title LIKE '%情シス%';

-- 概要
UPDATE posts SET summary = REPLACE(summary, '社内SE', '業務効率化') WHERE summary LIKE '%社内SE%';
UPDATE posts SET summary = REPLACE(summary, '情シス', '社内IT') WHERE summary LIKE '%情シス%';

-- 本文
UPDATE posts SET body = REPLACE(body, '情シス2名で', '担当2名で') WHERE body LIKE '%情シス2名で%';
UPDATE posts SET body = REPLACE(body, '情シスへの一次問い合わせ', '社内ヘルプデスクへの一次問い合わせ') WHERE body LIKE '%情シスへの一次問い合わせ%';
UPDATE posts SET body = REPLACE(body, '社内SE', '業務効率化担当') WHERE body LIKE '%社内SE%';
UPDATE posts SET body = REPLACE(body, '情シス', '社内IT') WHERE body LIKE '%情シス%';

-- その他のテキスト項目
UPDATE posts SET genre = REPLACE(genre, '社内SE', '業務効率化') WHERE genre LIKE '%社内SE%';
UPDATE posts SET genre = REPLACE(genre, '情シス', '社内IT') WHERE genre LIKE '%情シス%';

-- タグ（「社内SE」タグは「自動化」に統合）
UPDATE tags SET name = '自動化', slug = 'jidouka'
  WHERE name = '社内SE'
    AND NOT EXISTS (SELECT 1 FROM tags t2 WHERE t2.name = '自動化');
DELETE FROM post_tags WHERE tag_id IN (SELECT id FROM tags WHERE name IN ('社内SE', '情シス'));
DELETE FROM tags WHERE name IN ('社内SE', '情シス');
