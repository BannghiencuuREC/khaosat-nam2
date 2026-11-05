# Khảo sát "Hành trình định hướng nghề nghiệp ngành BĐS"

Trang khảo sát hiển thị mỗi màn hình một câu, chạy tốt trên điện thoại. Câu trả lời được lưu vào Google Sheets.

## Các file

| File | Dùng để |
|---|---|
| `questions.js` | **Toàn bộ nội dung**: lời mở đầu, câu hỏi, lựa chọn, rẽ nhánh, gợi ý ở màn kết quả. Thường bạn chỉ cần sửa file này. |
| `config.js` | Chứa link kết nối Google Sheets. |
| `google-apps-script.gs` | Đoạn script dán vào Google Sheets để nhận câu trả lời. |
| `illustrations.js` | Hình minh hoạ (bản đồ hành trình, các "trạm dừng"), được vẽ bằng code. |
| `index.html`, `style.css`, `app.js` | Khung trang, giao diện, cách trang hoạt động. Không cần sửa. |

Mỗi giai đoạn có một màu riêng: GĐ1 xanh lá, GĐ2 cam, GĐ3 tím. Màu chủ đạo của trang đổi theo giai đoạn đang làm. Lời động viên ở màn mở đầu mỗi phần nằm trong `questions.js`, trường `dongVien`.

Mở `questions.js` bằng TextEdit hoặc VS Code. Nếu sửa trên GitHub thì bấm vào file rồi bấm biểu tượng cây bút.

## Sửa câu hỏi

Mỗi câu hỏi trong `questions.js` trông như sau:

```js
{ ma: "A4", loai: "chon1", tieuDe: "Bạn đến từ đâu?",
  luaChon: ["TP.HCM", "Tỉnh/thành khác"] },
```

- **Sửa chữ:** chỉ sửa phần nằm giữa hai dấu ngoặc kép `"..."`. Giữ nguyên dấu phẩy, ngoặc vuông `[ ]` và ngoặc nhọn `{ }`.
- **Thêm hoặc bớt lựa chọn:** thêm hay xóa một mục `"..."` trong `luaChon`, các mục cách nhau bằng dấu phẩy.
- **Ô "ghi rõ":** lựa chọn nào có chữ `(ghi rõ)` sẽ tự hiện ô gõ thêm khi được chọn.
- **Giới hạn số lựa chọn:** thêm `toiDa: 3` vào câu loại `"chonNhieu"`.
- **Loại câu:** `"chon1"` (chọn 1), `"chonNhieu"` (chọn nhiều), `"thang5"` (thang 1–5), `"traLoiNgan"` (ô gõ chữ), `"email"`.
- **Rẽ nhánh:**
  - `anKhi: { cau: "B6", la: ["0"] }`: ẩn câu này nếu câu B6 chọn "0".
  - `chiHienKhi: { cau: "C1", la: ["Đã rõ một hướng"] }`: chỉ hiện câu này nếu C1 chọn "Đã rõ một hướng".
  - `chiHienKhiDaTraLoi: "E1"`: chỉ hiện câu này nếu người trả lời không bỏ qua E1.
  - Chữ trong `la: [...]` phải **giống hệt** chữ của lựa chọn. Nếu bạn sửa chữ của một lựa chọn, hãy sửa cả chỗ này.
- **Danh sách vị trí** dùng chung cho B2 và C9 nằm ở đầu file, tên là `DS_VI_TRI`. Sửa ở đó là đổi cả hai câu.
- **Chỉ dành cho sinh viên năm 2:** câu A1 có `chiTiepTucKhi: ["Năm 2"]` và `batBuoc: true`. Người chọn năm khác sẽ thấy lời cảm ơn (phần `loiDungSom` trong `questions.js`) và dừng lại, không có dòng nào được ghi vào Sheet. Muốn mở cho mọi năm, xóa hai trường này.
- **Lấy lựa chọn từ câu trước:** B5 có `layLuaChonTu: "B4"`, nên chỉ hiện các nguồn đã chọn ở B4. E5 cũng lấy từ E1 và có thêm `boQuaKhiMotLuaChon: true`: nếu E1 chỉ chọn 1 khó khăn, trang bỏ qua E5 và tự ghi khó khăn đó vào cột E5.
- **Mỗi lựa chọn một ô:** C8 có `moiLuaChonMotO: "C9"`, nên với mỗi vị trí được chọn ở C9, trang hiện một ô gõ riêng. Nếu người trả lời bỏ qua C9, trang hiện một ô chung kèm câu hỏi `tieuDeKhiKhongChon`.

⚠️ **Đừng đổi `ma`** (A1, B2…) sau khi đã có người trả lời, vì `ma` chính là tên cột trong Google Sheets. Nếu thêm câu mới, hãy đặt một mã mới (ví dụ `C9`). Cột mới sẽ tự xuất hiện ở cuối bảng.

**Gợi ý ở màn kết quả** nằm ở cuối file, phần `ketQua`. Quy tắc xếp giai đoạn nằm trong `tinhGiaiDoan`.

Sửa xong, hãy mở trang để thử lại. Nếu trang trắng tinh, nhiều khả năng bạn đã xóa nhầm một dấu phẩy hoặc dấu ngoặc kép.

## Xem và xuất câu trả lời

1. Mở Google Sheet của khảo sát.
2. Tab **CauTraLoi**: mỗi dòng là một người trả lời.
   - `Thời gian`: lúc gửi. `Giai đoạn (kết quả)`: giai đoạn hiện ở màn kết quả (1, 2 hoặc 3). `Thời lượng (phút)`: thời gian làm bài.
   - Câu chọn nhiều: các lựa chọn cách nhau bằng dấu `; `.
   - Cột `… – ghi rõ`: phần người trả lời tự gõ khi chọn "Khác (ghi rõ)".
   - Cột `C8 – <vị trí>`: câu hỏi người trả lời muốn hỏi anh chị làm vị trí đó. Khi đó cột `C8` ghi `(trả lời theo vị trí)`. Muốn gom câu hỏi cho từng anh chị, bạn chỉ cần đọc dọc theo cột của vị trí đó.
   - `(không hiển thị)`: câu bị ẩn do rẽ nhánh. Ô **trống** nghĩa là người trả lời được hỏi nhưng bấm "Bỏ qua".
3. Tab **Email**: chỉ có email. Email được chèn vào vị trí ngẫu nhiên nên không ghép được với câu trả lời.
4. **Xuất CSV:** đang ở tab CauTraLoi, chọn **Tệp → Tải xuống → Giá trị được phân tách bằng dấu phẩy (.csv)**. Cách này chỉ xuất tab đang mở.

### Tìm khó khăn chính

Mỗi giả thuyết về khó khăn được đo bằng một câu chấm điểm (cho mọi người) và một lựa chọn ở E1:

| Giả thuyết | Câu chấm điểm 1–5 | Lựa chọn ở E1 |
|---|---|---|
| H1 Không biết chọn hướng, chọn chuyên ngành | C14 (điểm thấp là khó) | Phải chọn chuyên ngành khi chưa đủ thông tin |
| H2 Không biết cách khám phá bản thân | C11 (điểm thấp là khó) | Chưa biết mình thích gì, giỏi gì |
| H3 Không biết nghề thực tế làm gì | B3 (điểm thấp là khó) | Không biết các nghề… thực tế làm gì; Thông tin về nghề rời rạc |
| H4 Không biết cần chuẩn bị gì | C13 (điểm thấp là khó) | Không biết cần chuẩn bị gì để được nhận |
| H5 Lo chọn xong chưa chắc đúng | C12 (điểm **cao** là khó) | Sợ chọn xong, đi làm mới thấy không hợp |

Mức mông lung chung nằm ở B9. Câu C15 cho biết các bạn dựa vào đâu để chọn chuyên ngành: nhiều bạn chọn "Chưa biết dựa vào đâu", "Theo bạn bè" hay "Môn học hoặc điểm số" mà ít bạn chọn "Công việc mình muốn làm sau này" là dấu hiệu chuyên ngành đang được chọn khi chưa nghĩ tới nghề.

Cột C5 cũ (nếu có) không còn được hỏi. C14 đã thay cho C5 với cách hỏi cụ thể hơn, nên đừng gộp hai cột khi phân tích.

Cách đọc:

1. **Đọc cột A7 trước khi xem con số.** A7 hỏi mở trước khi người trả lời thấy bất kỳ danh sách nào. Gắn cho mỗi câu trả lời một nhãn H1–H5, hoặc "mới" nếu không khớp giả thuyết nào. Nhãn "mới" xuất hiện nhiều là dấu hiệu danh sách còn thiếu.
2. **Phổ biến:** đếm xem bao nhiêu người tick mỗi lựa chọn ở cột E1.
3. **Lớn nhất:** đếm cột E5. Cột này luôn có khó khăn lớn nhất của người đã trả lời E1.
4. **Gốc hay hệ quả:** đọc cột E6 (vì sao đó là khó khăn lớn nhất). Ví dụ nhiều bạn chọn "Phải chọn chuyên ngành…" nhưng E6 lại viết "vì chưa biết mình hợp gì", thì gốc có thể là H2, còn H1 là hệ quả.
5. **Liên quan đến mông lung:** so điểm B9 trung bình giữa nhóm chấm 1–2 và nhóm chấm 4–5 ở từng câu C11, B3, C13, C14 (với C12 thì ngược lại). Câu nào có chênh lệch B9 lớn nhất là ứng viên cho khó khăn chính.
6. **Tách nhóm:** so các bạn đã chọn chuyên ngành với các bạn chưa chọn (A3), hoặc đã thực tập với chưa thực tập (A6).

Với dưới khoảng 30 người trả lời, chênh lệch nhỏ giữa các nhóm chưa nói lên được gì. Hãy xem kết quả như dấu hiệu để hỏi tiếp, chưa phải kết luận.

**Trước khi gửi link chính thức**, hãy xóa các dòng làm thử trong cả hai tab, nhưng giữ lại dòng tiêu đề (dòng 1).

## Một vài mẹo

- **Làm lại trên cùng máy** (để thử): thêm `?lamlai` vào cuối link, ví dụ `https://…/khao-sat/?lamlai`. Người trả lời bình thường làm xong sẽ chỉ thấy lại màn kết quả.
- Trang tự nhớ bài làm dở. Lỡ đóng trình duyệt thì lần sau mở lại, người trả lời bấm "Tiếp tục bài đang làm".
- Khi `config.js` còn để trống, trang hiện dòng "Bản chạy thử" và **không gửi dữ liệu đi đâu**.
- Sau khi sửa file trên GitHub, thường mất 1–2 phút trang mới cập nhật.

## Cài đặt lần đầu (tham khảo)

### A. Kết nối Google Sheets

1. Đăng nhập bằng **Gmail cá nhân**. Tài khoản trường có thể bị chặn quyền cho người lạ gửi dữ liệu.
2. Tạo một Google Sheet mới, đặt tên tùy ý.
3. Chọn **Tiện ích mở rộng → Apps Script**. Xóa hết code mẫu, dán toàn bộ nội dung file `google-apps-script.gs`, rồi bấm 💾 Lưu.
4. Bấm **Triển khai → Tùy chọn triển khai mới**. Ở bánh răng ⚙️, chọn **Ứng dụng web**:
   - *Thực thi dưới dạng:* **Tôi**
   - *Người có quyền truy cập:* **Bất kỳ ai**
5. Bấm **Triển khai** và cấp quyền. Nếu Google cảnh báo "chưa được xác minh", bấm **Nâng cao → Đi tới… (không an toàn)**. Cảnh báo này hiện vì đây là script do chính bạn viết.
6. Sao chép **URL ứng dụng web** (kết thúc bằng `/exec`) và dán vào `config.js`:
   ```js
   scriptUrl: "https://script.google.com/macros/s/……/exec",
   ```
7. Mở URL đó trên trình duyệt. Nếu thấy `"ok":true` là đã kết nối được.

⚠️ Nếu sau này sửa code Apps Script, bạn phải chọn **Triển khai → Quản lý các lần triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai**. Không làm bước này thì bản cũ vẫn chạy.

### B. Đăng lên GitHub Pages

1. Tạo tài khoản miễn phí tại github.com.
2. Bấm **New repository**, đặt tên (ví dụ `khao-sat`), chọn **Public**, rồi bấm **Create repository**.
3. Bấm **uploading an existing file**, kéo thả các file `index.html`, `style.css`, `app.js`, `questions.js`, `config.js` vào, rồi bấm **Commit changes**. Không cần tải lên file `.gs`.
4. Vào **Settings → Pages**. Ở mục *Branch*, chọn `main` và `/ (root)`, rồi bấm **Save**.
5. Khoảng 1–2 phút sau, link khảo sát sẽ hiện ở đầu trang Settings → Pages, dạng `https://tenban.github.io/khao-sat/`.

Lưu ý: vì repository để Public, ai cũng xem được code của trang. Câu trả lời thì **không** nằm trên GitHub, chúng chỉ nằm trong Google Sheet của bạn.
