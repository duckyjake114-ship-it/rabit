// =====================================================
// trang-chu.js — Trang chủ: thống kê, danh mục, đồ mới đăng
// =====================================================

const nguoiDung = layNguoiDungHienTai();
const tatCaDo = layDanhSachDo();
const doConHang = tatCaDo.filter((d) => !d.daBan);

// Lời chào cá nhân hóa
if (nguoiDung) {
  const ten = nguoiDung.hoTen.split(" ").pop();
  document.getElementById("loi-chao").textContent = `Xin chào, ${ten}! Hôm nay bạn muốn tìm gì? 👋`;
  document.getElementById("tieu-de-keu-goi").textContent = `${ten} ơi, bạn có sách cũ không dùng nữa?`;
}

// Hiệu ứng đếm số
function demSo(phanTu, dich) {
  const batDau = performance.now();
  const thoiGian = 900;
  function buoc(bayGio) {
    const tiLe = Math.min(1, (bayGio - batDau) / thoiGian);
    phanTu.textContent = Math.round(dich * tiLe).toLocaleString("vi-VN");
    if (tiLe < 1) requestAnimationFrame(buoc);
  }
  requestAnimationFrame(buoc);
}

demSo(document.getElementById("so-do"), doConHang.length);
demSo(document.getElementById("so-mien-phi"), doConHang.filter((d) => d.gia === 0).length);
demSo(document.getElementById("so-thanh-vien"), layDanhSachNguoiDung().length);

// Tìm kiếm → chuyển sang trang Danh sách
document.getElementById("form-tim-kiem").addEventListener("submit", (suKien) => {
  suKien.preventDefault();
  const tuKhoa = document.getElementById("tu-khoa").value.trim();
  window.location.href = DUONG_DAN.danhSach + (tuKhoa ? "?tu-khoa=" + encodeURIComponent(tuKhoa) : "");
});

// Danh mục kèm số lượng
document.getElementById("luoi-danh-muc").innerHTML = Object.entries(DANH_MUC)
  .map(([ma, dm]) => {
    const soLuong = doConHang.filter((d) => d.danhMuc === ma).length;
    return `
      <a class="o-danh-muc" href="${DUONG_DAN.danhSach}?danh-muc=${ma}">
        <span class="bieu-tuong">${dm.bieuTuong}</span>
        <strong>${dm.ten}</strong>
        <small>${soLuong} món</small>
      </a>`;
  })
  .join("");

// 4 món mới đăng nhất
const luoiMoiDang = document.getElementById("luoi-moi-dang");
const moiDang = [...doConHang].sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang)).slice(0, 4);

luoiMoiDang.innerHTML = moiDang.length
  ? moiDang.map(taoTheDo).join("")
  : `<div class="trang-trong">
       <div class="bieu-tuong">📭</div>
       <p>Chưa có món đồ nào. Hãy là người đầu tiên đăng đồ!</p>
       <a class="nut nut-chinh" href="${DUONG_DAN.dangDo}">Đăng đồ</a>
     </div>`;

// Bấm vào thẻ → mở chi tiết ở trang Danh sách
luoiMoiDang.addEventListener("click", (suKien) => {
  const the = suKien.target.closest(".the-do");
  if (the) window.location.href = DUONG_DAN.danhSach + "?xem=" + encodeURIComponent(the.dataset.id);
});
luoiMoiDang.addEventListener("keydown", (suKien) => {
  if (suKien.key === "Enter") suKien.target.closest(".the-do")?.click();
});
