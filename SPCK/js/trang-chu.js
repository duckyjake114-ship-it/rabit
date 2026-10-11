// =====================================================
// trang-chu.js — Trang chủ: chỉ dành cho người đã đăng nhập
// =====================================================

const nguoiDung = layNguoiDungHienTai();
if (!nguoiDung) {
  window.location.href = "dang-nhap.html";
} else {
  document.body.classList.add("da-xac-thuc");
  const ten = nguoiDung.hoTen.split(" ").pop();
  document.getElementById("ten-nguoi-dung").textContent = nguoiDung.hoTen;
  document.getElementById("loi-chao").textContent = `Xin chào, ${ten}!`;
  document.getElementById("chu-cai-dau").textContent = ten.charAt(0).toUpperCase();
  document.getElementById("tt-email").textContent = nguoiDung.email;
  document.getElementById("tt-sdt").textContent = nguoiDung.soDienThoai;
  document.getElementById("tt-ngay-tao").textContent = new Date(nguoiDung.ngayTao).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  document.getElementById("nut-dang-xuat").addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) dangXuat();
  });
}

// Danh sách sách gợi ý
const danhSachSach = [
  { ten: "Dế Mèn Phiêu Lưu Ký", tacGia: "Tô Hoài", mau: "#e07a5f" },
  { ten: "Số Đỏ", tacGia: "Vũ Trọng Phụng", mau: "#3d405b" },
  { ten: "Tắt Đèn", tacGia: "Ngô Tất Tố", mau: "#81b29a" },
  { ten: "Truyện Kiều", tacGia: "Nguyễn Du", mau: "#c9a227" },
  { ten: "Mắt Biếc", tacGia: "Nguyễn Nhật Ánh", mau: "#5e81ac" },
  { ten: "Nỗi Buồn Chiến Tranh", tacGia: "Bảo Ninh", mau: "#6d597a" },
];

const luoiSach = document.getElementById("luoi-sach");
danhSachSach.forEach((sach) => {
  const the = document.createElement("article");
  the.className = "the-sach";
  the.innerHTML = `
    <div class="bia-sach" style="background:${sach.mau}"><span></span></div>
    <h3></h3>
    <p></p>`;
  the.querySelector(".bia-sach span").textContent = sach.ten;
  the.querySelector("h3").textContent = sach.ten;
  the.querySelector("p").textContent = sach.tacGia;
  luoiSach.appendChild(the);
});
