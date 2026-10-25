// =====================================================
// api.js — Gọi API bên ngoài bằng fetch()
// Nguồn dữ liệu: Open Library API (https://openlibrary.org/developers/api)
// Miễn phí, không cần khóa API, cho phép gọi trực tiếp từ trình duyệt.
// =====================================================

const API_GOC = "https://openlibrary.org";
const API_ANH_BIA = "https://covers.openlibrary.org/b/id/";
const KHOA_BO_NHO_DEM = "motsach_api_";       // tiền tố khóa lưu tạm kết quả API
const THOI_GIAN_LUU_TAM = 60 * 60 * 1000;     // giữ kết quả 1 giờ

// Hàm gọi API chung: có giới hạn thời gian chờ và thông báo lỗi tiếng Việt
async function goiApi(duongDan, thoiGianCho = 10000) {
  const boHuy = new AbortController();
  const henGio = setTimeout(() => boHuy.abort(), thoiGianCho);

  try {
    const phanHoi = await fetch(API_GOC + duongDan, { signal: boHuy.signal });
    if (!phanHoi.ok) {
      throw new Error(`Máy chủ trả về lỗi ${phanHoi.status}. Vui lòng thử lại sau.`);
    }
    return await phanHoi.json();
  } catch (loi) {
    if (loi.name === "AbortError") throw new Error("Máy chủ phản hồi quá lâu. Vui lòng thử lại.");
    if (loi instanceof TypeError) throw new Error("Không kết nối được tới máy chủ. Hãy kiểm tra mạng Internet.");
    throw loi;
  } finally {
    clearTimeout(henGio);
  }
}

// Lưu tạm kết quả vào localStorage để đỡ gọi API lặp lại
function docBoNhoDem(khoa, chapNhanCu = false) {
  const banGhi = docDuLieu(KHOA_BO_NHO_DEM + khoa, null);
  if (!banGhi) return null;
  if (!chapNhanCu && Date.now() - banGhi.thoiGian > THOI_GIAN_LUU_TAM) return null;
  return banGhi.duLieu;
}

function ghiBoNhoDem(khoa, duLieu) {
  try {
    ghiDuLieu(KHOA_BO_NHO_DEM + khoa, { thoiGian: Date.now(), duLieu });
  } catch (loi) {
    // Bộ nhớ đầy thì bỏ qua, không ảnh hưởng chức năng chính
  }
}

// Chuyển dữ liệu thô của Open Library sang dạng dễ dùng
function chuanHoaSach(sach) {
  const tacGia = Array.isArray(sach.author_name) ? sach.author_name.slice(0, 3).join(", ") : "";
  return {
    ma: sach.key || "",
    ten: sach.title || "Không rõ tên",
    tacGia: tacGia || "Chưa rõ tác giả",
    namXuatBan: sach.first_publish_year || "",
    soTrang: sach.number_of_pages_median || "",
    anhBia: sach.cover_i ? `${API_ANH_BIA}${sach.cover_i}-M.jpg` : "",
    lienKet: sach.key ? API_GOC + sach.key : API_GOC,
  };
}

const TRUONG_CAN_LAY = "key,title,author_name,first_publish_year,cover_i,number_of_pages_median";

// Tìm sách theo tên hoặc tác giả
async function timSachApi(tuKhoa, soLuong = 8) {
  const tuKhoaChuan = tuKhoa.trim().toLowerCase();
  const khoa = "tim_" + tuKhoaChuan + "_" + soLuong;
  const daLuu = docBoNhoDem(khoa);
  if (daLuu) return daLuu;

  const duLieu = await goiApi(
    `/search.json?q=${encodeURIComponent(tuKhoaChuan)}&limit=${soLuong}&fields=${TRUONG_CAN_LAY}`
  );
  const ketQua = (duLieu.docs || []).map(chuanHoaSach);
  ghiBoNhoDem(khoa, ketQua);
  return ketQua;
}

// Lấy danh sách sách đang thịnh hành trong ngày
// lamMoi = true: luôn gọi API lấy dữ liệu mới (vẫn giữ dữ liệu cũ phòng khi mất mạng)
async function laySachThinhHanh(soLuong = 6, lamMoi = false) {
  const khoa = "thinh_hanh_" + soLuong;
  const daLuu = lamMoi ? null : docBoNhoDem(khoa);
  if (daLuu) return daLuu;

  try {
    const duLieu = await goiApi(`/trending/daily.json?limit=${soLuong}`);
    const ketQua = (duLieu.works || []).slice(0, soLuong).map(chuanHoaSach);
    ghiBoNhoDem(khoa, ketQua);
    return ketQua;
  } catch (loi) {
    // Mất mạng nhưng còn dữ liệu cũ thì vẫn hiển thị dữ liệu cũ
    const duLieuCu = docBoNhoDem(khoa, true);
    if (duLieuCu) return duLieuCu;
    throw loi;
  }
}
