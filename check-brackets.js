const fs = require("fs");

const file = "src/pages/BilincAlaniPage.jsx";
const s = fs.readFileSync(file, "utf8");

let line = 1, col = 0;
let st = [];
let inS = null, esc = false, inSL = false, inML = false;

for (let i = 0; i < s.length; i++) {
  const c = s[i], n = s[i + 1];

  if (c === "\n") { line++; col = 0; } else col++;

  if (inSL) { if (c === "\n") inSL = false; continue; }
  if (inML) { if (c === "*" && n === "/") { inML = false; i++; col++; } continue; }

  if (inS) {
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (c === inS) inS = null;
    continue;
  }

  if (c === "/" && n === "/") { inSL = true; i++; col++; continue; }
  if (c === "/" && n === "*") { inML = true; i++; col++; continue; }

  if (c === '"' || c === "'" || c === "`") { inS = c; continue; }

  if (c === "(" || c === "{" || c === "[") { st.push({ c, line, col }); continue; }
  if (c === ")" || c === "}" || c === "]") { st.pop(); continue; }
}

console.log("OPEN_COUNT =", st.length);
console.log("LAST_OPEN  =", st[st.length - 1]);