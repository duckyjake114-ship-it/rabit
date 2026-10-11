// =====================================================
// xac-thuc.js — Lõi xác thực dùng chung cho mọi trang
// Lưu tài khoản trong localStorage, mật khẩu được băm SHA-256 kèm "muối"
// =====================================================

const KHOA_NGUOI_DUNG = "motsach_nguoi_dung";   // danh sách tài khoản
const KHOA_PHIEN = "motsach_phien";              // phiên đăng nhập hiện tại

// ---------- Tiện ích lưu trữ ----------
function layDanhSachNguoiDung() {
  try {
    return JSON.parse(localStorage.getItem(KHOA_NGUOI_DUNG)) || [];
  } catch (loi) {
    return [];
  }
}

function luuDanhSachNguoiDung(danhSach) {
  localStorage.setItem(KHOA_NGUOI_DUNG, JSON.stringify(danhSach));
}

// ---------- Băm mật khẩu ----------
function taoMuoi() {
  const mang = new Uint8Array(16);
  crypto.getRandomValues(mang);
  return Array.from(mang, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function bamMatKhau(matKhau, muoi) {
  const duLieu = new TextEncoder().encode(muoi + matKhau);
  if (crypto.subtle) {
    const ketQua = await crypto.subtle.digest("SHA-256", duLieu);
    return Array.from(new Uint8Array(ketQua), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Dự phòng khi trình duyệt không hỗ trợ crypto.subtle (không an toàn bằng)
  let h = 0;
  for (const b of duLieu) h = (Math.imul(31, h) + b) | 0;
  return "dp" + (h >>> 0).toString(16);
}

// ---------- Kiểm tra dữ liệu ----------
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
    const v = giaTri.trim().replace(/\s/g, "");
    if (!v) return "Vui lòng nhập số điện thoại.";
    if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(v)) return "Số điện thoại Việt Nam không hợp lệ (VD: 0912345678).";
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

// ---------- Đăng ký ----------
async function dangKy({ hoTen, email, soDienThoai, matKhau }) {
  const danhSach = layDanhSachNguoiDung();
  const emailChuan = email.trim().toLowerCase();

  if (danhSach.some((nd) => nd.email === emailChuan)) {
    throw new Error("Email này đã được đăng ký. Vui lòng đăng nhập.");
  }

  const muoi = taoMuoi();
  const nguoiDungMoi = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    hoTen: hoTen.trim(),
    email: emailChuan,
    soDienThoai: soDienThoai.trim().replace(/\s/g, ""),
    muoi,
    matKhauBam: await bamMatKhau(matKhau, muoi),
    ngayTao: new Date().toISOString(),
  };

  danhSach.push(nguoiDungMoi);
  luuDanhSachNguoiDung(danhSach);
  return nguoiDungMoi;
}

// ---------- Đăng nhập ----------
async function dangNhap(email, matKhau, ghiNho) {
  const emailChuan = email.trim().toLowerCase();
  const nguoiDung = layDanhSachNguoiDung().find((nd) => nd.email === emailChuan);

  // Thông báo chung để không lộ việc email có tồn tại hay không
  const loiChung = "Email hoặc mật khẩu không đúng.";
  if (!nguoiDung) throw new Error(loiChung);

  const bam = await bamMatKhau(matKhau, nguoiDung.muoi);
  if (bam !== nguoiDung.matKhauBam) throw new Error(loiChung);

  const phien = { id: nguoiDung.id, thoiGian: Date.now() };
  // Ghi nhớ → localStorage (giữ sau khi đóng trình duyệt), ngược lại → sessionStorage
  (ghiNho ? localStorage : sessionStorage).setItem(KHOA_PHIEN, JSON.stringify(phien));
  return nguoiDung;
}

// ---------- Phiên làm việc ----------
function layNguoiDungHienTai() {
  const chuoi = sessionStorage.getItem(KHOA_PHIEN) || localStorage.getItem(KHOA_PHIEN);
  if (!chuoi) return null;
  try {
    const { id } = JSON.parse(chuoi);
    return layDanhSachNguoiDung().find((nd) => nd.id === id) || null;
  } catch (loi) {
    return null;
  }
}

function dangXuat() {
  sessionStorage.removeItem(KHOA_PHIEN);
  localStorage.removeItem(KHOA_PHIEN);
  window.location.href = "dang-nhap.html";
}

// ---------- Giao diện dùng chung ----------
function hienLoi(oNhap, thongDiep) {
  const nhom = oNhap.closest(".nhom-o-nhap");
  const vungLoi = nhom.querySelector(".thong-bao-loi");
  nhom.classList.toggle("co-loi", !!thongDiep);
  nhom.classList.toggle("hop-le", !thongDiep && oNhap.value !== "");
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
