module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "PostCategories",
      [
        {
          // nếu cate_id auto-increment, có thể bỏ cate_id
          cate_id: 1,
          name: "Tin công nghệ",
          slug: "tin-cong-nghe",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("PostCategories", { slug: "tin-cong-nghe" }, {});
  },
};
