// =====================================================
// dang-ky.js — Xử lý form đăng ký
// =====================================================

chiDanhChoKhach();

const form = document.getElementById("form-dang-ky");
const oHoTen = document.getElementById("ho-ten");
const oEmail = document.getElementById("email");
const oSoDienThoai = document.getElementById("so-dien-thoai");
const oKhuVuc = document.getElementById("khu-vuc");
const oMatKhau = document.getElementById("mat-khau");
const oXacNhan = document.getElementById("xac-nhan-mat-khau");
const oDieuKhoan = document.getElementById("dieu-khoan");
const vungThongBao = document.getElementById("thong-bao");
const nutGui = form.querySelector("button[type=submit]");

doKhuVuc(oKhuVuc);
ganThanhDoManh(oMatKhau, document.getElementById("thanh-do-manh"), document.getElementById("chu-do-manh"));

function kiemTraXacNhan() {
  if (!oXacNhan.value) return "Vui lòng nhập lại mật khẩu.";
  if (oXacNhan.value !== oMatKhau.value) return "Mật khẩu nhập lại không khớp.";
  return "";
}

const kiemTraTatCa = ganKiemTra([
  [oHoTen, () => KiemTra.hoTen(oHoTen.value)],
  [oEmail, () => KiemTra.email(oEmail.value)],
  [oSoDienThoai, () => KiemTra.soDienThoai(oSoDienThoai.value)],
  [oKhuVuc, () => (oKhuVuc.value ? "" : "Vui lòng chọn khu vực.")],
  [oMatKhau, () => KiemTra.matKhau(oMatKhau.value)],
  [oXacNhan, kiemTraXacNhan],
  [oDieuKhoan, () => (oDieuKhoan.checked ? "" : "Bạn cần đồng ý với điều khoản sử dụng.")],
]);

oKhuVuc.addEventListener("change", () => hienLoi(oKhuVuc, oKhuVuc.value ? "" : "Vui lòng chọn khu vực."));
oDieuKhoan.addEventListener("change", () => hienLoi(oDieuKhoan, oDieuKhoan.checked ? "" : "Bạn cần đồng ý với điều khoản sử dụng."));
// Đổi mật khẩu thì kiểm tra lại ô nhập lại
oMatKhau.addEventListener("input", () => {
  if (oXacNhan.value) hienLoi(oXacNhan, kiemTraXacNhan());
});

form.addEventListener("submit", async (suKien) => {
  suKien.preventDefault();
  vungThongBao.hidden = true;

  if (!kiemTraTatCa()) {
    form.querySelector(".co-loi input, .co-loi select")?.focus();
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
      khuVuc: oKhuVuc.value,
      matKhau: oMatKhau.value,
    });
    hienThongBao(vungThongBao, "Đăng ký thành công! Đang chuyển sang trang đăng nhập...", "thanh-cong");
    form.reset();
    setTimeout(() => {
      window.location.href = DUONG_DAN.dangNhap + "?email=" + encodeURIComponent(emailDaDangKy);
    }, 1500);
  } catch (loi) {
    hienThongBao(vungThongBao, loi.message, "that-bai");
    nutGui.disabled = false;
    nutGui.textContent = "Tạo tài khoản";
  }
});

ganNutAnHienMatKhau();
