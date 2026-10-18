// =====================================================
// dang-do.js — Đăng đồ mới hoặc sửa món đồ đã đăng (?sua=<mã>)
// =====================================================

const nguoiDung = yeuCauDangNhap();

if (nguoiDung) {
  const form = document.getElementById("form-dang-do");
  const oAnh = document.getElementById("anh");
  const vungTaiAnh = document.getElementById("vung-tai-anh");
  const xemAnh = document.getElementById("xem-anh");
  const goiYAnh = document.getElementById("goi-y-anh");
  const nutXoaAnh = document.getElementById("xoa-anh");
  const oTen = document.getElementById("ten");
  const oDanhMuc = document.getElementById("danh-muc");
  const oKhuVuc = document.getElementById("khu-vuc");
  const oGia = document.getElementById("gia");
  const oMienPhi = document.getElementById("mien-phi");
  const nhomTinhTrang = document.getElementById("nhom-tinh-trang");
  const oMoTa = document.getElementById("mo-ta");
  const demKyTu = document.getElementById("dem-ky-tu");
  const vungThongBao = document.getElementById("thong-bao");
  const nutGui = document.getElementById("nut-gui");
  const theXemTruoc = document.getElementById("the-xem-truoc");

  let anhHienTai = ""; // ảnh đã nén, dạng data URL

  // ----- Đổ dữ liệu vào các ô chọn -----
  oDanhMuc.innerHTML =
    '<option value="">-- Chọn danh mục --</option>' +
    Object.entries(DANH_MUC).map(([ma, dm]) => `<option value="${ma}">${dm.bieuTuong} ${dm.ten}</option>`).join("");
  doKhuVuc(oKhuVuc, nguoiDung.khuVuc);
  nhomTinhTrang.innerHTML = TINH_TRANG.map(
    (tt) => `<label class="lua-chon"><input type="radio" name="tinh-trang" value="${tt}" /><span>${tt}</span></label>`
  ).join("");
  const layTinhTrang = () => form.querySelector('input[name="tinh-trang"]:checked')?.value || "";

  // ----- Chế độ sửa -----
  const maSua = new URLSearchParams(window.location.search).get("sua");
  const doDangSua = maSua ? timDo(maSua) : null;

  if (maSua && (!doDangSua || doDangSua.nguoiDangId !== nguoiDung.id)) {
    hienThongBao(vungThongBao, "Không tìm thấy món đồ hoặc bạn không có quyền sửa. Bạn có thể đăng đồ mới.", "that-bai");
  } else if (doDangSua) {
    document.title = "Sửa đồ | Mọt Sách";
    document.getElementById("tieu-de").textContent = "Sửa thông tin món đồ";
    nutGui.textContent = "Lưu thay đổi";
    oTen.value = doDangSua.ten;
    oDanhMuc.value = doDangSua.danhMuc;
    oKhuVuc.value = doDangSua.khuVuc;
    oMienPhi.checked = doDangSua.gia === 0;
    oGia.value = doDangSua.gia === 0 ? "" : doDangSua.gia;
    oMoTa.value = doDangSua.moTa;
    const radio = form.querySelector(`input[name="tinh-trang"][value="${doDangSua.tinhTrang}"]`);
    if (radio) radio.checked = true;
    if (doDangSua.anh) datAnh(doDangSua.anh);
  }

  // ----- Kiểm tra dữ liệu -----
  function kiemTraTen() {
    const v = oTen.value.trim();
    if (!v) return "Vui lòng nhập tên món đồ.";
    if (v.length < 3) return "Tên phải có ít nhất 3 ký tự.";
    return "";
  }

  function kiemTraGia() {
    if (oMienPhi.checked) return "";
    if (oGia.value === "") return "Vui lòng nhập giá hoặc chọn tặng miễn phí.";
    const gia = Number(oGia.value);
    if (!Number.isInteger(gia) || gia < 0) return "Giá phải là số nguyên không âm.";
    if (gia > 50000000) return "Giá tối đa là 50.000.000 ₫.";
    return "";
  }

  const kiemTraTatCa = ganKiemTra([
    [oTen, kiemTraTen],
    [oDanhMuc, () => (oDanhMuc.value ? "" : "Vui lòng chọn danh mục.")],
    [oKhuVuc, () => (oKhuVuc.value ? "" : "Vui lòng chọn khu vực.")],
    [oGia, kiemTraGia],
  ]);

  function kiemTraTinhTrang() {
    return hienLoi(nhomTinhTrang.querySelector("input"), layTinhTrang() ? "" : "Vui lòng chọn tình trạng.");
  }

  [oDanhMuc, oKhuVuc].forEach((o) =>
    o.addEventListener("change", () => hienLoi(o, o.value ? "" : "Vui lòng chọn mục này."))
  );
  nhomTinhTrang.addEventListener("change", kiemTraTinhTrang);

  // ----- Miễn phí -----
  function capNhatMienPhi() {
    oGia.disabled = oMienPhi.checked;
    if (oMienPhi.checked) oGia.value = "";
    hienLoi(oGia, kiemTraGia());
  }
  oMienPhi.addEventListener("change", capNhatMienPhi);
  oGia.disabled = oMienPhi.checked;

  // ----- Đếm ký tự mô tả -----
  const capNhatDem = () => (demKyTu.textContent = oMoTa.value.length);
  oMoTa.addEventListener("input", capNhatDem);
  capNhatDem();

  // ----- Ảnh: chọn, kéo thả, nén -----
  function datAnh(duLieu) {
    anhHienTai = duLieu;
    xemAnh.src = duLieu;
    xemAnh.hidden = !duLieu;
    goiYAnh.hidden = !!duLieu;
    nutXoaAnh.hidden = !duLieu;
    veXemTruoc();
  }

  // Thu nhỏ ảnh tối đa 800px và nén JPEG để tiết kiệm bộ nhớ trình duyệt
  function nenAnh(tep) {
    return new Promise((giaiQuyet, tuChoi) => {
      const docTep = new FileReader();
      docTep.onerror = () => tuChoi(new Error("Không đọc được ảnh."));
      docTep.onload = () => {
        const anh = new Image();
        anh.onerror = () => tuChoi(new Error("Tệp không phải là ảnh hợp lệ."));
        anh.onload = () => {
          const tiLe = Math.min(1, 800 / Math.max(anh.width, anh.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(anh.width * tiLe);
          canvas.height = Math.round(anh.height * tiLe);
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(anh, 0, 0, canvas.width, canvas.height);
          giaiQuyet(canvas.toDataURL("image/jpeg", 0.75));
        };
        anh.src = docTep.result;
      };
      docTep.readAsDataURL(tep);
    });
  }

  async function xuLyTepAnh(tep) {
    if (!tep) return;
    if (!tep.type.startsWith("image/")) return hienLoi(oAnh, "Vui lòng chọn tệp ảnh (JPG, PNG...).");
    if (tep.size > 5 * 1024 * 1024) return hienLoi(oAnh, "Ảnh quá lớn, tối đa 5MB.");
    try {
      datAnh(await nenAnh(tep));
      hienLoi(oAnh, "");
    } catch (loi) {
      hienLoi(oAnh, loi.message);
    }
  }

  oAnh.addEventListener("change", () => xuLyTepAnh(oAnh.files[0]));
  nutXoaAnh.addEventListener("click", () => {
    oAnh.value = "";
    datAnh("");
  });

  ["dragenter", "dragover"].forEach((ten) =>
    vungTaiAnh.addEventListener(ten, (suKien) => {
      suKien.preventDefault();
      vungTaiAnh.classList.add("dang-keo");
    })
  );
  ["dragleave", "drop"].forEach((ten) =>
    vungTaiAnh.addEventListener(ten, (suKien) => {
      suKien.preventDefault();
      vungTaiAnh.classList.remove("dang-keo");
    })
  );
  vungTaiAnh.addEventListener("drop", (suKien) => xuLyTepAnh(suKien.dataTransfer.files[0]));

  // ----- Xem trước trực tiếp -----
  function layDuLieuForm() {
    return {
      ten: oTen.value.trim(),
      danhMuc: oDanhMuc.value,
      gia: oMienPhi.checked ? 0 : Math.max(0, Math.round(Number(oGia.value) || 0)),
      tinhTrang: layTinhTrang(),
      khuVuc: oKhuVuc.value,
      moTa: oMoTa.value.trim(),
      anh: anhHienTai,
    };
  }

  function veXemTruoc() {
    const duLieu = layDuLieuForm();
    theXemTruoc.innerHTML = taoTheDo({
      ...duLieu,
      id: "xem-truoc",
      ten: duLieu.ten || "Tên món đồ của bạn",
      danhMuc: duLieu.danhMuc || "khac",
      khuVuc: duLieu.khuVuc || "Khu vực",
      ngayDang: new Date().toISOString(),
      daBan: false,
    });
  }

  form.addEventListener("input", veXemTruoc);
  form.addEventListener("change", veXemTruoc);
  veXemTruoc();

  // ----- Gửi form -----
  form.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    vungThongBao.hidden = true;

    const hopLe = [kiemTraTatCa(), kiemTraTinhTrang()].every(Boolean);
    if (!hopLe) {
      form.querySelector(".co-loi input, .co-loi select")?.focus();
      hienThongBao(vungThongBao, "Vui lòng kiểm tra lại các mục được đánh dấu đỏ.", "that-bai");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      if (doDangSua && doDangSua.nguoiDangId === nguoiDung.id) {
        capNhatDo(doDangSua.id, layDuLieuForm());
        hienThongBao(vungThongBao, "Đã lưu thay đổi! Đang chuyển về trang cá nhân...", "thanh-cong");
        setTimeout(() => (window.location.href = DUONG_DAN.thongTin + "?tab=do-da-dang"), 1000);
      } else {
        const doMoi = themDo(nguoiDung, layDuLieuForm());
        hienThongBao(vungThongBao, "Đăng đồ thành công! Đang chuyển tới trang danh sách...", "thanh-cong");
        setTimeout(() => (window.location.href = DUONG_DAN.danhSach + "?xem=" + encodeURIComponent(doMoi.id)), 1000);
      }
      nutGui.disabled = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (loi) {
      hienThongBao(vungThongBao, loi.message, "that-bai");
    }
  });
}
