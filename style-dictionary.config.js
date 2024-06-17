const fs = require("fs"); // นำเข้าโมดูล fs สำหรับการทำงานกับไฟล์
const path = require("path"); // นำเข้าโมดูล path สำหรับจัดการเส้นทางของไฟล์

const StyleDictionary = require("style-dictionary"); // นำเข้าโมดูล Style Dictionary

// ฟังก์ชันสำหรับอัปเดตค่าอ้างอิงใน tokens
function updateReferences(obj, prefix) {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      updateReferences(obj[key], prefix); // เรียกใช้ฟังก์ชันนี้อีกครั้งหากค่าเป็น object
    } else if (
      typeof obj[key] === "string" &&
      obj[key].startsWith("{") &&
      obj[key].endsWith("}")
    ) {
      const referencePath = obj[key].slice(1, -1).split(".");
      if (referencePath[0] !== prefix.split("/")[0]) {
        obj[key] = `{${prefix}.${obj[key].slice(1, -1)}}`; // อัปเดตค่าอ้างอิงโดยเพิ่ม prefix
      }
    }
  }
}

// Load and preprocess the tokens
const tokensPath = path.join(__dirname, "tokens", "tokens.json");
const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

// Update references in the tokens
updateReferences(tokens, "Theme/Mode 1");

// Save the modified tokens to a temporary file
const tempTokensPath = path.join(__dirname, "temp-tokens.json");
fs.writeFileSync(tempTokensPath, JSON.stringify(tokens, null, 2), "utf8");

// Register custom transforms
StyleDictionary.registerTransform({
  name: "name/cti/kebab", // ชื่อการแปลง
  type: "name", // ประเภทการแปลง
  transformer: (prop, options) => {
    return prop.path
      .join("-")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""); // แปลงชื่อเป็น kebab-case
  },
});

StyleDictionary.registerTransform({
  name: "size/rem", // ชื่อการแปลง
  type: "value", // ประเภทการแปลง
  matcher: function (prop) {
    return prop.attributes.category === "size"; // ตรงกับขนาด
  },
  transformer: function (prop) {
    return `${parseFloat(prop.value)}rem`; // แปลงค่าเป็น rem
  },
});

// Register custom transform group for SCSS
StyleDictionary.registerTransformGroup({
  name: "custom-scss",
  transforms: ["attribute/cti", "name/cti/kebab", "size/rem", "color/css"],
});

// Custom format to resolve references
StyleDictionary.registerFormat({
  name: "scss/variables",
  formatter: function (dictionary, config) {
    return dictionary.allProperties
      .map((prop) => {
        return `$${prop.name}: ${prop.value};`;
      })
      .join("\n"); // สร้าง SCSS variables
  },
});

// Configure Style Dictionary
StyleDictionary.extend({
  source: [tempTokensPath],
  platforms: {
    scss: {
      transformGroup: "custom-scss",
      buildPath: "src/styles/",
      files: [
        {
          destination: "figma-tokens.scss",
          format: "scss/variables",
          options: {
            showFileHeader: false,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();

// Clean up the temporary file
fs.unlinkSync(tempTokensPath);

console.log("SCSS file has been created.");
