-- lumatale seed · 1 novel + 3 scenes
-- Run AFTER 0001_init.sql in Supabase SQL Editor. Idempotent on slug.

insert into novels (slug, title, author, synopsis, scene_count)
values (
  'midnight-library',
  '午夜图书馆',
  '匿名',
  '在一座只在午夜出现的图书馆里，你只能翻开一本书。你选择了那本最不起眼的旧笔记本——里面写满了你遗忘的记忆，而最后一页，是空白的。',
  3
)
on conflict (slug) do update
  set title = excluded.title,
      author = excluded.author,
      synopsis = excluded.synopsis,
      scene_count = excluded.scene_count;

with n as (select id from novels where slug = 'midnight-library')
insert into scenes (novel_id, "order", title, body) values
  ((select id from n), 1, '午夜', E'你推开那扇不应该存在的门。\n\n图书馆的穹顶高得看不到尽头，书架像森林一样向四面八方延伸。空气中飘着旧纸和檀香的味道。\n\n一位白发老人坐在前台，抬头看了你一眼：\n\n"你来了。每个人一生只能来一次。"'),
  ((select id from n), 2, '三本书', E'老人指向三个方向。\n\n左边，一本发着微光的金色封面的书。右边，一本封面全黑、没有书名的书。\n\n而正前方，一本不起眼的旧笔记本，封皮已经磨损，看起来像是被人翻阅过千百次。\n\n你犹豫了一下，伸手取下了那本笔记本。'),
  ((select id from n), 3, '空白页', E'你翻开笔记本。\n\n第一页是你五岁时弄丢的玩具熊。第二页是你父亲临终前没说完的那句话。第三页、第四页……每一页都是你以为已经遗忘的记忆。\n\n你越翻越快，直到翻到了最后一页。\n\n最后一页是空白的。\n\n你拿起笔。')
on conflict (novel_id, "order") do update
  set title = excluded.title,
      body = excluded.body;
