import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'riyan_nextjs',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  parent_id: number;
}

export interface Post {
  ID: number;
  post_title: string;
  post_content: string;
  post_excerpt: string;
  post_date: string;
  post_type: string;
  post_status: string;
}

export interface HeroSlide {
  id: number;
  order: number;
  title: string;
  description: string;
  imageUrl: string;
}

const stripHtmlAndWhitespace = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const safeJsonParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Failed to parse JSON from DB:", error);
    return null;
  }
};

export async function getMenuItems(): Promise<MenuItem[]> {
  const [rows] = await pool.query<any[]>(`
    SELECT
      p.ID as id,
      p.post_title as title,
      MAX(CASE WHEN pm.meta_key = '_menu_item_url' THEN pm.meta_value END) as url,
      MAX(CASE WHEN pm.meta_key = '_menu_item_menu_item_parent' THEN pm.meta_value END) as parent_id
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm ON p.ID = pm.post_id
    WHERE p.post_type = 'nav_menu_item'
    AND p.post_status = 'publish'
    GROUP BY p.ID, p.post_title, p.menu_order
    ORDER BY p.menu_order
  `);

  return rows as MenuItem[];
}

export async function getPosts(postType: string = 'post', limit: number = 10): Promise<Post[]> {
  const [rows] = await pool.query<any[]>(`
    SELECT ID, post_title, post_content, post_excerpt, post_date, post_type, post_status
    FROM wp_posts
    WHERE post_type = ?
    AND post_status = 'publish'
    ORDER BY post_date DESC
    LIMIT ?
  `, [postType, limit]);

  return rows as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [rows] = await pool.query<any[]>(`
    SELECT ID, post_title, post_content, post_excerpt, post_date, post_type, post_status
    FROM wp_posts
    WHERE post_name = ?
    AND post_status = 'publish'
    LIMIT 1
  `, [slug]);

  return rows.length > 0 ? (rows[0] as Post) : null;
}

export async function getHeroSlides(sliderAlias: string = 'slider-1'): Promise<HeroSlide[]> {
  const [sliderRows] = await pool.query<any[]>(
    'SELECT id FROM wp_revslider_sliders WHERE alias = ? LIMIT 1',
    [sliderAlias]
  );

  if (!sliderRows.length) return [];

  const sliderId = sliderRows[0].id as number;

  const [rows] = await pool.query<any[]>(
    'SELECT id, slide_order, params, layers FROM wp_revslider_slides WHERE slider_id = ? ORDER BY slide_order',
    [sliderId]
  );

  return (rows as any[])
    .map((row): HeroSlide | null => {
      const params = safeJsonParse<any>(row.params);
      const layers = safeJsonParse<Record<string, any>>(row.layers);

      if (params?.publish?.state === 'unpublished') return null;

      const imageUrl = params?.bg?.image ?? '';

      const textLayers = Object.entries(layers ?? {})
        .filter(([key, value]) => {
          if (['top', 'middle', 'bottom'].includes(key)) return false;
          const text = (value as any)?.text;
          return typeof text === 'string' && text.trim().length > 0;
        })
        .sort((a, b) => Number(a[0]) - Number(b[0]));

      const title = stripHtmlAndWhitespace(textLayers[0]?.[1]?.text ?? '');
      const description = stripHtmlAndWhitespace(textLayers[1]?.[1]?.text ?? '');

      if (!imageUrl && !title && !description) return null;

      return {
        id: Number(row.id),
        order: Number(row.slide_order) || 0,
        title,
        description,
        imageUrl,
      };
    })
    .filter((slide): slide is HeroSlide => Boolean(slide));
}
