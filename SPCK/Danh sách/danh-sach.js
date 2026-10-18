// =====================================================
// danh-sach.js — Danh sách đồ: tìm kiếm, lọc, sắp xếp, xem chi tiết
// =====================================================

const nguoiDung = layNguoiDungHienTai();
const thamSo = new URLSearchParams(window.location.search);

const oTimKiem = document.getElementById("tim-kiem");
const vungDanhMuc = document.getElementById("loc-danh-muc");
const oKhuVuc = document.getElementById("loc-khu-vuc");
const oTinhTrang = document.getElementById("loc-tinh-trang");
const oMienPhi = document.getElementById("chi-mien-phi");
const oHienDaBan = document.getElementById("hien-da-ban");
const oSapXep = document.getElementById("sap-xep");
const luoiDo = document.getElementById("luoi-do");
const demKetQua = document.getElementById("dem-ket-qua");
const hopChiTiet = document.getElementById("hop-chi-tiet");
const noiDungChiTiet = document.getElementById("noi-dung-chi-tiet");

// Trạng thái bộ lọc
let danhMucChon = DANH_MUC[thamSo.get("danh-muc")] ? thamSo.get("danh-muc") : "";
oTimKiem.value = thamSo.get("tu-khoa") || "";

// Khu vực
oKhuVuc.innerHTML = '<option value="">Tất cả khu vực</option>' + KHU_VUC.map((kv) => `<option>${kv}</option>`).join("");

// Nút chọn danh mục
function veDanhMuc() {
  vungDanhMuc.innerHTML = [["", { ten: "Tất cả", bieuTuong: "" }], ...Object.entries(DANH_MUC)]
    .map(
      ([ma, dm]) =>
        `<button type="button" class="chip${ma === danhMucChon ? " dang-chon" : ""}" data-ma="${ma}">${dm.bieuTuong} ${dm.ten}</button>`
    )
    .join("");
}

vungDanhMuc.addEventListener("click", (suKien) => {
  const chip = suKien.target.closest(".chip");
  if (!chip) return;
  danhMucChon = chip.dataset.ma;
  veDanhMuc();
  veDanhSach();
});

// Bỏ dấu tiếng Việt để tìm kiếm dễ hơn ("toan" tìm được "Toán")
function boDau(chuoi) {
  return chuoi.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

function locDo() {
  const tuKhoa = boDau(oTimKiem.value.trim());
  let ketQua = layDanhSachDo().filter((d) => {
    if (!oHienDaBan.checked && d.daBan) return false;
    if (danhMucChon && d.danhMuc !== danhMucChon) return false;
    if (oKhuVuc.value && d.khuVuc !== oKhuVuc.value) return false;
    if (oTinhTrang.value && d.tinhTrang !== oTinhTrang.value) return false;
    if (oMienPhi.checked && d.gia !== 0) return false;
    if (tuKhoa && !boDau(d.ten + " " + d.moTa).includes(tuKhoa)) return false;
    return true;
  });

  const sapXep = {
    "moi-nhat": (a, b) => new Date(b.ngayDang) - new Date(a.ngayDang),
    "cu-nhat": (a, b) => new Date(a.ngayDang) - new Date(b.ngayDang),
    "gia-tang": (a, b) => a.gia - b.gia,
    "gia-giam": (a, b) => b.gia - a.gia,
  };
  return ketQua.sort(sapXep[oSapXep.value]);
}

function veDanhSach() {
  const ketQua = locDo();
  demKetQua.textContent = `Tìm thấy ${ketQua.length} món đồ`;
  luoiDo.innerHTML = ketQua.length
    ? ketQua.map(taoTheDo).join("")
    : `<div class="trang-trong">
         <div class="bieu-tuong">🔍</div>
         <p>Không tìm thấy món đồ phù hợp. Thử đổi từ khóa hoặc bộ lọc nhé!</p>
         <button type="button" class="nut nut-phu" onclick="document.getElementById('xoa-loc').click()">Xóa bộ lọc</button>
       </div>`;
}

// =========== CHI TIẾT ===========
function moChiTiet(id) {
  const doVat = timDo(id);
  if (!doVat) return;
  const dm = DANH_MUC[doVat.danhMuc] || DANH_MUC.khac;
  const nguoiDang = layNguoiDang(doVat);
  const laCuaToi = nguoiDung && nguoiDung.id === doVat.nguoiDangId;

  let khuVucNut;
  if (laCuaToi) {
    khuVucNut = `
      <div class="hang-nut">
        <a class="nut nut-phu" href="${DUONG_DAN.dangDo}?sua=${encodeURIComponent(doVat.id)}">✏️ Sửa</a>
        <button type="button" class="nut nut-phu" data-hanh-dong="da-ban">${doVat.daBan ? "↩️ Còn hàng" : "✅ Đã bán"}</button>
        <button type="button" class="nut nut-nguy-hiem" data-hanh-dong="xoa">🗑 Xóa</button>
      </div>`;
  } else if (doVat.daBan) {
    khuVucNut = `<p class="thong-bao thong-tin">Món đồ này đã được bán/tặng.</p>`;
  } else if (nguoiDung) {
    khuVucNut = `<a class="nut nut-chinh nut-rong" href="tel:${thoatHtml(nguoiDang.soDienThoai)}">📞 Gọi ${thoatHtml(nguoiDang.soDienThoai)}</a>`;
  } else {
    khuVucNut = `<a class="nut nut-chinh nut-rong" href="${DUONG_DAN.dangNhap}" data-hanh-dong="dang-nhap">🔒 Đăng nhập để xem số điện thoại</a>`;
  }

  noiDungChiTiet.innerHTML = `
    <div class="chi-tiet" data-id="${thoatHtml(doVat.id)}">
      <div class="anh-do">${taoAnhDo(doVat)}</div>
      <div class="chi-tiet-noi-dung">
        <span class="danh-muc-nho">${dm.bieuTuong} ${dm.ten}</span>
        <h2>${thoatHtml(doVat.ten)}</h2>
        <p class="gia">${dinhDangGia(doVat.gia)}</p>
        <dl class="bang-thong-so">
          <dt>Tình trạng</dt><dd>${thoatHtml(doVat.tinhTrang)}</dd>
          <dt>Khu vực</dt><dd>${thoatHtml(doVat.khuVuc)}</dd>
          <dt>Ngày đăng</dt><dd>${dinhDangNgay(doVat.ngayDang)} (${thoiGianTruoc(doVat.ngayDang)})</dd>
        </dl>
        ${doVat.moTa ? `<p class="mo-ta-do">${thoatHtml(doVat.moTa)}</p>` : ""}
        <div class="nguoi-ban">
          <span class="anh-dai-dien">${thoatHtml(chuCaiDau(nguoiDang.hoTen))}</span>
          <div>
            <strong>${thoatHtml(nguoiDang.hoTen)}${laCuaToi ? " (bạn)" : ""}</strong>
            <small>Người đăng</small>
          </div>
        </div>
        ${khuVucNut}
      </div>
    </div>`;

  if (!hopChiTiet.open) hopChiTiet.showModal();
}

noiDungChiTiet.addEventListener("click", (suKien) => {
  const nut = suKien.target.closest("[data-hanh-dong]");
  if (!nut) return;
  const id = noiDungChiTiet.querySelector(".chi-tiet").dataset.id;

  switch (nut.dataset.hanhDong) {
    case "da-ban": {
      const doVat = capNhatDo(id, { daBan: !timDo(id).daBan });
      hienToast(doVat.daBan ? "Đã đánh dấu là đã bán" : "Đã chuyển về còn hàng");
      moChiTiet(id);
      veDanhSach();
      break;
    }
    case "xoa":
      if (confirm("Bạn có chắc muốn xóa món đồ này? Thao tác không thể hoàn tác.")) {
        xoaDo(id);
        hopChiTiet.close();
        hienToast("Đã xóa món đồ");
        veDanhSach();
      }
      break;
    case "dang-nhap":
      // Ghi nhớ món đồ đang xem để quay lại sau khi đăng nhập
      sessionStorage.setItem(KHOA_QUAY_LAI, window.location.pathname + "?xem=" + encodeURIComponent(id));
      break;
  }
});

document.getElementById("nut-dong").addEventListener("click", () => hopChiTiet.close());
// Bấm ra ngoài hộp để đóng
hopChiTiet.addEventListener("click", (suKien) => {
  if (suKien.target === hopChiTiet) hopChiTiet.close();
});

luoiDo.addEventListener("click", (suKien) => {
  const the = suKien.target.closest(".the-do");
  if (the) moChiTiet(the.dataset.id);
});
luoiDo.addEventListener("keydown", (suKien) => {
  if (suKien.key === "Enter" && suKien.target.classList.contains("the-do")) moChiTiet(suKien.target.dataset.id);
});

// =========== SỰ KIỆN BỘ LỌC ===========
let henGioTimKiem;
oTimKiem.addEventListener("input", () => {
  clearTimeout(henGioTimKiem);
  henGioTimKiem = setTimeout(veDanhSach, 200);
});
[oKhuVuc, oTinhTrang, oMienPhi, oHienDaBan, oSapXep].forEach((o) => o.addEventListener("change", veDanhSach));

document.getElementById("xoa-loc").addEventListener("click", () => {
  oTimKiem.value = "";
  oKhuVuc.value = "";
  oTinhTrang.value = "";
  oMienPhi.checked = false;
  oHienDaBan.checked = false;
  oSapXep.value = "moi-nhat";
  danhMucChon = "";
  veDanhMuc();
  veDanhSach();
});

veDanhMuc();
veDanhSach();

// Mở sẵn chi tiết nếu đường dẫn có ?xem=<mã>
if (thamSo.get("xem")) moChiTiet(thamSo.get("xem"));
