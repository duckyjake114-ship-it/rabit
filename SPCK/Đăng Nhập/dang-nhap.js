// =====================================================
// dang-nhap.js — Xử lý form đăng nhập
// =====================================================

chiDanhChoKhach();

const form = document.getElementById("form-dang-nhap");
const oEmail = document.getElementById("email");
const oMatKhau = document.getElementById("mat-khau");
const oGhiNho = document.getElementById("ghi-nho");
const vungThongBao = document.getElementById("thong-bao");
const nutGui = form.querySelector("button[type=submit]");

// Vừa đăng ký xong → điền sẵn email
const emailTuUrl = new URLSearchParams(window.location.search).get("email");
if (emailTuUrl) {
  oEmail.value = emailTuUrl;
  hienThongBao(vungThongBao, "Tài khoản đã được tạo. Mời bạn đăng nhập!", "thanh-cong");
  oMatKhau.focus();
} else if (sessionStorage.getItem(KHOA_QUAY_LAI)) {
  hienThongBao(vungThongBao, "Vui lòng đăng nhập để tiếp tục.", "thong-tin");
}

const kiemTraTatCa = ganKiemTra([
  [oEmail, () => KiemTra.email(oEmail.value)],
  [oMatKhau, () => (oMatKhau.value ? "" : "Vui lòng nhập mật khẩu.")],
]);

form.addEventListener("submit", async (suKien) => {
  suKien.preventDefault();
  vungThongBao.hidden = true;

  if (!kiemTraTatCa()) {
    form.querySelector(".co-loi input")?.focus();
    return;
  }

  nutGui.disabled = true;
  nutGui.textContent = "Đang đăng nhập...";
  try {
    const nguoiDung = await dangNhap(oEmail.value, oMatKhau.value, oGhiNho.checked);
    hienThongBao(vungThongBao, `Chào mừng ${nguoiDung.hoTen} quay trở lại!`, "thanh-cong");

    // Quay lại trang đang xem dở (nếu có), không thì về trang chủ
    const quayLai = sessionStorage.getItem(KHOA_QUAY_LAI);
    sessionStorage.removeItem(KHOA_QUAY_LAI);
    setTimeout(() => (window.location.href = quayLai || DUONG_DAN.trangChu), 800);
  } catch (loi) {
    hienThongBao(vungThongBao, loi.message, "that-bai");
    oMatKhau.value = "";
    oMatKhau.focus();
    nutGui.disabled = false;
    nutGui.textContent = "Đăng nhập";
  }
});

// Bản demo lưu dữ liệu ngay trên trình duyệt nên chưa gửi được email khôi phục
document.getElementById("quen-mat-khau").addEventListener("click", (suKien) => {
  suKien.preventDefault();
  hienThongBao(
    vungThongBao,
    "Tính năng khôi phục mật khẩu qua email sẽ sớm ra mắt. Hiện bạn có thể tạo tài khoản mới.",
    "thong-tin"
  );
});

ganNutAnHienMatKhau();
