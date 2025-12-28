import db from "../models";

// helper: bỏ HTML để cắt excerpt
const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "");
const makeExcerpt = (html = "", len = 160) => {
  const text = stripHtml(html).trim().replace(/\s+/g, " ");
  return text.length > len ? text.slice(0, len) + "..." : text;
};

// helper: thumbnail đang lưu kiểu "/images/products/xxx"
// nhưng server đang serve static qua "/static" => chuyển thành "/static/images/products/xxx"
const normalizeThumb = (thumb = "") => {
  if (!thumb) return "";
  if (thumb.startsWith("/static/")) return thumb;
  if (thumb.startsWith("/images/")) return `/static${thumb}`;
  return thumb;
};

export const getNewsList = async (req, res) => {
  try {
    const posts = await db.Post.findAll({
      include: [
        { model: db.PostCategory, as: "category", attributes: ["name", "slug"] },
        { model: db.User, as: "author", attributes: ["first_name", "last_name"] },
      ],
      order: [["created_at", "DESC"]],
    });

    const items = posts.map((p) => ({
      id: String(p.post_id),
      title: p.title,
      slug: p.slug,
      excerpt: makeExcerpt(p.content),
      content: p.content,
      thumbnail: normalizeThumb(p.thumbnail),
      category: p.category?.name ?? null,
      author:
        p.author ? `${p.author.first_name ?? ""} ${p.author.last_name ?? ""}`.trim() : null,
      publishedAt: p.created_at, // frontend đang dùng publishedAt
      tags: [],
    }));

    return res.json(items);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNewsDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const p = await db.Post.findOne({
      where: { slug },
      include: [
        { model: db.PostCategory, as: "category", attributes: ["name", "slug"] },
        { model: db.User, as: "author", attributes: ["first_name", "last_name"] },
      ],
    });

    if (!p) return res.status(404).json({ message: "Not Found" });

    const item = {
      id: String(p.post_id),
      title: p.title,
      slug: p.slug,
      excerpt: makeExcerpt(p.content),
      content: p.content,
      thumbnail: normalizeThumb(p.thumbnail),
      category: p.category?.name ?? null,
      author: p.author ? `${p.author.first_name ?? ""} ${p.author.last_name ?? ""}`.trim() : null,
      publishedAt: p.created_at,
      tags: [],
    };

    return res.json(item);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
