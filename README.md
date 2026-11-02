# WebPOS · Liquid Glass đỏ — bản thiết kế thử

Đây là bộ HTML/CSS/JavaScript mô phỏng giao diện, độc lập với ứng dụng WebPOS thật.

## Mở xem

1. Giải nén toàn bộ thư mục, mở thư mục đó trong VS Code.
2. Dùng Live Server mở `BAT-DAU.html` để xem hai màn hình song song và bấm thử. Có thể đổi cặp màn hình, chiều rộng 320/391/430 px và chiều cao.
3. Muốn xem từng trang trên toàn cửa sổ, bấm “Mở riêng”. `index.html` vẫn là trang bán hàng; `manager.html` là menu quản lý.

Nên mở qua cùng một địa chỉ Live Server để giỏ hàng dùng chung localStorage giữa các trang. Không cần chạy backend hoặc cài thêm thư viện.

## Thay vào thư mục thiết kế cũ

Sao lưu thư mục thiết kế hiện tại trước. Sao chép các file HTML, `css/`, `js/` và README trong bản này vào đúng thư mục dự án **thiết kế giao diện**, cho phép thay thế các file trùng tên. Giữ nguyên `.git` và `.github` đang có của bạn. Không chép bộ này vào frontend/backend của WebPOS thật.

Nếu trang vẫn dùng kiểu cũ, tải lại bằng Ctrl+F5. Không cần xóa localStorage để cập nhật giao diện.

## Phong cách đã sửa

- Nền nhiều lớp gradient hồng sương, đỏ ruby và xám ấm; không dùng xanh/tím làm màu chủ đạo.
- Bề mặt kính trong mờ có viền sáng, bóng nhẹ; các hàng dữ liệu nằm trên một lớp kính chung.
- Nút, ô tìm kiếm và bộ lọc dạng capsule. Icon SVG nét mảnh thay emoji ở phần bán hàng.
- Nav quản lý dạng thanh kính nổi với nút Bán hàng tròn ở giữa; nav nằm ở đáy trên điện thoại, phía trên ở desktop.
- Trên điện thoại có chiều cao từ 621 px: tìm kiếm, vùng quét và hai hàng Thêm nhanh nằm trong nửa đầu; giỏ hàng và thanh tổng tiền ở phần dưới. Các danh sách cuộn độc lập. Màn quá thấp dùng bố cục cuộn, giữ thanh tổng tiền ở đáy vùng nhìn.
- Popup thanh toán dùng nút phương thức dạng capsule, có xử lý focus, phím Tab và Escape.

## Các trang

| Trang | Nội dung |
| --- | --- |
| `login.html` | Đăng nhập giả lập |
| `menu.html` | Menu nhân viên |
| `index.html` | Tìm sản phẩm, vùng camera minh họa, thêm nhanh, giỏ hàng |
| `cart.html` | Xem giỏ, tiền mặt, VietQR minh họa |
| `success.html` | Kết quả đơn mẫu |
| `history.html` | Lịch sử bán thử trong phiên |
| `manager.html` | Menu quản lý |
| `products.html` | Danh mục, lọc, thêm/sửa/xóa sản phẩm mẫu |
| `orders.html` | Lọc và phân trang đơn mẫu |
| `order-detail.html` | Chi tiết và trạng thái đơn mẫu |
| `staff.html` | Danh sách, form và trạng thái nhân viên mẫu |

## Phạm vi dữ liệu

Camera và VietQR vẫn chỉ là minh họa. Đăng nhập không xác thực tài khoản thật. Chỉ nhập thông tin giả; ô mật khẩu đăng nhập đã bỏ thuộc tính name để không đưa mật khẩu vào query string. Mật khẩu ở form nhân viên không được lưu.

Giỏ hàng bán thử dùng localStorage và chia sẻ giữa trang bán hàng/giỏ hàng. Dữ liệu quản lý dùng bộ mẫu riêng, chưa đồng bộ với danh mục và lịch sử bán thử. Các nút xác nhận thanh toán/khóa nhân viên chỉ đổi dữ liệu mô phỏng.

Bản giao không có `.git`, `.github`, `.env`, chứng chỉ, khóa riêng hoặc dữ liệu backend. Chưa commit, push hay triển khai lên GitHub.

## Kiểm tra bản sửa

- Đã kiểm tra cú pháp toàn bộ 14 file JavaScript, ID HTML và đường dẫn tệp nội bộ của 12 trang.
- Đã mở trực tiếp trên trình duyệt: menu quản lý, sản phẩm và form, đơn/chi tiết, nhân viên và form, đăng nhập, menu nhân viên, bán hàng, giỏ/thanh toán, hoàn tất và lịch sử.
- Đã thử thêm/giảm hàng → xem giỏ: tổng 25.000đ đồng bộ; nhận 50.000đ → tiền thừa 25.000đ; chuyển tab VietQR, đóng popup, hoàn tất đơn giả lập.
- Đã kiểm tra bố cục 320 px và 391 px, màn thấp 568 px. Chưa kiểm tra trên máy A55 thật.

Màu và bề mặt chung: `css/ui-theme.css`. Bố cục quản lý: `css/admin.css`, `css/admin-management.css`. Bán hàng: `css/style.css`. Icon và tiện ích hiển thị: `js/ui-icons.js`.
