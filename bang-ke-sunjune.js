/* Ligentia WorkSpace — Tab 2: Bảng kê Sunjune (Form chuẩn 18 cột, gộp thông minh & tính Tariff tự động) */
(function () {
  const STORAGE_KEY = "lg_sunjune_v2";
  const LEGACY_KEY = "lg_sunjune_v1";

  const TRUCK_COLS = [
    "1.25T",
    "2.5T",
    "3.5T",
    "5T",
    "8T",
    "10T",
    "12T",
    "13T",
    "20'",
    "40'/40HC",
    "45HC/40HCNOR",
  ];

  // Bảng giá Vietnam Domestic Tariff (Valid 01 Apr – 31 Dec 2026, ưu tiên VND)
  const VN_TARIFF = [
    { key: "everviet", desc: "WS - Everviet", local: "Everviet", vnd: [913500, 1044000, 1174500, 1305000, 1566000, 1774800, 2218500, 2544750, 2218500, 2610000, 2871000] },
    { key: "everviet_new", desc: "WS - Everviet - new adress", local: "Everviet New", vnd: [2218500, 2349000, 2479500, 2610000, 2871000, 3079800, 3523500, 3849750, 3523500, 3915000, 4176000] },
    { key: "everrich", desc: "WS - EverRich(New)", local: "EverRich(New)", vnd: [1174500, 1435500, 1566000, 1957500, 2218500, 2610000, 3132000, 4648410, 3523500, 3784500, 4176000] },
    { key: "tht", desc: "TH - THT", local: "Tâm Hưng Thành", vnd: [1696500, 2088000, 2349000, 2740500, 3393000, 3784500, 4306500, 5724386.503, 4073121.166, 4403374.233, 5079321] },
    { key: "binh_nguyen_hd", desc: "TH - 平源(New)", local: "Bình Nguyên (Hải Dương)", vnd: [1435500, 1827000, 1957500, 2349000, 2610000, 3001500, 3523500, 4579509.202, 3393000, 3654000, 4176000] },
    { key: "lucky", desc: "Lucky", local: "LUCKY - Tiểu Trà", vnd: [913500, 1044000, 1096200, 1305000, 1651265.337, 1774800, 2296800, 2544750, 2610000, 2610000, 3132000] },
    { key: "lucky_new", desc: "Lucky - New", local: "LUCKY - New", vnd: [913500, 1044000, 1096200, 1210927.914, 1431096.626, 1774800, 2296800, 2544750, 2610000, 2610000, 3132000] },
    { key: "fantastics", desc: "MH - Fantastic -KIM THÀNH", local: "Fantastics", vnd: [1044000, 1200600, 1409400, 1651265.337, 2192400, 2401200, 2923200, 3732300, 2871000, 3132000, 3673836] },
    { key: "fantastics_paper", desc: "MH - Fantastic -Tiền Hải", local: "Fantastics - Kho Giấy", vnd: [1566000, 1722600, 1931400, 2173265.337, 2714400, 2923200, 3445200, 4254300, 3393000, 3654000, 4195836] },
    { key: "fantasy_tb", desc: "MH - Fantasy -THÁI BÌNH", local: "Fantasy - Thái Bình", vnd: [1513800, 1931400, 2091602.761, 2642024.54, 3132000, 3340800, 3862800, 4698000, 3680100, 4176000, 5079321] },
    { key: "sambound", desc: "Acctron - Sambound", local: "Sambound", vnd: [1122300, 1461600, 1592100, 2035800, 2296800, 2505600, 3027600, 3915000, 3302530.675, 3632783.742, 4075515] },
    { key: "grandbound", desc: "Acctron - Grandbound(New)", local: "Grandbound(New)", vnd: [1122300, 1461600, 1592100, 2035800, 2296800, 2505600, 3027600, 3915000, 3302530.675, 3632783.742, 4075515] },
    { key: "hung_luen", desc: "MGB - Hung Luen", local: "Hùng Lũng", vnd: [1305000, 1722600, 1931400, 2349000, 2844900, 3001500, 3523500, 4437000, 3654000, 3862800, 4978836] },
    { key: "coronet_pn", desc: "Coronet - Phu Ninh Factory", local: "Coronet - Phú Ninh", vnd: [2453400, 3393000, 3601800, 4437000, 5284049.08, 5724386.503, 6246386.503, 7308000, 6605061.35, 6935314.417, 8091000] },
    { key: "coronet_ph", desc: "Coronet - Phu Ha Factory", local: "Coronet - Phú Hà", vnd: [2349000, 3210300, 3340800, 4437000, 5284049.08, 5724386.503, 6246386.503, 7308000, 6605061.35, 6935314.417, 8091000] },
    { key: "vietmei", desc: "WLH - Vietmei", local: "Vietmei", vnd: [913500, 1044000, 1174500, 1435500, 1566000, 1696500, 2218500, 2578680, 2009700, 2531700, 2610000] },
    { key: "sun_vigor", desc: "Sun Vigor(VN)/Sun shing", local: "Sun Vigor", vnd: [1174500, 1305000, 1409400, 1774800, 2244600, 2610000, 3132000, 3577741.564, 2421855.828, 3262500, 3784500] },
    { key: "longshore", desc: "Longshore(VN)", local: "VN Vinh Phát", vnd: [913500, 1200600, 1409400, 1774800, 2192400, 2401200, 2923200, 3732300, 2714400, 2871000, 3673836] },
    { key: "yuhong", desc: "YuHong(VN)", local: "YuHong(VN)", vnd: [1513800, 1931400, 2140200, 2662200, 3132000, 3340800, 3862800, 4698000, 4220370, 4442220, 5380515] },
    { key: "dream2", desc: "Dream(VN) - factory 2", local: "Dream 2", vnd: [1513800, 1931400, 2140200, 2662200, 3132000, 3340800, 3862800, 4959000, 4698000, 5481000, 5742000] },
    { key: "dream9", desc: "Dream(VN) - factory 9", local: "Dream 9", vnd: [2583900, 3158100, 3588750, 4137111, 4846248, 5213736, 5750613, 6037713, 6037713, 6342039, 6913368] },
    { key: "dream8", desc: "Dream(VN) - factory 8", local: "Dream 8", vnd: [1644300, 2061900, 2270700, 2792700, 3262500, 3471300, 3993300, 5089500, 4828500, 5611500, 5872500] },
    { key: "haichuang", desc: "Keng Fung - Haichuang", local: "Haichuang", vnd: [1644300, 2061900, 2270700, 2792700, 3262500, 3471300, 3993300, 5089500, 4828500, 5611500, 5872500] },
    { key: "nebula", desc: "Nebula", local: "Nebula", vnd: [1761349.693, 2244600, 2311771.472, 2862193.252, 3412615.031, 3852952.454, 4374952.454, 5220000, 4489200, 4802400, 5380515] },
    { key: "sunjune", desc: "Sunjune", local: "SUNJUNE (Mặc định)", vnd: [1044000, 1305000, 1409400, 1774800, 2192400, 2401200, 2923200, 3732300, 2714400, 2871000, 3673836] },
    { key: "first_union", desc: "Firts Union", local: "First Union", vnd: [1210927.914, 1722600, 1871434.049, 2311771.472, 2752108.896, 3132000, 3654000, 4865728.528, 3412615.031, 3742868.098, 3673836] },
    { key: "charter", desc: "Charter", local: "SINTE", vnd: [1409400, 1981512, 2091654, 2531961, 3236400, 3445200, 3967200, 4828500, 4073166, 4403331, 5079321] },
    { key: "caile", desc: "Caile Interlligent Packaging", local: "CAILE", vnd: [1305000, 1722600, 1931400, 2349000, 2844900, 3001500, 3523500, 4437000, 3654000, 3862800, 4978836] },
    { key: "sambound_air", desc: "SAMBOUND to airport", local: "SAMBOUND to airport", vnd: [1275507, 1800900, 1970811, 2322900, 2666115, 2871000, 3393000, 3915000, 0, 0, 0] },
    { key: "sunjune_air", desc: "Sunjune to airport", local: "Sunjune to airport", vnd: [913500, 1200600, 1409400, 1774800, 2192400, 2401200, 2923200, 3732300, 0, 3588750, 0] },
    { key: "dream2_air", desc: "Dream(VN) - 2 to Airport", local: "Dream 2 to Airport", vnd: [1348587, 1819170, 2017791, 2349000, 2610000, 3132000, 3654000, 4959000, 0, 0, 0] },
    { key: "dream9_air", desc: "Dream(VN) - 9 to Airport", local: "Dream 9 to Airport", vnd: [3129390, 3703590, 4335210, 5081670, 5541030, 6000390, 6574590, 7177500, 0, 0, 0] },
    { key: "dream8_air", desc: "Dream(VN) - 8 to Airport", local: "Dream 8 to Airport", vnd: [3129390, 3703590, 4335210, 5081670, 5541030, 6000390, 6574590, 7177500, 0, 0, 0] },
    { key: "lucky_air", desc: "Lucky to Airport", local: "Lucky to Airport", vnd: [3129390, 3473910, 3990690, 4679730, 5081670, 5541030, 6115230, 6603300, 0, 0, 0] },
    { key: "lucky_new_air", desc: "Lucky - New to Airport", local: "Lucky New to Airport", vnd: [3129390, 3473910, 3990690, 4679730, 5081670, 5541030, 6115230, 6603300, 0, 0, 0] },
    { key: "everviet_air", desc: "WS - Everviet to Airport", local: "Everviet to Airport", vnd: [2871000, 3301650, 3588750, 3875850, 5024250, 5742000, 6316200, 6890400, 0, 0, 0] },
    { key: "fantastics_air", desc: "MH - Fantastic (New Factory) - Airport", local: "Fantastics - Airport", vnd: [1827000, 2088000, 2349000, 2610000, 3393000, 3784500, 4437000, 5481000, 0, 0, 0] },
    { key: "binh_nguyen_hp", desc: "Binh Nguyen TM Co., Ltd.", local: "Bình Nguyên (Hải Phòng)", vnd: [2283750, 2610000, 3105900, 3719250, 4110750, 4724100, 5154750, 6003000, 5454900, 5768100, 6551100] },
  ];

  const VEHICLE_OPTIONS = [
    { code: "1.25T", label: "1.25T (Hàng lẻ ≤ 5 CBM)", truckCell: "1.25T", defaultVol: "", colIdx: 0, isFcl: false, waitRate: 100000 },
    { code: "2.5T", label: "2.5T (Hàng lẻ ≤ 10 CBM)", truckCell: "2.5T", defaultVol: "", colIdx: 1, isFcl: false, waitRate: 100000 },
    { code: "3.5T", label: "3.5T (Hàng lẻ ≤ 15 CBM)", truckCell: "3.5T", defaultVol: "", colIdx: 2, isFcl: false, waitRate: 100000 },
    { code: "5T", label: "5T (Hàng lẻ ≤ 18 CBM)", truckCell: "5T", defaultVol: "", colIdx: 3, isFcl: false, waitRate: 120000 },
    { code: "8T", label: "8T (Hàng lẻ ≤ 28 CBM)", truckCell: "8T", defaultVol: "", colIdx: 4, isFcl: false, waitRate: 120000 },
    { code: "10T", label: "10T (Hàng lẻ ≤ 33 CBM)", truckCell: "10T", defaultVol: "", colIdx: 5, isFcl: false, waitRate: 120000 },
    { code: "12T", label: "12T (Hàng lẻ ≤ 40 CBM)", truckCell: "12T", defaultVol: "", colIdx: 6, isFcl: false, waitRate: 120000 },
    { code: "13T", label: "13T (Hàng lẻ ≤ 45 CBM)", truckCell: "13T", defaultVol: "", colIdx: 7, isFcl: false, waitRate: 120000 },
    { code: "FCL-20GP", label: "FCL · 20GP / 20'", truckCell: "FCL", defaultVol: "20GP", colIdx: 8, isFcl: true, waitRate: 200000 },
    { code: "FCL-40GP", label: "FCL · 40GP", truckCell: "FCL", defaultVol: "40GP", colIdx: 9, isFcl: true, waitRate: 200000 },
    { code: "FCL-40HC", label: "FCL · 40HC", truckCell: "FCL", defaultVol: "40HC", colIdx: 9, isFcl: true, waitRate: 200000 },
    { code: "FCL-40DC", label: "FCL · 40DC", truckCell: "FCL", defaultVol: "40DC", colIdx: 9, isFcl: true, waitRate: 200000 },
    { code: "FCL-40NOR", label: "FCL · 40NOR", truckCell: "FCL", defaultVol: "40NOR", colIdx: 10, isFcl: true, waitRate: 200000 },
    { code: "FCL-40HCNOR", label: "FCL · 40HCNOR", truckCell: "FCL", defaultVol: "40HCNOR", colIdx: 10, isFcl: true, waitRate: 200000 },
    { code: "FCL-45HC", label: "FCL · 45HC", truckCell: "FCL", defaultVol: "45HC", colIdx: 10, isFcl: true, waitRate: 200000 },
  ];

  const TENDA_FEE = 1000000;
  const SHELL_FEE_PER_DAY = 1800000;
  const FUEL_FACTOR = 1.25;

  const getTariff = (key) => VN_TARIFF.find((t) => t.key === key) || VN_TARIFF.find((t) => t.key === "sunjune");
  const getVehicle = (code) => VEHICLE_OPTIONS.find((v) => v.code === code) || VEHICLE_OPTIONS[4];

  let sjState = {
    title: "BẢNG TỔNG HỢP PHÁT SINH",
    sheetName: "",
    defaultFactory: "sunjune",
    vatOn: true,
    vatRate: 8,
    trips: [],
  };

  let editingTripId = null;
  let draft = null;
  let manualLocks = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
  let searchQuery = "";
  let showTariffDrawer = false;

  function formatShortDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return "";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${m[3]}.${months[+m[2] - 1] || m[2]}`;
  }

  function normalizeDateLabel(str) {
    const raw = String(str || "").trim();
    if (!raw) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return formatShortDate(raw);
    const dm = /^(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-]\d{2,4})?$/.exec(raw);
    if (dm) {
      const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const d = String(+dm[1]).padStart(2, "0");
      const mo = months[+dm[2] - 1];
      if (mo) return `${d}.${mo}`;
    }
    return raw.toUpperCase();
  }

  function splitTokens(str) {
    return String(str || "")
      .split(/[\s,;|\n\r]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function parseTimeToMins(str) {
    const m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(str || "").trim());
    if (!m) return null;
    const h = +m[1];
    const mi = +m[2];
    const s = +(m[3] || 0);
    if (h < 0 || h > 23 || mi < 0 || mi > 59 || s < 0 || s > 59) return null;
    return h * 60 + mi + (s >= 30 ? 1 : 0);
  }

  function fmtTimeStr(str) {
    const m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(str || "").trim());
    if (!m) return String(str || "").trim();
    return `${String(+m[1]).padStart(2, "0")}:${String(+m[2]).padStart(2, "0")}:${String(+(m[3] || 0)).padStart(2, "0")}`;
  }

  function timeStrToExcelFraction(str) {
    const m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(str || "").trim());
    if (!m) return null;
    const secs = +m[1] * 3600 + +m[2] * 60 + +(m[3] || 0);
    return secs / 86400;
  }

  function fmtDuration(mins) {
    if (mins == null || mins < 0) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  }

  function fmtHmShort(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h${String(m).padStart(2, "0")}'`;
  }

  function lunchOverlapMins(startMin, endMin) {
    if (endMin <= startMin) return 0;
    let total = 0;
    const maxDay = Math.floor(endMin / 1440);
    for (let d = 0; d <= maxDay; d++) {
      const lStart = d * 1440 + 12 * 60;
      const lEnd = d * 1440 + 13 * 60;
      const ov = Math.min(endMin, lEnd) - Math.max(startMin, lStart);
      if (ov > 0) total += ov;
    }
    return total;
  }

  function calcShellRange(fromIso, toIso) {
    const f = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromIso || "");
    const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(toIso || "");
    if (!f || !t) return { days: 0, label: "" };
    const start = new Date(+f[1], +f[2] - 1, +f[3]);
    const end = new Date(+t[1], +t[2] - 1, +t[3]);
    if (end < start) return { days: 0, label: "" };
    // Đếm đủ cả ngày đầu và ngày cuối
    const days = Math.round((end - start) / 86400000) + 1;
    const list = [];
    const cap = Math.min(days, 31);
    const months = new Set();
    for (let i = 0; i < cap; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      list.push({ d: cur.getDate(), m: cur.getMonth() + 1 });
      months.add(cur.getMonth() + 1);
    }
    let label = "";
    if (months.size === 1) {
      const mo = list[0].m;
      label = `ngày ${list.map((x) => x.d).join(", ")}/${mo}`;
    } else {
      label = `ngày ${list.map((x) => `${x.d}/${x.m}`).join(", ")}`;
    }
    return { days, label };
  }

  /* ---------- Phân tích cụm dòng từ dữ liệu nhập (Merge vs Split theo quy tắc) ---------- */
  function expandDraftRows(t) {
    const refs = splitTokens(t.bookingRefsText);
    const ships = splitTokens(t.shipmentsText);
    const bks = splitTokens(t.bookingsText);
    const conts = splitTokens(t.contsText);
    const vols = splitTokens(t.volumesText);
    const ins = splitTokens(t.inTimesText);
    const outs = splitTokens(t.outTimesText);

    const rowCount = Math.max(1, bks.length, conts.length, ins.length, outs.length, refs.length > 1 ? refs.length : 1, ships.length > 1 ? ships.length : 1);
    const isSplitByCont = conts.length > 1;
    const isSplitByTime = ins.length > 1 || outs.length > 1;
    const splitCosts = isSplitByCont || isSplitByTime;

    const veh = getVehicle(t.truckCode);
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const refVal = refs.length === 1 ? (i === 0 ? refs[0] : "") : refs[i] || "";
      const shipVal = ships.length === 1 ? (i === 0 ? ships[0] : "") : ships[i] || "";
      const bkVal = bks.length === 1 ? (i === 0 ? bks[0] : "") : bks[i] || "";
      const contVal = conts.length <= 1 ? (conts[0] || "") : conts[i] || "";
      const volVal = vols[i] || (veh.isFcl ? veh.defaultVol : "");
      const inVal = ins.length <= 1 ? (ins[0] || "") : ins[i] || "";
      const outVal = outs.length <= 1 ? (outs[0] || "") : outs[i] || "";
      rows.push({
        ref: refVal,
        shipment: shipVal,
        booking: bkVal,
        contNo: contVal,
        volume: volVal,
        inTime: inVal,
        outTime: outVal,
      });
    }

    // Tìm Volume lớn nhất trong cụm combine để in đậm
    let maxVol = -Infinity;
    const numericVols = rows.map((r) => {
      const n = parseFloat(String(r.volume || "").replace(/,/g, ""));
      return !isNaN(n) && /^[\d.,]+$/.test(String(r.volume || "").trim()) ? n : null;
    });
    const validNums = numericVols.filter((v) => v !== null);
    if (rowCount > 1 && validNums.length >= 2) {
      maxVol = Math.max(...validNums);
    }
    rows.forEach((r, idx) => {
      r.isMaxVol = maxVol > -Infinity && numericVols[idx] === maxVol;
    });

    return {
      rows,
      rowCount,
      mergeCont: !isSplitByCont && rowCount > 1,
      mergeTime: !isSplitByTime && rowCount > 1,
      mergeCost: !splitCosts && rowCount > 1,
      splitCosts,
    };
  }

  function computeTimingForPair(inStr, outStr, truckCode, deductLunch, nextDay) {
    const veh = getVehicle(truckCode);
    const inM = parseTimeToMins(inStr);
    const outM0 = parseTimeToMins(outStr);
    if (inM == null || outM0 == null) {
      return {
        hasTime: false,
        rawMins: 0,
        loadingTime: "",
        lunchMins: 0,
        netMins: 0,
        freeMins: veh.isFcl ? 240 : 120,
        excessMins: 0,
        extraTrucks: 0,
        waitHours: 0,
        overnightCount: 0,
      };
    }

    let outM = outM0;
    const crossedMidnight = nextDay || outM0 < inM;
    if (crossedMidnight && outM <= inM) outM += 1440;
    if (nextDay && outM - inM < 0) outM += 1440;

    const rawMins = Math.max(0, outM - inM);
    const lunchMins = deductLunch ? lunchOverlapMins(inM, outM) : 0;
    const netMins = Math.max(0, rawMins - lunchMins);
    const freeMins = veh.isFcl ? 240 : 120;
    const excessMins = Math.max(0, netMins - freeMins);

    // Làm tròn theo mốc 55 phút (2h55' -> 1h chờ, 2h54' -> 0h chờ; cứ 4h = 1 truck)
    const billableHours = Math.floor((excessMins + 5) / 60);
    const extraTrucks = Math.floor(billableHours / 4);
    const waitHours = billableHours % 4;
    const overnightCount = crossedMidnight || outM0 >= 22 * 60 ? 1 : 0;

    return {
      hasTime: true,
      rawMins,
      loadingTime: fmtDuration(rawMins),
      lunchMins,
      netMins,
      freeMins,
      excessMins,
      extraTrucks,
      waitHours,
      overnightCount,
    };
  }

  function formatKAmount(amount) {
    const n = Math.round(Number(amount) || 0);
    if (n <= 0) return "";
    if (n % 1000 === 0) return `${n / 1000}K`;
    return fmt(n);
  }

  function buildAutoNote(t, rowOverride) {
    const parts = [];
    if (t.tendaOn) parts.push("Tenda");

    const cancelCount = Math.max(0, Number(t.cancelCount) || 0);
    if (cancelCount === 1) parts.push("Cancel");
    else if (cancelCount > 1) parts.push(`${cancelCount} Cancel`);

    const ovn = rowOverride ? rowOverride.overnightCount : Math.max(0, Number(t.overnightCount) || 0);
    if (ovn > 0) parts.push(`${ovn} Over Night`);

    const extra = rowOverride ? rowOverride.extraTrucks : Math.max(0, Number(t.extraTrucks) || 0);
    if (extra > 0) parts.push(`${extra} Truck`);

    const wait = rowOverride ? rowOverride.waitHours : Math.max(0, Number(t.waitHours) || 0);
    if (wait > 0) parts.push(`${wait} Giờ chờ`);

    const shellInfo = t.shellFrom && t.shellTo ? calcShellRange(t.shellFrom, t.shellTo) : { days: Math.max(0, Number(t.shellDays) || 0), label: "" };
    if (shellInfo.days > 0) {
      parts.push(`Gửi vỏ ${shellInfo.days} ngày${shellInfo.label ? ` (${shellInfo.label})` : ""}`);
    }

    const toll = Math.max(0, Number(t.tollFee) || 0);
    if (toll > 0) parts.push(`${formatKAmount(toll)} Cao tốc`);

    return parts.join(" + ");
  }

  function calcTripDetails(t) {
    const expanded = expandDraftRows(t);
    const veh = getVehicle(t.truckCode);
    const tariff = getTariff(t.factoryKey || sjState.defaultFactory);
    const baseVnd = Number(tariff.vnd[veh.colIdx]) || 0;
    const truckUnit = round3(baseVnd * FUEL_FACTOR);
    const overnightUnit = round3(baseVnd * FUEL_FACTOR * 0.8);

    const shellInfo = t.shellFrom && t.shellTo ? calcShellRange(t.shellFrom, t.shellTo) : { days: Math.max(0, Number(t.shellDays) || 0), label: "" };
    const shellDays = shellInfo.days;
    const shellFee = round3(shellDays * SHELL_FEE_PER_DAY);
    const tendaFee = t.tendaOn ? TENDA_FEE : 0;
    const tollFee = round3(Math.max(0, Number(t.tollFee) || 0));
    const cancelCount = Math.max(0, Number(t.cancelCount) || 0);

    if (!expanded.splitCosts) {
      // Combine chung 1 chuyến / 1 Cont: chỉ tính 1 lần duy nhất
      const timing = computeTimingForPair(expanded.rows[0].inTime, expanded.rows[0].outTime, t.truckCode, t.deductLunch, t.nextDay);
      const extraTrucks = Math.max(0, Number(t.extraTrucks) || 0);
      const waitHours = Math.max(0, Number(t.waitHours) || 0);
      const overnightCount = Math.max(0, Number(t.overnightCount) || 0);

      const truckCountTotal = extraTrucks + cancelCount;
      const truckFee = round3(truckCountTotal * truckUnit);
      const waitFee = round3(waitHours * veh.waitRate);
      const overnightFee = round3(overnightCount * overnightUnit);
      const waitAndOvernight = round3(waitFee + overnightFee);
      const totalFee = round3(truckFee + waitAndOvernight + shellFee + tendaFee + tollFee);

      const lineCalc = {
        timing,
        extraTrucks,
        cancelCount,
        truckCountTotal,
        waitHours,
        overnightCount,
        shellDays,
        truckFee,
        waitFee,
        overnightFee,
        waitAndOvernight,
        shellFee,
        tendaFee,
        tollFee,
        totalFee,
        note: t.note ?? buildAutoNote(t),
      };

      return {
        expanded,
        veh,
        tariff,
        baseVnd,
        truckUnit,
        overnightUnit,
        lineCalcs: [lineCalc],
        tripTotal: totalFee,
      };
    }

    // Tách theo từng Cont / từng cặp In-Out: mỗi dòng tính riêng
    const lineCalcs = expanded.rows.map((r, idx) => {
      const timing = computeTimingForPair(r.inTime, r.outTime, t.truckCode, t.deductLunch, t.nextDay);
      const extraTrucks = timing.hasTime ? timing.extraTrucks : Math.max(0, Number(t.extraTrucks) || 0);
      const waitHours = timing.hasTime ? timing.waitHours : Math.max(0, Number(t.waitHours) || 0);
      const overnightCount = timing.hasTime ? timing.overnightCount : Math.max(0, Number(t.overnightCount) || 0);

      const truckCountTotal = extraTrucks + cancelCount;
      const truckFee = round3(truckCountTotal * truckUnit);
      const waitFee = round3(waitHours * veh.waitRate);
      const overnightFee = round3(overnightCount * overnightUnit);
      const waitAndOvernight = round3(waitFee + overnightFee);
      const totalFee = round3(truckFee + waitAndOvernight + shellFee + tendaFee + tollFee);

      const customOrAutoNote = idx === 0 && t.note && manualLocks.note ? t.note : buildAutoNote(t, { extraTrucks, waitHours, overnightCount });
      return {
        timing,
        extraTrucks,
        cancelCount,
        truckCountTotal,
        waitHours,
        overnightCount,
        shellDays,
        truckFee,
        waitFee,
        overnightFee,
        waitAndOvernight,
        shellFee,
        tendaFee,
        tollFee,
        totalFee,
        note: customOrAutoNote,
      };
    });

    const tripTotal = round3(lineCalcs.reduce((s, c) => s + c.totalFee, 0));
    return { expanded, veh, tariff, baseVnd, truckUnit, overnightUnit, lineCalcs, tripTotal };
  }

  function calcStatementSummary(tripsList) {
    const detailed = tripsList.map((t) => ({ trip: t, detail: calcTripDetails(t) }));
    const subtotal = Math.round(detailed.reduce((s, x) => s + x.detail.tripTotal, 0));
    const vatRate = sjState.vatOn ? Math.max(0, Number(sjState.vatRate) || 0) : 0;
    const vatTax = sjState.vatOn && vatRate > 0 ? Math.round((subtotal * vatRate) / 100) : 0;
    const grandTotal = Math.round(subtotal + vatTax);
    const totalBookings = detailed.reduce((s, x) => s + x.detail.expanded.rowCount, 0);
    return { detailed, subtotal, vatRate, vatTax, grandTotal, totalBookings };
  }

  function createEmptyDraft() {
    return {
      id: "sj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      date: formatShortDate(todayIso()),
      bookingRefsText: "",
      shipmentsText: "",
      bookingsText: "",
      contsText: "",
      truckCode: "8T",
      volumesText: "",
      inTimesText: "",
      outTimesText: "",
      nextDay: false,
      deductLunch: true,
      factoryKey: sjState.defaultFactory || "sunjune",
      extraTrucks: 0,
      cancelCount: 0,
      waitHours: 0,
      overnightCount: 0,
      shellFrom: "",
      shellTo: "",
      shellDays: 0,
      tendaOn: true,
      tollFee: 0,
      note: "Tenda",
      misaInvoice: "",
      misaAmount: "",
      lineMisa: [],
    };
  }

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw && typeof raw === "object") {
        sjState = {
          title: typeof raw.title === "string" && raw.title ? raw.title : "BẢNG TỔNG HỢP PHÁT SINH",
          sheetName: typeof raw.sheetName === "string" ? raw.sheetName : "",
          defaultFactory: raw.defaultFactory || "sunjune",
          vatOn: typeof raw.vatOn === "boolean" ? raw.vatOn : true,
          vatRate: raw.vatRate !== undefined && !isNaN(Number(raw.vatRate)) ? Number(raw.vatRate) : 8,
          trips: Array.isArray(raw.trips) ? raw.trips : [],
        };
        return;
      }
      // Chuyển nhẹ dữ liệu cũ nếu có từ bản v1
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
      if (legacy && Array.isArray(legacy.trips) && legacy.trips.length) {
        sjState.title = legacy.title || sjState.title;
        sjState.vatOn = typeof legacy.vatOn === "boolean" ? legacy.vatOn : true;
        sjState.vatRate = legacy.vatRate ?? 8;
        sjState.trips = legacy.trips.map((old) => ({
          id: old.id,
          date: old.date || "",
          bookingRefsText: (old.bookings || []).map((b) => b.ref).filter(Boolean).join(" "),
          shipmentsText: (old.bookings || []).map((b) => b.shipment).filter(Boolean).join(" "),
          bookingsText: (old.bookings || []).map((b) => b.booking).filter(Boolean).join(" "),
          contsText: old.contNo || "",
          truckCode: old.truckCode || "8T",
          volumesText: (old.bookings || []).map((b) => b.volume).filter(Boolean).join(" "),
          inTimesText: old.inTime || "",
          outTimesText: old.outTime || "",
          nextDay: !!old.nextDay,
          deductLunch: old.deductLunch !== false,
          factoryKey: old.factoryKey || "sunjune",
          extraTrucks: Number(old.extraTrucks) || 0,
          cancelCount: Number(old.cancelCount) || 0,
          waitHours: Number(old.waitHours) || 0,
          overnightCount: Number(old.overnightCount) || 0,
          shellFrom: "",
          shellTo: "",
          shellDays: Number(old.shellDays) || 0,
          tendaOn: !!old.tendaOn,
          tollFee: Number(old.tollFee) || 0,
          note: old.note || "",
          misaInvoice: old.misaInvoice || "",
          misaAmount: "",
          lineMisa: [],
        }));
      }
    } catch {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sjState));
    } catch {}
  }

  function autoSheetName(tripsList) {
    const dates = [];
    const seen = new Set();
    (tripsList || []).forEach((t) => {
      const d = normalizeDateLabel(t.date);
      if (d && !seen.has(d)) {
        seen.add(d);
        dates.push(d);
      }
    });
    if (!dates.length) return "Bang_Ke_Phat_Sinh";
    if (dates.length === 1) return dates[0];
    return `${dates[0]} - ${dates[dates.length - 1]}`;
  }

  function safeSheetName(raw) {
    return String(raw || "")
      .replace(/[\\\/?*\[\]:]/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 31) || "Bang_Ke_Phat_Sinh";
  }

  function safeFileName(raw) {
    return String(raw || "BẢNG TỔNG HỢP PHÁT SINH")
      .replace(/[\\/:*?"<>|]/g, "-")
      .replace(/\s+/g, " ")
      .trim() || "BẢNG TỔNG HỢP PHÁT SINH";
  }

  /* ---------- HTML Preview & Print Sheet (Đúng 18 cột & Dòng Date ngang) ---------- */
  function groupTripsByDate(detailed) {
    const groups = [];
    const map = new Map();
    detailed.forEach((item) => {
      const dKey = normalizeDateLabel(item.trip.date) || "CHƯA GHI NGÀY";
      if (!map.has(dKey)) {
        const g = { dateLabel: dKey, items: [] };
        map.set(dKey, g);
        groups.push(g);
      }
      map.get(dKey).items.push(item);
    });
    return groups;
  }

  function buildStatementHtml(tripsList, forPrint = false) {
    const sum = calcStatementSummary(tripsList);
    const groups = groupTripsByDate(sum.detailed);
    const totalCols = forPrint ? 18 : 19;

    let bodyHtml = "";
    if (!groups.length) {
      bodyHtml = `<tr><td colspan="${totalCols}" style="text-align:center;color:#64748b;padding:26px;">Chưa có chuyến phát sinh nào. Hãy nhập thông tin bên trên hoặc bấm <b>Nạp ví dụ mẫu</b>.</td></tr>`;
    } else {
      bodyHtml = groups
        .map((grp) => {
          const dateRow = `<tr class="sj-date-row"><td colspan="${totalCols}">${esc(grp.dateLabel)}</td></tr>`;
          const tripRows = grp.items
            .map(({ trip, detail }) => {
              const { expanded, veh, lineCalcs } = detail;
              const rows = expanded.rows;
              const n = rows.length;
              const span = n > 1 ? ` rowspan="${n}"` : "";

              return rows
                .map((r, idx) => {
                  const lc = expanded.splitCosts ? lineCalcs[idx] : lineCalcs[0];
                  const showCost = expanded.splitCosts || idx === 0;
                  const costSpan = expanded.splitCosts ? "" : span;
                  const contSpan = expanded.mergeCont ? span : "";
                  const timeSpan = expanded.mergeTime ? span : "";
                  const truckSpan = !expanded.splitCosts && n > 1 ? span : "";

                  const cells = [];
                  cells.push(`<td class="c">${esc(r.ref)}</td>`);
                  cells.push(`<td class="c">${esc(r.shipment)}</td>`);
                  cells.push(`<td class="c">${esc(r.booking)}</td>`);
                  if (!expanded.mergeCont || idx === 0) {
                    cells.push(`<td${contSpan} class="c">${esc(r.contNo)}</td>`);
                  }
                  if (expanded.splitCosts || idx === 0) {
                    cells.push(`<td${truckSpan} class="c"><b>${esc(veh.truckCell)}</b></td>`);
                  }
                  cells.push(`<td class="c">${r.isMaxVol ? `<b>${esc(r.volume)}</b>` : esc(r.volume)}</td>`);

                  if (!expanded.mergeTime || idx === 0) {
                    const rowTiming = computeTimingForPair(r.inTime, r.outTime, trip.truckCode, trip.deductLunch, trip.nextDay);
                    cells.push(`<td${timeSpan} class="c">${esc(r.inTime ? fmtTimeStr(r.inTime) : "")}</td>`);
                    cells.push(`<td${timeSpan} class="c">${esc(r.outTime ? fmtTimeStr(r.outTime) : "")}</td>`);
                    cells.push(`<td${timeSpan} class="c">${esc(rowTiming.loadingTime || "")}</td>`);
                  }

                  if (showCost) {
                    const misaInv = expanded.splitCosts ? (trip.lineMisa?.[idx]?.inv ?? (idx === 0 ? trip.misaInvoice : "")) : (trip.misaInvoice || "");
                    const misaAmt = expanded.splitCosts ? (trip.lineMisa?.[idx]?.amt ?? (idx === 0 ? trip.misaAmount : "")) : (trip.misaAmount || "");
                    const lineIdxAttr = expanded.splitCosts ? idx : 0;

                    cells.push(`<td${costSpan} class="r">${lc.truckFee ? fmt(lc.truckFee) : ""}</td>`);
                    cells.push(`<td${costSpan} class="r">${lc.waitAndOvernight ? fmt(lc.waitAndOvernight) : ""}</td>`);
                    cells.push(`<td${costSpan} class="r">${lc.shellFee ? fmt(lc.shellFee) : ""}</td>`);
                    cells.push(`<td${costSpan} class="r">${lc.tendaFee ? fmt(lc.tendaFee) : ""}</td>`);
                    cells.push(`<td${costSpan} class="r">${lc.tollFee ? fmt(lc.tollFee) : ""}</td>`);
                    cells.push(`<td${costSpan} class="r"><b>${fmt(lc.totalFee)}</b></td>`);
                    cells.push(`<td${costSpan} class="sj-note-cell">${esc(lc.note)}</td>`);

                    if (forPrint) {
                      cells.push(`<td${costSpan} class="c">${esc(misaInv)}</td>`);
                      cells.push(`<td${costSpan} class="r">${misaAmt ? fmt(Number(String(misaAmt).replace(/,/g, "")) || 0) : ""}</td>`);
                    } else {
                      cells.push(
                        `<td${costSpan} class="c hd-edit" contenteditable="true" data-misa-trip="${esc(trip.id)}" data-misa-idx="${lineIdxAttr}" data-misa-field="inv">${esc(misaInv)}</td>`
                      );
                      cells.push(
                        `<td${costSpan} class="r hd-edit" contenteditable="true" data-misa-trip="${esc(trip.id)}" data-misa-idx="${lineIdxAttr}" data-misa-field="amt">${esc(misaAmt)}</td>`
                      );
                    }
                  }

                  if (!forPrint && idx === 0) {
                    cells.push(
                      `<td${span} class="c sj-op-col">
                        <div class="sj-row-ops">
                          <button type="button" class="sj-op-btn" data-sj-edit="${esc(trip.id)}">Sửa</button>
                          <button type="button" class="sj-op-btn" data-sj-dup="${esc(trip.id)}">Nhân</button>
                          <button type="button" class="sj-op-btn del" data-sj-del="${esc(trip.id)}">Xoá</button>
                        </div>
                      </td>`
                    );
                  }

                  return `<tr>${cells.join("")}</tr>`;
                })
                .join("");
            })
            .join("");

          return dateRow + tripRows;
        })
        .join("");
    }

    const trailSpan = forPrint ? 3 : 4;
    const vatSpacerRow = `<tr class="sj-vat-gap"><td colspan="${totalCols}"></td></tr>`;
    const vatRowHtml = (labelHtml, valNum, bold = false) =>
      `<tr class="sj-vat-row ${bold ? "gt" : ""}">
        <td colspan="11" class="sj-vat-blank"></td>
        <td colspan="3" class="sj-vat-lbl">${labelHtml}</td>
        <td class="sj-vat-val">${fmt(valNum)}</td>
        <td colspan="${trailSpan}" class="sj-vat-blank"></td>
      </tr>`;

    const vatRowsHtml =
      sjState.vatOn && sum.vatTax > 0
        ? vatSpacerRow +
          vatRowHtml(`Tổng trước thuế <i>(Subtotal)</i>:`, sum.subtotal) +
          vatRowHtml(`Thuế suất GTGT ${esc(String(round3(sum.vatRate)))}% <i>(VAT ${esc(String(round3(sum.vatRate)))}%)</i>:`, sum.vatTax) +
          vatRowHtml(`Tổng sau thuế <i>(Total payment)</i>:`, sum.grandTotal, true)
        : vatSpacerRow + vatRowHtml(`Tổng sau thuế <i>(Total payment)</i>:`, sum.grandTotal, true);

    return `<div class="sheet sj-sheet">
      <div class="sj-sheet-title">${esc(sjState.title || "BẢNG TỔNG HỢP PHÁT SINH")}</div>

      <table class="t sj-table">
        <thead>
          <tr>
            <th colspan="6" class="sj-gh-info">Thông tin lô hàng</th>
            <th colspan="3" class="sj-gh-time">Thời gian xe</th>
            <th colspan="7" class="sj-gh-cost">Chi phí phát sinh</th>
            <th colspan="2" class="sj-gh-misa">Misa</th>
            ${!forPrint ? `<th rowspan="2" class="sj-op-col">Thao tác</th>` : ""}
          </tr>
          <tr>
            <th>Booking Ref</th>
            <th>Shipment</th>
            <th>Booking</th>
            <th>Cont No.</th>
            <th>Type of Truck</th>
            <th>Volume</th>
            <th>In</th>
            <th>Out</th>
            <th>Loading time</th>
            <th>Cước xe/Huỷ Xe</th>
            <th>Lưu Ca/Giờ Chờ</th>
            <th>Gửi Vỏ</th>
            <th>Tenda</th>
            <th>Cao tốc</th>
            <th>Tổng trả</th>
            <th>NOTE</th>
            <th>Hoá đơn Misa</th>
            <th>Tiền Misa</th>
          </tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
        <tfoot>${vatRowsHtml}</tfoot>
      </table>
    </div>`;
  }

  function estimateNoteLines(noteText, charsPerLine = 32) {
    const text = String(noteText || "").trim();
    if (!text) return 1;
    return text.split(/\r?\n/).reduce((sum, seg) => {
      const len = seg.trim().length;
      return sum + Math.max(1, Math.ceil(len / charsPerLine));
    }, 0);
  }

  /* ---------- Xuất Excel chuẩn 18 cột, đúng bố cục & màu sắc mẫu (A1:R3, 28pt, căn đều ô NOTE, làm tròn 0) ---------- */
  async function buildSunjuneXlsxBuffer(tripsList) {
    if (typeof ExcelJS === "undefined") {
      throw new Error("Thư viện xuất Excel (ExcelJS) chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng và tải lại trang.");
    }
    const wb = new ExcelJS.Workbook();
    const sheetTitle = safeSheetName(sjState.sheetName.trim() || autoSheetName(tripsList));
    const ws = wb.addWorksheet(sheetTitle, {
      views: [{ showGridLines: true }],
      pageSetup: {
        orientation: "landscape",
        paperSize: 9,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
        margins: { left: 0.25, right: 0.25, top: 0.35, bottom: 0.35, header: 0.2, footer: 0.2 },
      },
    });

    const sum = calcStatementSummary(tripsList);
    const groups = groupTripsByDate(sum.detailed);

    const colWidths = [15, 13, 18, 14, 12, 10, 10, 10, 12, 16, 16, 13, 12, 12, 16, 40, 14, 15];
    ws.columns = colWidths.map((w) => ({ width: w, style: { font: { name: "Times New Roman", size: 11 } } }));

    const G = "FF64748B";
    const ln = (c) => ({ style: "thin", color: { argb: c } });
    const bd = { top: ln(G), left: ln(G), bottom: ln(G), right: ln(G) };
    const ft = (z = 11, b = false, i = false, c = null) => ({
      name: "Times New Roman",
      size: z,
      bold: !!b,
      italic: !!i,
      ...(c ? { color: { argb: c } } : {}),
    });
    const rt = (...p) => ({ richText: p.map(([t, z, b, i, c]) => ({ text: t, font: ft(z || 11, b, i, c) })) });
    const fill = (a) => ({ type: "pattern", pattern: "solid", fgColor: { argb: a } });
    const BASE_ROW_PT = 28;

    // Tiêu đề A1:R3 (3 dòng gộp, căn giữa, 22pt đậm, chiều cao 28 mỗi dòng)
    const r1 = ws.addRow([sjState.title || "BẢNG TỔNG HỢP PHÁT SINH"]);
    const r2 = ws.addRow([]);
    const r3 = ws.addRow([]);
    r1.height = BASE_ROW_PT;
    r2.height = BASE_ROW_PT;
    r3.height = BASE_ROW_PT;
    ws.mergeCells(1, 1, 3, 18);
    const tc = r1.getCell(1);
    tc.font = ft(22, true);
    tc.alignment = { horizontal: "center", vertical: "middle" };
    [r1, r2, r3].forEach((rr) => {
      for (let c = 1; c <= 18; c++) rr.getCell(c).border = bd;
    });

    // Row 4: Header nhóm (#FDEADA, #E0F2FE, #FEF3C7, #FDEADA) | Row 5: Header cột (nền trắng)
    const ghRow = ws.addRow([]);
    ghRow.height = BASE_ROW_PT;
    const chRow = ws.addRow([
      "Booking Ref",
      "Shipment",
      "Booking",
      "Cont No.",
      "Type of Truck",
      "Volume",
      "In",
      "Out",
      "Loading time",
      "Cước xe/Huỷ Xe",
      "Lưu Ca/Giờ Chờ",
      "Gửi Vỏ",
      "Tenda",
      "Cao tốc",
      "Tổng trả",
      "NOTE",
      "Hoá đơn Misa",
      "Tiền Misa",
    ]);
    chRow.height = BASE_ROW_PT;
    ws.pageSetup.printTitlesRow = `${ghRow.number}:${chRow.number}`;

    const headerGroups = [
      { title: "Thông tin lô hàng", start: 1, span: 6, bg: "FFFDEADA" },
      { title: "Thời gian xe", start: 7, span: 3, bg: "FFE0F2FE" },
      { title: "Chi phí phát sinh", start: 10, span: 7, bg: "FFFEF3C7" },
      { title: "Misa", start: 17, span: 2, bg: "FFFDEADA" },
    ];
    headerGroups.forEach((g) => {
      if (g.span > 1) ws.mergeCells(ghRow.number, g.start, ghRow.number, g.start + g.span - 1);
      const cell = ghRow.getCell(g.start);
      cell.value = g.title;
      cell.font = ft(11, true);
      cell.alignment = { horizontal: "center", vertical: "middle" };
      for (let c = g.start; c <= g.start + g.span - 1; c++) {
        ghRow.getCell(c).fill = fill(g.bg);
        ghRow.getCell(c).border = bd;
      }
    });
    for (let c = 1; c <= 18; c++) {
      const cell = chRow.getCell(c);
      cell.font = ft(11, true);
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = bd;
    }

    const totalFormulaRefs = [];

    groups.forEach((grp) => {
      // Dòng Ngày nằm ngang (#EBF1DE, căn giữa)
      const dRow = ws.addRow([grp.dateLabel]);
      dRow.height = BASE_ROW_PT;
      ws.mergeCells(dRow.number, 1, dRow.number, 18);
      dRow.getCell(1).font = ft(11, true);
      dRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
      for (let c = 1; c <= 18; c++) {
        dRow.getCell(c).fill = fill("FFEBF1DE");
        dRow.getCell(c).border = bd;
      }

      grp.items.forEach(({ trip, detail }) => {
        const { expanded, veh, baseVnd, lineCalcs } = detail;
        const rows = expanded.rows;
        const startRowNum = ws.rowCount + 1;

        // Chuẩn chiều cao 28; nếu NOTE nhiều dòng thì kéo đều các dòng combine cho vừa nội dung
        let perRowHeight = BASE_ROW_PT;
        if (expanded.splitCosts) {
          const maxLines = Math.max(1, ...lineCalcs.map((lc) => estimateNoteLines(lc.note, 32)));
          perRowHeight = maxLines > 1 ? Math.max(BASE_ROW_PT, maxLines * 16 + 10) : BASE_ROW_PT;
        } else {
          const linesNeeded = estimateNoteLines(lineCalcs[0].note, 32);
          const minTotalPt = linesNeeded > 1 ? linesNeeded * 16 + 10 : BASE_ROW_PT;
          const neededTotal = Math.max(BASE_ROW_PT * rows.length, minTotalPt);
          perRowHeight = +(neededTotal / rows.length).toFixed(1);
        }

        rows.forEach((r, idx) => {
          const xlRow = ws.addRow([]);
          const rn = xlRow.number;
          xlRow.height = perRowHeight;

          const setC = (col, val, align = "center", bold = false, numFmtStr = null) => {
            const cell = xlRow.getCell(col);
            cell.value = val;
            cell.font = ft(11, bold);
            cell.alignment = { horizontal: align, vertical: "middle", wrapText: true };
            cell.border = bd;
            if (numFmtStr) cell.numFmt = numFmtStr;
            return cell;
          };

          setC(1, r.ref || "");
          setC(2, r.shipment || "");
          setC(3, r.booking || "");
          setC(4, !expanded.mergeCont || idx === 0 ? r.contNo || "" : "");
          setC(5, !expanded.splitCosts && idx > 0 ? "" : veh.truckCell, "center", true);

          // Volume (nếu là số hợp lệ giữ kiểu số; lớn nhất in đậm!)
          const volTrim = String(r.volume || "").trim();
          const volNum = /^[\d.,]+$/.test(volTrim) ? parseFloat(volTrim.replace(/,/g, "")) : NaN;
          setC(6, !isNaN(volNum) ? volNum : volTrim, "center", !!r.isMaxVol);

          // In / Out / Loading time (=Out - In)
          const showTime = !expanded.mergeTime || idx === 0;
          const inFrac = showTime ? timeStrToExcelFraction(r.inTime) : null;
          const outFrac = showTime ? timeStrToExcelFraction(r.outTime) : null;
          setC(7, inFrac !== null ? inFrac : (showTime ? r.inTime || "" : ""), "center", false, inFrac !== null ? "hh:mm:ss" : null);
          setC(8, outFrac !== null ? outFrac : (showTime ? r.outTime || "" : ""), "center", false, outFrac !== null ? "hh:mm:ss" : null);

          const rowTiming = showTime ? computeTimingForPair(r.inTime, r.outTime, trip.truckCode, trip.deductLunch, trip.nextDay) : null;
          if (showTime && inFrac !== null && outFrac !== null && rowTiming?.hasTime) {
            const ltFormula = trip.nextDay && outFrac >= inFrac
              ? `H${rn}+1-G${rn}`
              : `IF(H${rn}<G${rn},H${rn}+1-G${rn},H${rn}-G${rn})`;
            setC(9, { formula: ltFormula, result: rowTiming.rawMins / 1440 }, "center", false, "[h]:mm:ss");
          } else {
            setC(9, showTime ? rowTiming?.loadingTime || "" : "");
          }

          // Chi phí phát sinh với công thức Excel thật
          const showCost = expanded.splitCosts || idx === 0;
          const lc = expanded.splitCosts ? lineCalcs[idx] : lineCalcs[0];
          if (showCost) {
            if (lc.truckCountTotal > 0) {
              setC(10, { formula: `ROUND(${baseVnd}*${FUEL_FACTOR}*${lc.truckCountTotal},3)`, result: lc.truckFee }, "right", false, xlsxFmt(lc.truckFee));
            } else {
              setC(10, "");
            }

            const waitParts = [];
            if (lc.waitHours > 0) waitParts.push(`${lc.waitHours}*${veh.waitRate}`);
            if (lc.overnightCount > 0) waitParts.push(`${lc.overnightCount}*${baseVnd}*${FUEL_FACTOR}*0.8`);
            if (waitParts.length) {
              setC(11, { formula: `ROUND(${waitParts.join("+")},3)`, result: lc.waitAndOvernight }, "right", false, xlsxFmt(lc.waitAndOvernight));
            } else {
              setC(11, "");
            }

            if (lc.shellDays > 0) {
              setC(12, { formula: `${lc.shellDays}*${SHELL_FEE_PER_DAY}`, result: lc.shellFee }, "right", false, xlsxFmt(lc.shellFee));
            } else {
              setC(12, "");
            }

            setC(13, lc.tendaFee ? lc.tendaFee : "", "right", false, lc.tendaFee ? "#,##0" : null);
            setC(14, lc.tollFee ? lc.tollFee : "", "right", false, lc.tollFee ? xlsxFmt(lc.tollFee) : null);
            setC(15, { formula: `ROUND(SUM(J${rn}:N${rn}),3)`, result: lc.totalFee }, "right", true, xlsxFmt(lc.totalFee));
            totalFormulaRefs.push(`O${rn}`);

            setC(16, lc.note || "", "left");

            const misaInv = expanded.splitCosts ? (trip.lineMisa?.[idx]?.inv ?? (idx === 0 ? trip.misaInvoice : "")) : (trip.misaInvoice || "");
            const misaAmtRaw = expanded.splitCosts ? (trip.lineMisa?.[idx]?.amt ?? (idx === 0 ? trip.misaAmount : "")) : (trip.misaAmount || "");
            const misaNum = parseFloat(String(misaAmtRaw || "").replace(/,/g, ""));
            setC(17, misaInv || "");
            setC(18, !isNaN(misaNum) && misaNum > 0 ? misaNum : (misaAmtRaw || ""), "right", false, !isNaN(misaNum) && misaNum > 0 ? xlsxFmt(misaNum) : null);
          } else {
            for (let col = 10; col <= 18; col++) setC(col, "");
          }
        });

        const endRowNum = ws.rowCount;
        if (endRowNum > startRowNum) {
          if (expanded.mergeCont) ws.mergeCells(startRowNum, 4, endRowNum, 4);
          if (!expanded.splitCosts) ws.mergeCells(startRowNum, 5, endRowNum, 5);
          if (expanded.mergeTime) {
            ws.mergeCells(startRowNum, 7, endRowNum, 7);
            ws.mergeCells(startRowNum, 8, endRowNum, 8);
            ws.mergeCells(startRowNum, 9, endRowNum, 9);
          }
          if (expanded.mergeCost) {
            for (let col = 10; col <= 18; col++) {
              ws.mergeCells(startRowNum, col, endRowNum, col);
            }
          }
        }
      });
    });

    // Bảng Thuế 3 dòng nằm ngay dưới cột Tổng trả (cột 12-14 nhãn | cột 15 = O số tiền), nền trắng đúng mẫu & làm tròn 0
    const firstDataRow = chRow.number + 1;
    const lastDataRow = ws.rowCount;
    ws.addRow([]).height = 14;
    const sumFormulaExpr = totalFormulaRefs.length ? `ROUND(SUM(O${firstDataRow}:O${lastDataRow}),0)` : "0";
    const addVatBoxRow = (labelRich, valOrFormula, numFmtStr) => {
      const r = ws.addRow([]);
      r.height = BASE_ROW_PT;
      ws.mergeCells(r.number, 12, r.number, 14);
      const lc = r.getCell(12);
      lc.value = labelRich;
      lc.alignment = { horizontal: "right", vertical: "middle" };
      const vc = r.getCell(15);
      vc.value = valOrFormula;
      vc.font = ft(11, true);
      vc.alignment = { horizontal: "right", vertical: "middle" };
      vc.numFmt = numFmtStr;
      for (let c = 12; c <= 15; c++) {
        r.getCell(c).border = bd;
      }
      return r;
    };

    const subRow = addVatBoxRow(
      rt(["Tổng trước thuế "], ["(Subtotal)", 11, false, true], [":"]),
      totalFormulaRefs.length ? { formula: sumFormulaExpr, result: sum.subtotal } : 0,
      "#,##0"
    );
    if (sjState.vatOn && sum.vatTax > 0) {
      const rateStr = String(round3(sum.vatRate));
      const vatRow = addVatBoxRow(
        rt([`Thuế suất GTGT ${rateStr}% `], [`(VAT ${rateStr}%)`, 11, false, true], [":"]),
        { formula: `ROUND(O${subRow.number}*${round3(sum.vatRate) / 100},0)`, result: sum.vatTax },
        "#,##0"
      );
      addVatBoxRow(
        rt(["Tổng sau thuế "], ["(Total payment)", 11, false, true], [":"]),
        { formula: `ROUND(O${subRow.number}+O${vatRow.number},0)`, result: sum.grandTotal },
        "#,##0"
      );
    } else {
      addVatBoxRow(
        rt(["Tổng sau thuế "], ["(Total payment)", 11, false, true], [":"]),
        { formula: `O${subRow.number}`, result: sum.grandTotal },
        "#,##0"
      );
    }

    return wb.xlsx.writeBuffer();
  }

  /* ---------- Giao diện 2 khối gọn gàng ---------- */
  function renderWorkspaceShell() {
    const root = $("#vSunjune");
    if (!root) return;

    root.innerHTML = `
      <div class="sj-shell">
        <!-- Thanh trên gọn -->
        <div class="sj-top-card">
          <div class="sj-top-bar">
            <div class="sj-title-group">
              <input id="sjTitle" class="sj-title-input" type="text" value="${esc(sjState.title)}" placeholder="VD: BẢNG TỔNG HỢP PHÁT SINH TỪ 03.10 - 15.10.26" aria-label="Tiêu đề bảng kê & tên file">
              <input id="sjSheetName" class="sj-sheet-input" type="text" value="${esc(sjState.sheetName)}" placeholder="Sheet: ${esc(autoSheetName(sjState.trips))}" aria-label="Tên sheet Excel" title="Tên sheet trong file Excel (để trống sẽ tự lấy theo ngày đầu – cuối)">
              <div class="sj-vat-inline">
                <label class="check-inline">
                  <input id="sjVatOn" type="checkbox" ${sjState.vatOn ? "checked" : ""}>
                  <span>VAT</span>
                </label>
                <input id="sjVatRate" type="number" min="0" max="100" step="0.5" value="${esc(sjState.vatRate)}">
                <span>%</span>
              </div>
            </div>
            <div class="sj-top-btns">
              <button type="button" class="btn btn-sm btn-ghost" id="sjToggleTariff">Bảng giá Tariff</button>
              <button type="button" class="btn btn-sm btn-ghost" id="sjLoadSample">Nạp ví dụ mẫu</button>
              <button type="button" class="btn btn-sm btn-ghost" id="sjClearAll">Xoá bảng kê</button>
            </div>
          </div>
          <div id="sjTariffDrawer" class="sj-tariff-drawer" hidden></div>
          <div id="sjKpis" class="sj-kpis"></div>
        </div>

        <!-- Khối 1: Thêm chuyến phát sinh -->
        <div class="sj-editor-card">
          <div class="sj-editor-head">
            <div class="sj-editor-title">
              <strong id="sjFormModeTitle">Thêm chuyến phát sinh</strong>
              <span id="sjModeBadge" class="sj-pill">Mới</span>
              <span id="sjDetectHint" class="sj-detect-hint"></span>
            </div>
            <button type="button" class="btn btn-sm btn-ghost" id="sjResetForm">Làm mới form</button>
          </div>

          <div class="sj-form-grid-v2">
            <label class="sj-field">
              <span>Ngày</span>
              <input id="sjDate" type="text" placeholder="VD: 23.OCT hoặc 23/10">
            </label>
            <label class="sj-field">
              <span>Type of Truck</span>
              <select id="sjTruckCode">
                <optgroup label="Hàng lẻ (LCL · Free 2h)">
                  ${VEHICLE_OPTIONS.filter((v) => !v.isFcl)
                    .map((v) => `<option value="${esc(v.code)}">${esc(v.label)}</option>`)
                    .join("")}
                </optgroup>
                <optgroup label="Hàng nguyên Cont (FCL · Free 4h · 200k/h)">
                  ${VEHICLE_OPTIONS.filter((v) => v.isFcl)
                    .map((v) => `<option value="${esc(v.code)}">${esc(v.label)}</option>`)
                    .join("")}
                </optgroup>
              </select>
            </label>
            <label class="sj-field">
              <span>Booking Ref</span>
              <textarea id="sjBookingRefs" rows="1" class="sj-multi" placeholder="VD: SE1809260288"></textarea>
            </label>
            <label class="sj-field">
              <span>Shipment</span>
              <textarea id="sjShipments" rows="1" class="sj-multi" placeholder="VD: S02315494"></textarea>
            </label>

            <label class="sj-field sj-span-2">
              <span>Số Booking</span>
              <textarea id="sjBookings" rows="2" class="sj-multi" placeholder="VD: WAL076N05527HN0 WAL076N05528HN0"></textarea>
            </label>
            <label class="sj-field">
              <span>Số Cont</span>
              <textarea id="sjConts" rows="2" class="sj-multi" placeholder="VD: FSCU5960847"></textarea>
            </label>
            <label class="sj-field">
              <span>Volume</span>
              <textarea id="sjVolumes" rows="2" class="sj-multi" placeholder="VD: 5.571 4.414 3.664 (hoặc 40HC)"></textarea>
            </label>

            <label class="sj-field">
              <span>Giờ vào (In)</span>
              <input id="sjInTimes" type="text" placeholder="VD: 08:19">
            </label>
            <label class="sj-field">
              <span>Giờ ra (Out)</span>
              <input id="sjOutTimes" type="text" placeholder="VD: 16:40">
            </label>
            <div class="sj-check-row sj-span-2">
              <label class="check-inline">
                <input id="sjNextDay" type="checkbox">
                <span>Ra ngày hôm sau</span>
              </label>
              <label class="check-inline">
                <input id="sjDeductLunch" type="checkbox" checked>
                <span>Trừ nghỉ trưa (12h–13h)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Khối 2: Chi phí phát sinh -->
        <div class="sj-editor-card">
          <div class="sj-editor-head">
            <div class="sj-editor-title">
              <strong>Chi phí phát sinh</strong>
              <span id="sjCalcExplain" class="sj-calc-summary"></span>
            </div>
            <button type="button" class="link-btn" id="sjRecalcAuto">Tính lại theo giờ</button>
          </div>

          <div class="sj-fees-grid">
            <div class="sj-fee-item">
              <label class="sj-field">
                <span>Phát sinh chuyến (4h = 1 Truck)</span>
                <input id="sjExtraTrucks" type="number" min="0" max="10" step="1" value="0">
              </label>
              <small id="sjExtraTruckAmt" class="sj-fee-amt">0 đ</small>
            </div>

            <div class="sj-fee-item">
              <label class="sj-field">
                <span>Huỷ Xe (1 – 5 Truck)</span>
                <select id="sjCancelCount">
                  <option value="0">Không</option>
                  <option value="1">1 Truck</option>
                  <option value="2">2 Truck</option>
                  <option value="3">3 Truck</option>
                  <option value="4">4 Truck</option>
                  <option value="5">5 Truck</option>
                </select>
              </label>
              <small id="sjCancelAmt" class="sj-fee-amt">0 đ</small>
            </div>

            <div class="sj-fee-item">
              <label class="sj-field">
                <span>Giờ chờ (tự tính từ In/Out)</span>
                <input id="sjWaitHours" type="number" min="0" step="0.5" value="0">
              </label>
              <small id="sjWaitAmt" class="sj-fee-amt">0 đ</small>
            </div>

            <div class="sj-fee-item">
              <label class="sj-field">
                <span>Lưu ca / Overnight (đêm)</span>
                <input id="sjOvernightCount" type="number" min="0" max="10" step="1" value="0">
              </label>
              <small id="sjOvernightAmt" class="sj-fee-amt">0 đ</small>
            </div>

            <div class="sj-fee-item sj-shell-range">
              <div class="sj-field">
                <span>Gửi vỏ (Từ ngày → Đến ngày)</span>
                <div class="sj-date-pair">
                  <input id="sjShellFrom" type="date" aria-label="Gửi vỏ từ ngày">
                  <span>→</span>
                  <input id="sjShellTo" type="date" aria-label="Gửi vỏ đến ngày">
                </div>
              </div>
              <small id="sjShellAmt" class="sj-fee-amt">0 ngày · 0 đ</small>
            </div>

            <div class="sj-fee-item">
              <div class="sj-field">
                <span>Tenda</span>
                <label class="sj-tenda-toggle">
                  <input id="sjTendaOn" type="checkbox" checked>
                  <span>Áp dụng Tenda</span>
                </label>
              </div>
              <small id="sjTendaAmt" class="sj-fee-amt">1,000,000 đ</small>
            </div>

            <div class="sj-fee-item">
              <label class="sj-field">
                <span>Cao tốc (VND)</span>
                <input id="sjTollFee" type="number" min="0" step="1000" value="0">
              </label>
              <small id="sjTollAmt" class="sj-fee-amt">0 đ</small>
            </div>
          </div>

          <div class="sj-note-row">
            <label class="sj-field sj-note-field">
              <span>NOTE (tự động tổng hợp · không trùng giờ vào/ra)</span>
              <input id="sjNote" type="text" placeholder="VD: Tenda + 2 Giờ chờ + 217K Cao tốc">
            </label>
            <div class="sj-draft-total">
              <small>Tổng chuyến (chưa VAT)</small>
              <strong id="sjDraftTotal">0 đ</strong>
            </div>
            <div class="sj-submit-wrap">
              <button type="button" class="btn btn-primary" id="sjSaveTripBtn">+ Thêm vào bảng kê</button>
            </div>
          </div>
        </div>

        <!-- Khối 3: Bảng kê & Xuất Excel -->
        <div class="sj-preview-card">
          <div class="sj-preview-bar">
            <div class="sj-search-box">
              <input id="sjSearch" type="search" placeholder="Tìm Booking, SE, Shipment, Cont, Ngày..." value="${esc(searchQuery)}">
            </div>
            <div class="sj-export-btns">
              <button type="button" class="btn btn-primary" id="sjPrintBtn">In / Lưu PDF</button>
              <button type="button" class="btn" id="sjExcelBtn">Xuất Excel (.xlsx)</button>
            </div>
          </div>
          <div class="paper sj-paper" id="sjPreview"></div>
        </div>
      </div>
    `;
  }

  function renderTariffDrawer() {
    const el = $("#sjTariffDrawer");
    if (!el) return;
    el.hidden = !showTariffDrawer;
    if (!showTariffDrawer) return;
    const t = getTariff(sjState.defaultFactory);
    el.innerHTML = `
      <div class="sj-tariff-title">
        <strong>Bảng giá Tariff mặc định:</strong>
        <select id="sjDefaultFactory" class="sj-tariff-select">
          ${VN_TARIFF.map((x) => `<option value="${esc(x.key)}" ${x.key === sjState.defaultFactory ? "selected" : ""}>${esc(x.desc)} (${esc(x.local)})</option>`).join("")}
        </select>
        <span>1 Truck = VND × ${FUEL_FACTOR} · Overnight = VND × ${FUEL_FACTOR} × 0.8</span>
      </div>
      <div class="sj-tariff-scroll">
        <table class="sj-tariff-mini">
          <thead>
            <tr><th>Mục</th>${TRUCK_COLS.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            <tr><td><b>VND gốc</b></td>${t.vnd.map((v) => `<td>${v ? fmt(v) : "—"}</td>`).join("")}</tr>
            <tr><td><b>1 Truck (×1.25)</b></td>${t.vnd.map((v) => `<td>${v ? fmt(round3(v * FUEL_FACTOR)) : "—"}</td>`).join("")}</tr>
            <tr><td><b>Overnight (×0.8)</b></td>${t.vnd.map((v) => `<td>${v ? fmt(round3(v * FUEL_FACTOR * 0.8)) : "—"}</td>`).join("")}</tr>
          </tbody>
        </table>
      </div>
    `;
    on("#sjDefaultFactory", "change", (e) => {
      sjState.defaultFactory = e.target.value;
      if (!editingTripId && draft) draft.factoryKey = sjState.defaultFactory;
      saveState();
      renderTariffDrawer();
      updateDraftAmountsUi();
      renderSunjune();
    });
  }

  function syncDraftToForm() {
    if (!draft) return;
    const setVal = (sel, v) => {
      const el = $(sel);
      if (el && document.activeElement !== el) el.value = v;
    };
    const setChk = (sel, v) => {
      const el = $(sel);
      if (el) el.checked = !!v;
    };
    setVal("#sjDate", draft.date || "");
    setVal("#sjTruckCode", draft.truckCode || "8T");
    setVal("#sjBookingRefs", draft.bookingRefsText || "");
    setVal("#sjShipments", draft.shipmentsText || "");
    setVal("#sjBookings", draft.bookingsText || "");
    setVal("#sjConts", draft.contsText || "");
    setVal("#sjVolumes", draft.volumesText || "");
    setVal("#sjInTimes", draft.inTimesText || "");
    setVal("#sjOutTimes", draft.outTimesText || "");
    setChk("#sjNextDay", draft.nextDay);
    setChk("#sjDeductLunch", draft.deductLunch);

    setVal("#sjExtraTrucks", draft.extraTrucks ?? 0);
    setVal("#sjCancelCount", String(draft.cancelCount ?? 0));
    setVal("#sjWaitHours", draft.waitHours ?? 0);
    setVal("#sjOvernightCount", draft.overnightCount ?? 0);
    setVal("#sjShellFrom", draft.shellFrom || "");
    setVal("#sjShellTo", draft.shellTo || "");
    setChk("#sjTendaOn", draft.tendaOn);
    setVal("#sjTollFee", draft.tollFee ?? 0);
    setVal("#sjNote", draft.note || "");

    const modeTitle = $("#sjFormModeTitle");
    const modeBadge = $("#sjModeBadge");
    const saveBtn = $("#sjSaveTripBtn");
    if (editingTripId) {
      if (modeTitle) modeTitle.textContent = "Sửa chuyến phát sinh";
      if (modeBadge) {
        modeBadge.textContent = "Đang sửa";
        modeBadge.className = "sj-pill edit";
      }
      if (saveBtn) saveBtn.textContent = "Lưu thay đổi";
    } else {
      if (modeTitle) modeTitle.textContent = "Thêm chuyến phát sinh";
      if (modeBadge) {
        modeBadge.textContent = "Mới";
        modeBadge.className = "sj-pill";
      }
      if (saveBtn) saveBtn.textContent = "+ Thêm vào bảng kê";
    }
    updateDraftAmountsUi();
  }

  function applyAutoFromTime(forceAll = false) {
    if (!draft) return;
    const expanded = expandDraftRows(draft);
    if (!expanded.splitCosts) {
      const timing = computeTimingForPair(expanded.rows[0].inTime, expanded.rows[0].outTime, draft.truckCode, draft.deductLunch, draft.nextDay);
      if (timing.hasTime) {
        if (forceAll || !manualLocks.extraTrucks) draft.extraTrucks = timing.extraTrucks;
        if (forceAll || !manualLocks.waitHours) draft.waitHours = timing.waitHours;
        if (forceAll || !manualLocks.overnightCount) draft.overnightCount = timing.overnightCount;
      } else if (forceAll) {
        draft.extraTrucks = 0;
        draft.waitHours = 0;
        draft.overnightCount = 0;
      }
    }
    if (forceAll || !manualLocks.note) {
      draft.note = buildAutoNote(draft);
    }
    syncDraftToForm();
  }

  function updateDraftAmountsUi() {
    if (!draft) return;
    const detail = calcTripDetails(draft);
    const { expanded, veh, truckUnit, overnightUnit, lineCalcs, tripTotal } = detail;

    const hintEl = $("#sjDetectHint");
    if (hintEl) {
      if (expanded.rowCount > 1 && !expanded.splitCosts) {
        hintEl.textContent = `Combine ${expanded.rowCount} Booking · Tính phí 1 lần`;
      } else if (expanded.splitCosts) {
        hintEl.textContent = `${expanded.rowCount} dòng riêng (${expanded.mergeCont ? "chung Cont" : "tách Cont / tách giờ"})`;
      } else {
        hintEl.textContent = "";
      }
    }

    const explainEl = $("#sjCalcExplain");
    if (explainEl) {
      const firstTiming = lineCalcs[0].timing;
      const parts = [
        `${veh.truckCell}: <b>${fmt(truckUnit)} đ/truck</b>`,
        `Chờ: <b>${fmt(veh.waitRate)} đ/h</b>`,
        `Overnight: <b>${fmt(overnightUnit)} đ/đêm</b>`,
      ];
      if (!expanded.splitCosts && firstTiming.hasTime) {
        parts.push(
          `Đóng hàng: <b>${fmtHmShort(firstTiming.rawMins)}</b>${
            firstTiming.lunchMins ? ` (trừ trưa -${firstTiming.lunchMins}')` : ""
          } · Free ${firstTiming.freeMins / 60}h`
        );
      }
      explainEl.innerHTML = parts.join(" · ");
    }

    const sumTruck = round3(lineCalcs.reduce((s, c) => s + c.extraTrucks * truckUnit, 0));
    const sumCancel = round3(lineCalcs.reduce((s, c) => s + c.cancelCount * truckUnit, 0));
    const sumWait = round3(lineCalcs.reduce((s, c) => s + c.waitFee, 0));
    const sumOvn = round3(lineCalcs.reduce((s, c) => s + c.overnightFee, 0));
    const sumShell = round3(lineCalcs.reduce((s, c) => s + c.shellFee, 0));
    const sumTenda = round3(lineCalcs.reduce((s, c) => s + c.tendaFee, 0));
    const sumToll = round3(lineCalcs.reduce((s, c) => s + c.tollFee, 0));

    if ($("#sjExtraTruckAmt")) $("#sjExtraTruckAmt").textContent = `${fmt(sumTruck)} đ`;
    if ($("#sjCancelAmt")) $("#sjCancelAmt").textContent = `${fmt(sumCancel)} đ`;
    if ($("#sjWaitAmt")) $("#sjWaitAmt").textContent = `${fmt(sumWait)} đ`;
    if ($("#sjOvernightAmt")) $("#sjOvernightAmt").textContent = `${fmt(sumOvn)} đ`;
    if ($("#sjShellAmt")) {
      const days = lineCalcs[0].shellDays || 0;
      $("#sjShellAmt").textContent = `${days} ngày · ${fmt(sumShell)} đ`;
    }
    if ($("#sjTendaAmt")) $("#sjTendaAmt").textContent = `${fmt(sumTenda)} đ`;
    if ($("#sjTollAmt")) $("#sjTollAmt").textContent = `${fmt(sumToll)} đ`;
    if ($("#sjDraftTotal")) $("#sjDraftTotal").textContent = `${fmt(tripTotal)} đ`;
  }

  function filteredTrips() {
    if (!searchQuery.trim()) return sjState.trips;
    const q = norm(searchQuery);
    return sjState.trips.filter((t) =>
      [t.date, t.bookingRefsText, t.shipmentsText, t.bookingsText, t.contsText, t.truckCode, t.note, t.misaInvoice]
        .map(norm)
        .join(" ")
        .includes(q)
    );
  }

  function renderSunjune() {
    if (!$("#vSunjune")) return;
    const allSum = calcStatementSummary(sjState.trips);
    const kpiEl = $("#sjKpis");
    if (kpiEl) {
      kpiEl.innerHTML = [
        ["Số chuyến", sjState.trips.length, ""],
        ["Số Booking", allSum.totalBookings, "kpi-ok"],
        ["Tổng trước thuế", `${fmt(allSum.subtotal)} đ`, ""],
        ["Tổng sau thuế (VAT)", `${fmt(allSum.grandTotal)} đ`, "kpi-ok"],
      ]
        .map(([l, v, c]) => `<div class="kpi ${c}"><small>${l}</small><strong>${v}</strong></div>`)
        .join("");
    }
    renderTariffDrawer();
    const sheetInp = $("#sjSheetName");
    if (sheetInp) {
      sheetInp.placeholder = `Sheet: ${autoSheetName(sjState.trips)}`;
    }
    if ($("#sjPreview")) $("#sjPreview").innerHTML = buildStatementHtml(filteredTrips(), false);
  }

  function saveDraftTrip() {
    if (!draft) return;
    const hasAnyId =
      splitTokens(draft.bookingsText).length ||
      splitTokens(draft.bookingRefsText).length ||
      splitTokens(draft.shipmentsText).length ||
      splitTokens(draft.contsText).length;
    if (!hasAnyId) {
      toast("Vui lòng nhập ít nhất Số Booking, Booking Ref hoặc Shipment.");
      return;
    }
    const copy = JSON.parse(JSON.stringify(draft));
    copy.date = normalizeDateLabel(copy.date);

    if (editingTripId) {
      const idx = sjState.trips.findIndex((t) => t.id === editingTripId);
      if (idx >= 0) sjState.trips[idx] = copy;
      else sjState.trips.push(copy);
      toast("Đã cập nhật chuyến phát sinh.");
    } else {
      sjState.trips.push(copy);
      toast("Đã thêm chuyến vào bảng kê.");
    }

    const keepDate = copy.date;
    editingTripId = null;
    manualLocks = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
    draft = createEmptyDraft();
    draft.date = keepDate || draft.date;
    saveState();
    syncDraftToForm();
    renderSunjune();
  }

  function loadSampleTrips() {
    if (sjState.trips.length && !window.confirm("Bảng kê đang có dữ liệu. Thêm các chuyến ví dụ mẫu vào bảng kê?")) {
      return;
    }
    const samples = [
      {
        id: "sj_s1",
        date: "03.NOV",
        bookingRefsText: "SE1809260349 SE0310260183 SE0310260145",
        shipmentsText: "S02320180 S02319546 S02319544",
        bookingsText: "BY388673 BY414666 BY414778",
        contsText: "",
        truckCode: "10T",
        volumesText: "1.81 16.01 14.1",
        inTimesText: "07:52",
        outTimesText: "10:00",
        nextDay: false,
        deductLunch: true,
        factoryKey: "sunjune",
        extraTrucks: 0,
        cancelCount: 0,
        waitHours: 0,
        overnightCount: 0,
        shellFrom: "",
        shellTo: "",
        shellDays: 0,
        tendaOn: true,
        tollFee: 0,
        note: "Tenda",
        misaInvoice: "",
        misaAmount: "",
        lineMisa: [],
      },
      {
        id: "sj_s2",
        date: "05.NOV",
        bookingRefsText: "SE3110260140",
        shipmentsText: "S02326736",
        bookingsText: "HANM83299800",
        contsText: "HMMU6837801",
        truckCode: "FCL-40DC",
        volumesText: "40DC",
        inTimesText: "08:19",
        outTimesText: "16:40",
        nextDay: false,
        deductLunch: true,
        factoryKey: "sunjune",
        extraTrucks: 0,
        cancelCount: 0,
        waitHours: 3,
        overnightCount: 0,
        shellFrom: "",
        shellTo: "",
        shellDays: 0,
        tendaOn: true,
        tollFee: 0,
        note: "Tenda + 3 Giờ chờ",
        misaInvoice: "",
        misaAmount: "",
        lineMisa: [],
      },
      {
        id: "sj_s3",
        date: "05.NOV",
        bookingRefsText: "SE0309260099",
        shipmentsText: "S02304563",
        bookingsText: "HANGG4684500",
        contsText: "TLLU1114663",
        truckCode: "FCL-40HCNOR",
        volumesText: "40HCNOR",
        inTimesText: "",
        outTimesText: "",
        nextDay: false,
        deductLunch: true,
        factoryKey: "sunjune",
        extraTrucks: 0,
        cancelCount: 1,
        waitHours: 0,
        overnightCount: 2,
        shellFrom: "2026-10-15",
        shellTo: "2026-10-17",
        shellDays: 3,
        tendaOn: true,
        tollFee: 217000,
        note: "Tenda + Cancel + 2 Over Night + Gửi vỏ 3 ngày (ngày 15, 16, 17/10) + 217K Cao tốc",
        misaInvoice: "",
        misaAmount: "",
        lineMisa: [],
      },
    ];
    sjState.trips.push(...samples);
    saveState();
    renderSunjune();
    toast("Đã nạp 3 chuyến ví dụ mẫu (có combine & dòng Ngày nằm ngang).");
  }

  function bindEvents() {
    on("#sjTitle", "input", (e) => {
      sjState.title = e.target.value;
      saveState();
      const tEl = $("#sjPreview .sj-sheet-title");
      if (tEl) tEl.textContent = sjState.title || "BẢNG TỔNG HỢP PHÁT SINH";
    });
    on("#sjSheetName", "input", (e) => {
      sjState.sheetName = e.target.value;
      saveState();
    });
    on("#sjVatOn", "change", (e) => {
      sjState.vatOn = e.target.checked;
      saveState();
      renderSunjune();
    });
    on("#sjVatRate", "input", (e) => {
      const v = parseFloat(e.target.value);
      sjState.vatRate = isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
      saveState();
      renderSunjune();
    });
    bindClick("#sjToggleTariff", () => {
      showTariffDrawer = !showTariffDrawer;
      renderTariffDrawer();
    });
    bindClick("#sjLoadSample", loadSampleTrips);
    bindClick("#sjClearAll", () => {
      if (!sjState.trips.length) return;
      if (!window.confirm("Xoá toàn bộ các chuyến trong Bảng kê Sunjune?")) return;
      sjState.trips = [];
      saveState();
      renderSunjune();
      toast("Đã xoá bảng kê.");
    });

    // Khối 1: Thêm chuyến phát sinh
    on("#sjDate", "input", (e) => {
      draft.date = e.target.value;
    });
    on("#sjTruckCode", "change", (e) => {
      draft.truckCode = e.target.value;
      applyAutoFromTime(false);
    });
    on("#sjBookingRefs", "input", (e) => {
      draft.bookingRefsText = e.target.value;
    });
    on("#sjShipments", "input", (e) => {
      draft.shipmentsText = e.target.value;
    });
    on("#sjBookings", "input", (e) => {
      draft.bookingsText = e.target.value;
      updateDraftAmountsUi();
    });
    on("#sjConts", "input", (e) => {
      draft.contsText = e.target.value;
      applyAutoFromTime(false);
    });
    on("#sjVolumes", "input", (e) => {
      draft.volumesText = e.target.value;
    });
    on("#sjInTimes", "input", (e) => {
      draft.inTimesText = e.target.value;
      applyAutoFromTime(false);
    });
    on("#sjOutTimes", "input", (e) => {
      draft.outTimesText = e.target.value;
      applyAutoFromTime(false);
    });
    on("#sjNextDay", "change", (e) => {
      draft.nextDay = e.target.checked;
      applyAutoFromTime(false);
    });
    on("#sjDeductLunch", "change", (e) => {
      draft.deductLunch = e.target.checked;
      applyAutoFromTime(false);
    });

    // Khối 2: Chi phí phát sinh
    const bindNumFee = (sel, field, lockKey) => {
      on(sel, "input", (e) => {
        const val = parseFloat(e.target.value);
        draft[field] = isNaN(val) ? 0 : Math.max(0, val);
        if (lockKey) manualLocks[lockKey] = true;
        if (!manualLocks.note) {
          draft.note = buildAutoNote(draft);
          if ($("#sjNote")) $("#sjNote").value = draft.note;
        }
        updateDraftAmountsUi();
      });
    };
    bindNumFee("#sjExtraTrucks", "extraTrucks", "extraTrucks");
    bindNumFee("#sjWaitHours", "waitHours", "waitHours");
    bindNumFee("#sjOvernightCount", "overnightCount", "overnightCount");
    bindNumFee("#sjTollFee", "tollFee", null);

    on("#sjCancelCount", "change", (e) => {
      draft.cancelCount = Math.max(0, parseInt(e.target.value, 10) || 0);
      if (!manualLocks.note) {
        draft.note = buildAutoNote(draft);
        if ($("#sjNote")) $("#sjNote").value = draft.note;
      }
      updateDraftAmountsUi();
    });

    const onShellChange = () => {
      draft.shellFrom = $("#sjShellFrom")?.value || "";
      draft.shellTo = $("#sjShellTo")?.value || "";
      draft.shellDays = calcShellRange(draft.shellFrom, draft.shellTo).days;
      if (!manualLocks.note) {
        draft.note = buildAutoNote(draft);
        if ($("#sjNote")) $("#sjNote").value = draft.note;
      }
      updateDraftAmountsUi();
    };
    on("#sjShellFrom", "change", onShellChange);
    on("#sjShellTo", "change", onShellChange);

    on("#sjTendaOn", "change", (e) => {
      draft.tendaOn = e.target.checked;
      if (!manualLocks.note) {
        draft.note = buildAutoNote(draft);
        if ($("#sjNote")) $("#sjNote").value = draft.note;
      }
      updateDraftAmountsUi();
    });
    on("#sjNote", "input", (e) => {
      draft.note = e.target.value;
      manualLocks.note = true;
    });

    bindClick("#sjRecalcAuto", () => {
      manualLocks = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
      applyAutoFromTime(true);
      toast("Đã tính lại chi phí theo giờ và công thức Tariff.");
    });

    bindClick("#sjResetForm", () => {
      editingTripId = null;
      manualLocks = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
      draft = createEmptyDraft();
      syncDraftToForm();
    });

    bindClick("#sjSaveTripBtn", saveDraftTrip);
    on("#sjSearch", "input", (e) => {
      searchQuery = e.target.value;
      renderSunjune();
    });

    // Sửa trực tiếp Misa trên bảng xem trước & thao tác dòng
    on("#sjPreview", "input", (e) => {
      const cell = e.target.closest("[data-misa-trip]");
      if (!cell) return;
      const t = sjState.trips.find((x) => x.id === cell.dataset.misaTrip);
      if (!t) return;
      const val = cell.textContent.replace(/\s+/g, " ").trim();
      const idx = +cell.dataset.misaIdx;
      const field = cell.dataset.misaField;
      const expanded = expandDraftRows(t);
      if (expanded.splitCosts) {
        t.lineMisa = t.lineMisa || [];
        t.lineMisa[idx] = t.lineMisa[idx] || {};
        t.lineMisa[idx][field] = val;
      } else {
        if (field === "inv") t.misaInvoice = val;
        else t.misaAmount = val;
      }
      saveState();
    });

    on("#sjPreview", "keydown", (e) => {
      const cell = e.target.closest("[data-misa-trip]");
      if (cell && e.key === "Enter") {
        e.preventDefault();
        cell.blur();
      }
    });

    on("#sjPreview", "click", (e) => {
      const editBtn = e.target.closest("[data-sj-edit]");
      if (editBtn) {
        const found = sjState.trips.find((t) => t.id === editBtn.dataset.sjEdit);
        if (!found) return;
        editingTripId = found.id;
        draft = JSON.parse(JSON.stringify(found));
        manualLocks = { extraTrucks: true, waitHours: true, overnightCount: true, note: true };
        syncDraftToForm();
        $("#vSunjune")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const dupBtn = e.target.closest("[data-sj-dup]");
      if (dupBtn) {
        const found = sjState.trips.find((t) => t.id === dupBtn.dataset.sjDup);
        if (!found) return;
        const copy = JSON.parse(JSON.stringify(found));
        copy.id = "sj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
        const idx = sjState.trips.findIndex((t) => t.id === found.id);
        sjState.trips.splice(idx + 1, 0, copy);
        saveState();
        renderSunjune();
        toast("Đã nhân bản chuyến.");
        return;
      }
      const delBtn = e.target.closest("[data-sj-del]");
      if (delBtn) {
        const id = delBtn.dataset.sjDel;
        sjState.trips = sjState.trips.filter((t) => t.id !== id);
        if (editingTripId === id) {
          editingTripId = null;
          draft = createEmptyDraft();
          syncDraftToForm();
        }
        saveState();
        renderSunjune();
        toast("Đã xoá chuyến.");
      }
    });

    bindClick("#sjPrintBtn", () => {
      const list = filteredTrips();
      if (!list.length) return toast("Chưa có dữ liệu bảng kê để in.");
      $("#printArea").innerHTML = buildStatementHtml(list, true);
      setTimeout(() => window.print(), 60);
    });

    bindClick("#sjExcelBtn", async () => {
      const list = filteredTrips();
      if (!list.length) return toast("Chưa có dữ liệu bảng kê để xuất Excel.");
      try {
        const buf = await buildSunjuneXlsxBuffer(list);
        const file = `${safeFileName(sjState.title)}.xlsx`;
        downloadBuffer(file, buf);
        toast(`Đã xuất ${file}`);
      } catch (err) {
        toast(`Không xuất được Excel: ${err.message}`, 5000);
      }
    });
  }

  function initSunjune() {
    loadState();
    draft = createEmptyDraft();
    renderWorkspaceShell();
    bindEvents();
    syncDraftToForm();
    renderSunjune();
  }

  LG_TABS.sunjune = {
    inited: false,
    init: initSunjune,
    onShow: renderSunjune,
    onConfigChange: renderSunjune,
    _test: {
      expandDraftRows,
      computeTimingForPair,
      calcShellRange,
      calcTripDetails,
      calcStatementSummary,
      estimateNoteLines,
      buildSunjuneXlsxBuffer,
      buildAutoNote,
      autoSheetName,
      safeSheetName,
      safeFileName,
      VN_TARIFF,
    },
  };
})();
