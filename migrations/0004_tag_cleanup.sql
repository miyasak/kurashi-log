UPDATE post_tags SET tag_id=(SELECT id FROM tags WHERE name='ツーリングルート') WHERE tag_id=(SELECT id FROM tags WHERE name='ツールングルート');
UPDATE post_tags SET tag_id=(SELECT id FROM tags WHERE name='青森') WHERE tag_id=(SELECT id FROM tags WHERE name='青森県');
DELETE FROM tags WHERE NOT EXISTS (SELECT 1 FROM post_tags pt WHERE pt.tag_id=tags.id);
UPDATE tags SET name='山形' WHERE name='山形県';
UPDATE tags SET name='長野' WHERE name='長野県';
UPDATE tags SET slug = name WHERE slug LIKE 'post-%';
