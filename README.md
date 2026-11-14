# Thư mời ra mắt cơ sở mới – Aphrodite Clinic

Trang thiệp mời tĩnh (HTML/CSS/JS), không cần build.

## Cấu trúc
- `index.html` – nội dung và logo (SVG nhúng sẵn)
- `style.css` – giao diện theo brand guideline
- `script.js` – chuyển động khi cuộn, form xác nhận tham dự; cấu hình `CFG` ở đầu file
- `assets/photo.jpg` – ảnh gốc (ảnh đã nhúng sẵn trong index.html, thư mục này chỉ để lưu trữ)
- `google-apps-script.gs` – mã nhận dữ liệu xác nhận vào Google Sheet

## Đăng lên GitHub Pages
1. Tạo repository mới, tải toàn bộ file trong thư mục này lên (giữ nguyên cấu trúc).
2. Vào **Settings → Pages**, chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`.
3. Sau vài phút, trang chạy tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

## Cấu hình (đầu file `script.js`)
- `date`: ngày sự kiện, định dạng `năm-tháng-ngày` (hiện là `2026-11-29`).
- `endpoint`: link Apps Script dạng `.../exec` để ghi dữ liệu vào Google Sheet.
- `email`: email nhận xác nhận khi chưa có `endpoint`.

## Sửa lỗi danh sách xác nhận không ghi vào Google Sheet
1. Mở Apps Script, dán lại `google-apps-script.gs`, chọn hàm `testPost` rồi bấm **Chạy** một lần (cấp quyền truy cập Sheet; xem dòng "Test" xuất hiện trong Sheet).
2. **Triển khai → Quản lý bản triển khai → bút chì → Phiên bản mới → Triển khai.** Chỉ lưu code thôi thì link `/exec` vẫn chạy bản cũ.
3. Đảm bảo: *Thực thi với tư cách* = Tôi, *Người có quyền truy cập* = Bất kỳ ai.
4. Nếu triển khai mới tạo ra link `/exec` khác, cập nhật `endpoint` trong `script.js`.
