import ExcelJS from "exceljs";
import type { InvitationInput } from "./wedding-validation";
import { normalizeText, validateInvitationInput } from "./wedding-validation";

const TEMPLATE_HEADERS = [
  "Nama Undangan",
  "Custom Message",
] as const;

const HEADER_ALIASES: Record<string, keyof InvitationInput> = {
  "nama undangan": "guestName",
  nama: "guestName",
  guestname: "guestName",
  "guest name": "guestName",
  slug: "slug",
  "custom message": "customMessage",
  message: "customMessage",
  pesan: "customMessage",
  "pesan custom": "customMessage",
  catatan: "customMessage",
  notes: "customMessage",
};

export interface InvitationImportResult {
  rows: InvitationInput[];
  skipped: number;
  errors: string[];
}

function normalizeHeader(value: unknown) {
  return normalizeText(String(value || ""), 80).toLowerCase();
}

function getCellText(cell: ExcelJS.Cell) {
  const value = cell.value;

  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("result" in value) return String(value.result ?? "");
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text || "").join("");
    }
  }

  return "";
}

export async function createInvitationTemplateBuffer() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Solid Wedding";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Invitation Template", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.addRow(TEMPLATE_HEADERS);
  sheet.addRow([
    "Bapak/Ibu John Doe",
    "Assalamu'alaikum Wr. Wb.\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
  ]);
  sheet.addRow(["Sahabat Kampus", "Custom message boleh dikosongkan."]);

  sheet.columns = [
    { key: "guestName", width: 28 },
    { key: "customMessage", width: 72 },
  ];

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4A0E0E" },
  };
  header.alignment = { vertical: "middle" };

  sheet.eachRow((row) => {
    row.height = row.number === 1 ? 22 : 28;
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE4DDD6" } },
        left: { style: "thin", color: { argb: "FFE4DDD6" } },
        bottom: { style: "thin", color: { argb: "FFE4DDD6" } },
        right: { style: "thin", color: { argb: "FFE4DDD6" } },
      };
      cell.alignment = { vertical: "top", wrapText: true };
    });
  });

  return workbook.xlsx.writeBuffer();
}

export async function parseInvitationWorkbook(file: File) {
  const result: InvitationImportResult = {
    rows: [],
    skipped: 0,
    errors: [],
  };

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(
    buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
  );

  const sheet = workbook.worksheets[0];
  if (!sheet) {
    return {
      rows: [],
      skipped: 0,
      errors: ["Sheet pertama tidak ditemukan."],
    };
  }

  const headerMap = new Map<number, keyof InvitationInput>();
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const alias = HEADER_ALIASES[normalizeHeader(getCellText(cell))];
    if (alias) headerMap.set(colNumber, alias);
  });

  if (!Array.from(headerMap.values()).includes("guestName")) {
    return {
      rows: [],
      skipped: 0,
      errors: ["Kolom Nama Undangan wajib ada di baris pertama."],
    };
  }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const raw: Record<string, unknown> = {};
    headerMap.forEach((field, colNumber) => {
      raw[field] = getCellText(row.getCell(colNumber));
    });

    const hasAnyValue = Object.values(raw).some((value) =>
      Boolean(normalizeText(String(value || ""), 200)),
    );

    if (!hasAnyValue) {
      result.skipped += 1;
      return;
    }

    const validation = validateInvitationInput(raw);
    if (!validation.ok) {
      result.errors.push(`Baris ${rowNumber}: ${validation.error}`);
      return;
    }

    result.rows.push(validation.data);
  });

  return result;
}
