/* Ligentia WorkSpace — Tab 2: Bảng kê Sunjune (Phát sinh vận tải & Tariff Combine) */
(function () {
  const STORAGE_KEY = "lg_sunjune_v1";

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

  // Vietnam Domestic Trucking Tariff (Valid 01 Apr – 31 Dec 2026, VND prioritized)
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

  const getTariff = (key) => VN_TARIFF.find((t) => t.key === key) || VN_TARIFF.find((t) => t.key === "sunjune");
  const getVehicle = (code) => VEHICLE_OPTIONS.find((v) => v.code === code) || VEHICLE_OPTIONS[4]; // default 8T

  const TENDA_FEE = 1000000;
  const SHELL_FEE_PER_DAY = 1800000;

  let sjState = {
    title: "BẢNG TỔNG HỢP PHÁT SINH",
    period: "",
    defaultFactory: "sunjune",
    fuelFactor: 1.25,
    vatOn: true,
    vatRate: 8,
    trips: [],
  };

  let editingTripId = null;
  let draftTrip = null;
  let manualLocked = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
  let searchQuery = "";
  let showTariffDrawer = false;

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (raw && typeof raw === "object") {
        sjState = {
          title: typeof raw.title === "string" && raw.title ? raw.title : "BẢNG TỔNG HỢP PHÁT SINH",
          period: typeof raw.period === "string" ? raw.period : "",
          defaultFactory: raw.defaultFactory || "sunjune",
          fuelFactor: Number(raw.fuelFactor) > 0 ? Number(raw.fuelFactor) : 1.25,
          vatOn: typeof raw.vatOn === "boolean" ? raw.vatOn : true,
          vatRate: raw.vatRate !== undefined && !isNaN(Number(raw.vatRate)) ? Number(raw.vatRate) : 8,
          trips: Array.isArray(raw.trips) ? raw.trips : [],
        };
      }
    } catch {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sjState));
    } catch {}
  }

  /* ---------- Time & Tariff Calculation Engine ---------- */
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

  function computeAutoTiming(trip) {
    const veh = getVehicle(trip.truckCode);
    const inM = parseTimeToMins(trip.inTime);
    const outM0 = parseTimeToMins(trip.outTime);
    if (inM == null || outM0 == null) {
      return {
        hasTime: false,
        rawMins: 0,
        loadingTime: "",
        lunchMins: 0,
        netMins: 0,
        freeMins: veh.isFcl ? 240 : 120,
        excessMins: 0,
        billableHours: 0,
        extraTrucks: 0,
        waitHours: 0,
        overnightCount: 0,
      };
    }

    let outM = outM0;
    const crossedMidnight = trip.nextDay || outM0 < inM;
    if (crossedMidnight && outM <= inM) outM += 1440;
    if (trip.nextDay && outM - inM < 0) outM += 1440;

    const rawMins = Math.max(0, outM - inM);
    const lunchMins = trip.deductLunch ? lunchOverlapMins(inM, outM) : 0;
    const netMins = Math.max(0, rawMins - lunchMins);
    const freeMins = veh.isFcl ? 240 : 120;
    const excessMins = Math.max(0, netMins - freeMins);

    // Làm tròn theo mốc gần 55 phút (2h55' -> 1h chờ, 2h54' -> 0h chờ; cứ 4h = 1 truck)
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
      billableHours,
      extraTrucks,
      waitHours,
      overnightCount,
    };
  }

  function calcTripMoney(trip) {
    const veh = getVehicle(trip.truckCode);
    const tariff = getTariff(trip.factoryKey || sjState.defaultFactory);
    const baseVnd = Number(tariff.vnd[veh.colIdx]) || 0;
    const fuel = Number(sjState.fuelFactor) > 0 ? Number(sjState.fuelFactor) : 1.25;

    const timing = computeAutoTiming(trip);
    const extraTrucks = Math.max(0, Number(trip.extraTrucks) || 0);
    const cancelCount = Math.max(0, Number(trip.cancelCount) || 0);
    const waitHours = Math.max(0, Number(trip.waitHours) || 0);
    const overnightCount = Math.max(0, Number(trip.overnightCount) || 0);
    const shellDays = Math.max(0, Number(trip.shellDays) || 0);

    const truckUnit = round3(baseVnd * fuel);
    const overnightUnit = round3(baseVnd * fuel * 0.8);

    const truckFee = round3((extraTrucks + cancelCount) * truckUnit);
    const waitFee = round3(waitHours * veh.waitRate);
    const overnightFee = round3(overnightCount * overnightUnit);
    const waitAndOvernight = round3(waitFee + overnightFee);
    const shellFee = round3(shellDays * SHELL_FEE_PER_DAY);
    const tendaFee = trip.tendaOn ? TENDA_FEE : 0;
    const tollFee = round3(Math.max(0, Number(trip.tollFee) || 0));
    const otherFee = round3(Math.max(0, Number(trip.otherFee) || 0));
    const totalFee = round3(truckFee + waitAndOvernight + shellFee + tendaFee + tollFee + otherFee);

    return {
      veh,
      tariff,
      baseVnd,
      fuel,
      timing,
      truckUnit,
      overnightUnit,
      truckFee,
      waitFee,
      overnightFee,
      waitAndOvernight,
      shellFee,
      tendaFee,
      tollFee,
      otherFee,
      totalFee,
    };
  }

  function buildAutoNote(trip, calc) {
    const parts = [];
    if (trip.tendaOn) parts.push("PICKUP TENDA");

    const details = [];
    if (calc.timing.hasTime) {
      details.push(`xe vào ${trip.inTime.slice(0, 5)}, ra ${trip.outTime.slice(0, 5)}, tổng ${fmtHmShort(calc.timing.rawMins)}`);
    }
    const charges = [];
    const extra = Math.max(0, Number(trip.extraTrucks) || 0);
    const cancel = Math.max(0, Number(trip.cancelCount) || 0);
    const wait = Math.max(0, Number(trip.waitHours) || 0);
    const ovn = Math.max(0, Number(trip.overnightCount) || 0);
    const shell = Math.max(0, Number(trip.shellDays) || 0);
    const toll = Math.max(0, Number(trip.tollFee) || 0);
    const other = Math.max(0, Number(trip.otherFee) || 0);

    if (extra > 0) charges.push(`${extra} Truck`);
    if (cancel > 0) charges.push(`${cancel} Cancel Truck`);
    if (wait > 0) charges.push(`${wait} Giờ chờ`);
    if (ovn > 0) charges.push(`${ovn} Overnight`);
    if (shell > 0) charges.push(`${shell} Ngày gửi vỏ`);
    if (toll > 0) charges.push(`Cao tốc ${fmt(toll)}`);
    if (other > 0) charges.push(`Phụ phí khác ${fmt(other)}`);

    if (details.length && charges.length) {
      parts.push(`(${details[0]}) / Charge ${charges.join(" + ")}`);
    } else if (charges.length) {
      parts.push(`Charge ${charges.join(" + ")}`);
    }
    return parts.join(" + ");
  }

  function createEmptyDraft() {
    return {
      id: "sj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      date: formatShortDate(todayIso()),
      contNo: "",
      truckCode: "8T",
      factoryKey: sjState.defaultFactory || "sunjune",
      inTime: "",
      outTime: "",
      nextDay: false,
      deductLunch: true,
      extraTrucks: 0,
      cancelCount: 0,
      waitHours: 0,
      overnightCount: 0,
      shellDays: 0,
      tendaOn: true,
      tollFee: 0,
      otherFee: 0,
      misaInvoice: "",
      note: "PICKUP TENDA",
      bookings: [{ ref: "", shipment: "", booking: "", volume: "" }],
    };
  }

  function formatShortDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return "";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${m[3]}.${months[+m[2] - 1] || m[2]}`;
  }

  function calcSummary(tripsList) {
    const calcs = tripsList.map((t) => ({ trip: t, calc: calcTripMoney(t) }));
    const subtotal = round3(calcs.reduce((s, x) => s + x.calc.totalFee, 0));
    const vatRate = sjState.vatOn ? Math.max(0, Number(sjState.vatRate) || 0) : 0;
    const vatTax = sjState.vatOn && vatRate > 0 ? round3((subtotal * vatRate) / 100) : 0;
    const grandTotal = round3(subtotal + vatTax);
    const totalBookings = tripsList.reduce((s, t) => s + Math.max(1, (t.bookings || []).length), 0);
    const showOtherCol = calcs.some((x) => x.calc.otherFee > 0);
    return { calcs, subtotal, vatRate, vatTax, grandTotal, totalBookings, showOtherCol };
  }

  /* ---------- Paste Parser for Combining Multiple Bookings ---------- */
  function parsePastedBookings(rawText) {
    const lines = String(rawText || "")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return [];

    return lines.map((line) => {
      let cols = line.includes("\t") ? line.split("\t") : line.includes(",") ? line.split(",") : line.split(/\s+/);
      cols = cols.map((c) => c.trim());
      if (cols.length >= 4) {
        return { ref: cols[0] || "", shipment: cols[1] || "", booking: cols[2] || "", volume: cols[3] || "" };
      }
      if (cols.length === 3) {
        const isLastNum = /^[\d.,]+$/.test(cols[2]) || /^(20|40|45)/i.test(cols[2]);
        if (isLastNum) return { ref: cols[0] || "", shipment: "", booking: cols[1] || "", volume: cols[2] || "" };
        return { ref: cols[0] || "", shipment: cols[1] || "", booking: cols[2] || "", volume: "" };
      }
      if (cols.length === 2) {
        const isSecondVol = /^[\d.,]+$/.test(cols[1]);
        return isSecondVol
          ? { ref: "", shipment: "", booking: cols[0] || "", volume: cols[1] || "" }
          : { ref: "", shipment: cols[0] || "", booking: cols[1] || "", volume: "" };
      }
      return { ref: "", shipment: "", booking: cols[0] || "", volume: "" };
    });
  }

  /* ---------- HTML Preview & Print Sheet ---------- */
  function buildStatementHtml(tripsList, forPrint = false) {
    const sum = calcSummary(tripsList);
    const now = new Date();
    const factoryInfo = getTariff(sjState.defaultFactory);
    const hasOther = sum.showOtherCol;
    const totalCols = hasOther ? 19 : 18;
    const feeColSpan = hasOther ? 8 : 7;

    let bodyHtml = "";
    if (!sum.calcs.length) {
      bodyHtml = `<tr><td colspan="${totalCols}" style="text-align:center;color:#64748b;padding:24px;">Chưa có chuyến phát sinh nào. Hãy nhập chuyến mới ở bảng trên hoặc bấm <b>Nạp ví dụ mẫu</b> để xem thử.</td></tr>`;
    } else {
      bodyHtml = sum.calcs
        .map(({ trip, calc }) => {
          const bks = trip.bookings && trip.bookings.length ? trip.bookings : [{ ref: "", shipment: "", booking: "", volume: "" }];
          const rs = bks.length;
          const spanAttr = rs > 1 ? ` rowspan="${rs}"` : "";
          const truckCellText = calc.veh.truckCell;

          return bks
            .map((bk, idx) => {
              const volText = bk.volume || (calc.veh.isFcl ? calc.veh.defaultVol : "");
              const cells = [];

              if (idx === 0) cells.push(`<td${spanAttr} class="c">${esc(trip.date || "—")}</td>`);
              cells.push(`<td class="c">${esc(bk.ref)}</td>`);
              cells.push(`<td class="c">${esc(bk.shipment)}</td>`);
              cells.push(`<td class="c">${esc(bk.booking)}</td>`);
              if (idx === 0) cells.push(`<td${spanAttr} class="c">${esc(trip.contNo)}</td>`);
              if (idx === 0) cells.push(`<td${spanAttr} class="c"><b>${esc(truckCellText)}</b></td>`);
              cells.push(`<td class="c">${esc(volText)}</td>`);

              if (idx === 0) {
                cells.push(`<td${spanAttr} class="c">${esc(trip.inTime ? fmtTimeStr(trip.inTime) : "")}</td>`);
                cells.push(`<td${spanAttr} class="c">${esc(trip.outTime ? fmtTimeStr(trip.outTime) : "")}</td>`);
                cells.push(`<td${spanAttr} class="c">${esc(calc.timing.loadingTime || "")}</td>`);
                cells.push(`<td${spanAttr} class="r">${calc.truckFee ? fmt(calc.truckFee) : ""}</td>`);
                cells.push(`<td${spanAttr} class="r">${calc.waitAndOvernight ? fmt(calc.waitAndOvernight) : ""}</td>`);
                cells.push(`<td${spanAttr} class="r">${calc.shellFee ? fmt(calc.shellFee) : ""}</td>`);
                cells.push(`<td${spanAttr} class="r">${calc.tendaFee ? fmt(calc.tendaFee) : ""}</td>`);
                cells.push(`<td${spanAttr} class="r">${calc.tollFee ? fmt(calc.tollFee) : ""}</td>`);
                if (hasOther) cells.push(`<td${spanAttr} class="r">${calc.otherFee ? fmt(calc.otherFee) : ""}</td>`);
                cells.push(`<td${spanAttr} class="r"><b>${fmt(calc.totalFee)}</b></td>`);
                cells.push(`<td${spanAttr} class="sj-note-cell">${esc(trip.note)}</td>`);
                cells.push(`<td${spanAttr} class="c">${esc(trip.misaInvoice)}</td>`);
                if (!forPrint) {
                  cells.push(
                    `<td${spanAttr} class="c sj-op-col">
                      <div class="sj-row-ops">
                        <button type="button" class="sj-op-btn" data-sj-edit="${esc(trip.id)}" title="Sửa chuyến này">Sửa</button>
                        <button type="button" class="sj-op-btn" data-sj-dup="${esc(trip.id)}" title="Nhân bản">Nhân</button>
                        <button type="button" class="sj-op-btn del" data-sj-del="${esc(trip.id)}" title="Xoá">Xoá</button>
                      </div>
                    </td>`
                  );
                }
              }

              return `<tr>${cells.join("")}</tr>`;
            })
            .join("");
        })
        .join("");
    }

    const kv = (l, e, v, b) =>
      v ? `<div class="kv">${l} <i>(${e})</i>: ${b ? `<b class="big">${esc(v)}</b>` : esc(v)}</div>` : "";

    return `<div class="sheet sj-sheet">
      <div class="sh-top">
        <div>${cfg.logo ? `<img src="${cfg.logo}" alt="">` : ""}</div>
        <div class="sh-mid">
          <h2>${esc(sjState.title || "BẢNG TỔNG HỢP PHÁT SINH")}</h2>
          <div class="e">(SURCHARGE / EXTRA COST STATEMENT)</div>
          <div>Ngày <i>(Date)</i> ${now.getDate()} tháng <i>(month)</i> ${now.getMonth() + 1} năm <i>(year)</i> ${now.getFullYear()}</div>
        </div>
        <div class="sh-r">Kỳ <i>(Period)</i>:<br><i style="white-space:nowrap">${esc(sjState.period) || "—"}</i></div>
      </div>
      ${kv("Đơn vị lập", "Issuer", cfg.name, 1)}
      ${kv("Mã số thuế", "Tax code", cfg.tax)}
      ${kv("Địa chỉ", "Address", cfg.addr)}
      ${kv("Điện thoại", "Tel", cfg.tel)}
      ${kv("Số tài khoản", "Bank account", cfg.bank)}
      <hr style="border:0;border-top:1px solid #999;margin:8px 0">
      ${kv("Khách hàng / Nhà máy áp Tariff", "Customer / Tariff", factoryInfo.desc, 1)}

      <table class="t sj-table">
        <thead>
          <tr>
            <th colspan="7">Thông tin lô hàng</th>
            <th colspan="3">Thời gian xe</th>
            <th colspan="${feeColSpan}">Chi phí phát sinh</th>
            <th>Misa</th>
            ${!forPrint ? `<th rowspan="2" class="sj-op-col">Thao tác</th>` : ""}
          </tr>
          <tr>
            <th>Date</th>
            <th>Booking Ref</th>
            <th>Shipment</th>
            <th>Booking</th>
            <th>Cont No.</th>
            <th>Type of Truck</th>
            <th>Volume</th>
            <th>In</th>
            <th>Out</th>
            <th>Loading time</th>
            <th>Cước xe / Huỷ xe</th>
            <th>Lưu ca / Giờ chờ</th>
            <th>Gửi vỏ</th>
            <th>Tenda</th>
            <th>Cao tốc</th>
            ${hasOther ? "<th>Khác</th>" : ""}
            <th>Tổng trả</th>
            <th>NOTE</th>
            <th>Hoá đơn Misa</th>
          </tr>
        </thead>
        <tbody>${bodyHtml}</tbody>
      </table>

      <table class="tt">
        ${
          sjState.vatOn && sum.vatTax > 0
            ? `<tr><td>Tổng trước thuế <i>(Subtotal)</i>:</td><td>${fmt(sum.subtotal)}</td></tr>
               <tr><td>Thuế suất GTGT ${esc(String(round3(sum.vatRate)))}% <i>(VAT ${esc(String(round3(sum.vatRate)))}%)</i>:</td><td>${fmt(sum.vatTax)}</td></tr>
               <tr class="gt"><td>Tổng sau thuế <i>(Total payment)</i>:</td><td>${fmt(sum.grandTotal)}</td></tr>`
            : `<tr class="gt"><td>Tổng cộng <i>(Total amount)</i>:</td><td>${fmt(sum.grandTotal)}</td></tr>`
        }
      </table>
      <div class="wd">Số tiền viết bằng chữ <i>(Total amount in words)</i>: <b>${words(sum.grandTotal)}</b></div>
      ${cfg.note ? `<div class="nt">${esc(cfg.note)}</div>` : ""}
      <div class="sig">
        <div><b>Người lập</b> <i>(Prepared by)</i><i class="sp"></i><b>${esc(cfg.signer)}</b></div>
        <div><b>Khách hàng xác nhận</b> <i>(Customer confirmation)</i><i class="sp"></i><small>(Ký, đóng dấu / Signature, stamp)</small></div>
      </div>
    </div>`;
  }

  /* ---------- Excel Export with Real Merge Cells ---------- */
  async function buildSunjuneXlsxBuffer(tripsList) {
    if (typeof ExcelJS === "undefined") {
      throw new Error("Thư viện xuất Excel (ExcelJS) chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng và tải lại trang.");
    }
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Bang_Ke_Phat_Sinh", {
      views: [{ showGridLines: false }],
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

    const sum = calcSummary(tripsList);
    const hasOther = sum.showOtherCol;
    const now = new Date();
    const factoryInfo = getTariff(sjState.defaultFactory);

    const colDefs = [
      { h: "Date", w: 10 },
      { h: "Booking Ref", w: 15 },
      { h: "Shipment", w: 13 },
      { h: "Booking", w: 18 },
      { h: "Cont No.", w: 14 },
      { h: "Type of Truck", w: 12 },
      { h: "Volume", w: 10 },
      { h: "In", w: 10 },
      { h: "Out", w: 10 },
      { h: "Loading time", w: 12 },
      { h: "Cước xe / Huỷ Xe", w: 15, num: true },
      { h: "Lưu Ca / Giờ Chờ", w: 15, num: true },
      { h: "Gửi Vỏ", w: 13, num: true },
      { h: "Tenda", w: 12, num: true },
      { h: "Cao tốc", w: 12, num: true },
      ...(hasOther ? [{ h: "Khác", w: 12, num: true }] : []),
      { h: "Tổng trả", w: 15, num: true },
      { h: "NOTE", w: 34 },
      { h: "Hoá đơn Misa", w: 13 },
    ];

    const n = colDefs.length;
    const A = 2;
    const Z = n + 1;
    const W = n + 2;
    const totalColNum = A + colDefs.findIndex((c) => c.h === "Tổng trả");

    const G = "FF8A8896";
    const BL = "FF000000";
    const GR = "FF444444";
    const ln = (c) => ({ style: "thin", color: { argb: c } });
    const bd = { top: ln(G), left: ln(G), bottom: ln(G), right: ln(G) };
    const ft = (z, b, i, c) => ({
      name: "Times New Roman",
      size: z,
      bold: !!b,
      italic: !!i,
      ...(c ? { color: { argb: c } } : {}),
    });
    const rt = (...p) => ({ richText: p.map(([t, z, b, i, c]) => ({ text: t, font: ft(z || 11, b, i, c) })) });
    const fill = (a) => ({ type: "pattern", pattern: "solid", fgColor: { argb: a } });

    ws.columns = [1.5, ...colDefs.map((c) => c.w), 1.5].map((w) => ({ width: w, style: { font: ft(10) } }));

    const sp = (h) => {
      ws.addRow([]).height = h;
    };
    const mg = (v, al, h, a = A, z = Z, va = "middle") => {
      const r = ws.addRow([]);
      if (z > a) ws.mergeCells(r.number, a, r.number, z);
      const c = r.getCell(a);
      c.value = v;
      if (typeof v === "string") c.font = ft(10);
      c.alignment = { horizontal: al || "left", vertical: va, wrapText: true };
      if (h) r.height = h;
      return r;
    };

    const img = cfg.logo
      ? wb.addImage({ base64: cfg.logo.replace(/^data:image\/\w+;base64,/, ""), extension: "png" })
      : null;

    sp(6);
    const titleStart = A + 3;
    const titleEnd = Z - 3;
    mg(rt([sjState.title || "BẢNG TỔNG HỢP PHÁT SINH", 18, 1]), "center", 30, titleStart, titleEnd);
    mg(rt(["(SURCHARGE / EXTRA COST STATEMENT)", 12, 1, 1]), "center", 20, titleStart, titleEnd);
    mg(
      rt(
        ["Ngày "],
        ["(Date)", 10, 0, 1, GR],
        [` ${now.getDate()} tháng `],
        ["(month)", 10, 0, 1, GR],
        [` ${now.getMonth() + 1} năm `],
        ["(year)", 10, 0, 1, GR],
        [` ${now.getFullYear()}`]
      ),
      "center",
      20,
      titleStart,
      titleEnd
    );

    ws.mergeCells(2, titleEnd + 1, 4, Z);
    const periodCell = ws.getCell(2, titleEnd + 1);
    periodCell.value = rt(["Kỳ "], ["(Period)", 10, 0, 1, GR], [":\n"], [sjState.period || "—", 10, 0, 1]);
    periodCell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };

    if (img !== null) {
      const lr = cfg.lr > 0 ? cfg.lr : 2.5149;
      ws.addImage(img, { tl: { col: 1.2, row: 1.2 }, ext: { width: Math.round(64 * lr), height: 64 }, editAs: "oneCell" });
    }

    sp(6);
    const kv = (l, e, v, big) =>
      v && mg(rt([`${l} `], [`(${e})`, 10, 0, 1, GR], [": "], [v, big ? 13 : 10, big]), "left", big ? 22 : 16);
    kv("Đơn vị lập", "Issuer", cfg.name, 1);
    kv("Mã số thuế", "Tax code", cfg.tax);
    kv("Địa chỉ", "Address", cfg.addr);
    kv("Điện thoại", "Tel", cfg.tel);
    kv("Số tài khoản", "Bank account", cfg.bank);
    kv("Khách hàng / Tariff", "Customer", factoryInfo.desc, 1);
    sp(6);

    // Group Header Row + Column Header Row
    const ghRow = ws.addRow([]);
    ghRow.height = 22;
    const chRow = ws.addRow([]);
    chRow.height = 28;
    ws.pageSetup.printTitlesRow = `${ghRow.number}:${chRow.number}`;

    const feeGroupCount = hasOther ? 8 : 7;
    const groups = [
      { title: "Thông tin lô hàng", start: A, span: 7, bg: "FFE2E8F0" },
      { title: "Thời gian xe", start: A + 7, span: 3, bg: "FFE0F2FE" },
      { title: "Chi phí phát sinh", start: A + 10, span: feeGroupCount, bg: "FFFEF3C7" },
      { title: "Misa", start: A + 10 + feeGroupCount, span: 1, bg: "FFDCFCE7" },
    ];
    groups.forEach((g) => {
      if (g.span > 1) ws.mergeCells(ghRow.number, g.start, ghRow.number, g.start + g.span - 1);
      const c = ghRow.getCell(g.start);
      c.value = g.title;
      c.font = ft(10, 1);
      c.alignment = { horizontal: "center", vertical: "middle" };
      for (let x = g.start; x < g.start + g.span; x++) {
        ghRow.getCell(x).fill = fill(g.bg);
        ghRow.getCell(x).border = bd;
      }
    });

    colDefs.forEach((col, idx) => {
      const c = chRow.getCell(A + idx);
      c.value = col.h;
      c.font = ft(10, 1);
      c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      c.fill = fill("FFF1F5F9");
      c.border = bd;
    });

    // Data Rows with exact merge rules:
    // Merge: Date (0), Cont No. (4), Type of Truck (5), In (7), Out (8), Loading time (9),
    //        and all cost/NOTE/Misa cols (10 .. n-1).
    // Never merge: Booking Ref (1), Shipment (2), Booking (3), Volume (6).
    const mergeColIndices = [0, 4, 5, 7, 8, 9];
    for (let idx = 10; idx < n; idx++) mergeColIndices.push(idx);

    const dataStartRow = chRow.number + 1;

    sum.calcs.forEach(({ trip, calc }) => {
      const bks = trip.bookings && trip.bookings.length ? trip.bookings : [{ ref: "", shipment: "", booking: "", volume: "" }];
      const startRowNum = ws.rowCount + 1;

      bks.forEach((bk, idx) => {
        const r = ws.addRow([]);
        r.height = 21;
        const volText = bk.volume || (calc.veh.isFcl ? calc.veh.defaultVol : "");

        const setCell = (colIdx, val, align = "center", isNum = false, isBold = false) => {
          const cell = r.getCell(A + colIdx);
          cell.value = val;
          cell.font = ft(10, isBold);
          cell.alignment = { horizontal: align, vertical: "middle", wrapText: true };
          cell.border = bd;
          if (isNum && typeof val === "number" && val !== 0) cell.numFmt = xlsxFmt(val);
        };

        setCell(0, idx === 0 ? trip.date || "" : "", "center");
        setCell(1, bk.ref || "", "center");
        setCell(2, bk.shipment || "", "center");
        setCell(3, bk.booking || "", "center");
        setCell(4, idx === 0 ? trip.contNo || "" : "", "center");
        setCell(5, idx === 0 ? calc.veh.truckCell : "", "center", false, true);
        setCell(6, volText, "center");
        setCell(7, idx === 0 && trip.inTime ? fmtTimeStr(trip.inTime) : "", "center");
        setCell(8, idx === 0 && trip.outTime ? fmtTimeStr(trip.outTime) : "", "center");
        setCell(9, idx === 0 ? calc.timing.loadingTime || "" : "", "center");

        let cIdx = 10;
        setCell(cIdx++, idx === 0 && calc.truckFee ? calc.truckFee : "", "right", true);
        setCell(cIdx++, idx === 0 && calc.waitAndOvernight ? calc.waitAndOvernight : "", "right", true);
        setCell(cIdx++, idx === 0 && calc.shellFee ? calc.shellFee : "", "right", true);
        setCell(cIdx++, idx === 0 && calc.tendaFee ? calc.tendaFee : "", "right", true);
        setCell(cIdx++, idx === 0 && calc.tollFee ? calc.tollFee : "", "right", true);
        if (hasOther) setCell(cIdx++, idx === 0 && calc.otherFee ? calc.otherFee : "", "right", true);
        setCell(cIdx++, idx === 0 ? calc.totalFee : "", "right", true, true);
        setCell(cIdx++, idx === 0 ? trip.note || "" : "", "left");
        setCell(cIdx++, idx === 0 ? trip.misaInvoice || "" : "", "center");
      });

      const endRowNum = ws.rowCount;
      if (endRowNum > startRowNum) {
        mergeColIndices.forEach((colIdx) => {
          const excelCol = A + colIdx;
          ws.mergeCells(startRowNum, excelCol, endRowNum, excelCol);
        });
      }
    });

    const dataEndRow = ws.rowCount;
    const totalColLetter = ws.getColumn(totalColNum).letter;

    const addSummaryRow = (label, formulaOrVal, numFmtStr, bold = false) => {
      const r = ws.addRow([]);
      r.height = bold ? 23 : 20;
      ws.mergeCells(r.number, A, r.number, totalColNum - 1);
      const lc = r.getCell(A);
      lc.value = label;
      lc.font = ft(10, true);
      lc.alignment = { horizontal: "right", vertical: "middle" };

      const vc = r.getCell(totalColNum);
      vc.value = formulaOrVal;
      vc.font = ft(bold ? 11 : 10, true);
      vc.alignment = { horizontal: "right", vertical: "middle" };
      if (numFmtStr) vc.numFmt = numFmtStr;

      if (Z > totalColNum) {
        if (Z > totalColNum + 1) ws.mergeCells(r.number, totalColNum + 1, r.number, Z);
      }
      for (let x = A; x <= Z; x++) r.getCell(x).border = bd;
      return r;
    };

    const hasRows = dataEndRow >= dataStartRow;
    if (sjState.vatOn && sum.vatTax > 0) {
      const subRow = addSummaryRow(
        "TỔNG TRƯỚC THUẾ (VND)",
        hasRows ? { formula: `ROUND(SUM(${totalColLetter}${dataStartRow}:${totalColLetter}${dataEndRow}),3)`, result: sum.subtotal } : sum.subtotal,
        xlsxFmt(sum.subtotal),
        false
      );
      const rateRow = addSummaryRow("THUẾ SUẤT (VAT)", round3(sum.vatRate) / 100, "0.0%", false);
      const taxRow = addSummaryRow(
        "TIỀN THUẾ (VND)",
        {
          formula: `ROUND(${totalColLetter}${subRow.number}*${totalColLetter}${rateRow.number},3)`,
          result: sum.vatTax,
        },
        xlsxFmt(sum.vatTax),
        false
      );
      addSummaryRow(
        "TỔNG SAU THUẾ (VND)",
        {
          formula: `ROUND(${totalColLetter}${subRow.number}+${totalColLetter}${taxRow.number},3)`,
          result: sum.grandTotal,
        },
        xlsxFmt(sum.grandTotal),
        true
      );
    } else {
      addSummaryRow(
        "TỔNG CỘNG (VND)",
        hasRows ? { formula: `ROUND(SUM(${totalColLetter}${dataStartRow}:${totalColLetter}${dataEndRow}),3)`, result: sum.grandTotal } : sum.grandTotal,
        xlsxFmt(sum.grandTotal),
        true
      );
    }

    const wordsRow = mg(
      rt(["Số tiền viết bằng chữ "], ["(Total amount in words)", 10, 0, 1], [": "], [words(sum.grandTotal), 10, 1, 1]),
      "left",
      22
    );
    for (let x = A; x <= Z; x++) wordsRow.getCell(x).border = bd;

    if (cfg.note) {
      sp(5);
      mg(cfg.note, "left", 16 * cfg.note.split("\n").length, A, Z, "top");
    }

    sp(10);
    const half = Math.floor(n / 2);
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
    two(rt(["Người lập ", 10, 1], ["(Prepared by)", 10, 0, 1]), rt(["Khách hàng xác nhận ", 10, 1], ["(Customer confirmation)", 10, 0, 1]), 20);
    two("", "", 64);
    two(rt([cfg.signer || " ", 10, 1]), rt(["(Ký, đóng dấu / Signature, stamp)", 9, 0, 1, "FF555555"]), 18);

    sp(6);
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
    ws.pageSetup.printArea = `A1:${ws.getColumn(W).letter}${last}`;
    return wb.xlsx.writeBuffer();
  }

  /* ---------- UI Rendering & Interactive Form ---------- */
  function renderWorkspaceShell() {
    const root = $("#vSunjune");
    if (!root) return;

    root.innerHTML = `
      <div class="sj-shell">
        <!-- Top Settings & KPIs -->
        <div class="sj-top-card">
          <div class="sj-top-head">
            <div>
              <h1 class="sj-title">Bảng kê phát sinh vận tải</h1>
              <p class="sj-sub">Nhập Booking & loại xe (hàng lẻ combine hoặc FCL) — tự gộp ô, tính cước theo Tariff VND, giờ chờ, lưu ca và VAT 8%.</p>
            </div>
            <div class="sj-top-btns">
              <button type="button" class="btn btn-sm btn-ghost" id="sjToggleTariff">Xem bảng giá Tariff</button>
              <button type="button" class="btn btn-sm btn-ghost" id="sjLoadSample">Nạp ví dụ mẫu</button>
              <button type="button" class="btn btn-sm btn-ghost" id="sjClearAll">Xoá bảng kê</button>
            </div>
          </div>

          <div class="sj-meta-grid">
            <label class="sj-field">
              <span>Tiêu đề bảng kê</span>
              <input id="sjTitle" type="text" value="${esc(sjState.title)}">
            </label>
            <label class="sj-field">
              <span>Kỳ phát sinh</span>
              <input id="sjPeriod" type="text" placeholder="VD: 23.10 - 06.11.26" value="${esc(sjState.period)}">
            </label>
            <label class="sj-field">
              <span>Nhà máy mặc định (Tariff VND)</span>
              <select id="sjDefaultFactory">
                ${VN_TARIFF.map((t) => `<option value="${esc(t.key)}" ${t.key === sjState.defaultFactory ? "selected" : ""}>${esc(t.desc)} (${esc(t.local)})</option>`).join("")}
              </select>
            </label>
            <label class="sj-field sj-field-sm">
              <span>Hệ số nhiên liệu</span>
              <input id="sjFuelFactor" type="number" step="0.05" min="0.5" max="3" value="${esc(sjState.fuelFactor)}">
            </label>
            <div class="sj-vat-box">
              <label class="check-inline">
                <input id="sjVatOn" type="checkbox" ${sjState.vatOn ? "checked" : ""}>
                <span>VAT</span>
              </label>
              <input id="sjVatRate" type="number" min="0" max="100" step="0.5" value="${esc(sjState.vatRate)}">
              <span>%</span>
            </div>
          </div>

          <div id="sjTariffDrawer" class="sj-tariff-drawer" hidden></div>
          <div id="sjKpis" class="sj-kpis"></div>
        </div>

        <!-- Trip / Combine Editor Card -->
        <div class="sj-editor-card">
          <div class="sj-editor-head">
            <div class="sj-editor-title">
              <strong id="sjFormModeTitle">Thêm chuyến phát sinh mới</strong>
              <span id="sjModeBadge" class="sj-pill">Mới</span>
            </div>
            <div class="sj-editor-actions">
              <button type="button" class="btn btn-sm btn-ghost" id="sjResetForm">Làm mới form</button>
            </div>
          </div>

          <div class="sj-form-grid">
            <label class="sj-field">
              <span>Ngày (Date · Merge)</span>
              <input id="sjDate" type="text" placeholder="VD: 05.NOV hoặc 05/11/2026">
            </label>
            <label class="sj-field">
              <span>Loại xe / Cont (Merge)</span>
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
              <span>Cont No. (Merge)</span>
              <input id="sjContNo" type="text" placeholder="VD: HMMU6837801 (nếu FCL)">
            </label>
            <label class="sj-field">
              <span>Tariff Nhà máy</span>
              <select id="sjTripFactory">
                ${VN_TARIFF.map((t) => `<option value="${esc(t.key)}">${esc(t.desc)}</option>`).join("")}
              </select>
            </label>
            <label class="sj-field">
              <span>Giờ vào (In · Merge)</span>
              <input id="sjInTime" type="text" placeholder="08:19">
            </label>
            <label class="sj-field">
              <span>Giờ ra (Out · Merge)</span>
              <input id="sjOutTime" type="text" placeholder="16:40">
            </label>
            <label class="sj-field">
              <span>Hoá đơn Misa (Merge)</span>
              <input id="sjMisa" type="text" placeholder="VD: 3579">
            </label>
            <div class="sj-check-col">
              <label class="check-inline" title="Bật nếu xe ra sang ngày hôm sau">
                <input id="sjNextDay" type="checkbox">
                <span>Qua ngày sau</span>
              </label>
              <label class="check-inline" title="Tự trừ 1 tiếng nghỉ trưa 12:00–13:00 nếu thời gian đóng hàng vắt qua giờ trưa">
                <input id="sjDeductLunch" type="checkbox" checked>
                <span>Trừ trưa 12h–13h</span>
              </label>
            </div>
          </div>

          <!-- Bookings sub-table (NOT merged) -->
          <div class="sj-bk-section">
            <div class="sj-bk-head">
              <div>
                <strong>Danh sách Booking đi chung xe / Cont này</strong>
                <span class="sj-hint">Nếu có nhiều Booking (combine), chỉ giữ 1 chuyến — các cột ngày, xe, giờ và tiền sẽ tự động gộp ô (merge) và chỉ tính phí 1 lần.</span>
              </div>
              <div class="sj-bk-btns">
                <button type="button" class="btn btn-sm btn-ghost" id="sjTogglePaste">📋 Dán nhiều dòng từ Excel</button>
                <button type="button" class="btn btn-sm" id="sjAddBookingRow">+ Thêm Booking</button>
              </div>
            </div>

            <div id="sjPasteBox" class="sj-paste-box" hidden>
              <textarea id="sjPasteInput" rows="3" placeholder="Dán các dòng copy từ Excel vào đây (hỗ trợ: Booking Ref | Shipment | Booking | Volume, hoặc Booking | Volume)..."></textarea>
              <div class="sj-paste-actions">
                <button type="button" class="btn btn-sm btn-primary" id="sjApplyPaste">Tách & Thêm vào danh sách</button>
                <button type="button" class="btn btn-sm btn-ghost" id="sjCancelPaste">Đóng</button>
              </div>
            </div>

            <div class="sj-bk-table-wrap">
              <table class="sj-bk-table">
                <thead>
                  <tr>
                    <th style="width:38px">#</th>
                    <th>Booking Ref (SE · Không merge)</th>
                    <th>Shipment (Không merge)</th>
                    <th>Booking (Không merge)</th>
                    <th>Volume / Size</th>
                    <th style="width:42px"></th>
                  </tr>
                </thead>
                <tbody id="sjBkRows"></tbody>
              </table>
            </div>
          </div>

          <!-- Calculation & Surcharges -->
          <div class="sj-calc-section">
            <div class="sj-calc-banner">
              <span id="sjCalcExplain">Nhập giờ In/Out hoặc chọn phụ phí để hệ thống tự tính theo Tariff VND.</span>
              <button type="button" class="link-btn" id="sjRecalcAuto">Áp lại công thức tự động</button>
            </div>

            <div class="sj-charges-grid">
              <label class="sj-field">
                <span>Số Truck thêm (4h/truck)</span>
                <input id="sjExtraTrucks" type="number" min="0" step="1" value="0">
              </label>
              <label class="sj-field">
                <span>Huỷ xe (Cancel truck)</span>
                <input id="sjCancelCount" type="number" min="0" step="1" value="0">
              </label>
              <label class="sj-field">
                <span>Số giờ chờ</span>
                <input id="sjWaitHours" type="number" min="0" step="0.5" value="0">
              </label>
              <label class="sj-field">
                <span>Lưu ca / Overnight (đêm)</span>
                <input id="sjOvernightCount" type="number" min="0" step="1" value="0">
              </label>
              <label class="sj-field">
                <span>Gửi vỏ (ngày · 1.8tr/ngày)</span>
                <input id="sjShellDays" type="number" min="0" step="1" value="0">
              </label>
              <label class="sj-field">
                <span>Phí Cao tốc (VND)</span>
                <input id="sjTollFee" type="number" min="0" step="1000" value="0">
              </label>
              <label class="sj-field">
                <span>Khác / Nâng hạ Cont (VND)</span>
                <input id="sjOtherFee" type="number" min="0" step="1000" value="0">
              </label>
              <div class="sj-tenda-box">
                <label class="check-inline">
                  <input id="sjTendaOn" type="checkbox" checked>
                  <span><strong>Tenda</strong> (+1,000,000 đ)</span>
                </label>
              </div>
            </div>

            <div class="sj-note-row">
              <label class="sj-field sj-note-field">
                <span>NOTE hiển thị trên bảng kê</span>
                <input id="sjNote" type="text" placeholder="Tự động tạo theo chi tiết phát sinh...">
              </label>
              <div class="sj-draft-total">
                <small>Tổng chuyến này (chưa VAT)</small>
                <strong id="sjDraftTotal">0 đ</strong>
              </div>
              <div class="sj-submit-wrap">
                <button type="button" class="btn btn-primary" id="sjSaveTripBtn">+ Thêm vào bảng kê</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview & Export Card -->
        <div class="sj-preview-card">
          <div class="sj-preview-bar">
            <div class="sj-search-box">
              <input id="sjSearch" type="search" placeholder="Lọc theo Booking, SE, Shipment, Cont, Ngày..." value="${esc(searchQuery)}">
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
    const fuel = Number(sjState.fuelFactor) || 1.25;
    el.innerHTML = `
      <div class="sj-tariff-title">
        <strong>Đơn giá Tariff đang chọn: ${esc(t.desc)}</strong>
        <span>(VND gốc trên Tariff · Giá 1 Truck = VND × ${fuel} · Overnight = VND × ${fuel} × 0.8)</span>
      </div>
      <div class="sj-tariff-scroll">
        <table class="sj-tariff-mini">
          <thead>
            <tr>
              <th>Mục</th>
              ${TRUCK_COLS.map((c) => `<th>${esc(c)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>VND gốc</b></td>
              ${t.vnd.map((v) => `<td>${v ? fmt(v) : "—"}</td>`).join("")}
            </tr>
            <tr>
              <td><b>1 Truck (×${fuel})</b></td>
              ${t.vnd.map((v) => `<td>${v ? fmt(round3(v * fuel)) : "—"}</td>`).join("")}
            </tr>
            <tr>
              <td><b>Overnight (×0.8)</b></td>
              ${t.vnd.map((v) => `<td>${v ? fmt(round3(v * fuel * 0.8)) : "—"}</td>`).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderBookingRows() {
    const tbody = $("#sjBkRows");
    if (!tbody || !draftTrip) return;
    tbody.innerHTML = draftTrip.bookings
      .map(
        (bk, idx) => `
      <tr data-bk-idx="${idx}">
        <td class="c">${idx + 1}</td>
        <td><input type="text" class="sj-bk-inp" data-bk-field="ref" value="${esc(bk.ref)}" placeholder="VD: SE1809260288"></td>
        <td><input type="text" class="sj-bk-inp" data-bk-field="shipment" value="${esc(bk.shipment)}" placeholder="VD: S02315494"></td>
        <td><input type="text" class="sj-bk-inp" data-bk-field="booking" value="${esc(bk.booking)}" placeholder="VD: BY388653"></td>
        <td><input type="text" class="sj-bk-inp" data-bk-field="volume" value="${esc(bk.volume)}" placeholder="${
          getVehicle(draftTrip.truckCode).isFcl ? getVehicle(draftTrip.truckCode).defaultVol : "CBM (VD: 4.71)"
        }"></td>
        <td class="c"><button type="button" class="sj-bk-del" data-bk-del="${idx}" title="Xoá dòng">×</button></td>
      </tr>`
      )
      .join("");
  }

  function syncDraftInputsToForm() {
    if (!draftTrip) return;
    const setVal = (sel, v) => {
      const el = $(sel);
      if (el && document.activeElement !== el) el.value = v;
    };
    const setChk = (sel, v) => {
      const el = $(sel);
      if (el) el.checked = !!v;
    };
    setVal("#sjDate", draftTrip.date || "");
    setVal("#sjTruckCode", draftTrip.truckCode || "8T");
    setVal("#sjContNo", draftTrip.contNo || "");
    setVal("#sjTripFactory", draftTrip.factoryKey || sjState.defaultFactory);
    setVal("#sjInTime", draftTrip.inTime || "");
    setVal("#sjOutTime", draftTrip.outTime || "");
    setVal("#sjMisa", draftTrip.misaInvoice || "");
    setChk("#sjNextDay", draftTrip.nextDay);
    setChk("#sjDeductLunch", draftTrip.deductLunch);
    setVal("#sjExtraTrucks", draftTrip.extraTrucks ?? 0);
    setVal("#sjCancelCount", draftTrip.cancelCount ?? 0);
    setVal("#sjWaitHours", draftTrip.waitHours ?? 0);
    setVal("#sjOvernightCount", draftTrip.overnightCount ?? 0);
    setVal("#sjShellDays", draftTrip.shellDays ?? 0);
    setVal("#sjTollFee", draftTrip.tollFee ?? 0);
    setVal("#sjOtherFee", draftTrip.otherFee ?? 0);
    setChk("#sjTendaOn", draftTrip.tendaOn);
    setVal("#sjNote", draftTrip.note || "");

    const modeTitle = $("#sjFormModeTitle");
    const modeBadge = $("#sjModeBadge");
    const saveBtn = $("#sjSaveTripBtn");
    if (editingTripId) {
      if (modeTitle) modeTitle.textContent = "Đang sửa chuyến phát sinh";
      if (modeBadge) {
        modeBadge.textContent = "Đang sửa";
        modeBadge.className = "sj-pill edit";
      }
      if (saveBtn) saveBtn.textContent = "Lưu thay đổi";
    } else {
      if (modeTitle) modeTitle.textContent = "Thêm chuyến phát sinh mới";
      if (modeBadge) {
        modeBadge.textContent = "Mới";
        modeBadge.className = "sj-pill";
      }
      if (saveBtn) saveBtn.textContent = "+ Thêm vào bảng kê";
    }

    renderBookingRows();
    updateDraftCalcPreview();
  }

  function applyAutoCalcToDraft(forceAll = false) {
    if (!draftTrip) return;
    const timing = computeAutoTiming(draftTrip);
    if (timing.hasTime) {
      if (forceAll || !manualLocked.extraTrucks) draftTrip.extraTrucks = timing.extraTrucks;
      if (forceAll || !manualLocked.waitHours) draftTrip.waitHours = timing.waitHours;
      if (forceAll || !manualLocked.overnightCount) draftTrip.overnightCount = timing.overnightCount;
    } else if (forceAll) {
      draftTrip.extraTrucks = 0;
      draftTrip.waitHours = 0;
      draftTrip.overnightCount = 0;
    }
    if (forceAll || !manualLocked.note) {
      const c = calcTripMoney(draftTrip);
      draftTrip.note = buildAutoNote(draftTrip, c);
    }
    syncDraftInputsToForm();
  }

  function updateDraftCalcPreview() {
    if (!draftTrip) return;
    const calc = calcTripMoney(draftTrip);
    const explainEl = $("#sjCalcExplain");
    const totalEl = $("#sjDraftTotal");

    if (explainEl) {
      const parts = [
        `Tariff <b>${esc(calc.tariff.local)}</b> · ${esc(calc.veh.truckCell)}${calc.veh.isFcl ? ` (${esc(calc.veh.defaultVol)})` : ""}`,
        `1 Truck = <b>${fmt(calc.truckUnit)} đ</b>`,
        `Giờ chờ = <b>${fmt(calc.veh.waitRate)} đ/h</b>`,
      ];
      if (calc.timing.hasTime) {
        parts.push(
          `Đóng hàng: <b>${fmtHmShort(calc.timing.rawMins)}</b>${
            calc.timing.lunchMins ? ` (trừ trưa -${calc.timing.lunchMins}')` : ""
          } · Free ${calc.timing.freeMins / 60}h → Gợi ý: <b>${calc.timing.extraTrucks} Truck + ${calc.timing.waitHours}h chờ${
            calc.timing.overnightCount ? ` + ${calc.timing.overnightCount} Overnight` : ""
          }</b>`
        );
      }
      explainEl.innerHTML = parts.join(" · ");
    }
    if (totalEl) {
      totalEl.textContent = `${fmt(calc.totalFee)} đ`;
    }
  }

  function filteredTrips() {
    if (!searchQuery.trim()) return sjState.trips;
    const q = norm(searchQuery);
    return sjState.trips.filter((t) => {
      const haystack = [
        t.date,
        t.contNo,
        t.truckCode,
        t.misaInvoice,
        t.note,
        ...(t.bookings || []).flatMap((b) => [b.ref, b.shipment, b.booking, b.volume]),
      ]
        .map(norm)
        .join(" ");
      return haystack.includes(q);
    });
  }

  function renderSunjune() {
    if (!$("#vSunjune")) return;
    const allSum = calcSummary(sjState.trips);
    const kpiEl = $("#sjKpis");
    if (kpiEl) {
      kpiEl.innerHTML = [
        ["Số chuyến / Cont", sjState.trips.length, ""],
        ["Tổng số Booking", allSum.totalBookings, "kpi-ok"],
        ["Tổng trước thuế", `${fmt(allSum.subtotal)} đ`, ""],
        ["Tổng sau thuế (VAT)", `${fmt(allSum.grandTotal)} đ`, "kpi-ok"],
      ]
        .map(([l, v, c]) => `<div class="kpi ${c}"><small>${l}</small><strong>${v}</strong></div>`)
        .join("");
    }
    renderTariffDrawer();
    const list = filteredTrips();
    const prevEl = $("#sjPreview");
    if (prevEl) prevEl.innerHTML = buildStatementHtml(list, false);
  }

  function saveDraftTripToList() {
    if (!draftTrip) return;
    const validBookings = (draftTrip.bookings || []).filter(
      (b) => b.ref.trim() || b.shipment.trim() || b.booking.trim() || b.volume.trim()
    );
    if (!validBookings.length) {
      toast("Vui lòng nhập ít nhất 1 Booking hoặc Số Shipment / Booking Ref.");
      return;
    }

    const tripCopy = JSON.parse(JSON.stringify(draftTrip));
    tripCopy.bookings = validBookings;
    if (tripCopy.inTime) tripCopy.inTime = fmtTimeStr(tripCopy.inTime);
    if (tripCopy.outTime) tripCopy.outTime = fmtTimeStr(tripCopy.outTime);

    if (editingTripId) {
      const idx = sjState.trips.findIndex((t) => t.id === editingTripId);
      if (idx >= 0) sjState.trips[idx] = tripCopy;
      else sjState.trips.push(tripCopy);
      toast("Đã cập nhật chuyến phát sinh.");
    } else {
      sjState.trips.push(tripCopy);
      toast(`Đã thêm chuyến (${validBookings.length} booking) vào bảng kê.`);
    }

    editingTripId = null;
    manualLocked = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
    const keepDate = draftTrip.date;
    const keepFactory = draftTrip.factoryKey;
    draftTrip = createEmptyDraft();
    draftTrip.date = keepDate || draftTrip.date;
    draftTrip.factoryKey = keepFactory || sjState.defaultFactory;
    saveState();
    syncDraftInputsToForm();
    renderSunjune();
  }

  function loadSampleTrips() {
    if (sjState.trips.length && !window.confirm("Bảng kê đang có dữ liệu. Bạn muốn thêm các chuyến ví dụ mẫu vào cuối bảng kê?")) {
      return;
    }
    const samples = [
      {
        id: "sj_demo_1",
        date: "02.NOV",
        contNo: "",
        truckCode: "8T",
        factoryKey: "sunjune",
        inTime: "08:00:00",
        outTime: "11:05:00",
        nextDay: false,
        deductLunch: true,
        extraTrucks: 0,
        cancelCount: 0,
        waitHours: 1,
        overnightCount: 0,
        shellDays: 0,
        tendaOn: true,
        tollFee: 0,
        otherFee: 0,
        misaInvoice: "3610",
        note: "PICKUP TENDA + (xe vào 08:00, ra 11:05, tổng 3h05') / Charge 1 Giờ chờ",
        bookings: [
          { ref: "SE1410260549", shipment: "S02319432", booking: "WAL076N05527HN0", volume: "5.57" },
          { ref: "SE1410260550", shipment: "S02319432", booking: "WAL076N05528HN0", volume: "4.41" },
          { ref: "SE1410260551", shipment: "S02319432", booking: "WAL076N05529HN0", volume: "3.66" },
        ],
      },
      {
        id: "sj_demo_2",
        date: "05.NOV",
        contNo: "HMMU6837801",
        truckCode: "FCL-40DC",
        factoryKey: "sunjune",
        inTime: "08:19:00",
        outTime: "16:40:00",
        nextDay: false,
        deductLunch: true,
        extraTrucks: 0,
        cancelCount: 0,
        waitHours: 3,
        overnightCount: 0,
        shellDays: 0,
        tendaOn: true,
        tollFee: 0,
        otherFee: 0,
        misaInvoice: "3611",
        note: "PICKUP TENDA + (xe vào 08:19, ra 16:40, tổng 8h21') / Charge 3 Giờ chờ",
        bookings: [{ ref: "SE3110260140", shipment: "S02326736", booking: "HANM83299800", volume: "40DC" }],
      },
      {
        id: "sj_demo_3",
        date: "02.OCT",
        contNo: "TLLU1114663",
        truckCode: "FCL-40HCNOR",
        factoryKey: "sunjune",
        inTime: "",
        outTime: "",
        nextDay: false,
        deductLunch: true,
        extraTrucks: 1,
        cancelCount: 0,
        waitHours: 0,
        overnightCount: 2,
        shellDays: 0,
        tendaOn: true,
        tollFee: 0,
        otherFee: 0,
        misaInvoice: "3658",
        note: "PICKUP TENDA + Charge 1 Truck + 2 Overnight",
        bookings: [{ ref: "SE0309260099", shipment: "S02304563", booking: "HANGG4684500", volume: "40HCNOR" }],
      },
    ];
    sjState.trips.push(...samples);
    if (!sjState.period) sjState.period = "02.10 - 05.11.26";
    if ($("#sjPeriod")) $("#sjPeriod").value = sjState.period;
    saveState();
    renderSunjune();
    toast("Đã nạp 3 chuyến ví dụ mẫu (gồm cả hàng lẻ combine & FCL).");
  }

  function bindEvents() {
    on("#sjTitle", "input", (e) => {
      sjState.title = e.target.value;
      saveState();
      renderSunjune();
    });
    on("#sjPeriod", "input", (e) => {
      sjState.period = e.target.value;
      saveState();
      const pr = $("#sjPreview .sh-r i");
      if (pr) pr.textContent = sjState.period || "—";
    });
    on("#sjDefaultFactory", "change", (e) => {
      sjState.defaultFactory = e.target.value;
      if (!editingTripId && draftTrip) {
        draftTrip.factoryKey = sjState.defaultFactory;
        syncDraftInputsToForm();
      }
      saveState();
      renderSunjune();
    });
    on("#sjFuelFactor", "input", (e) => {
      const val = parseFloat(e.target.value);
      sjState.fuelFactor = !isNaN(val) && val > 0 ? val : 1.25;
      saveState();
      updateDraftCalcPreview();
      renderSunjune();
    });
    on("#sjVatOn", "change", (e) => {
      sjState.vatOn = e.target.checked;
      saveState();
      renderSunjune();
    });
    on("#sjVatRate", "input", (e) => {
      const val = parseFloat(e.target.value);
      sjState.vatRate = isNaN(val) ? 0 : Math.max(0, Math.min(100, val));
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
      if (!window.confirm("Bạn chắc chắn muốn xoá toàn bộ danh sách chuyến trong Bảng kê Sunjune?")) return;
      sjState.trips = [];
      saveState();
      renderSunjune();
      toast("Đã xoá toàn bộ bảng kê Sunjune.");
    });

    // Draft Trip Inputs
    on("#sjDate", "input", (e) => {
      draftTrip.date = e.target.value;
    });
    on("#sjTruckCode", "change", (e) => {
      draftTrip.truckCode = e.target.value;
      applyAutoCalcToDraft(false);
    });
    on("#sjContNo", "input", (e) => {
      draftTrip.contNo = e.target.value;
    });
    on("#sjTripFactory", "change", (e) => {
      draftTrip.factoryKey = e.target.value;
      applyAutoCalcToDraft(false);
    });
    on("#sjInTime", "input", (e) => {
      draftTrip.inTime = e.target.value;
      applyAutoCalcToDraft(false);
    });
    on("#sjOutTime", "input", (e) => {
      draftTrip.outTime = e.target.value;
      applyAutoCalcToDraft(false);
    });
    on("#sjMisa", "input", (e) => {
      draftTrip.misaInvoice = e.target.value;
    });
    on("#sjNextDay", "change", (e) => {
      draftTrip.nextDay = e.target.checked;
      applyAutoCalcToDraft(false);
    });
    on("#sjDeductLunch", "change", (e) => {
      draftTrip.deductLunch = e.target.checked;
      applyAutoCalcToDraft(false);
    });

    const bindManualNum = (sel, field, lockKey) => {
      on(sel, "input", (e) => {
        const val = parseFloat(e.target.value);
        draftTrip[field] = isNaN(val) ? 0 : Math.max(0, val);
        if (lockKey) manualLocked[lockKey] = true;
        if (!manualLocked.note) {
          draftTrip.note = buildAutoNote(draftTrip, calcTripMoney(draftTrip));
          if ($("#sjNote")) $("#sjNote").value = draftTrip.note;
        }
        updateDraftCalcPreview();
      });
    };
    bindManualNum("#sjExtraTrucks", "extraTrucks", "extraTrucks");
    bindManualNum("#sjCancelCount", "cancelCount", null);
    bindManualNum("#sjWaitHours", "waitHours", "waitHours");
    bindManualNum("#sjOvernightCount", "overnightCount", "overnightCount");
    bindManualNum("#sjShellDays", "shellDays", null);
    bindManualNum("#sjTollFee", "tollFee", null);
    bindManualNum("#sjOtherFee", "otherFee", null);

    on("#sjTendaOn", "change", (e) => {
      draftTrip.tendaOn = e.target.checked;
      if (!manualLocked.note) {
        draftTrip.note = buildAutoNote(draftTrip, calcTripMoney(draftTrip));
        if ($("#sjNote")) $("#sjNote").value = draftTrip.note;
      }
      updateDraftCalcPreview();
    });
    on("#sjNote", "input", (e) => {
      draftTrip.note = e.target.value;
      manualLocked.note = true;
    });

    bindClick("#sjRecalcAuto", () => {
      manualLocked = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
      applyAutoCalcToDraft(true);
      toast("Đã tính lại theo công thức chuẩn.");
    });

    bindClick("#sjAddBookingRow", () => {
      draftTrip.bookings.push({ ref: "", shipment: "", booking: "", volume: "" });
      renderBookingRows();
      const rows = $("#sjBkRows")?.querySelectorAll("tr");
      const last = rows?.[rows.length - 1]?.querySelector('input[data-bk-field="booking"]');
      last?.focus();
    });

    bindClick("#sjTogglePaste", () => {
      const box = $("#sjPasteBox");
      if (box) box.hidden = !box.hidden;
    });
    bindClick("#sjCancelPaste", () => {
      if ($("#sjPasteBox")) $("#sjPasteBox").hidden = true;
    });
    bindClick("#sjApplyPaste", () => {
      const parsed = parsePastedBookings($("#sjPasteInput")?.value || "");
      if (!parsed.length) return toast("Chưa có dữ liệu dán vào.");
      const hasOnlyBlank =
        draftTrip.bookings.length === 1 &&
        !draftTrip.bookings[0].ref &&
        !draftTrip.bookings[0].shipment &&
        !draftTrip.bookings[0].booking &&
        !draftTrip.bookings[0].volume;
      if (hasOnlyBlank) draftTrip.bookings = parsed;
      else draftTrip.bookings.push(...parsed);
      if ($("#sjPasteInput")) $("#sjPasteInput").value = "";
      if ($("#sjPasteBox")) $("#sjPasteBox").hidden = true;
      renderBookingRows();
      toast(`Đã tách và thêm ${parsed.length} booking vào cụm combine.`);
    });

    on("#sjBkRows", "input", (e) => {
      const inp = e.target.closest("[data-bk-field]");
      const tr = e.target.closest("tr[data-bk-idx]");
      if (!inp || !tr) return;
      const idx = +tr.dataset.bkIdx;
      if (draftTrip.bookings[idx]) {
        draftTrip.bookings[idx][inp.dataset.bkField] = inp.value;
      }
    });

    on("#sjBkRows", "click", (e) => {
      const btn = e.target.closest("[data-bk-del]");
      if (!btn) return;
      const idx = +btn.dataset.bkDel;
      if (draftTrip.bookings.length <= 1) {
        draftTrip.bookings[0] = { ref: "", shipment: "", booking: "", volume: "" };
      } else {
        draftTrip.bookings.splice(idx, 1);
      }
      renderBookingRows();
    });

    bindClick("#sjResetForm", () => {
      editingTripId = null;
      manualLocked = { extraTrucks: false, waitHours: false, overnightCount: false, note: false };
      draftTrip = createEmptyDraft();
      syncDraftInputsToForm();
    });
    bindClick("#sjSaveTripBtn", saveDraftTripToList);

    on("#sjSearch", "input", (e) => {
      searchQuery = e.target.value;
      renderSunjune();
    });

    on("#sjPreview", "click", (e) => {
      const editBtn = e.target.closest("[data-sj-edit]");
      if (editBtn) {
        const found = sjState.trips.find((t) => t.id === editBtn.dataset.sjEdit);
        if (!found) return;
        editingTripId = found.id;
        draftTrip = JSON.parse(JSON.stringify(found));
        manualLocked = { extraTrucks: true, waitHours: true, overnightCount: true, note: true };
        syncDraftInputsToForm();
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
          draftTrip = createEmptyDraft();
          syncDraftInputsToForm();
        }
        saveState();
        renderSunjune();
        toast("Đã xoá chuyến khỏi bảng kê.");
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
        const sfxName = sjState.period ? "-" + slug(sjState.period) : "";
        downloadBuffer(`bang-ke-sunjune${sfxName}.xlsx`, buf);
        toast(`Đã xuất bang-ke-sunjune${sfxName}.xlsx`);
      } catch (err) {
        toast(`Không xuất được Excel: ${err.message}`, 5000);
      }
    });
  }

  function initSunjune() {
    loadState();
    draftTrip = createEmptyDraft();
    renderWorkspaceShell();
    bindEvents();
    syncDraftInputsToForm();
    renderSunjune();
  }

  LG_TABS.sunjune = {
    inited: false,
    init: initSunjune,
    onShow: renderSunjune,
    onConfigChange: renderSunjune,
    // Expose pure helpers for automated testing if needed
    _test: { computeAutoTiming, calcTripMoney, parsePastedBookings, VN_TARIFF },
  };
})();
