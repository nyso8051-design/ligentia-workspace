/* Ligentia WorkSpace — Tab 1: Bảng kê Daily (Isolated Module) */
(function () {
  let data = null;
  let cur = null;
  let inclAll = false;
  let period = "";
  let types = new Set();
  let hl = null;
  let go = false;
  let df = 0;
  let dt = 0;
  let dmin = 0;
  let dmax = 0;
  let incU = true;
  let facQuery = "";


/* ---------- Chuẩn hoá & Nhận diện Loại Phí - Số BK ---------- */
const FEE_CANONICAL = [
  { test: /^(phi )?(thu tuc )?(hai quan|tthq)\b/, label: "Phí Thủ Tục Hải Quan" },
  { test: /^(phi )?(co so ha tang|csht|ha tang)\b/, label: "Phí Cơ Sở Hạ Tầng" },
  { test: /^(phi )?nang ha\b/, label: "Phí Nâng Hạ" },
  { test: /^(phi )?kiem hoa\b/, label: "Phí Kiểm Hóa" },
  { test: /^(phi )?(luu cont|luu container|demurrage|detention)\b/, label: "Phí Lưu Cont" },
  { test: /^(phi )?(do|d\/o|lenh giao hang)\b/, label: "Phí D/O" },
  { test: /^(phi )?handling\b/, label: "Phí Handling" },
  { test: /^(phi )?boc xep\b/, label: "Phí Bốc Xếp" },
  { test: /^(phi )?(van chuyen|trucking)\b/, label: "Phí Vận Chuyển" },
  { test: /^(phi )?(hun trung|phun trung)\b/, label: "Phí Hun Trùng" },
  { test: /^(phi )?(chung tu|doc)\b/, label: "Phí Chứng Từ" },
  { test: /^(phi )?thc\b/, label: "Phí THC" },
  { test: /^(phi )?can xe\b/, label: "Phí Cân Xe" },
  { test: /^(phi )?luu bai\b/, label: "Phí Lưu Bãi" },
];

function canonicalFeeName(rawName, cshtAmount = 0) {
  let clean = String(rawName || "")
    .replace(/[–—]/g, "-")
    .replace(/^[\s\-:/.,;]+|[\s\-:/.,;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean && cshtAmount > 0) return "Phí Cơ Sở Hạ Tầng";
  if (!clean) return "Phí Khác";

  const n = norm(clean).replace(/[^a-z0-9/ ]/g, " ").replace(/\s+/g, " ").trim();
  for (const rule of FEE_CANONICAL) {
    if (rule.test.test(n)) return rule.label;
  }
  return clean;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function looksLikeCode(token) {
  const t = token.trim();
  if (!t || t.length < 4 || /\s/.test(t)) return false;
  return /\d/.test(t) && /^[A-Za-z0-9\-_/.]+$/.test(t);
}

/**
 * Tách "Loại Phí" và "Số BK" từ cột Nội dung + Số BK,
 * luôn trả về displayItem theo đúng cấu trúc: "Loại Phí - Số BK"
 */
function parseFee(rawItem, rawBk, cshtAmount = 0) {
  const bkCol = String(rawBk || "").trim();
  let item = String(rawItem || "").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  let extractedBk = "";
  let feePart = item;

  if (bkCol && item) {
    // Xóa hậu tố "- <Số BK>" hoặc "(<Số BK>)" khớp chính xác với cột Số BK
    const bkEsc = escapeRegExp(bkCol);
    const reEnd = new RegExp(`(?:\\s*[-:/]\\s*|\\s*\\(\\s*|\\s+)${bkEsc}\\s*\\)?$`, "i");
    if (reEnd.test(item)) {
      feePart = item.replace(reEnd, "").trim();
    }
  }

  // Nếu chưa tách được hoặc cột Số BK trống, thử tách mẫu "<Loại Phí> - <Mã BK>"
  if (feePart === item && item.includes(" - ")) {
    const idx = item.indexOf(" - ");
    const left = item.slice(0, idx).trim();
    const right = item.slice(idx + 3).trim();
    if (left && looksLikeCode(right)) {
      feePart = left;
      extractedBk = right;
    }
  } else if (feePart === item) {
    const m = item.match(/^(.*?)\s*[-:/]\s*([A-Z0-9][A-Z0-9\-_/.]{3,})$/);
    if (m && looksLikeCode(m[2])) {
      feePart = m[1].trim();
      extractedBk = m[2].trim();
    }
  }

  const finalBk = bkCol || extractedBk;
  const feeType = canonicalFeeName(feePart, cshtAmount);
  const feeKey = norm(feeType);
  const displayItem = finalBk ? `${feeType} - ${finalBk}` : feeType;

  return { feeType, feeKey, bk: finalBk, displayItem };
}

function applyRowFee(row, feeType, overrideBk) {
  const bk = overrideBk || row.bk;
  row.bk = bk;
  row.feeType = feeType;
  row.feeKey = norm(feeType);
  row.displayItem = bk ? `${feeType} - ${bk}` : feeType;
}

/* ---------- Đọc & kiểm tra dữ liệu Excel / CSV ---------- */
function txt(v) {
  if (v == null) return "";
  if (typeof v === "number") {
    return Number.isInteger(v) ? v.toLocaleString("fullwide", { useGrouping: false }) : String(v);
  }
  return String(v).trim();
}

function num(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v ?? "").replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function pdate(v) {
  if (v instanceof Date && !isNaN(v)) {
    return { d: v.getDate(), m: v.getMonth() + 1, y: v.getFullYear() };
  }
  if (typeof v === "number" && v > 20000 && v < 80000 && typeof XLSX !== "undefined") {
    const o = XLSX.SSF.parse_date_code(v);
    return o ? { d: o.d, m: o.m, y: o.y } : null;
  }
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/\s+\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?$/, "");
  let m;
  // ISO: YYYY-MM-DD hoặc YYYY/MM/DD
  if ((m = s.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/))) {
    const y = +m[1];
    let mo = +m[2];
    let d = +m[3];
    if (mo > 12 && d <= 12) [mo, d] = [d, mo];
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return { d, m: mo, y };
  }
  // VN / EU: DD/MM/YYYY hoặc DD-MM-YYYY
  if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/))) {
    const y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
    let d = +m[1];
    let mo = +m[2];
    if (mo > 12 && d <= 12) [d, mo] = [mo, d];
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31) return { d, m: mo, y };
  }
  return null;
}

function parseWorkbook(wb) {
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: "" });
    const rg = ws["!ref"] ? XLSX.utils.decode_range(ws["!ref"]) : { s: { r: 0, c: 0 } };
    const hi = aoa.findIndex(
      (r) => r.some((c) => /^(nha may|khach hang|factory)/.test(norm(c))) && r.some((c) => /^(noi dung|dien giai|description)/.test(norm(c)))
    );
    if (hi < 0) continue;

    const K = {
      date: /^ngay|^date/,
      ship: /^shipment/,
      bk: /^so bk|^booking/,
      fac: /^nha may|^khach hang|^factory/,
      item: /^noi dung|^dien giai|^description/,
      st: /^trang th|^status/,
      vnd: /^vnd|^so tien|^thanh tien/,
      csht: /^csht\b|^phi csht/,
      usd: /^usd$/,
      hd: /^hd csht|^so hoa don|^hoa don csht|^so hd\b|^hoa don$|^invoice/,
      tk: /^so to khai|^to khai/,
      note: /^ghi chu|^note/,
    };
    const C = {};
    aoa[hi].forEach((h, i) => {
      const t = norm(h);
      for (const k in K) {
        if (!(k in C) && K[k].test(t)) {
          C[k] = i;
          break;
        }
      }
    });

    const rows = [];
    for (let i = hi + 1; i < aoa.length; i++) {
      const r = aoa[i];
      const g = (k) => (k in C ? r[C[k]] : "");
      const fac = txt(g("fac"));
      const ship = txt(g("ship"));
      const rawItem = txt(g("item"));
      const vnd = num(g("vnd"));
      const csht = num(g("csht"));
      const usdCol = num(g("usd"));
      if (!fac && !ship && !rawItem && !vnd && !csht && !usdCol) continue;

      const dvv = g("date");
      const cl = (k) => (k in C ? ws[XLSX.utils.encode_cell({ r: i + rg.s.r, c: C[k] + rg.s.c })] : null);
      const cell = cl("date");
      const date = pdate(cell && cell.w) || pdate(dvv);
      const isU = (c) => !!c && (/\$|usd/i.test(String(c.w ?? "")) || (typeof c.v === "string" && /\$|usd/i.test(c.v)));

      const bkRaw = g("bk");
      const bkTxt = txt(bkRaw);
      const parsedFee = parseFee(rawItem, bkTxt, csht);

      const isUsd = usdCol > 0 || isU(cl("vnd")) || isU(cl("csht"));
      const rawAmt = vnd + csht + usdCol;

      rows.push({
        usdc: isUsd,
        n: i + 1 + rg.s.r,
        date,
        dnote: date ? "" : txt(dvv),
        ship,
        bk: parsedFee.bk,
        sci: typeof bkRaw === "string" && /^\d(\.\d+)?e\+\d+$/i.test(bkRaw.trim()),
        fac,
        rawItem,
        feeType: parsedFee.feeType,
        feeKey: parsedFee.feeKey,
        displayItem: parsedFee.displayItem,
        st: txt(g("st")),
        vnd,
        csht,
        amt: rawAmt,
        base: rawAmt,
        hd: txt(g("hd")),
        tk: txt(g("tk")),
        note: txt(g("note")),
      });
    }
    return { rows, sheet: sn };
  }
  return null;
}

const isCshtRow = (r) => /csht|co so ha tang/.test(r?.feeKey || "");

function validateRows(rows) {
  const seen = new Map();
  rows.forEach((r) => {
    r.ok = norm(r.st) === "posted";
    r.is = [];
    const nm = r.fac.replace(/[\s,;.]+$/, "").replace(/\s+/g, " ");
    const key = norm(nm).replace(/[^a-z0-9 ]/g, "");
    r.key = key;

    if (!r.ok) r.is.push({ l: "err", t: r.st ? `Trạng thái “${r.st}” chưa phải Posted` : "Chưa có trạng thái Posted" });
    if (!nm) r.is.push({ l: "err", t: "Thiếu tên nhà máy" });
    if (r.base <= 0) r.is.push({ l: "warn", t: r.base < 0 ? "Số tiền âm" : "Thiếu số tiền" });
    if (r.base > 0 && r.base < 1000 && !r.usdc) {
      r.is.push({ l: "warn", t: `Số tiền chỉ ${r.base} đ. Nếu là USD, cần ghi kèm ký hiệu $ (VD: 20$)` });
    }
    const isC = isCshtRow(r);
    if (isC && !r.hd) {
      r.is.push({ l: "warn", t: "Phí CSHT chưa có Số hoá đơn" });
    }
    if (!isC && r.csht > 0) {
      r.is.push({ l: "warn", t: "Số tiền nằm ở cột CSHT nhưng nội dung không phải phí CSHT" });
    }
    if (r.sci) {
      r.is.push({ l: "warn", t: `Số BK bị Excel đổi sang dạng khoa học (${r.bk})` });
    }
    const dk = norm(`${r.ship}|${r.feeKey}|${r.bk}|${r.base}`);
    if (seen.has(dk)) {
      r.is.push({ l: "warn", t: `Có thể trùng với dòng ${seen.get(dk)}` });
    } else {
      seen.set(dk, r.n);
    }
  });
}

function buildFactories(rows) {
  validateRows(rows);
  const F = new Map();
  rows.forEach((r) => {
    const nm = r.fac.replace(/[\s,;.]+$/, "").replace(/\s+/g, " ");
    if (!nm) return;
    if (!F.has(r.key)) F.set(r.key, { key: r.key, name: nm, rows: [] });
    F.get(r.key).rows.push(r);
  });
  return [...F.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function rebuildTypeMap(rows) {
  const tm = new Map();
  rows.forEach((r) => {
    if (!r.feeKey) return;
    const prev = tm.get(r.feeKey);
    if (prev) {
      prev.count += 1;
    } else {
      tm.set(r.feeKey, { label: r.feeType, count: 1 });
    }
  });
  return tm;
}

const sel = (r) => types.has(r.feeKey);


function applyFx() {
  if (!data) return;
  const k = fxRate();
  data.rows.forEach((r) => {
    r.usd = !!r.usdc;
    r.amt = r.usd && k ? Math.round(r.base * k) : r.base;
  });
}

function updateFxUi() {
  const k = fxRate();
  $("#fxavg").textContent = k ? `${fmtU(k)} đ/USD` : "—";
  const badge = $("#fxBadge");
  const note = $("#fxNote");

  if (data) {
    const us = data.rows.filter((r) => r.usd);
    const fc = new Set(us.map((r) => r.key)).size;
    if (us.length && !k) {
      badge.className = "fx-badge warn";
      badge.textContent = "Thiếu tỉ giá";
      note.className = "fx-note";
      note.textContent = `Có ${us.length} dòng USD nhưng chưa có tỉ giá hợp lệ.`;
      note.hidden = false;
      return;
    }
    if (us.length) {
      note.className = "fx-note info";
      note.textContent = `Đang quy đổi ${us.length} dòng phí USD (${fc} nhà máy) theo tỉ giá ${fmtU(k)} đ/USD.`;
      note.hidden = false;
    } else {
      note.hidden = true;
    }
  } else {
    note.hidden = true;
  }
}

/* ---------- Lọc & Thống kê ---------- */
const inR = (r) => (r.date ? (!df || dv(r) >= df) && (!dt || dv(r) <= dt) : incU);
const n2d = (x) => ({ d: x % 100, m: Math.floor(x / 100) % 100, y: Math.floor(x / 1e4) });

function setPeriod() {
  if (df || dt) {
    const a = df || dmin;
    const b = dt || dmax;
    period = `${a ? D(n2d(a)) : "…"} – ${b ? D(n2d(b)) : "…"}`;
  } else if (dmin && dmax) {
    period = `${D(n2d(dmin))} – ${D(n2d(dmax))}`;
  }
  $("#period").value = period;
}

const sfx = () => (df || dt ? "-" + period.replace(/[^0-9]+/g, "-").replace(/^-|-$/g, "") : "");

function stats(f) {
  const inc = f.rows
    .filter((r) => (inclAll || r.ok) && sel(r) && inR(r))
    .sort((a, b) => dv(a) - dv(b) || a.n - b.n);

  const subtotal = round3(inc.reduce((s, r) => s + r.amt, 0));
  const vatOn = !!cfg.vatOn;
  const taxRate = vatOn ? Math.max(0, Number(cfg.vatRate) || 0) : 0;
  const taxable =
    vatOn && taxRate > 0 ? round3(inc.filter((r) => !isCshtRow(r)).reduce((s, r) => s + r.amt, 0)) : 0;
  const tax = taxable > 0 ? round3((taxable * taxRate) / 100) : 0;
  const showVat = tax > 0;
  const total = round3(subtotal + tax);

  return {
    inc,
    subtotal,
    vatOn,
    showVat,
    taxRate,
    taxLabel: String(round3(taxRate)),
    taxable,
    tax,
    total,
    err: f.rows.filter((r) => r.is.some((i) => i.l === "err")).length,
    warn: f.rows.filter((r) => !r.is.some((i) => i.l === "err") && r.is.length).length,
  };
}

/* ---------- Bảng kê (dùng chung cho Preview, PDF, Excel) ---------- */
const COLS = [
  { h: "STT", e: "No", w: 6, v: (r, k) => k },
  { h: "Ngày", e: "Date", w: 14, v: (r) => D(r.date) || "—" },
  { h: "Shipment", e: "Shipment", w: 14, v: (r) => r.ship },
  { h: "Số BK", e: "Booking no.", w: 22, v: (r) => r.bk },
  { h: "Nội dung", e: "Description", w: 30, v: (r) => r.displayItem },
  { h: "Thành tiền", e: "Amount, VND", w: 20, r: 1, n: 1, v: (r) => r.amt },
  { h: "Số hoá đơn", e: "Invoice no.", w: 18, hdCol: 1, v: (r) => r.hd },
  { h: "Ghi chú", e: "Note", w: 22, o: (r) => r.note, v: (r) => r.note },
];

function model(f) {
  const s = stats(f);
  const cols = COLS.filter((c) => !c.o || s.inc.some(c.o));
  const und = s.inc.filter((r) => !r.date);
  const dated = s.inc.filter((r) => r.date);
  const groups = [];
  const prev = [...new Set(und.map((r) => r.dnote).filter(Boolean))].join(" ");
  if (und.length) groups.push({ t: `Khoản thu bổ sung kỳ trước${prev ? ` (${prev})` : ""}`, rows: und });
  if (dated.length) groups.push({ t: und.length ? "Phát sinh trong kỳ" : "", rows: dated });
  return {
    s,
    cols,
    groups,
    ex: f.rows.filter((r) => !(inclAll || r.ok) && sel(r) && inR(r)),
  };
}

function sheet(f, scr) {
  const m = model(f);
  const s = m.s;
  const now = new Date();
  const n = m.cols.length;
  let i = 0;
  const tr = (r, ex) => {
    const k = ex ? "–" : ++i;
    const cl =
      (ex ? "ex " : "") +
      (!ex && r.is.length ? (r.is.some((x) => x.l === "err") ? "fe " : "fw ") : "") +
      (hl === r.n ? "hl" : "");
    return (
      `<tr class="${cl}" data-n="${r.n}" title="${esc(r.is.map((x) => x.t).join("; "))}">` +
      m.cols
        .map((c) => {
          const val = c.n ? fmt(c.v(r)) : c.v(r, k);
          if (scr && !ex && c.hdCol) {
            return `<td class="hd-edit" contenteditable="true" data-hd-row="${r.n}">${esc(val)}</td>`;
          }
          return `<td class="${c.r ? "r" : ""}">${esc(val)}</td>`;
        })
        .join("") +
      "</tr>"
    );
  };
  const g = (t, x) => (t ? `<tr class="grp ${x || ""}"><td colspan="${n}">${esc(t)}</td></tr>` : "");
  const body =
    m.groups.map((x) => g(x.t) + x.rows.map((r) => tr(r)).join("")).join("") +
    (scr && m.ex.length
      ? g("Dòng bị loại khỏi bảng kê vì chưa Posted (không in)", "ex") + m.ex.map((r) => tr(r, 1)).join("")
      : "");
  const kv = (l, e, v, b) =>
    v ? `<div class="kv">${l} <i>(${e})</i>: ${b ? `<b class="big">${esc(v)}</b>` : esc(v)}</div>` : "";

  return `<div class="sheet">
    <div class="sh-top">
      <div>${cfg.logo ? `<img src="${cfg.logo}" alt="">` : ""}</div>
      <div class="sh-mid">
        <h2>BẢNG KÊ PHÍ</h2>
        <div class="e">(FEE STATEMENT)</div>
        <div>Ngày <i>(Date)</i> ${now.getDate()} tháng <i>(month)</i> ${now.getMonth() + 1} năm <i>(year)</i> ${now.getFullYear()}</div>
      </div>
      <div class="sh-r">Kỳ <i>(Period)</i>:<br><i style="white-space:nowrap">${esc(period) || "—"}</i></div>
    </div>
    ${kv("Đơn vị lập", "Issuer", cfg.name, 1)}
    ${kv("Mã số thuế", "Tax code", cfg.tax)}
    ${kv("Địa chỉ", "Address", cfg.addr)}
    ${kv("Điện thoại", "Tel", cfg.tel)}
    ${kv("Số tài khoản", "Bank account", cfg.bank)}
    <hr style="border:0;border-top:1px solid #999;margin:8px 0">
    ${kv("Khách hàng", "Customer", f.name, 1)}
    ${s.inc.some((r) => r.usd) ? `<div class="kv"><i>${esc(fxLine())}</i></div>` : ""}
    <table class="t">
      <thead><tr>${m.cols.map((c) => `<th>${c.h}<br><i>(${c.e})</i></th>`).join("")}</tr></thead>
      <tbody>${body}</tbody>
    </table>
    <table class="tt">
      ${
        s.showVat
          ? `<tr><td>Tổng cộng <i>(Subtotal)</i>:</td><td>${fmt(s.subtotal)}</td></tr>
             <tr><td>Thuế GTGT ${esc(s.taxLabel)}% <i>(VAT ${esc(s.taxLabel)}%)</i>${
              s.taxable < s.subtotal ? ` <small class="tax-base">(trên ${fmt(s.taxable)})</small>` : ""
            }:</td><td>${fmt(s.tax)}</td></tr>
             <tr class="gt"><td>Tổng tiền cần trả <i>(Total payment)</i>:</td><td>${fmt(s.total)}</td></tr>`
          : `<tr class="gt"><td>Tổng cộng <i>(Total amount)</i>:</td><td>${fmt(s.total)}</td></tr>`
      }
    </table>
    <div class="wd">Số tiền viết bằng chữ <i>(Total amount in words)</i>: <b>${words(s.total)}</b></div>
    ${cfg.note ? `<div class="nt">${esc(cfg.note)}</div>` : ""}
    <div class="sig">
      <div><b>Người lập</b> <i>(Prepared by)</i><i class="sp"></i><b>${esc(cfg.signer)}</b></div>
      <div><b>Khách hàng xác nhận</b> <i>(Customer confirmation)</i><i class="sp"></i><small>(Ký, đóng dấu / Signature, stamp)</small></div>
    </div>
  </div>`;
}

/* ---------- Xuất Excel có định dạng ---------- */
const sn = (n, u) => {
  const b = n.replace(/[\\\/?*\[\]:]/g, "").slice(0, 28) || "Sheet";
  let k = b;
  let j = 1;
  while (u.has(k)) k = `${b}_${++j}`;
  u.add(k);
  return k;
};

async function buildXlsxBuffer(fs) {
  if (typeof ExcelJS === "undefined") {
    throw new Error("Thư viện xuất Excel (ExcelJS) chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng và tải lại trang.");
  }
  const wb = new ExcelJS.Workbook();
  const u = new Set();
  const img = cfg.logo
    ? wb.addImage({ base64: cfg.logo.replace(/^data:image\/\w+;base64,/, ""), extension: "png" })
    : null;
  const now = new Date();
  const G = "FF8A8896";
  const BL = "FF000000";
  const GR = "FF444444";
  const ln = (c) => ({ style: "thin", color: { argb: c } });
  const bd = { top: ln(G), left: ln(G), bottom: ln(G), right: ln(G) };
  const ft = (z, b, i, c) => ({ name: "Times New Roman", size: z, bold: !!b, italic: !!i, ...(c ? { color: { argb: c } } : {}) });
  const rt = (...p) => ({ richText: p.map(([t, z, b, i, c]) => ({ text: t, font: ft(z || 11, b, i, c) })) });
  const fill = (a) => ({ type: "pattern", pattern: "solid", fgColor: { argb: a } });

  for (const f of fs) {
    const m = model(f);
    const s = m.s;
    const n = m.cols.length;
    const A = 3;
    const Z = n + 2;
    const W = n + 4;
    const half = Math.floor(n / 2);
    const amtIdx = m.cols.findIndex((c) => c.n);
    const amtCol = A + (amtIdx >= 0 ? amtIdx : 5);

    const ws = wb.addWorksheet(sn(f.name, u), {
      views: [{ showGridLines: false }],
      pageSetup: {
        orientation: "landscape",
        paperSize: 9,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        margins: { left: 0.3, right: 0.3, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 },
      },
    });

    const sc = 140 / m.cols.reduce((a, c) => a + c.w, 0);
    const ww = m.cols.map((c) => +(c.w * sc).toFixed(1));
    ws.columns = [1.3, 2.2, ...ww, 2.2, 1.3].map((w) => ({ width: w, style: { font: ft(11) } }));

    const sp = (h) => {
      ws.addRow([]).height = h;
    };
    const mg = (v, al, h, a = A, z = Z, va = "middle") => {
      const r = ws.addRow([]);
      ws.mergeCells(r.number, a, r.number, z);
      const c = r.getCell(a);
      c.value = v;
      if (typeof v === "string") c.font = ft(11);
      c.alignment = { horizontal: al || "left", vertical: va, wrapText: true };
      if (h) r.height = h;
      return r;
    };
    const rl = (h) => {
      const r = ws.addRow([]);
      r.height = h;
      for (let c = A; c <= Z; c++) r.getCell(c).border = { bottom: ln("FF999999") };
    };

    sp(5);
    sp(12);
    let best = null;
    const tw = ww.reduce((x, y) => x + y, 0);
    for (let a = 1; a < n - 1; a++) {
      for (let b = 1; a + b < n; b++) {
        const L = ww.slice(0, a).reduce((x, y) => x + y, 0);
        const R = ww.slice(n - b).reduce((x, y) => x + y, 0);
        if (L >= 24 && R >= 29 && tw - L - R >= 52 && Math.abs(L - R) <= 10) {
          const d = Math.abs(L - R);
          if (!best || d < best.d) best = { a, b, d };
        }
      }
    }
    const ta = best ? A + best.a : A;
    const tz = best ? Z - best.b : Z;
    mg(rt(["BẢNG KÊ PHÍ", 22, 1]), "center", 38, ta, tz);
    mg(rt(["(FEE STATEMENT)", 15, 1, 1]), "center", 24, ta, tz);
    mg(
      rt(
        ["Ngày "],
        ["(Date)", 11, 0, 1, GR],
        [` ${now.getDate()} tháng `],
        ["(month)", 11, 0, 1, GR],
        [` ${now.getMonth() + 1} năm `],
        ["(year)", 11, 0, 1, GR],
        [` ${now.getFullYear()}`]
      ),
      "center",
      22,
      ta,
      tz
    );

    if (best) {
      ws.mergeCells(3, tz + 1, 5, Z);
      const kc = ws.getCell(3, tz + 1);
      kc.value = rt(["Kỳ "], ["(Period)", 11, 0, 1, GR], [":\n"], [period || "—", 11, 0, 1]);
      kc.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
    } else {
      mg(rt(["Kỳ "], ["(Period)", 11, 0, 1, GR], [": "], [period || "—", 11, 0, 1]), "center", 20);
    }

    if (img !== null) {
      const lr = cfg.lr > 0 ? cfg.lr : 2.5149;
      ws.addImage(img, { tl: { col: 2.12, row: best ? 2.15 : 2.05 }, ext: { width: Math.round(78 * lr), height: 78 }, editAs: "oneCell" });
    }

    rl(6);
    const kv = (l, e, v, big) => v && mg(rt([`${l} `], [`(${e})`, 11, 0, 1, GR], [": "], [v, big ? 16 : 11, big]), "left", big ? 26 : 18);
    sp(4);
    kv("Đơn vị lập", "Issuer", cfg.name, 1);
    kv("Mã số thuế", "Tax code", cfg.tax);
    kv("Địa chỉ", "Address", cfg.addr);
    kv("Điện thoại", "Tel", cfg.tel);
    kv("Số tài khoản", "Bank account", cfg.bank);
    rl(6);
    sp(6);
    kv("Khách hàng", "Customer", f.name, 1);
    if (s.inc.some((r) => r.usd)) mg(rt([fxLine(), 11, 0, 1]), "left", 18);
    sp(8);

    const hr = ws.addRow([]);
    hr.height = 36;
    ws.pageSetup.printTitlesRow = `${hr.number}:${hr.number}`;
    m.cols.forEach((c, idx) => {
      const x = hr.getCell(A + idx);
      x.value = rt([`${c.h}\n`, 11, 1], [`(${c.e})`, 11, 0, 1]);
      x.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      x.border = bd;
    });

    let i = 0;
    m.groups.forEach((g) => {
      if (g.t) {
        const r = ws.addRow([]);
        ws.mergeCells(r.number, A, r.number, Z);
        const c = r.getCell(A);
        c.value = g.t;
        c.font = ft(11, 1);
        c.alignment = { vertical: "middle", indent: 1 };
        r.height = 20;
        for (let x = A; x <= Z; x++) {
          r.getCell(x).border = bd;
          r.getCell(x).fill = fill("FFEEF2F8");
        }
      }
      g.rows.forEach((rw) => {
        const k = ++i;
        const r = ws.addRow([]);
        r.height = 22;
        m.cols.forEach((d, j) => {
          const c = r.getCell(A + j);
          c.value = d.v(rw, k);
          c.font = ft(11);
          c.border = bd;
          c.alignment = { horizontal: d.r ? "right" : "center", vertical: "middle", wrapText: true, indent: d.r ? 1 : 0 };
          if (d.n) c.numFmt = xlsxFmt(c.value);
        });
      });
    });

    const tr = (l, v, b) => {
      const val = round3(v);
      const r = ws.addRow([]);
      r.height = b ? 24 : 20;
      if (amtCol > A) {
        if (amtCol - 1 > A) ws.mergeCells(r.number, A, r.number, amtCol - 1);
        const a = r.getCell(A);
        a.value = l;
        a.alignment = { horizontal: "right", vertical: "middle", indent: 1 };
      }
      const c = r.getCell(amtCol);
      c.value = val;
      c.numFmt = xlsxFmt(val);
      c.font = ft(b ? 13 : 11, 1);
      c.alignment = { horizontal: "right", vertical: "middle", indent: 1 };
      if (Z > amtCol) {
        if (Z > amtCol + 1) ws.mergeCells(r.number, amtCol + 1, r.number, Z);
      }
      for (let x = A; x <= Z; x++) r.getCell(x).border = bd;
    };

    if (s.showVat) {
      tr(rt(["Tổng cộng "], ["(Subtotal)", 11, 0, 1], [":"]), s.subtotal);
      const taxParts = [
        [`Thuế GTGT ${s.taxLabel}% `],
        [`(VAT ${s.taxLabel}%)`, 11, 0, 1],
      ];
      if (s.taxable < s.subtotal) {
        taxParts.push([` (trên ${fmt(s.taxable)})`, 10, 0, 1, "FF555555"]);
      }
      taxParts.push([":"]);
      tr(rt(...taxParts), s.tax);
      tr(rt(["Tổng tiền cần trả ", 12, 1], ["(Total payment)", 11, 0, 1], [":", 12, 1]), s.total, 1);
    } else {
      tr(rt(["Tổng cộng "], ["(Total amount)", 11, 0, 1], [":"]), s.total, 1);
    }

    const w = mg(rt(["Số tiền viết bằng chữ "], ["(Total amount in words)", 11, 0, 1], [": "], [words(s.total), 11, 1, 1]), "left", 24);
    w.getCell(A).alignment = { horizontal: "left", vertical: "middle", wrapText: true, indent: 1 };
    for (let x = A; x <= Z; x++) w.getCell(x).border = bd;

    if (cfg.note) {
      sp(6);
      mg(cfg.note, "left", 17 * cfg.note.split("\n").length, A, Z, "top");
    }

    sp(12);
    const two = (a, b, h) => {
      const r = ws.addRow([]);
      ws.mergeCells(r.number, A, r.number, A + half - 1);
      ws.mergeCells(r.number, A + half, r.number, Z);
      r.height = h;
      [
        [A, a],
        [A + half, b],
      ].forEach(([x, v]) => {
        const c = r.getCell(x);
        c.value = v;
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      });
    };
    two(rt(["Người lập ", 11, 1], ["(Prepared by)", 11, 0, 1]), rt(["Khách hàng xác nhận ", 11, 1], ["(Customer confirmation)", 11, 0, 1]), 22);
    two("", "", 74);
    two(rt([cfg.signer || " ", 11, 1]), rt(["(Ký, đóng dấu / Signature, stamp)", 10, 0, 1, "FF555555"]), 20);

    sp(10);
    sp(5);
    const last = ws.rowCount;
    const T = { style: "thick", color: { argb: BL } };
    const t = ln(BL);
    for (let r = 1; r <= last; r++) {
      for (let c = 1; c <= W; c++) {
        const b = {};
        if (r === 1) {
          b.top = T;
          b.bottom = t;
        }
        if (r === last) {
          b.bottom = T;
          b.top = t;
        }
        if (c === 1) {
          b.left = T;
          b.right = t;
        }
        if (c === W) {
          b.right = T;
          b.left = t;
        }
        if (b.top || b.bottom || b.left || b.right) ws.getCell(r, c).border = b;
      }
    }
    ws.eachRow({ includeEmpty: true }, (row) => {
      for (let c = 1; c <= W; c++) {
        const x = row.getCell(c);
        x.font = { size: 11, ...(x.font || {}), name: "Times New Roman" };
      }
    });
    ws.pageSetup.printArea = `A1:${ws.getColumn(W).letter}${last}`;
  }
  return wb.xlsx.writeBuffer();
}


function ready(fs) {
  const r = fs.filter((f) => stats(f).inc.length);
  if (!r.length) {
    toast("Không có dòng nào phù hợp bộ lọc hiện tại.");
    return [];
  }
  if (r.some((f) => stats(f).inc.some((x) => x.usd)) && !fxRate()) {
    toast("Có dòng phí USD nhưng chưa có tỉ giá Vietcombank. Vui lòng tra hoặc nhập tỉ giá.", 5500);
    return [];
  }
  return r;
}

function printSheets(fs) {
  const list = ready(fs);
  if (!list.length) return;
  $("#printArea").innerHTML = list.map((f) => sheet(f, false)).join("");
  setTimeout(() => window.print(), 60);
}

async function exportX(fs, name) {
  const list = ready(fs);
  if (!list.length) return;
  try {
    const buf = await buildXlsxBuffer(list);
    downloadBuffer(name, buf);
    const missingHd = list.reduce(
      (sum, f) => sum + stats(f).inc.filter((r) => isCshtRow(r) && !r.hd).length,
      0
    );
    if (missingHd > 0) {
      toast(`Đã xuất ${name} — Lưu ý: Còn ${missingHd} dòng Phí CSHT chưa có Số hoá đơn`, 5500);
    } else {
      toast(`Đã xuất ${name}`);
    }
  } catch (e) {
    toast(`Không tạo được Excel: ${e.message}`, 5000);
  }
}

const curF = () => data && data.fs.find((x) => x.key === cur);

/* ---------- Render giao diện ---------- */
const issuesHtml = (rows) =>
  `<ul class="issue-list">${rows
    .map((r) =>
      r.is
        .map(
          (i) =>
            `<li data-k="${esc(r.key)}" data-n="${r.n}"><b>Dòng ${r.n}</b> · ${esc(r.fac || "—")} · ${esc(
              r.ship || r.bk
            )} — ${esc(i.t)}</li>`
        )
        .join("")
    )
    .join("")}</ul>`;

function renderStatusPanels(allStats) {
  if (!data) return;
  const R = data.rows;
  const postedCount = R.filter((r) => r.ok).length;
  const totalVnd = allStats.reduce((s, x) => s + x.total, 0);
  const ne = R.filter((r) => r.is.some((i) => i.l === "err")).length;
  const nw = R.filter((r) => !r.is.some((i) => i.l === "err") && r.is.length).length;

  $("#kpis").innerHTML = [
    ["Nhà máy", data.fs.length, ""],
    ["Dòng Posted", `${postedCount} / ${R.length}`, "kpi-ok"],
    ["Tổng tiền bảng kê", `${fmt(totalVnd)} đ`, ""],
    ["Cần kiểm tra", ne + nw ? `${ne} lỗi · ${nw} lưu ý` : "Sạch dữ liệu", ne + nw ? "kpi-warn" : "kpi-ok"],
  ]
    .map(([label, val, cls]) => `<div class="kpi ${cls}"><small>${label}</small><strong>${val}</strong></div>`)
    .join("");

  const bad = R.filter((r) => r.is.length);
  $("#alerts").innerHTML = bad.length
    ? `<div class="banner ${ne ? "banner-err" : "banner-warn"}"><details><summary>${
        ne ? `${ne} dòng chưa Posted (tạm loại khỏi bảng kê)` : `${nw} dòng có lưu ý nhẹ`
      }${ne && nw ? ` · ${nw} lưu ý` : ""}</summary>${issuesHtml(bad)}</details></div>`
    : "";

  const filteredFacs = data.fs.filter((f) => !facQuery || norm(f.name).includes(norm(facQuery)));
  $("#facCount").textContent = filteredFacs.length;
  if (!data.fs.some((f) => f.key === cur)) cur = data.fs[0]?.key;

  $("#list").innerHTML = filteredFacs
    .map((f) => {
      const idx = data.fs.indexOf(f);
      const st = allStats[idx];
      const badge = st.err
        ? `<span class="tag">${st.err} lỗi</span>`
        : st.warn
        ? `<span class="tag w">${st.warn}</span>`
        : "";
      return `<button type="button" class="fb ${f.key === cur ? "sel" : ""}" data-k="${esc(f.key)}">
        <div class="fb-top"><span>${esc(f.name)}</span>${badge}</div>
        <div class="fb-sub">${st.inc.length ? `${fmt(st.total)} đ · ${st.inc.length} dòng` : "Không có dòng khớp lọc"}</div>
      </button>`;
    })
    .join("");

  const f = curF();
  if (f) {
    const b = f.rows.filter((r) => r.is.length);
    const curIdx = data.fs.indexOf(f);
    const curStats = curIdx >= 0 ? allStats[curIdx] : stats(f);
    const missingCshtHd = curStats.inc.filter((r) => isCshtRow(r) && !r.hd);
    const cshtNotice = missingCshtHd.length
      ? `<div class="banner banner-warn"><strong>Lưu ý Phí CSHT:</strong> Có <b>${missingCshtHd.length}</b> dòng Phí Cơ Sở Hạ Tầng trong bảng kê chưa có <b>Số hoá đơn</b>. Bạn có thể bấm trực tiếp vào ô <i>Số hoá đơn</i> trên bảng kê bên dưới để điền hoặc bổ sung vào file Excel gốc.</div>`
      : "";
    $("#fi").innerHTML =
      cshtNotice +
      (b.length
        ? `<div class="banner ${
            b.some((r) => r.is.some((i) => i.l === "err")) ? "banner-err" : "banner-warn"
          }"><details><summary>Nhà máy này có ${b.length} dòng cần lưu ý</summary>${issuesHtml(b)}</details></div>`
        : "");
  }
}

function renderFactoryList() {
  if (!data) return;
  const filteredFacs = data.fs.filter((f) => !facQuery || norm(f.name).includes(norm(facQuery)));
  $("#facCount").textContent = filteredFacs.length;
  $("#list").innerHTML = filteredFacs
    .map((f) => {
      const st = stats(f);
      const badge = st.err
        ? `<span class="tag">${st.err} lỗi</span>`
        : st.warn
        ? `<span class="tag w">${st.warn}</span>`
        : "";
      return `<button type="button" class="fb ${f.key === cur ? "sel" : ""}" data-k="${esc(f.key)}">
        <div class="fb-top"><span>${esc(f.name)}</span>${badge}</div>
        <div class="fb-sub">${st.inc.length ? `${fmt(st.total)} đ · ${st.inc.length} dòng` : "Không có dòng khớp lọc"}</div>
      </button>`;
    })
    .join("");
}

function render() {
  if ($("#bl") && cfg.logo) $("#bl").src = cfg.logo;
  if ($("#sl") && cfg.logo) $("#sl").src = cfg.logo;
  updateFxUi();
  if (!data) return;

  applyFx();
  updateFxUi();
  $("#emptyState").hidden = true;
  $("#work").hidden = false;

  $("#fileName").textContent = data.fileName;
  $("#fileSub").textContent = `Sheet “${data.sheet}” · ${data.rows.length} dòng · ${data.types.size} loại phí`;

  const allStats = data.fs.map(stats);
  renderStatusPanels(allStats);

  $("#chips").innerHTML = [...data.types.entries()]
    .map(
      ([k, meta]) =>
        `<button type="button" class="chip" data-t="${esc(k)}" aria-pressed="${types.has(k)}">${esc(
          meta.label
        )} <span class="chip-count">${meta.count}</span></button>`
    )
    .join("");

  if ($("#vatOn")) $("#vatOn").checked = !!cfg.vatOn;
  if ($("#vatRate")) {
    if (document.activeElement !== $("#vatRate")) {
      $("#vatRate").value = cfg.vatRate ?? 8;
    }
    $("#vatRate").disabled = !cfg.vatOn;
  }

  const f = curF();
  if (f) {
    $("#prev").innerHTML = sheet(f, true);
  }

  if (go) {
    go = false;
    const el = $(`#prev tr[data-n="${hl}"]`);
    el && el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function loadArrayBuffer(buf, fileName) {
  $("#err").hidden = true;
  $("#aiAuditBox").hidden = true;
  try {
    if (typeof XLSX === "undefined") {
      throw new Error("Thư viện đọc Excel (SheetJS) chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng và tải lại trang.");
    }
    const isCsv = /\.csv$/i.test(fileName || "");
    const wb = isCsv
      ? XLSX.read(new TextDecoder("utf-8").decode(buf).replace(/^\uFEFF/, ""), { type: "string" })
      : XLSX.read(new Uint8Array(buf), { type: "array" });
    const p = parseWorkbook(wb);
    if (!p) {
      throw new Error("Không tìm thấy dòng tiêu đề có cột “Nhà máy” và “Nội dung”.");
    }
    const fs = buildFactories(p.rows);
    const tm = rebuildTypeMap(p.rows);
    data = { fileName, sheet: p.sheet, rows: p.rows, fs, types: tm };
    types = new Set(tm.keys());
    hl = null;
    const ds = p.rows.filter((r) => r.date).sort((a, b) => dv(a) - dv(b));
    dmin = ds.length ? dv(ds[0]) : 0;
    dmax = ds.length ? dv(ds[ds.length - 1]) : 0;
    df = 0;
    dt = 0;
    $("#dfrom").value = "";
    $("#dto").value = "";
    period = "";
    setPeriod();
    cur = null;
    render();
  } catch (err) {
    $("#err").textContent = err.message;
    $("#err").hidden = false;
  }
}

function loadFile(file) {
  const fr = new FileReader();
  fr.onload = (e) => loadArrayBuffer(e.target.result, file.name);
  fr.readAsArrayBuffer(file);
}

/* ---------- Tích hợp Gemini AI & Dự phòng thông minh trên trình duyệt ---------- */
function runLocalClassify() {
  let updated = 0;
  data.rows.forEach((r) => {
    const parsed = parseFee(r.rawItem, r.bk, r.csht);
    applyRowFee(r, parsed.feeType, parsed.bk);
    updated++;
  });
  validateRows(data.rows);
  data.types = rebuildTypeMap(data.rows);
  types = new Set(data.types.keys());
  render();
  toast(`Đã chuẩn hoá ${updated} dòng phí theo bộ quy tắc (${data.types.size} loại phí).`);
}

function buildLocalAuditBullets() {
  const notPosted = data.rows.filter((r) => !r.ok).length;
  const missingCshtHd = data.rows.filter((r) => isCshtRow(r) && !r.hd).length;
  const usdRows = data.rows.filter((r) => r.usd).length;
  const dupRows = data.rows.filter((r) => r.is.some((i) => i.t.includes("trùng"))).length;
  const allSt = data.fs.map(stats);
  const totalVnd = allSt.reduce((s, x) => s + x.total, 0);
  const hasVat = allSt.some((x) => x.showVat);
  const bullets = [
    `Tổng hợp ${data.fs.length} nhà máy (${data.rows.length} dòng), tổng tiền cần trả hiện tại${
      hasVat ? ` (đã gồm VAT ${round3(cfg.vatRate ?? 8)}%)` : ""
    }: ${fmt(totalVnd)} đ.`,
  ];
  if (notPosted) bullets.push(`Có ${notPosted} dòng chưa ở trạng thái Posted (đang tạm loại khỏi bảng kê xuất).`);
  if (missingCshtHd) bullets.push(`Lưu ý: Có ${missingCshtHd} dòng Phí CSHT chưa có Số hoá đơn — cần bổ sung trước khi gửi khách hàng.`);
  if (usdRows) {
    bullets.push(
      fxRate()
        ? `Có ${usdRows} dòng phí USD đang quy đổi theo tỉ giá ${fmtU(fxRate())} đ/USD.`
        : `Có ${usdRows} dòng phí USD nhưng chưa có tỉ giá quy đổi hợp lệ.`
    );
  }
  if (dupRows) bullets.push(`Phát hiện ${dupRows} dòng có dấu hiệu trùng Shipment / Booking / Số tiền.`);
  if (!notPosted && !missingCshtHd && !dupRows && (!usdRows || fxRate())) {
    bullets.push("Dữ liệu bảng kê sạch, đầy đủ Số hoá đơn CSHT và sẵn sàng xuất PDF / Excel.");
  }
  return bullets;
}

async function runAiClassify() {
  if (!data) return;
  const btn = $("#aiClassifyBtn");
  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = "Đang chuẩn hoá...";
  try {
    if (!srvInfo.ok || !srvInfo.geminiConfigured) {
      runLocalClassify();
      return;
    }
    const unique = [];
    const seen = new Set();
    data.rows.forEach((r) => {
      const k = `${r.rawItem}||${r.bk}`;
      if (!seen.has(k)) {
        seen.add(k);
        unique.push({ rawItem: r.rawItem, bk: r.bk });
      }
    });

    const res = await fetch("/api/ai/classify-fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: unique }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "AI phản hồi lỗi");

    const map = new Map();
    json.items.forEach((it) => {
      map.set(`${it.rawItem}||${it.bk || ""}`, it);
      map.set(it.rawItem, it);
    });

    let updated = 0;
    data.rows.forEach((r) => {
      const match = map.get(`${r.rawItem}||${r.bk}`) || map.get(r.rawItem);
      if (match && match.feeType) {
        applyRowFee(r, match.feeType.trim(), match.extractedBk || r.bk);
        updated++;
      }
    });

    validateRows(data.rows);
    data.types = rebuildTypeMap(data.rows);
    types = new Set(data.types.keys());
    render();
    toast(`Gemini AI đã chuẩn hoá ${updated} dòng phí (${data.types.size} loại phí).`);
  } catch (err) {
    runLocalClassify();
  } finally {
    btn.disabled = false;
    btn.textContent = prevText;
  }
}

async function runAiAudit() {
  if (!data) return;
  const btn = $("#aiAuditBtn");
  const box = $("#aiAuditBox");
  btn.disabled = true;
  const prevText = btn.textContent;
  btn.textContent = "Đang rà soát...";
  try {
    if (srvInfo.ok && srvInfo.geminiConfigured) {
      const summary = {
        fileName: data.fileName,
        totalRows: data.rows.length,
        factories: data.fs.map((f) => ({
          name: f.name,
          rows: f.rows.length,
          totalVnd: stats(f).total,
        })),
        feeTypes: [...data.types.values()],
        usdRows: data.rows.filter((r) => r.usd).length,
        exchangeRate: { date: cfg.fxd, transfer: cfg.fxb, sell: cfg.fxs, avg: fxRate() },
        issues: data.rows
          .filter((r) => r.is.length)
          .slice(0, 20)
          .map((r) => ({ row: r.n, factory: r.fac, bk: r.bk, issues: r.is.map((i) => i.t) })),
      };

      const res = await fetch("/api/ai/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        const bullets = (json.audit?.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("");
        box.innerHTML = `<div class="banner-head"><strong>✨ Nhận xét từ Gemini AI</strong><button type="button" class="link-btn" onclick="this.closest('.banner').hidden=true">Đóng</button></div><ul>${bullets}</ul>`;
        box.hidden = false;
        return;
      }
    }
    const localBullets = buildLocalAuditBullets().map((b) => `<li>${esc(b)}</li>`).join("");
    box.innerHTML = `<div class="banner-head"><strong>✓ Báo cáo kiểm tra dữ liệu bảng kê</strong><button type="button" class="link-btn" onclick="this.closest('.banner').hidden=true">Đóng</button></div><ul>${localBullets}</ul>`;
    box.hidden = false;
  } catch (err) {
    const localBullets = buildLocalAuditBullets().map((b) => `<li>${esc(b)}</li>`).join("");
    box.innerHTML = `<div class="banner-head"><strong>✓ Báo cáo kiểm tra dữ liệu bảng kê</strong><button type="button" class="link-btn" onclick="this.closest('.banner').hidden=true">Đóng</button></div><ul>${localBullets}</ul>`;
    box.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = prevText;
  }
}



  function initDaily() {
    bindEvents();
    render();
  }

  function bindEvents() {
    bindClick("#pick", () => {
      show("main");
      $("#f")?.click();
    });
    bindClick("#dropBtn", () => $("#f")?.click());
    bindClick("#changeFile", () => $("#f")?.click());
    on("#f", "change", (e) => {
      if (e.target.files[0]) loadFile(e.target.files[0]);
      e.target.value = "";
    });

    bindClick("#loadSample", async () => {
      try {
        const res = await fetch("sample_data.csv");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const buf = await res.arrayBuffer();
        loadArrayBuffer(buf, "sample_data.csv");
      } catch (err) {
        toast("Không tải được dữ liệu mẫu.");
      }
    });

    const dr = $("#drop");
    if (dr) {
      ["dragover", "dragenter"].forEach((v) =>
        dr.addEventListener(v, (e) => {
          e.preventDefault();
          dr.classList.add("on");
        })
      );
      ["dragleave", "drop"].forEach((v) =>
        dr.addEventListener(v, (e) => {
          e.preventDefault();
          dr.classList.remove("on");
        })
      );
      dr.addEventListener("drop", (e) => {
        if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
      });
    }


      on("#vMain", "click", (e) => {
        const c = e.target.closest("[data-t]");
        if (c) {
          const k = c.dataset.t;
          types.has(k) ? types.delete(k) : types.add(k);
          return render();
        }

        const t = e.target.closest("[data-k]");
        if (!t || !t.dataset.k) return;
        cur = t.dataset.k;
        hl = t.dataset.n ? +t.dataset.n : null;
        if (hl && data) {
          const r = data.rows.find((x) => x.n === hl);
          if (r) types.add(r.feeKey);
          go = true;
        }
        render();
      });

    on("#prev", "keydown", (e) => {
      const cell = e.target.closest("[data-hd-row]");
      if (!cell) return;
      if (e.key === "Enter") {
        e.preventDefault();
        cell.blur();
      }
    });

    on("#prev", "input", (e) => {
      const cell = e.target.closest("[data-hd-row]");
      if (!cell || !data) return;
      const r = data.rows.find((x) => x.n === +cell.dataset.hdRow);
      if (r) r.hd = cell.textContent.replace(/\s+/g, " ").trim();
    });

    on("#prev", "focusout", (e) => {
      const cell = e.target.closest("[data-hd-row]");
      if (!cell || !data) return;
      const rowNum = +cell.dataset.hdRow;
      const r = data.rows.find((x) => x.n === rowNum);
      if (!r) return;
      const nextVal = cell.textContent.replace(/\s+/g, " ").trim();
      const movingToHdCell = !!(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("[data-hd-row]"));
      r.hd = nextVal;
      validateRows(data.rows);
      if (movingToHdCell) {
        renderStatusPanels(data.fs.map(stats));
      } else {
        render();
      }
    });

    bindClick("#toggleAllTypes", () => {
      if (!data) return;
      if (types.size === data.types.size) types.clear();
      else types = new Set(data.types.keys());
      render();
    });

    on("#vatOn", "change", (e) => {
      cfg.vatOn = e.target.checked;
      save();
      render();
    });

    on("#vatRate", "input", (e) => {
      const numVal = parseFloat(e.target.value);
      cfg.vatRate = isNaN(numVal) ? 0 : Math.max(0, Math.min(100, numVal));
      save();
      render();
    });

    on("#facSearch", "input", (e) => {
      facQuery = e.target.value;
      renderFactoryList();
    });

    on("#period", "input", (e) => {
      period = e.target.value;
      const prEl = $("#prev .sh-r i");
      if (prEl) prEl.textContent = period || "—";
      else render();
    });

    function rd() {
      const a = +($("#dfrom")?.value || "").replace(/-/g, "") || 0;
      const b = +($("#dto")?.value || "").replace(/-/g, "") || 0;
      if (a && b && a > b) return toast("Ngày bắt đầu phải trước ngày kết thúc.");
      df = a;
      dt = b;
      setPeriod();
      render();
    }
    on("#dfrom", "change", rd);
    on("#dto", "change", rd);
    bindClick("#dclr", () => {
      if ($("#dfrom")) $("#dfrom").value = "";
      if ($("#dto")) $("#dto").value = "";
      rd();
    });
    on("#incu", "change", (e) => {
      incU = e.target.checked;
      render();
    });
    on("#inclAll", "change", (e) => {
      inclAll = e.target.checked;
      render();
    });

    bindClick("#pr1", () => curF() && printSheets([curF()]));
    bindClick("#prA", () => data && printSheets(data.fs));
    bindClick("#x1", () => curF() && exportX([curF()], `bang-ke-${slug(curF().name)}${sfx()}.xlsx`));
    bindClick("#xA", () => data && exportX(data.fs, `bang-ke-tat-ca-nha-may${sfx()}.xlsx`));
    bindClick("#aiClassifyBtn", runAiClassify);
    bindClick("#aiAuditBtn", runAiAudit);


    on("#fxd", "change", (e) => {
      if (e.target.value) fetchVcbRate(e.target.value, false);
    });
    bindClick("#fxFetchBtn", () => fetchVcbRate($("#fxd")?.value || todayIso(), false));

    ["fxb", "fxs"].forEach((id) => {
      on("#" + id, "input", (e) => {
        cfg[id] = e.target.value;
        cfg.fxManual = true;
        const k = d2i(cfg.fxd);
        if (k) {
          cfg.fxt = cfg.fxt || {};
          if (cfg.fxb || cfg.fxs) cfg.fxt[k] = { b: cfg.fxb, s: cfg.fxs, manual: true };
          else delete cfg.fxt[k];
        }
        if ($("#fxBadge")) {
          $("#fxBadge").className = "fx-badge";
          $("#fxBadge").textContent = "Chỉnh tay";
        }
        save();
        render();
      });
    });
  }

  LG_TABS.main = {
    inited: false,
    init: initDaily,
    onShow: render,
    onConfigChange: render,
  };
})();
