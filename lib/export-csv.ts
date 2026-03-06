export function exportToCsv<T>(data: T[], filename: string, columns?: { key: keyof T | string; label: string }[]) {
  if (!data || !data.length) return;

  const headerKeys = columns ? columns.map((c) => c.key) : Object.keys(data[0] as object);
  const headerLabels = columns ? columns.map((c) => c.label) : headerKeys;

  const csvRows = [headerLabels.join(",")];

  for (const row of data) {
    const values = headerKeys.map((key) => {
      // Handle nested keys if necessary, or just simple keys
      let val = (row as any)[key];
      if (val === null || val === undefined) {
        val = "";
      }
      
      // Escape quotes and wrap in quotes if there are commas or newlines
      const stringVal = String(val);
      if (stringVal.includes(",") || stringVal.includes("\"") || stringVal.includes("\n")) {
        return `"${stringVal.replace(/"/g, "\"\"")}"`;
      }
      return stringVal;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
