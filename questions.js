/* =====================================================================
   NỘI DUNG KHẢO SÁT — muốn sửa chữ, câu hỏi, lựa chọn, gợi ý: sửa ở file này.
   Xem README.md để biết cách sửa an toàn.

   Mỗi câu hỏi có:
     ma        Mã câu (A1, B2…). Đây cũng là tên cột trong Google Sheets.
               ĐỪNG đổi mã sau khi đã có người trả lời.
     loai      "chon1"      chọn 1 đáp án
               "chonNhieu"  chọn nhiều (thêm toiDa: 3 để giới hạn)
               "thang5"     thang 1–5
               "traLoiNgan" ô gõ chữ
               "email"      ô email (không bắt buộc)
     tieuDe    Nội dung câu hỏi.
     luaChon   Danh sách đáp án. Đáp án nào có chữ "(ghi rõ)" sẽ tự hiện ô gõ thêm.

   Rẽ nhánh:
     anKhi:      { cau: "B6", la: ["0"] }          → ẩn câu này nếu B6 chọn "0"
                 (với câu chọn nhiều: ẩn nếu có tick một trong các lựa chọn trong la)
     chiHienKhi: { cau: "C1", la: ["Đã rõ một hướng"] } → chỉ hiện nếu C1 chọn "Đã rõ một hướng"

     chiHienKhiDaTraLoi: "E1"                      → chỉ hiện nếu E1 có trả lời (không bỏ qua)

   Lọc người trả lời:
     chiTiepTucKhi: ["Năm 2"]   → chọn đáp án khác thì hiện màn loiDungSom, không ghi gì vào Sheet
     batBuoc: true              → phải trả lời mới đi tiếp được

   Câu chọn nhiều có tronThuTu: true sẽ hiện lựa chọn theo thứ tự ngẫu nhiên cho mỗi người
   ("Khác (ghi rõ)" và các lựa chọn trong luaChonDuyNhat luôn nằm cuối).

   Câu có layLuaChonTu: "B4" chỉ hiện những lựa chọn đã tick ở B4.
   Thêm boQuaKhiMotLuaChon: true thì nếu câu nguồn chỉ tick 1 lựa chọn, trang bỏ qua câu này
   và tự ghi lựa chọn đó vào cột của câu.

   Câu gõ chữ có moiLuaChonMotO: "C9" sẽ hiện một ô cho mỗi lựa chọn đã tick ở C9.
   ===================================================================== */

// Danh sách vị trí, dùng chung cho B2 và C9. Sửa ở đây là đổi cả hai câu.
const DS_VI_TRI = [
  "Môi giới/kinh doanh", "Nghiên cứu thị trường", "Thẩm định giá", "Phát triển dự án", "Phân tích đầu tư",
  "Quản lý dự án", "Quản lý vận hành tài sản/tòa nhà", "Marketing BĐS", "Pháp lý dự án",
  "Phát triển mặt bằng cho chuỗi bán lẻ (site developer)", "Khác (ghi rõ)",
];

window.SURVEY = {
  tieuDe: "Năm 2 ngành BĐS: Bạn sẽ làm gì với tương lai của chính mình?",
  thoiGian: "7–10 phút",

  loiMoDau: {
    // Mỗi dòng trong danh sách là một đoạn văn trên trang đầu
    chao: [
      "Bước qua năm 1, câu hỏi “sau này mình sẽ làm gì?” bắt đầu đến gần hơn: bạn chọn chuyên ngành nào, theo nghề gì, bắt đầu từ đâu. Có bạn may mắn hơn khi đã thấy khá rõ hướng đi nhưng cũng có những bạn đang cân nhắc một vài hướng, cũng không thiếu những bạn vẫn còn mông lung. Thời điểm này, những chuyện đó vẫn rất đỗi bình thường.",
      "Nhằm giúp các bạn có thêm nguồn thông tin tham khảo, trong phạm vi khả năng của REC, khảo sát này dành riêng cho sinh viên năm 2 ngành Bất động sản UEH. REC muốn nghe chính các bạn kể điều gì đang giúp và điều gì đang làm khó các bạn khi định hướng nghề. Câu trả lời của bạn sẽ giúp REC mời đúng những anh chị đi trước và có ý tưởng tổ chức những hoạt động thật sự có ích cho các bạn.",
    ],
    gachDau: [
      "Thời gian: khoảng 7–10 phút.",
      "Khảo sát hoàn toàn ẩn danh. Email ở cuối là không bắt buộc.",
      "Không có câu trả lời đúng hay sai. Hãy trả lời theo đúng trải nghiệm của bạn.",
      "Câu nào không áp dụng với bạn, bạn có thể bỏ qua.",
    ],
    thangDiem: "Thang điểm dùng chung cho các câu đánh giá: 1 = Hoàn toàn không đồng ý · 2 = Không đồng ý · 3 = Trung lập · 4 = Đồng ý · 5 = Hoàn toàn đồng ý.",
  },

  // Nhãn của 5 mức trong câu thang 1–5
  thangDiem: ["Hoàn toàn không đồng ý", "Không đồng ý", "Trung lập", "Đồng ý", "Hoàn toàn đồng ý"],

  // Tên 3 giai đoạn trên thanh tiến trình
  cacGiaiDoan: { 1: "Hiểu ngành", 2: "Chọn hướng", 3: "Apply và đi làm" },

  loiCamOn: "Cảm ơn bạn đã dành thời gian!",
  loiMoiChiaSe: "Mình đang làm một khảo sát ngắn (7–10 phút) về định hướng nghề nghiệp, dành cho sinh viên năm 2 ngành BĐS UEH. Bạn làm giúp mình nhé!",

  // Màn hiện ra khi người trả lời không thuộc nhóm khảo sát (xem chiTiepTucKhi ở câu A1 và A2)
  loiDungSom: {
    tieuDe: "Khảo sát này dành cho sinh viên năm 2 ngành BĐS UEH",
    noiDung: "Cảm ơn bạn đã quan tâm! Lần này nhóm chỉ tìm hiểu khó khăn của các bạn năm 2 ngành Bất động sản tại UEH, nên bạn không cần làm tiếp. Nếu bạn chọn nhầm, hãy bấm “Chọn lại”.",
  },

  cacPhan: [
    {
      ma: "A",
      ten: "Phần A – Thông tin chung",
      nhan: "Bắt đầu",
      giaiDoan: 1, // nằm trong đoạn đầu của thanh tiến trình
      moTa: "Phần này dùng để chia kết quả theo năm học và hoàn cảnh, không dùng để nhận diện người trả lời.",
      cauHoi: [
        // Chỉ sinh viên năm 2 được làm tiếp
        { ma: "A1", loai: "chon1", tieuDe: "Bạn đang là sinh viên năm mấy?",
          luaChon: ["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Đã tốt nghiệp (dưới 2 năm)"],
          chiTiepTucKhi: ["Năm 2"], batBuoc: true },
        // Chỉ sinh viên ngành BĐS của UEH được làm tiếp
        { ma: "A2", loai: "chon1", tieuDe: "Bạn học ngành/chương trình nào?",
          luaChon: ["Bất động sản – UEH", "Ngành khác ở UEH", "Trường khác"],
          chiTiepTucKhi: ["Bất động sản – UEH"], batBuoc: true },
        { ma: "A3", loai: "chon1", tieuDe: "Chuyên ngành bạn đã chọn?",
          luaChon: ["Phát triển BĐS", "Đầu tư tài chính BĐS", "Chưa chọn"] },
        { ma: "A4", loai: "chon1", tieuDe: "Bạn đến từ đâu?",
          luaChon: ["TP.HCM", "Tỉnh/thành khác"] },
        { ma: "A5", loai: "chon1", tieuDe: "Sau khi tốt nghiệp, bạn muốn làm việc ở đâu?",
          luaChon: ["TP.HCM", "Hà Nội hoặc đô thị lớn khác", "Về quê", "Chưa biết"] },
        { ma: "A6", loai: "chon1", tieuDe: "Bạn đã từng thực tập hoặc làm việc trong ngành BĐS chưa?",
          luaChon: ["Chưa", "Đang thực tập/làm việc", "Đã từng"] },
        // Hỏi mở trước khi đưa danh sách khó khăn ở các phần sau, để câu trả lời không bị dẫn dắt
        { ma: "A7", loai: "traLoiNgan",
          tieuDe: "Lần gần nhất bạn thấy bí về chuyện chọn chuyên ngành, chọn nghề hay chọn hướng đi là khi nào? Điều gì làm bạn bí nhất?" },
      ],
    },

    {
      ma: "B",
      ten: "Phần B – Giai đoạn 1: Hiểu biết về ngành",
      nhan: "Giai đoạn 1",
      dongVien: "Khởi động xong! Giờ vào chặng đầu tiên nhé.", // lời động viên ở màn mở đầu phần
      giaiDoan: 1,
      cauHoi: [
        { ma: "B1", loai: "traLoiNgan", tieuDe: "Khi mới vào năm 1, bạn hình dung học ngành BĐS ra trường sẽ làm công việc gì?" },
        { ma: "B2", loai: "chonNhieu", tieuDe: "Hiện tại, bạn biết đến những vị trí nào dành cho người học BĐS?",
          luaChon: DS_VI_TRI },
        { ma: "B3", loai: "thang5", tieuDe: "“Tôi có thể mô tả cụ thể một ngày làm việc của ít nhất 2 vị trí khác ngoài môi giới/kinh doanh.”" },
        { ma: "B4", loai: "chonNhieu", tieuDe: "Bạn đã tìm hiểu về ngành qua những nguồn nào?",
          luaChon: ["Giảng viên trên lớp", "Workshop/talkshow", "Câu lạc bộ", "Anh chị khóa trên", "Người đang đi làm trong ngành",
            "Mạng xã hội", "Báo chí/báo cáo thị trường", "Thực tập/làm thêm", "Khác (ghi rõ)"] },
        // B5 chỉ hiện những nguồn bạn đã chọn ở B4 (nếu bỏ qua B4 thì hiện cả danh sách)
        { ma: "B5", loai: "chon1", tieuDe: "Trong các nguồn trên, nguồn nào giúp bạn hiểu công việc thật nhất?",
          layLuaChonTu: "B4" },
        { ma: "B6", loai: "chon1", tieuDe: "Bạn đã tham gia bao nhiêu workshop/talkshow về ngành BĐS?",
          luaChon: ["0", "1–2", "3–5", "Trên 5"] },
        { ma: "B7", loai: "thang5", tieuDe: "“Sau các workshop đã tham gia, tôi hình dung rõ hơn công việc cụ thể mình có thể làm.”",
          anKhi: { cau: "B6", la: ["0"] } },
        { ma: "B8", loai: "chonNhieu", tieuDe: "Nếu workshop chưa giúp bạn nhiều, lý do là gì?",
          luaChon: ["Nội dung chung chung, nói về thị trường hơn là công việc", "Diễn giả quá xa giai đoạn của mình",
            "Không có cơ hội hỏi", "Chỉ nói mặt tốt của công việc", "Thiếu ví dụ thực tế", "Workshop vẫn hữu ích", "Khác (ghi rõ)"],
          anKhi: { cau: "B6", la: ["0"] } },
        { ma: "B9", loai: "thang5", tieuDe: "“Tôi thường cảm thấy mông lung về hướng đi nghề nghiệp của mình.”" },
        { ma: "B10", loai: "thang5", tieuDe: "“Tôi hay lo mình đang chậm hơn bạn bè cùng khóa.”" },
      ],
    },

    {
      ma: "C",
      ten: "Phần C – Giai đoạn 2: Chọn hướng",
      nhan: "Giai đoạn 2",
      dongVien: "Xong 1/3 hành trình rồi!",
      giaiDoan: 2,
      cauHoi: [
        { ma: "C11", loai: "thang5", tieuDe: "“Tôi có thể kể ra 3 việc mình làm tốt và 1 kiểu công việc mình chắc chắn không muốn làm.”" },
        // Đọc cùng C11: biết mình là ai (C11) nhưng chưa nối được với nghề (C18)
        { ma: "C18", loai: "thang5", tieuDe: "“Tôi biết những điểm mạnh và sở thích của mình phù hợp với vị trí nào trong ngành BĐS.”" },
        { ma: "C1", loai: "chon1", tieuDe: "Bạn đã có hướng nghề muốn theo chưa?",
          luaChon: ["Đã rõ một hướng", "Đang cân nhắc vài hướng", "Chưa có hướng nào"] },
        { ma: "C2", loai: "traLoiNgan", tieuDe: "Nếu đã có hướng, đó là vị trí nào?",
          anKhi: { cau: "C1", la: ["Chưa có hướng nào"] } },
        { ma: "C3", loai: "chonNhieu", tieuDe: "Hướng đó dựa trên căn cứ gì?",
          luaChon: ["Đã trải nghiệm công việc thật", "Trò chuyện với người đang làm vị trí đó", "Nghe giảng/workshop",
            "Đọc trên mạng", "Cảm nhận cá nhân về tính cách của mình", "Theo bạn bè/gia đình", "Khác (ghi rõ)"],
          anKhi: { cau: "C1", la: ["Chưa có hướng nào"] } },
        { ma: "C4", loai: "thang5", tieuDe: "“Tôi có thể kể ra ít nhất 3 việc cụ thể mà người làm vị trí tôi muốn theo phải làm hằng tuần.”",
          anKhi: { cau: "C1", la: ["Chưa có hướng nào"] } },
        // Chọn chuyên ngành: căn cứ (C15) và hiểu biết về chuyên ngành (C14). Thay cho C5 cũ.
        { ma: "C15", loai: "chonNhieu", toiDa: 3, tieuDe: "Bạn đã (hoặc đang) dựa vào điều gì để chọn chuyên ngành?",
          luaChon: ["Công việc mình muốn làm sau này", "Môn học hoặc điểm số", "Lời khuyên của giảng viên hoặc anh chị khóa trên",
            "Theo bạn bè", "Theo gia đình", "Chuyên ngành nào dễ xin việc hơn", "Chưa biết dựa vào đâu", "Khác (ghi rõ)"],
          luaChonDuyNhat: ["Chưa biết dựa vào đâu"] },
        { ma: "C14", loai: "thang5", tieuDe: "“Tôi biết mỗi chuyên ngành có thể dẫn tới những vị trí công việc nào.”" },
        { ma: "C13", loai: "thang5", tieuDe: "“Tôi có thể kể ra 2–3 kỹ năng hoặc kinh nghiệm cụ thể mà nhà tuyển dụng ngành BĐS cần ở người mới ra trường.”" },
        { ma: "C12", loai: "thang5", tieuDe: "“Tôi lo rằng dù chọn hướng nào, khi đi làm thật mình cũng có thể thấy không hợp.”" },
        // "Chưa từng" không đi chung với các lựa chọn khác: chọn nó sẽ bỏ các lựa chọn còn lại
        { ma: "C6", loai: "chonNhieu", tieuDe: "Bạn đã từng thử công việc thật trong ngành dưới hình thức nào?",
          luaChon: ["Thực tập", "Làm thêm/cộng tác viên", "Dự án của CLB", "Cuộc thi mô phỏng (case)",
            "Đi theo anh chị để quan sát công việc", "Chưa từng"],
          luaChonDuyNhat: ["Chưa từng"] },
        { ma: "C7", loai: "chon1", tieuDe: "Khi cần hỏi về nghề, bạn có người đi trước trong ngành để hỏi không?",
          luaChon: ["Có, và hỏi thường xuyên", "Có, nhưng ngại hỏi", "Không có ai"] },
      ],
    },

    {
      ma: "E",
      ten: "Phần E – Ưu tiên và nhu cầu hỗ trợ",
      nhan: "Chặng cuối",
      dongVien: "Sắp tới đích rồi, cố thêm chút nữa nhé!",
      giaiDoan: 3, // nằm chung đoạn cuối của thanh tiến trình
      cauHoi: [
        // Mỗi lựa chọn chỉ nói một khó khăn. Ghi chú cuối dòng là giả thuyết mà lựa chọn đó kiểm tra.
        // tronThuTu: mỗi người thấy các khó khăn theo thứ tự riêng, để ô đầu danh sách không được chọn nhiều hơn chỉ vì nằm đầu.
        { ma: "E1", loai: "chonNhieu", toiDa: 3, tronThuTu: true,
          tieuDe: "Những khó khăn nào đang ảnh hưởng nhiều nhất đến việc chọn chuyên ngành và hướng nghề của bạn?",
          luaChon: [
            "Chưa biết mình thích gì, giỏi gì",                              // H2
            "Không biết các nghề trong ngành (ngoài môi giới) thực tế làm gì", // H3
            "Thông tin về nghề rời rạc, chủ yếu nghe kể lại",                 // H3
            "Chưa rõ mỗi chuyên ngành sẽ dẫn tới những nghề nào",                   // H1
            "Không biết cần chuẩn bị gì để được nhận (kỹ năng, kinh nghiệm, CV)", // H4
            "Sợ chọn xong, đi làm mới thấy không hợp",                        // H5
            "Chưa có cơ hội thử việc thật (thực tập, dự án)",
            "Không có ai đi trước để hỏi",
            "Áp lực hoặc kỳ vọng từ gia đình",
            "Ít cơ hội việc làm nếu muốn về quê",
            "Khác (ghi rõ)",
            "Hiện mình không thấy khó khăn đáng kể",
          ],
          luaChonDuyNhat: ["Hiện mình không thấy khó khăn đáng kể"] },
        // Chỉ chọn 1 ở E1 thì trang bỏ qua E5 và tự ghi lựa chọn đó vào cột E5
        { ma: "E5", loai: "chon1", tieuDe: "Trong những khó khăn bạn vừa chọn, khó khăn nào lớn nhất?",
          layLuaChonTu: "E1", boQuaKhiMotLuaChon: true, chiHienKhiDaTraLoi: "E1",
          anKhi: { cau: "E1", la: ["Hiện mình không thấy khó khăn đáng kể"] } },
        { ma: "E6", loai: "traLoiNgan", tieuDe: "Vì sao đó là khó khăn lớn nhất với bạn?",
          chiHienKhiDaTraLoi: "E1",
          anKhi: { cau: "E1", la: ["Hiện mình không thấy khó khăn đáng kể"] } },
        // Các câu về anh chị đi trước đặt SAU câu khó khăn (E1, E5, E6),
        // để người trả lời không bị gợi ý chọn những khó khăn mà anh chị giải quyết được.
        { ma: "C9", loai: "chonNhieu", toiDa: 3, tieuDe: "Bạn muốn tìm hiểu kỹ hơn về những vị trí nào?",
          luaChon: DS_VI_TRI },
        { ma: "C10", loai: "chonNhieu", toiDa: 3, tieuDe: "Với vị trí đó, bạn muốn biết điều gì nhất?",
          luaChon: ["Công việc cụ thể hằng ngày", "Kỹ năng và kiến thức cần có", "Cách bắt đầu vào nghề (thực tập, vị trí đầu tiên)",
            "Lộ trình thăng tiến 3–5 năm", "Thu nhập và cách tính thu nhập", "Áp lực, mặt khó của công việc",
            "Cân bằng công việc và cuộc sống", "Ai hợp và ai không hợp với nghề này"] },
        // Muốn nghe về giai đoạn nào trong hành trình của cựu sinh viên (C16), và điều gì về thời đi học của họ (C17)
        { ma: "C16", loai: "chon1",
          tieuDe: "Nếu được nghe một anh/chị cựu sinh viên kể về hành trình của họ, bạn muốn nghe về giai đoạn nào nhất?",
          luaChon: ["Hồi còn đi học: chọn chuyên ngành, chọn hướng, thử việc", "Lúc mới ra trường: tìm công việc đầu tiên",
            "Công việc hiện tại của họ", "Mình không có nhu cầu nghe chia sẻ"] },
        { ma: "C17", loai: "chonNhieu", toiDa: 2, tieuDe: "Về thời còn đi học của anh/chị, bạn muốn nghe điều gì nhất?",
          luaChon: ["Họ đã chọn chuyên ngành dựa vào đâu", "Họ đã thử những gì (CLB, cuộc thi, thực tập)",
            "Lúc họ mông lung và cách họ vượt qua", "Họ nhận ra mình hợp với nghề vào lúc nào",
            "Điều họ ước đã làm khác hồi đi học", "Khác (ghi rõ)"],
          anKhi: { cau: "C16", la: ["Mình không có nhu cầu nghe chia sẻ"] } },
        // Mỗi vị trí chọn ở C9 có một ô riêng. Nếu bỏ qua C9 thì hiện một ô chung với tieuDeKhiKhongChon.
        { ma: "C8", loai: "traLoiNgan", moiLuaChonMotO: "C9",
          tieuDe: "Nếu được gặp một anh/chị đang làm vị trí bạn đã chọn, bạn muốn hỏi câu gì?",
          tieuDeKhiKhongChon: "Nếu có một anh/chị đi trước để hỏi, điều đầu tiên bạn muốn hỏi là gì?" },
        { ma: "E3", loai: "traLoiNgan", tieuDe: "Điều bạn ước được biết sớm hơn về ngành này là gì?" },
        // Email được gửi sang sheet riêng, không nằm chung dòng với câu trả lời
        { ma: "E4", loai: "email", tieuDe: "Nếu muốn nhận nội dung chia sẻ hoặc tham gia các buổi trò chuyện, hãy để lại email.",
          ghiChu: "Không bắt buộc. Email chỉ dùng cho mục đích này và được tách riêng khỏi câu trả lời khi phân tích." },
      ],
    },
  ],

  /* ---------- MÀN HÌNH KẾT QUẢ ---------- */
  ketQua: {
    luuY: "Đây chỉ là gợi ý tham khảo dựa trên câu trả lời của bạn, không phải đánh giá chính xác.",
    giaiDoan: {
      1: {
        ten: "Giai đoạn 1 – Hiểu ngành",
        moDau: "Có vẻ bạn đang ở giai đoạn khám phá ngành. Việc này rất bình thường!",
        goiY: [
          "Chọn 2–3 vị trí ngoài môi giới mà bạn tò mò, rồi tìm đọc một bản mô tả công việc (JD) thật của từng vị trí.",
          "Đi workshop thì chuẩn bị sẵn một câu hỏi: “Một ngày làm việc của anh/chị gồm những gì?”",
          "Hẹn một anh/chị khóa trên đã đi thực tập để nói chuyện 15 phút. Cách này đôi khi giúp bạn rõ hơn nhiều bài đọc.",
        ],
      },
      2: {
        ten: "Giai đoạn 2 – Chọn hướng",
        moDau: "Có vẻ bạn đã bắt đầu có hướng và đang cân nhắc lựa chọn.",
        goiY: [
          "Kiểm chứng hướng bạn chọn bằng cách hỏi một người đang làm vị trí đó: hằng tuần họ thật sự làm gì?",
          "Tìm một cách “thử việc” nhỏ, ví dụ dự án CLB, cuộc thi case hay làm cộng tác viên.",
          "Nếu lý do chọn hướng chủ yếu là “đọc trên mạng” hay “cảm giác”, bạn nên kiểm chứng thêm trước khi chọn chuyên ngành.",
        ],
      },
      3: {
        ten: "Giai đoạn 3 – Apply và đi làm",
        moDau: "Có vẻ bạn đã bước vào giai đoạn apply và trải nghiệm thực tế.",
        goiY: [
          "Sau mỗi lần phỏng vấn, ghi lại các câu được hỏi và chỗ mình trả lời chưa tốt.",
          "Nhờ người đi trước xem CV của bạn, đặt cạnh một JD cụ thể.",
          "Nếu công việc thật khác hình dung, đó là thông tin quý để điều chỉnh hướng, không nhất thiết là thất bại.",
        ],
      },
    },
  },

  /* Quy tắc xếp giai đoạn. "tl" là câu trả lời, ví dụ tl.D1 là đáp án câu D1.
     Câu bị ẩn hoặc bị bỏ qua sẽ không có giá trị. */
  tinhGiaiDoan: function (tl) {
    if (tl.A6 === "Đang thực tập/làm việc" || tl.A6 === "Đã từng") return 3;
    if (tl.C1 === "Đã rõ một hướng" || tl.C1 === "Đang cân nhắc vài hướng" || tl.B3 >= 3) return 2;
    return 1;
  },
};
