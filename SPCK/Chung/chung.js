// =====================================================
// chung.js — Mã dùng chung cho mọi trang của Mọt Sách
// Gồm: lưu trữ, tài khoản, đồ đăng bán, kiểm tra dữ liệu, thanh điều hướng
// =====================================================

const KHOA_NGUOI_DUNG = "motsach_nguoi_dung"; // danh sách tài khoản
const KHOA_PHIEN = "motsach_phien";           // phiên đăng nhập hiện tại
const KHOA_DO = "motsach_do";                 // danh sách đồ được đăng
const KHOA_QUAY_LAI = "motsach_quay_lai";     // trang cần quay lại sau khi đăng nhập

// Đường dẫn giữa các trang (mọi trang đều nằm sâu 1 cấp trong thư mục SPCK)
const DUONG_DAN = {
  trangChu: "../Trang chủ/trang-chu.html",
  danhSach: "../Danh sách/danh-sach.html",
  dangDo: "../Đăng Đồ/dang-do.html",
  thongTin: "../Thông Tin Cá Nhân/thong-tin.html",
  dangNhap: "../Đăng Nhập/dang-nhap.html",
  dangKy: "../Đăng Ký/dang-ky.html",
};

const DANH_MUC = {
  "sach-giao-khoa": { ten: "Sách giáo khoa", bieuTuong: "📘", mau: "#5e81ac" },
  "tham-khao": { ten: "Sách tham khảo", bieuTuong: "📚", mau: "#81b29a" },
  "truyen": { ten: "Truyện & tiểu thuyết", bieuTuong: "📖", mau: "#e07a5f" },
  "ky-nang": { ten: "Sách kỹ năng", bieuTuong: "💡", mau: "#c9a227" },
  "dung-cu": { ten: "Dụng cụ học tập", bieuTuong: "✏️", mau: "#6d597a" },
  "khac": { ten: "Khác", bieuTuong: "📦", mau: "#778579" },
};

const TINH_TRANG = ["Mới", "Như mới", "Đã dùng"];

const KHU_VUC = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Khác"];

// =====================================================
// 1. LƯU TRỮ
// =====================================================
function docDuLieu(khoa, macDinh) {
  try {
    const chuoi = localStorage.getItem(khoa);
    return chuoi === null ? macDinh : JSON.parse(chuoi);
  } catch (loi) {
    return macDinh;
  }
}

function ghiDuLieu(khoa, giaTri) {
  try {
    localStorage.setItem(khoa, JSON.stringify(giaTri));
  } catch (loi) {
    throw new Error("Bộ nhớ trình duyệt đã đầy. Hãy thử ảnh nhỏ hơn hoặc xóa bớt đồ cũ.");
  }
}

// =====================================================
// 2. TÀI KHOẢN
// =====================================================
function layDanhSachNguoiDung() {
  return docDuLieu(KHOA_NGUOI_DUNG, []);
}

function luuDanhSachNguoiDung(danhSach) {
  ghiDuLieu(KHOA_NGUOI_DUNG, danhSach);
}

function timNguoiDung(id) {
  return layDanhSachNguoiDung().find((nd) => nd.id === id) || null;
}

function taoMa() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function taoMuoi() {
  const mang = new Uint8Array(16);
  crypto.getRandomValues(mang);
  return Array.from(mang, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Băm mật khẩu bằng SHA-256 kèm "muối" — không bao giờ lưu mật khẩu gốc
async function bamMatKhau(matKhau, muoi) {
  const duLieu = new TextEncoder().encode(muoi + matKhau);
  if (crypto.subtle) {
    const ketQua = await crypto.subtle.digest("SHA-256", duLieu);
    return Array.from(new Uint8Array(ketQua), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Dự phòng khi trình duyệt không hỗ trợ crypto.subtle
  let h = 0;
  for (const b of duLieu) h = (Math.imul(31, h) + b) | 0;
  return "dp" + (h >>> 0).toString(16);
}

async function dangKy({ hoTen, email, soDienThoai, khuVuc, matKhau }) {
  const danhSach = layDanhSachNguoiDung();
  const emailChuan = email.trim().toLowerCase();

  if (danhSach.some((nd) => nd.email === emailChuan)) {
    throw new Error("Email này đã được đăng ký. Vui lòng đăng nhập.");
  }

  const muoi = taoMuoi();
  const nguoiDungMoi = {
    id: taoMa(),
    hoTen: hoTen.trim().replace(/\s+/g, " "),
    email: emailChuan,
    soDienThoai: soDienThoai.replace(/\s/g, ""),
    khuVuc: khuVuc || "",
    gioiThieu: "",
    muoi,
    matKhauBam: await bamMatKhau(matKhau, muoi),
    ngayTao: new Date().toISOString(),
  };

  danhSach.push(nguoiDungMoi);
  luuDanhSachNguoiDung(danhSach);
  return nguoiDungMoi;
}

async function dangNhap(email, matKhau, ghiNho) {
  const emailChuan = email.trim().toLowerCase();
  const nguoiDung = layDanhSachNguoiDung().find((nd) => nd.email === emailChuan);

  // Thông báo chung để không lộ việc email có tồn tại hay không
  const loiChung = "Email hoặc mật khẩu không đúng.";
  if (!nguoiDung) throw new Error(loiChung);
  if ((await bamMatKhau(matKhau, nguoiDung.muoi)) !== nguoiDung.matKhauBam) throw new Error(loiChung);

  const phien = JSON.stringify({ id: nguoiDung.id, thoiGian: Date.now() });
  // Ghi nhớ → localStorage (còn sau khi tắt trình duyệt), ngược lại → sessionStorage
  (ghiNho ? localStorage : sessionStorage).setItem(KHOA_PHIEN, phien);
  return nguoiDung;
}

function layNguoiDungHienTai() {
  const chuoi = sessionStorage.getItem(KHOA_PHIEN) || localStorage.getItem(KHOA_PHIEN);
  if (!chuoi) return null;
  try {
    return timNguoiDung(JSON.parse(chuoi).id);
  } catch (loi) {
    return null;
  }
}

function xoaPhien() {
  sessionStorage.removeItem(KHOA_PHIEN);
  localStorage.removeItem(KHOA_PHIEN);
}

function dangXuat() {
  xoaPhien();
  window.location.href = DUONG_DAN.dangNhap;
}

function capNhatNguoiDung(id, thayDoi) {
  const danhSach = layDanhSachNguoiDung();
  const viTri = danhSach.findIndex((nd) => nd.id === id);
  if (viTri === -1) throw new Error("Không tìm thấy tài khoản.");
  danhSach[viTri] = { ...danhSach[viTri], ...thayDoi };
  luuDanhSachNguoiDung(danhSach);
  return danhSach[viTri];
}

async function doiMatKhau(id, matKhauCu, matKhauMoi) {
  const nguoiDung = timNguoiDung(id);
  if (!nguoiDung) throw new Error("Không tìm thấy tài khoản.");
  if ((await bamMatKhau(matKhauCu, nguoiDung.muoi)) !== nguoiDung.matKhauBam) {
    throw new Error("Mật khẩu hiện tại không đúng.");
  }
  const muoi = taoMuoi();
  capNhatNguoiDung(id, { muoi, matKhauBam: await bamMatKhau(matKhauMoi, muoi) });
}

function xoaTaiKhoan(id) {
  luuDanhSachNguoiDung(layDanhSachNguoiDung().filter((nd) => nd.id !== id));
  luuDanhSachDo(layDanhSachDo().filter((d) => d.nguoiDangId !== id));
  xoaPhien();
}

// Trang cần đăng nhập: chưa đăng nhập thì chuyển sang trang đăng nhập rồi quay lại sau
function yeuCauDangNhap() {
  const nguoiDung = layNguoiDungHienTai();
  if (!nguoiDung) {
    sessionStorage.setItem(KHOA_QUAY_LAI, window.location.pathname + window.location.search);
    window.location.href = DUONG_DAN.dangNhap;
    return null;
  }
  document.body.classList.add("da-xac-thuc");
  return nguoiDung;
}

// Trang đăng nhập / đăng ký: đã đăng nhập rồi thì về trang chủ
function chiDanhChoKhach() {
  if (layNguoiDungHienTai()) window.location.href = DUONG_DAN.trangChu;
}

// =====================================================
// 3. ĐỒ ĐĂNG BÁN / TẶNG
// =====================================================
function taoDuLieuMau() {
  const gio = 3600 * 1000;
  const mau = [
    ["Sách giáo khoa Toán 12 (trọn bộ)", "sach-giao-khoa", 45000, "Như mới", "Hà Nội", "Trần Minh Khoa", "0987654321", "Bộ sách học năm ngoái, không viết vẽ, còn nguyên bìa bọc.", 3],
    ["Bộ truyện Doraemon 10 tập", "truyen", 80000, "Đã dùng", "TP. Hồ Chí Minh", "Lê Thu Hà", "0905123456", "Truyện đọc để giải trí, giấy hơi ngả màu nhưng không rách trang.", 7],
    ["Tuyển tập đề IELTS Cambridge 15–18", "tham-khao", 120000, "Như mới", "Đà Nẵng", "Phạm Gia Huy", "0934567890", "Kèm file nghe. Mình đã thi xong nên muốn nhượng lại cho bạn cần.", 12],
    ["Máy tính Casio fx-580VN X", "dung-cu", 350000, "Như mới", "Hà Nội", "Trần Minh Khoa", "0987654321", "Dùng được 1 năm, đầy đủ nắp, pin còn tốt. Cho thử máy trước khi lấy.", 20],
    ["Mắt Biếc – Nguyễn Nhật Ánh", "truyen", 0, "Đã dùng", "Cần Thơ", "Nguyễn Thảo Vy", "0918765432", "Tặng miễn phí cho bạn nào yêu văn Nguyễn Nhật Ánh, nhận tại Ninh Kiều.", 26],
    ["Đắc Nhân Tâm (bìa cứng)", "ky-nang", 50000, "Mới", "Bình Dương", "Võ Quốc Bảo", "0976543210", "Được tặng 2 cuốn nên nhượng lại 1, còn nguyên màng co.", 40],
    ["Sách Ngữ văn 11 tập 1 + 2", "sach-giao-khoa", 30000, "Đã dùng", "Bình Dương", "Võ Quốc Bảo", "0976543210", "Có ghi chú bút chì ở vài bài, tẩy được.", 55],
    ["Bộ thước kẻ, compa, ê-ke", "dung-cu", 0, "Đã dùng", "TP. Hồ Chí Minh", "Lê Thu Hà", "0905123456", "Tặng cho các em lớp 6, 7. Nhận tại quận 3.", 70],
  ];
  return mau.map(([ten, danhMuc, gia, tinhTrang, khuVuc, tenNguoiDang, sdtNguoiDang, moTa, soGio], i) => ({
    id: "mau-" + i,
    ten, danhMuc, gia, tinhTrang, khuVuc, moTa,
    anh: "",
    nguoiDangId: "mau",
    tenNguoiDang, sdtNguoiDang,
    ngayDang: new Date(Date.now() - soGio * gio).toISOString(),
    daBan: false,
  }));
}

function layDanhSachDo() {
  let danhSach = docDuLieu(KHOA_DO, null);
  if (danhSach === null) {
    danhSach = taoDuLieuMau();
    ghiDuLieu(KHOA_DO, danhSach);
  }
  return danhSach;
}

function luuDanhSachDo(danhSach) {
  ghiDuLieu(KHOA_DO, danhSach);
}

function timDo(id) {
  return layDanhSachDo().find((d) => d.id === id) || null;
}

function themDo(nguoiDung, duLieu) {
  const doMoi = {
    id: taoMa(),
    ...duLieu,
    nguoiDangId: nguoiDung.id,
    tenNguoiDang: nguoiDung.hoTen,
    sdtNguoiDang: nguoiDung.soDienThoai,
    ngayDang: new Date().toISOString(),
    daBan: false,
  };
  luuDanhSachDo([doMoi, ...layDanhSachDo()]);
  return doMoi;
}

function capNhatDo(id, thayDoi) {
  const danhSach = layDanhSachDo();
  const viTri = danhSach.findIndex((d) => d.id === id);
  if (viTri === -1) throw new Error("Không tìm thấy món đồ.");
  danhSach[viTri] = { ...danhSach[viTri], ...thayDoi };
  luuDanhSachDo(danhSach);
  return danhSach[viTri];
}

function xoaDo(id) {
  luuDanhSachDo(layDanhSachDo().filter((d) => d.id !== id));
}

// Thông tin người đăng: ưu tiên hồ sơ mới nhất, nếu không có thì dùng thông tin lưu kèm
function layNguoiDang(doVat) {
  const nd = timNguoiDung(doVat.nguoiDangId);
  return {
    hoTen: nd ? nd.hoTen : doVat.tenNguoiDang,
    soDienThoai: nd ? nd.soDienThoai : doVat.sdtNguoiDang,
  };
}

// =====================================================
// 4. KIỂM TRA DỮ LIỆU
// =====================================================
const KiemTra = {
  hoTen(giaTri) {
    const v = giaTri.trim();
    if (!v) return "Vui lòng nhập họ và tên.";
    if (v.length < 2) return "Họ và tên phải có ít nhất 2 ký tự.";
    if (!/^[\p{L}\s']+$/u.test(v)) return "Họ và tên chỉ được chứa chữ cái.";
    return "";
  },
  email(giaTri) {
    const v = giaTri.trim();
    if (!v) return "Vui lòng nhập email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Email không hợp lệ.";
    return "";
  },
  soDienThoai(giaTri) {
    const v = giaTri.replace(/\s/g, "");
    if (!v) return "Vui lòng nhập số điện thoại.";
    if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(v)) return "Số điện thoại không hợp lệ (VD: 0912345678).";
    return "";
  },
  matKhau(giaTri) {
    if (!giaTri) return "Vui lòng nhập mật khẩu.";
    if (giaTri.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (!/[A-Z]/.test(giaTri)) return "Mật khẩu cần ít nhất 1 chữ in hoa.";
    if (!/[a-z]/.test(giaTri)) return "Mật khẩu cần ít nhất 1 chữ thường.";
    if (!/\d/.test(giaTri)) return "Mật khẩu cần ít nhất 1 chữ số.";
    return "";
  },
};

// Chấm điểm độ mạnh mật khẩu: 0 → 4
function doManhMatKhau(matKhau) {
  let diem = 0;
  if (matKhau.length >= 8) diem++;
  if (/[A-Z]/.test(matKhau) && /[a-z]/.test(matKhau)) diem++;
  if (/\d/.test(matKhau)) diem++;
  if (/[^A-Za-z0-9]/.test(matKhau) || matKhau.length >= 12) diem++;
  return diem;
}

const NHAN_DO_MANH = ["Rất yếu", "Yếu", "Trung bình", "Khá mạnh", "Rất mạnh"];

// Gắn thanh đo độ mạnh cho một ô mật khẩu
function ganThanhDoManh(oMatKhau, thanh, chu) {
  oMatKhau.addEventListener("input", () => {
    const v = oMatKhau.value;
    thanh.dataset.muc = v ? doManhMatKhau(v) : "";
    chu.textContent = v ? "Độ mạnh: " + NHAN_DO_MANH[doManhMatKhau(v)] : "";
  });
}

// Gắn kiểm tra cho danh sách [ô nhập, hàm kiểm tra]; trả về hàm kiểm tra tất cả
function ganKiemTra(quyTac) {
  quyTac.forEach(([oNhap, ham]) => {
    oNhap.addEventListener("blur", () => hienLoi(oNhap, ham()));
    oNhap.addEventListener("input", () => {
      if (oNhap.closest(".nhom-o-nhap").classList.contains("co-loi")) hienLoi(oNhap, ham());
    });
  });
  return () => quyTac.map(([oNhap, ham]) => hienLoi(oNhap, ham())).every(Boolean);
}

// =====================================================
// 5. GIAO DIỆN DÙNG CHUNG
// =====================================================
function thoatHtml(chuoi) {
  return String(chuoi ?? "").replace(/[&<>"']/g, (k) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[k]));
}

function dinhDangGia(gia) {
  return gia === 0 ? "Tặng miễn phí" : Number(gia).toLocaleString("vi-VN") + " ₫";
}

function dinhDangNgay(iso) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function thoiGianTruoc(iso) {
  const giay = Math.max(0, (Date.now() - new Date(iso)) / 1000);
  if (giay < 60) return "Vừa xong";
  if (giay < 3600) return Math.floor(giay / 60) + " phút trước";
  if (giay < 86400) return Math.floor(giay / 3600) + " giờ trước";
  if (giay < 86400 * 30) return Math.floor(giay / 86400) + " ngày trước";
  return dinhDangNgay(iso);
}

function chuCaiDau(hoTen) {
  return (hoTen.trim().split(/\s+/).pop() || "?").charAt(0).toUpperCase();
}

// Ảnh của món đồ — nếu không có ảnh thì hiện ô màu theo danh mục
function taoAnhDo(doVat) {
  const dm = DANH_MUC[doVat.danhMuc] || DANH_MUC.khac;
  if (doVat.anh && doVat.anh.startsWith("data:image/")) {
    return `<img src="${doVat.anh}" alt="${thoatHtml(doVat.ten)}" loading="lazy" />`;
  }
  return `<div class="anh-thay-the" style="background:${dm.mau}"><span>${dm.bieuTuong}</span></div>`;
}

// Thẻ hiển thị một món đồ (dùng ở trang chủ, danh sách, thông tin cá nhân)
function taoTheDo(doVat) {
  const dm = DANH_MUC[doVat.danhMuc] || DANH_MUC.khac;
  return `
    <article class="the-do${doVat.daBan ? " da-ban" : ""}" data-id="${thoatHtml(doVat.id)}" tabindex="0">
      <div class="anh-do">
        ${taoAnhDo(doVat)}
        ${doVat.daBan ? '<span class="nhan nhan-da-ban">Đã bán</span>' : doVat.gia === 0 ? '<span class="nhan nhan-mien-phi">Miễn phí</span>' : ""}
      </div>
      <div class="the-do-noi-dung">
        <span class="danh-muc-nho">${dm.bieuTuong} ${dm.ten}</span>
        <h3>${thoatHtml(doVat.ten)}</h3>
        <p class="gia">${dinhDangGia(doVat.gia)}</p>
        <p class="meta">📍 ${thoatHtml(doVat.khuVuc)} · ${thoiGianTruoc(doVat.ngayDang)}</p>
      </div>
    </article>`;
}

function hienLoi(oNhap, thongDiep) {
  const nhom = oNhap.closest(".nhom-o-nhap");
  const vungLoi = nhom.querySelector(".thong-bao-loi");
  nhom.classList.toggle("co-loi", !!thongDiep);
  nhom.classList.toggle("hop-le", !thongDiep && oNhap.type !== "checkbox" && oNhap.value !== "");
  vungLoi.textContent = thongDiep;
  return !thongDiep;
}

function hienThongBao(phanTu, noiDung, loai) {
  phanTu.textContent = noiDung;
  phanTu.className = "thong-bao " + loai;
  phanTu.hidden = false;
}

// Nút ẩn/hiện mật khẩu
function ganNutAnHienMatKhau() {
  document.querySelectorAll(".nut-mat").forEach((nut) => {
    nut.addEventListener("click", () => {
      const oNhap = nut.parentElement.querySelector("input");
      const dangAn = oNhap.type === "password";
      oNhap.type = dangAn ? "text" : "password";
      nut.textContent = dangAn ? "Ẩn" : "Hiện";
      nut.setAttribute("aria-label", dangAn ? "Ẩn mật khẩu" : "Hiện mật khẩu");
    });
  });
}

// Đổ danh sách khu vực vào thẻ <select>
function doKhuVuc(oChon, giaTriChon) {
  oChon.innerHTML =
    '<option value="">-- Chọn khu vực --</option>' +
    KHU_VUC.map((kv) => `<option${kv === giaTriChon ? " selected" : ""}>${kv}</option>`).join("");
}

// Thông báo nổi nhỏ ở góc màn hình
function hienToast(noiDung) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = noiDung;
  toast.classList.add("hien");
  clearTimeout(toast._hen);
  toast._hen = setTimeout(() => toast.classList.remove("hien"), 2500);
}

// Thanh điều hướng + chân trang — tự vẽ vào mọi trang có #thanh-dieu-huong / #chan-trang
function veKhungTrang() {
  const dauTrang = document.getElementById("thanh-dieu-huong");
  if (dauTrang) {
    const nd = layNguoiDungHienTai();
    const trangHienTai = document.body.dataset.trang;
    const lienKet = [
      ["trangChu", "Trang chủ"],
      ["danhSach", "Danh sách"],
      ["dangDo", "Đăng đồ"],
      ["thongTin", "Cá nhân"],
    ];

    dauTrang.innerHTML = `
      <a href="${DUONG_DAN.trangChu}" class="logo">📚 Mọt Sách</a>
      <button type="button" class="nut-menu" aria-label="Mở menu" aria-expanded="false">☰</button>
      <nav class="menu-chinh">
        ${lienKet
          .map(([khoa, ten]) => `<a href="${DUONG_DAN[khoa]}"${khoa === trangHienTai ? ' class="dang-chon"' : ""}>${ten}</a>`)
          .join("")}
        <div class="khu-tai-khoan">
          ${
            nd
              ? `<a href="${DUONG_DAN.thongTin}" class="nguoi-dung-nho" title="Thông tin cá nhân">
                   <span class="anh-dai-dien">${thoatHtml(chuCaiDau(nd.hoTen))}</span>
                   <span class="ten-nguoi-dung">${thoatHtml(nd.hoTen)}</span>
                 </a>
                 <button type="button" class="nut nut-phu nut-nho" id="nut-dang-xuat">Đăng xuất</button>`
              : `<a href="${DUONG_DAN.dangNhap}" class="nut nut-phu nut-nho">Đăng nhập</a>
                 <a href="${DUONG_DAN.dangKy}" class="nut nut-chinh nut-nho">Đăng ký</a>`
          }
        </div>
      </nav>`;

    const nutMenu = dauTrang.querySelector(".nut-menu");
    nutMenu.addEventListener("click", () => {
      const mo = dauTrang.classList.toggle("menu-mo");
      nutMenu.setAttribute("aria-expanded", mo);
    });

    dauTrang.querySelector("#nut-dang-xuat")?.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn đăng xuất?")) dangXuat();
    });
  }

  const chanTrang = document.getElementById("chan-trang");
  if (chanTrang) {
    chanTrang.innerHTML = `
      <p><strong>📚 Mọt Sách</strong> — Chợ sách cũ & đồ dùng học tập cho học sinh, sinh viên.</p>
      <p>© ${new Date().getFullYear()} Mọt Sách · Dự án SPCK</p>`;
  }
}

veKhungTrang();
