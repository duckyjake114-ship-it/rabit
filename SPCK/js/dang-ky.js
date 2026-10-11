// =====================================================
// dang-ky.js — Xử lý form đăng ký
// =====================================================

// Đã đăng nhập thì chuyển thẳng về trang chủ
if (layNguoiDungHienTai()) window.location.href = "index.html";

const form = document.getElementById("form-dang-ky");
const oHoTen = document.getElementById("ho-ten");
const oEmail = document.getElementById("email");
const oSoDienThoai = document.getElementById("so-dien-thoai");
const oMatKhau = document.getElementById("mat-khau");
const oXacNhan = document.getElementById("xac-nhan-mat-khau");
const oDieuKhoan = document.getElementById("dieu-khoan");
const vungThongBao = document.getElementById("thong-bao");
const nutGui = form.querySelector("button[type=submit]");
const thanhManh = document.getElementById("thanh-do-manh");
const chuDoManh = document.getElementById("chu-do-manh");

const NHAN_DO_MANH = ["Rất yếu", "Yếu", "Trung bình", "Khá mạnh", "Rất mạnh"];

function kiemTraXacNhan() {
  if (!oXacNhan.value) return "Vui lòng nhập lại mật khẩu.";
  if (oXacNhan.value !== oMatKhau.value) return "Mật khẩu nhập lại không khớp.";
  return "";
}

const quyTac = [
  [oHoTen, () => KiemTra.hoTen(oHoTen.value)],
  [oEmail, () => KiemTra.email(oEmail.value)],
  [oSoDienThoai, () => KiemTra.soDienThoai(oSoDienThoai.value)],
  [oMatKhau, () => KiemTra.matKhau(oMatKhau.value)],
  [oXacNhan, kiemTraXacNhan],
];

// Kiểm tra khi rời ô nhập, và kiểm tra lại khi gõ nếu ô đang báo lỗi
quyTac.forEach(([oNhap, ham]) => {
  oNhap.addEventListener("blur", () => hienLoi(oNhap, ham()));
  oNhap.addEventListener("input", () => {
    if (oNhap.closest(".nhom-o-nhap").classList.contains("co-loi")) hienLoi(oNhap, ham());
  });
});

// Thanh đo độ mạnh mật khẩu
oMatKhau.addEventListener("input", () => {
  const diem = oMatKhau.value ? doManhMatKhau(oMatKhau.value) : 0;
  thanhManh.dataset.muc = oMatKhau.value ? diem : "";
  chuDoManh.textContent = oMatKhau.value ? "Độ mạnh: " + NHAN_DO_MANH[diem] : "";
  if (oXacNhan.value) hienLoi(oXacNhan, kiemTraXacNhan());
});

form.addEventListener("submit", async (suKien) => {
  suKien.preventDefault();
  vungThongBao.hidden = true;

  const tatCaHopLe = quyTac.map(([oNhap, ham]) => hienLoi(oNhap, ham())).every(Boolean);
  const loiDieuKhoan = oDieuKhoan.checked ? "" : "Bạn cần đồng ý với điều khoản sử dụng.";
  hienLoi(oDieuKhoan, loiDieuKhoan);

  if (!tatCaHopLe || loiDieuKhoan) {
    form.querySelector(".co-loi input")?.focus();
    return;
  }

  nutGui.disabled = true;
  nutGui.textContent = "Đang tạo tài khoản...";
  try {
    const emailDaDangKy = oEmail.value.trim();
    await dangKy({
      hoTen: oHoTen.value,
      email: oEmail.value,
      soDienThoai: oSoDienThoai.value,
      matKhau: oMatKhau.value,
    });
    hienThongBao(vungThongBao, "Đăng ký thành công! Đang chuyển sang trang đăng nhập...", "thanh-cong");
    form.reset();
    setTimeout(() => {
      window.location.href = "dang-nhap.html?email=" + encodeURIComponent(emailDaDangKy);
    }, 1500);
  } catch (loi) {
    hienThongBao(vungThongBao, loi.message, "that-bai");
    nutGui.disabled = false;
    nutGui.textContent = "Tạo tài khoản";
  }
});

ganNutAnHienMatKhau();
