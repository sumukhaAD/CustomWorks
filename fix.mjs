import { writeFileSync, readFileSync } from "fs";
const f = "src/routes/product.$slug.lazy.tsx";
let c = readFileSync(f, "utf8");
c = c.replace(
  /              \r?\n                href=\{orderUrl\}/,
  "              <a\n                href={orderUrl}",
);
writeFileSync(f, c);
console.log("done");
