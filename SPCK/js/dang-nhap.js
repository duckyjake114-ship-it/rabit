// =====================================================
// dang-nhap.js — Xử lý form đăng nhập
// =====================================================

if (layNguoiDungHienTai()) window.location.href = "index.html";

const form = document.getElementById("form-dang-nhap");
const oEmail = document.getElementById("email");
const oMatKhau = document.getElementById("mat-khau");
const oGhiNho = document.getElementById("ghi-nho");
const vungThongBao = document.getElementById("thong-bao");
const nutGui = form.querySelector("button[type=submit]");

// Điền sẵn email nếu vừa đăng ký xong
const emailTuUrl = new URLSearchParams(window.location.search).get("email");
if (emailTuUrl) {
  oEmail.value = emailTuUrl;
  hienThongBao(vungThongBao, "Tài khoản đã được tạo. Mời bạn đăng nhập!", "thanh-cong");
  oMatKhau.focus();
}

const quyTac = [
  [oEmail, () => KiemTra.email(oEmail.value)],
  [oMatKhau, () => (oMatKhau.value ? "" : "Vui lòng nhập mật khẩu.")],
];

quyTac.forEach(([oNhap, ham]) => {
  oNhap.addEventListener("blur", () => hienLoi(oNhap, ham()));
  oNhap.addEventListener("input", () => {
    if (oNhap.closest(".nhom-o-nhap").classList.contains("co-loi")) hienLoi(oNhap, ham());
  });
});

form.addEventListener("submit", async (suKien) => {
  suKien.preventDefault();
  vungThongBao.hidden = true;

  const tatCaHopLe = quyTac.map(([oNhap, ham]) => hienLoi(oNhap, ham())).every(Boolean);
  if (!tatCaHopLe) {
    form.querySelector(".co-loi input")?.focus();
    return;
  }

  nutGui.disabled = true;
  nutGui.textContent = "Đang đăng nhập...";
  try {
    const nguoiDung = await dangNhap(oEmail.value, oMatKhau.value, oGhiNho.checked);
    hienThongBao(vungThongBao, `Chào mừng ${nguoiDung.hoTen} quay trở lại!`, "thanh-cong");
    setTimeout(() => (window.location.href = "index.html"), 800);
  } catch (loi) {
    hienThongBao(vungThongBao, loi.message, "that-bai");
    oMatKhau.value = "";
    oMatKhau.focus();
    nutGui.disabled = false;
    nutGui.textContent = "Đăng nhập";
  }
});

// "Quên mật khẩu" — bản demo chỉ lưu cục bộ nên không gửi được email
document.getElementById("quen-mat-khau").addEventListener("click", (suKien) => {
  suKien.preventDefault();
  hienThongBao(
    vungThongBao,
    "Tính năng khôi phục mật khẩu qua email sẽ sớm ra mắt. Bạn có thể tạo tài khoản mới.",
    "thong-tin"
  );
});

ganNutAnHienMatKhau();
