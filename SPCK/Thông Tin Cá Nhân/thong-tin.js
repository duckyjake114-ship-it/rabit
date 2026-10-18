// =====================================================
// thong-tin.js — Thông tin cá nhân: hồ sơ, đồ đã đăng, bảo mật
// =====================================================

let nguoiDung = yeuCauDangNhap();

if (nguoiDung) {
  // =========== THẺ HỒ SƠ + THỐNG KÊ ===========
  function veTheHoSo() {
    document.getElementById("anh-dai-dien").textContent = chuCaiDau(nguoiDung.hoTen);
    document.getElementById("ten-hien-thi").textContent = nguoiDung.hoTen;
    document.getElementById("email-hien-thi").textContent = nguoiDung.email;
    document.getElementById("ngay-tham-gia").textContent = dinhDangNgay(nguoiDung.ngayTao);

    const doCuaToi = layDanhSachDo().filter((d) => d.nguoiDangId === nguoiDung.id);
    document.getElementById("tk-da-dang").textContent = doCuaToi.length;
    document.getElementById("tk-con-hang").textContent = doCuaToi.filter((d) => !d.daBan).length;
    document.getElementById("tk-da-ban").textContent = doCuaToi.filter((d) => d.daBan).length;
  }

  // =========== THANH ĐIỀU HƯỚNG PHỤ (TAB) ===========
  const cacNutTab = document.querySelectorAll(".thanh-dieu-huong-phu button");
  const TAB_HOP_LE = ["ho-so", "do-da-dang", "bao-mat"];

  function chonTab(ten) {
    if (!TAB_HOP_LE.includes(ten)) ten = "ho-so";
    cacNutTab.forEach((nut) => nut.setAttribute("aria-selected", nut.dataset.tab === ten));
    TAB_HOP_LE.forEach((t) => (document.getElementById("tab-" + t).hidden = t !== ten));
    // Ghi tab vào đường dẫn để tải lại trang vẫn giữ nguyên tab
    history.replaceState(null, "", "?tab=" + ten);
  }

  cacNutTab.forEach((nut) => nut.addEventListener("click", () => chonTab(nut.dataset.tab)));

  // =========== TAB HỒ SƠ ===========
  const formHoSo = document.getElementById("form-ho-so");
  const oHoTen = document.getElementById("ho-ten");
  const oSoDienThoai = document.getElementById("so-dien-thoai");
  const oKhuVuc = document.getElementById("khu-vuc");
  const oGioiThieu = document.getElementById("gioi-thieu");
  const thongBaoHoSo = document.getElementById("thong-bao-ho-so");

  function doDuLieuHoSo() {
    oHoTen.value = nguoiDung.hoTen;
    document.getElementById("email").value = nguoiDung.email;
    oSoDienThoai.value = nguoiDung.soDienThoai;
    doKhuVuc(oKhuVuc, nguoiDung.khuVuc);
    oGioiThieu.value = nguoiDung.gioiThieu || "";
  }

  const kiemTraHoSo = ganKiemTra([
    [oHoTen, () => KiemTra.hoTen(oHoTen.value)],
    [oSoDienThoai, () => KiemTra.soDienThoai(oSoDienThoai.value)],
    [oKhuVuc, () => (oKhuVuc.value ? "" : "Vui lòng chọn khu vực.")],
  ]);

  formHoSo.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    thongBaoHoSo.hidden = true;
    if (!kiemTraHoSo()) return;

    try {
      nguoiDung = capNhatNguoiDung(nguoiDung.id, {
        hoTen: oHoTen.value.trim().replace(/\s+/g, " "),
        soDienThoai: oSoDienThoai.value.replace(/\s/g, ""),
        khuVuc: oKhuVuc.value,
        gioiThieu: oGioiThieu.value.trim(),
      });
      hienThongBao(thongBaoHoSo, "Đã lưu hồ sơ thành công!", "thanh-cong");
      veTheHoSo();
      veKhungTrang(); // cập nhật tên trên thanh điều hướng
    } catch (loi) {
      hienThongBao(thongBaoHoSo, loi.message, "that-bai");
    }
  });

  // =========== TAB ĐỒ ĐÃ ĐĂNG ===========
  const vungDoCuaToi = document.getElementById("danh-sach-cua-toi");

  function veDoCuaToi() {
    const doCuaToi = layDanhSachDo()
      .filter((d) => d.nguoiDangId === nguoiDung.id)
      .sort((a, b) => new Date(b.ngayDang) - new Date(a.ngayDang));

    if (!doCuaToi.length) {
      vungDoCuaToi.innerHTML = `
        <div class="trang-trong">
          <div class="bieu-tuong">📦</div>
          <p>Bạn chưa đăng món đồ nào.</p>
          <a class="nut nut-chinh" href="${DUONG_DAN.dangDo}">Đăng đồ đầu tiên</a>
        </div>`;
      return;
    }

    vungDoCuaToi.innerHTML = doCuaToi
      .map(
        (d) => `
        <div class="dong-do${d.daBan ? " da-ban" : ""}" data-id="${thoatHtml(d.id)}">
          <div class="anh-do">${taoAnhDo(d)}</div>
          <div>
            <h3>${thoatHtml(d.ten)}
              <span class="trang-thai${d.daBan ? " da-ban" : ""}">${d.daBan ? "Đã bán" : "Còn hàng"}</span>
            </h3>
            <p class="gia">${dinhDangGia(d.gia)}</p>
            <p class="meta">📍 ${thoatHtml(d.khuVuc)} · Đăng ${thoiGianTruoc(d.ngayDang)}</p>
          </div>
          <div class="nut-dong-do">
            <a class="nut nut-phu" href="${DUONG_DAN.dangDo}?sua=${encodeURIComponent(d.id)}">Sửa</a>
            <button type="button" class="nut nut-phu" data-hanh-dong="da-ban">${d.daBan ? "Còn hàng" : "Đã bán"}</button>
            <button type="button" class="nut nut-nguy-hiem" data-hanh-dong="xoa">Xóa</button>
          </div>
        </div>`
      )
      .join("");
  }

  vungDoCuaToi.addEventListener("click", (suKien) => {
    const nut = suKien.target.closest("[data-hanh-dong]");
    if (!nut) return;
    const id = nut.closest(".dong-do").dataset.id;

    if (nut.dataset.hanhDong === "da-ban") {
      const doVat = capNhatDo(id, { daBan: !timDo(id).daBan });
      hienToast(doVat.daBan ? "Đã đánh dấu là đã bán" : "Đã chuyển về còn hàng");
    } else if (nut.dataset.hanhDong === "xoa") {
      if (!confirm("Bạn có chắc muốn xóa món đồ này?")) return;
      xoaDo(id);
      hienToast("Đã xóa món đồ");
    }
    veDoCuaToi();
    veTheHoSo();
  });

  // =========== TAB BẢO MẬT ===========
  const formMatKhau = document.getElementById("form-doi-mat-khau");
  const oMatKhauCu = document.getElementById("mat-khau-cu");
  const oMatKhauMoi = document.getElementById("mat-khau-moi");
  const oXacNhan = document.getElementById("xac-nhan-mat-khau");
  const thongBaoMatKhau = document.getElementById("thong-bao-mat-khau");

  ganThanhDoManh(oMatKhauMoi, document.getElementById("thanh-do-manh"), document.getElementById("chu-do-manh"));

  function kiemTraMatKhauMoi() {
    const loi = KiemTra.matKhau(oMatKhauMoi.value);
    if (loi) return loi;
    if (oMatKhauMoi.value === oMatKhauCu.value) return "Mật khẩu mới phải khác mật khẩu hiện tại.";
    return "";
  }

  function kiemTraXacNhan() {
    if (!oXacNhan.value) return "Vui lòng nhập lại mật khẩu mới.";
    if (oXacNhan.value !== oMatKhauMoi.value) return "Mật khẩu nhập lại không khớp.";
    return "";
  }

  const kiemTraMatKhau = ganKiemTra([
    [oMatKhauCu, () => (oMatKhauCu.value ? "" : "Vui lòng nhập mật khẩu hiện tại.")],
    [oMatKhauMoi, kiemTraMatKhauMoi],
    [oXacNhan, kiemTraXacNhan],
  ]);

  formMatKhau.addEventListener("submit", async (suKien) => {
    suKien.preventDefault();
    thongBaoMatKhau.hidden = true;
    if (!kiemTraMatKhau()) return;

    const nutGui = formMatKhau.querySelector("button[type=submit]");
    nutGui.disabled = true;
    try {
      await doiMatKhau(nguoiDung.id, oMatKhauCu.value, oMatKhauMoi.value);
      nguoiDung = timNguoiDung(nguoiDung.id);
      formMatKhau.reset();
      formMatKhau.querySelectorAll(".hop-le").forEach((nhom) => nhom.classList.remove("hop-le"));
      document.getElementById("thanh-do-manh").dataset.muc = "";
      document.getElementById("chu-do-manh").textContent = "";
      hienThongBao(thongBaoMatKhau, "Đổi mật khẩu thành công!", "thanh-cong");
    } catch (loi) {
      hienThongBao(thongBaoMatKhau, loi.message, "that-bai");
    }
    nutGui.disabled = false;
  });

  document.getElementById("nut-xoa-tai-khoan").addEventListener("click", () => {
    const xacNhan = prompt('Nhập "XOA" để xác nhận xóa vĩnh viễn tài khoản:');
    if (xacNhan === null) return;
    if (xacNhan.trim().toUpperCase() !== "XOA") {
      alert("Bạn nhập chưa đúng, tài khoản chưa bị xóa.");
      return;
    }
    xoaTaiKhoan(nguoiDung.id);
    alert("Tài khoản của bạn đã được xóa. Hẹn gặp lại!");
    window.location.href = DUONG_DAN.trangChu;
  });

  // =========== KHỞI TẠO ===========
  ganNutAnHienMatKhau();
  veTheHoSo();
  doDuLieuHoSo();
  veDoCuaToi();
  chonTab(new URLSearchParams(window.location.search).get("tab"));
}
