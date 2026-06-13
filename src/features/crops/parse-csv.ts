import { CreateCropSchema, CropTypeSchema, type CropType } from "./schemas";

export interface ParsedCsvRow {
  row: number;
  name: string;
  cropType: CropType;
  quantity: number;
  harvestDate?: string;
}

export interface CsvParseError {
  row: number;
  message: string;
}

export interface ParseCsvResult {
  rows: ParsedCsvRow[];
  errors: CsvParseError[];
}

const HEADER_ALIASES: Record<string, keyof ParsedCsvRow | "harvestDate"> = {
  name: "name",
  crop: "name",
  cropname: "name",
  croptype: "cropType",
  type: "cropType",
  quantity: "quantity",
  qty: "quantity",
  amount: "quantity",
  harvestdate: "harvestDate",
  harvest: "harvestDate",
  date: "harvestDate",
};

function normalizeHeader(cell: string): string {
  return cell.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function parseCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));
}

function isHeaderRow(cells: string[]): boolean {
  const normalized = cells.map(normalizeHeader);
  return normalized.some((cell) => cell in HEADER_ALIASES);
}

function mapRowFromCells(cells: string[], headerMap: Map<number, string>): Record<string, string> {
  const record: Record<string, string> = {};
  for (const [index, field] of headerMap) {
    record[field] = cells[index]?.trim() ?? "";
  }
  return record;
}

function validateRow(
  rowNumber: number,
  record: Record<string, string>,
): { row?: ParsedCsvRow; error?: CsvParseError } {
  const name = record["name"]?.trim();
  const cropTypeRaw = record["cropType"]?.trim().toLowerCase();
  const quantityRaw = record["quantity"]?.trim();
  const harvestDateRaw = record["harvestDate"]?.trim();

  if (!name) {
    return { error: { row: rowNumber, message: "Name is required" } };
  }

  const cropTypeResult = CropTypeSchema.safeParse(cropTypeRaw);
  if (!cropTypeResult.success) {
    return {
      error: {
        row: rowNumber,
        message: `Invalid crop type "${cropTypeRaw ?? ""}" — use grains, vegetables, fruits, legumes, or other`,
      },
    };
  }

  const quantity = Number(quantityRaw);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: { row: rowNumber, message: "Quantity must be a whole number ≥ 0" } };
  }

  const payload: Record<string, unknown> = {
    name,
    cropType: cropTypeResult.data,
    quantity,
  };
  if (harvestDateRaw) {
    payload["harvestDate"] = harvestDateRaw;
  }

  const result = CreateCropSchema.safeParse(payload);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid row";
    return { error: { row: rowNumber, message } };
  }

  const row: ParsedCsvRow = {
    row: rowNumber,
    name: result.data.name,
    cropType: result.data.cropType,
    quantity: result.data.quantity,
  };
  if (result.data.harvestDate) {
    row.harvestDate = result.data.harvestDate.toISOString().slice(0, 10);
  }
  return { row };
}

export function parseCropCsv(text: string): ParseCsvResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: [{ row: 0, message: "CSV file is empty" }] };
  }

  const firstCells = parseCsvLine(lines[0] ?? "");
  const hasHeader = isHeaderRow(firstCells);

  const headerMap = new Map<number, string>();
  if (hasHeader) {
    for (const [index, cell] of firstCells.entries()) {
      const field = HEADER_ALIASES[normalizeHeader(cell)];
      if (field) {
        headerMap.set(index, field);
      }
    }
    if (![...headerMap.values()].includes("name")) {
      return {
        rows: [],
        errors: [{ row: 1, message: "Header row must include a name column" }],
      };
    }
  } else {
    headerMap.set(0, "name");
    headerMap.set(1, "cropType");
    headerMap.set(2, "quantity");
    headerMap.set(3, "harvestDate");
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const rows: ParsedCsvRow[] = [];
  const errors: CsvParseError[] = [];

  for (const [index, line] of dataLines.entries()) {
    const rowNumber = hasHeader ? index + 2 : index + 1;
    const cells = parseCsvLine(line);
    const record = mapRowFromCells(cells, headerMap);
    const { row, error } = validateRow(rowNumber, record);
    if (error) {
      errors.push(error);
    } else if (row) {
      rows.push(row);
    }
  }

  if (rows.length === 0 && errors.length === 0) {
    errors.push({ row: 0, message: "No data rows found in CSV" });
  }

  return { rows, errors };
}

export const CROP_CSV_TEMPLATE = `name,cropType,quantity,harvestDate
Maize,grains,500,2026-06-15
Tomatoes,vegetables,120,
Soybeans,legumes,200,2026-07-01`;
