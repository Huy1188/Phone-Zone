// src/app/components/Pages/News/news.data.ts
import { NewsItem } from "@/types/news";


export const NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Apple ra mắt iPhone 16 với chip A18 mạnh nhất từ trước đến nay",
    slug: "iphone-16-chip-a18",
    excerpt: "iPhone 16 được trang bị chip A18 mới, hiệu năng tăng mạnh và tiết kiệm pin hơn.",
    content: `
      Apple chính thức giới thiệu iPhone 16 với chip A18 mới.
      Con chip này mang lại hiệu suất CPU và GPU vượt trội,
      đồng thời tối ưu pin và AI trên thiết bị.

      iPhone 16 dự kiến sẽ tạo ra làn sóng nâng cấp mạnh mẽ
      trong năm 2025.
    `,
    thumbnail: "/images/news/iphone-16.jpg",
    category: "Mobile",
    author: "Admin",
    publishedAt: "2025-01-05T08:00:00.000Z",
    tags: ["Apple", "iPhone", "A18"],
  },
  {
    id: "2",
    title: "Samsung trình làng Galaxy S25 Ultra với camera 200MP",
    slug: "galaxy-s25-ultra-camera-200mp",
    excerpt: "Galaxy S25 Ultra tiếp tục khẳng định vị thế flagship Android.",
    content: `
      Samsung Galaxy S25 Ultra được trang bị camera chính 200MP
      cùng nhiều cải tiến về AI chụp ảnh và zoom quang học.

      Đây là chiếc smartphone cao cấp nhất của Samsung năm nay.
    `,
    thumbnail: "/images/news/galaxy-s25.jpg",
    category: "Mobile",
    author: "Admin",
    publishedAt: "2025-01-04T09:00:00.000Z",
    tags: ["Samsung", "Galaxy", "Android"],
  },
  {
    id: "3",
    title: "ChatGPT được tích hợp sâu hơn vào Windows 12",
    slug: "chatgpt-windows-12",
    excerpt: "Microsoft đưa AI ChatGPT trở thành trợ lý mặc định trên Windows 12.",
    content: `
      Windows 12 đánh dấu bước tiến lớn khi tích hợp sâu ChatGPT.
      Người dùng có thể điều khiển hệ thống, tìm kiếm và viết nội dung
      trực tiếp bằng AI.

      Đây là chiến lược dài hạn của Microsoft với AI.
    `,
    thumbnail: "/images/news/chatgpt-windows.jpg",
    category: "AI",
    author: "Huy",
    publishedAt: "2025-01-03T10:30:00.000Z",
    tags: ["ChatGPT", "Microsoft", "Windows"],
  },
  {
    id: "4",
    title: "Google ra mắt Android 15 với nhiều tính năng AI mới",
    slug: "android-15-ai",
    excerpt: "Android 15 tập trung mạnh vào cá nhân hóa bằng AI.",
    content: `
      Android 15 mang đến nhiều cải tiến về bảo mật,
      pin và các tính năng AI học thói quen người dùng.

      Google tiếp tục cuộc đua AI trên nền tảng di động.
    `,
    thumbnail: "/images/news/android-15.jpg",
    category: "Mobile",
    author: "Admin",
    publishedAt: "2025-01-02T07:45:00.000Z",
    tags: ["Android", "Google", "AI"],
  },
  {
    id: "5",
    title: "Top 5 laptop đáng mua nhất cho lập trình viên năm 2025",
    slug: "top-laptop-lap-trinh-2025",
    excerpt: "Danh sách laptop mạnh mẽ, phù hợp cho developer.",
    content: `
      Các tiêu chí chọn laptop cho lập trình viên gồm:
      CPU mạnh, RAM lớn, màn hình đẹp và pin tốt.

      Danh sách năm 2025 có nhiều lựa chọn đáng giá.
    `,
    thumbnail: "/images/news/laptop-dev.jpg",
    category: "Laptop",
    author: "Huy",
    publishedAt: "2025-01-01T06:00:00.000Z",
    tags: ["Laptop", "Developer"],
  },
  {
    id: "6",
    title: "AI đang thay đổi ngành thiết kế đồ họa như thế nào?",
    slug: "ai-thiet-ke-do-hoa",
    excerpt: "AI giúp designer làm việc nhanh và sáng tạo hơn.",
    content: `
      Các công cụ AI như Midjourney, Photoshop AI
      đang thay đổi cách designer làm việc.

      Tuy nhiên, sáng tạo của con người vẫn là cốt lõi.
    `,
    thumbnail: "/images/news/ai-design.jpg",
    category: "AI",
    author: "Admin",
    publishedAt: "2024-12-30T11:00:00.000Z",
    tags: ["AI", "Design"],
  },
  {
    id: "7",
    title: "So sánh iOS 18 và Android 15: Hệ điều hành nào tốt hơn?",
    slug: "so-sanh-ios-18-android-15",
    excerpt: "Bài so sánh chi tiết hai hệ điều hành di động phổ biến.",
    content: `
      iOS 18 tập trung vào trải nghiệm mượt mà,
      trong khi Android 15 nổi bật về tùy biến.

      Mỗi nền tảng đều có ưu và nhược điểm riêng.
    `,
    thumbnail: "/images/news/ios-android.jpg",
    category: "Mobile",
    author: "Admin",
    publishedAt: "2024-12-28T09:15:00.000Z",
    tags: ["iOS", "Android"],
  },
  {
    id: "8",
    title: "Xu hướng công nghệ nổi bật trong năm 2025",
    slug: "xu-huong-cong-nghe-2025",
    excerpt: "AI, XR và chip bán dẫn sẽ dẫn đầu xu hướng.",
    content: `
      Năm 2025 được dự đoán là năm bùng nổ
      của trí tuệ nhân tạo, thực tế mở rộng và bán dẫn.

      Doanh nghiệp cần sẵn sàng thích nghi.
    `,
    thumbnail: "/images/news/tech-trend-2025.jpg",
    category: "Tech",
    author: "Admin",
    publishedAt: "2024-12-26T08:00:00.000Z",
    tags: ["Technology", "Trend"],
  },
  {
    id: "9",
    title: "Lập trình web 2025: Nên học Next.js hay Nuxt?",
    slug: "nextjs-vs-nuxt-2025",
    excerpt: "So sánh hai framework phổ biến cho web hiện đại.",
    content: `
      Next.js và Nuxt đều hỗ trợ SSR và SEO tốt.
      Tuy nhiên, Next.js nổi bật với hệ sinh thái React.

      Lựa chọn phụ thuộc vào team và mục tiêu.
    `,
    thumbnail: "/images/news/nextjs-nuxt.jpg",
    category: "Web",
    author: "Huy",
    publishedAt: "2024-12-25T10:00:00.000Z",
    tags: ["Next.js", "Nuxt", "Web"],
  },
  {
    id: "10",
    title: "Elon Musk giới thiệu phiên bản mới của Tesla Bot",
    slug: "tesla-bot-moi",
    excerpt: "Tesla Bot được nâng cấp khả năng vận động và AI.",
    content: `
      Tesla Bot phiên bản mới có thể thực hiện
      nhiều tác vụ phức tạp trong đời sống.

      Elon Musk tin rằng robot hình người sẽ phổ biến.
    `,
    thumbnail: "/images/news/tesla-bot.jpg",
    category: "AI",
    author: "Admin",
    publishedAt: "2024-12-23T13:00:00.000Z",
    tags: ["Tesla", "Robot", "AI"],
  },
  {
    id: "11",
    title: "Cách bảo mật tài khoản Google an toàn hơn năm 2025",
    slug: "bao-mat-tai-khoan-google",
    excerpt: "Hướng dẫn bảo mật tài khoản Google hiệu quả.",
    content: `
      Google khuyến khích sử dụng passkey
      và xác thực hai bước để tăng bảo mật.

      Người dùng nên kiểm tra bảo mật định kỳ.
    `,
    thumbnail: "/images/news/google-security.jpg",
    category: "Security",
    author: "Admin",
    publishedAt: "2024-12-22T09:30:00.000Z",
    tags: ["Google", "Security"],
  },
  {
    id: "12",
    title: "Lập trình viên mới nên học AI từ đâu?",
    slug: "lap-trinh-vien-hoc-ai",
    excerpt: "Gợi ý lộ trình học AI dành cho người mới.",
    content: `
      Người mới nên bắt đầu từ Python,
      sau đó học Machine Learning và Deep Learning.

      Thực hành dự án là yếu tố quan trọng nhất.
    `,
    thumbnail: "/images/news/learn-ai.jpg",
    category: "AI",
    author: "Huy",
    publishedAt: "2024-12-20T07:00:00.000Z",
    tags: ["AI", "Learning"],
  },
];


export const getNewsBySlug = (slug: string) => NEWS.find(n => n.slug === slug);
