-- Список всех категорий
SELECT * FROM categories

-- Список непустых категорий
SELECT id, name FROM categories
  JOIN offer_categories
  ON id = category_id
  GROUP BY id

-- Категории с количеством объявлений
SELECT id, name, count(offer_id) FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id

-- Список объявлений, сначала свежие
SELECT offers.id, title, sum, type, description, offers.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(DISTINCT comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.created_at DESC

-- Детальная информация по объявлению
SELECT offers.id, title, sum, type, description, offers.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(DISTINCT comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
  GROUP BY offers.id, users.id

-- Пять свежих комментариев
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

-- Комментарии к объявлению
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 2
  ORDER BY comments.created_at DESC

-- Два объявления о покупке
SELECT * FROM offers
WHERE type = 'OFFER'
  LIMIT 2

-- Обновить заголовок
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1

-- 8 самых обсуждаемых объявлений
SELECT offers.id, title, sum, type, description, offers."createdAt",
  jsonb_agg(DISTINCT jsonb_build_object('id', categories.id, 'name', categories.name)) AS categories,
  count(DISTINCT comments.id) AS "commentsCount"
FROM offers
  JOIN offer_categories ON offers.id = offer_categories."OfferId"
  JOIN categories ON offer_categories."CategoryId" = categories.id
  LEFT JOIN comments ON comments."offerId" = offers.id
GROUP BY offers.id
ORDER BY "commentsCount" DESC
LIMIT 8