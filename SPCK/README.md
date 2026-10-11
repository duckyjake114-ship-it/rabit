# Mọt Sách — Đăng nhập & Đăng ký (SPCK)

Website nhỏ về chủ đề **sách**, có đầy đủ chức năng đăng ký, đăng nhập và đăng xuất.
Viết bằng HTML, CSS và JavaScript thuần — không cần cài đặt gì thêm.

## Cách chạy
Mở file `dang-ky.html` (hoặc `index.html`) bằng trình duyệt (Chrome, Edge, Firefox...).
Nếu dùng VS Code, có thể bấm chuột phải → **Open with Live Server**.

## Cấu trúc thư mục
```
SPCK/
├── index.html        Trang chủ (chỉ vào được khi đã đăng nhập)
├── dang-nhap.html    Trang đăng nhập
├── dang-ky.html      Trang đăng ký
├── css/style.css     Giao diện
└── js/
    ├── xac-thuc.js   Lõi xử lý: lưu tài khoản, băm mật khẩu, phiên đăng nhập
    ├── dang-ky.js    Xử lý form đăng ký
    ├── dang-nhap.js  Xử lý form đăng nhập
    └── trang-chu.js  Hiển thị thông tin người dùng, đăng xuất
```

## Chức năng
- Kiểm tra dữ liệu: họ tên, email, số điện thoại Việt Nam, mật khẩu mạnh, nhập lại mật khẩu, đồng ý điều khoản.
- Thanh đo độ mạnh mật khẩu, nút ẩn/hiện mật khẩu.
- Không cho đăng ký trùng email.
- Mật khẩu được băm SHA-256 kèm "muối" ngẫu nhiên, không lưu dạng chữ thường.
- "Ghi nhớ đăng nhập": giữ phiên sau khi tắt trình duyệt.
- Trang chủ được bảo vệ: chưa đăng nhập sẽ bị chuyển về trang đăng nhập.
- Giao diện tương thích điện thoại.

## Lưu ý
Dữ liệu được lưu trong `localStorage` của trình duyệt (phù hợp cho bài học/demo).
Muốn dùng thật cho nhiều người, cần thay phần lưu trữ trong `js/xac-thuc.js` bằng một máy chủ hoặc Firebase.
