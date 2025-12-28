module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Posts",
      [
        {
          title: "Next.js 14 có gì mới?",
          slug: "nextjs-14-co-gi-moi",
          content: `
            <p>Next.js 14 mang lại nhiều cải tiến đáng chú ý:</p>
            <ul>
              <li>Tối ưu App Router</li>
              <li>Server Actions ổn định hơn</li>
              <li>Cải thiện hiệu năng build</li>
            </ul>
          `,
          thumbnail: "/images/products/news-1.jpg",
          user_id: 1,
          post_category_id: 1,
          // product_id: null, // nếu muốn gắn sản phẩm thì điền id
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: "AI đang thay đổi ngành Frontend",
          slug: "ai-thay-doi-nganh-frontend",
          content: `
            <p>AI đang tác động mạnh tới Frontend:</p>
            <ol>
              <li>Tạo UI tự động</li>
              <li>Viết code nhanh hơn</li>
              <li>Kiểm thử thông minh</li>
            </ol>
          `,
          thumbnail: "/images/products/news-2.jpg",
          user_id: 1,
          post_category_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Posts", null, {});
  },
};
