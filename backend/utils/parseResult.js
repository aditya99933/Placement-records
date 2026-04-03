const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const subjectsPath = path.join(__dirname, "subjects.json");
const subjectsList = fs.existsSync(subjectsPath)
  ? JSON.parse(fs.readFileSync(subjectsPath, "utf-8"))
  : [];

const creditsMap = {};
subjectsList.forEach((s) => {
  creditsMap[s.subjectName] = s.credits;
});

const parseResult = (html) => {


  // 🔥 Always init cheerio (safe)
  const $ = cheerio.load(typeof html === "string" ? html : "");

  // =======================
  // 🔥 JSON RESPONSE HANDLE
  // =======================
  if (typeof html === "string" && html.includes("{")) {

    try {
      const start = html.indexOf("{");
      const end = html.lastIndexOf("}") + 1;

      const jsonString = html.slice(start, end);
      const data = JSON.parse(jsonString);

      // 🔥 PORTAL ERROR DETECT
      if (data.status === "ERROR") {
        return {
          studentInfo: {},
          subjects: [],
          message: data.message || "University Portal returned an error",
        };
      }

      // 🔥 अगर result null hai → graceful return
      if (!data.stresult) {
        return {
          studentInfo: {
            enrollmentNumber: data.stprofile?.nrollno,
            studentName: data.stprofile?.stname,
            institute: data.stprofile?.iname,
            program: data.stprofile?.prgname,
            batch: data.stprofile?.byoa,
            yearOfAdmission: data.stprofile?.yoa,
          },
          subjects: [],
          message: "Result not declared yet",
        };
      }

      return {
        studentInfo: {
          enrollmentNumber: data.stprofile?.nrollno,
          studentName: data.stprofile?.stname,
          institute: data.stprofile?.iname,
          program: data.stprofile?.prgname,
          batch: data.stprofile?.byoa,
          yearOfAdmission: data.stprofile?.yoa,
        },
        subjects: data.stresult.map((sub) => {
          // Sanitize marks (remove '*' and handle '-')
          const cleanMark = (val) => {
            if (val === "-" || val === "" || val == null) return null;
            const str = String(val).replace(/\*/g, "").trim();
            return isNaN(str) ? str : parseInt(str, 10);
          };

          return {
            semester: sub[0],
            paperCode: sub[1],
            subject: sub[2],
            credits: creditsMap[sub[2]] ?? null,
            internal: cleanMark(sub[3]),
            external: cleanMark(sub[4]),
            total: cleanMark(sub[5]),
            status: sub[6], // 08, 09 etc
          };
        }),
      };

    } catch (err) {
      // Fallback to HTML parsing handled below
    }
  }

  // =======================
  // 🔥 HTML FALLBACK PARSER
  // =======================

  const studentInfo = {};

  $("#dataContainer .student-info-card .info-item").each((_, el) => {
    const label = $(el).find(".info-label").text().trim();
    const value = $(el).find(".info-value").text().trim();

    if (!label || !value) return;

    if (label.includes("Enrollment")) {
      studentInfo.enrollmentNumber = value;
    } else if (label.includes("Student Name")) {
      studentInfo.studentName = value;
    } else if (label.includes("Institute")) {
      studentInfo.institute = value;
    } else if (label.includes("Program")) {
      studentInfo.program = value;
    } else if (label.includes("Batch")) {
      studentInfo.batch = value;
    } else if (label.includes("Year")) {
      studentInfo.yearOfAdmission = value;
    }
  });

  const subjects = [];

  const rows = $(".table-responsive table.modern-table tr");


  rows.each((index, row) => {
    if (index === 0) return; // header skip

    const cols = $(row).find("td");

    if (cols.length < 6) return;

    const semester = $(cols[0]).text().trim();
    const paperCode = $(cols[1]).text().trim();
    const subjectName = $(cols[2]).text().trim();

    const internal = parseInt($(cols[3]).text().trim(), 10);
    const external = parseInt($(cols[4]).text().trim(), 10);
    const total = parseInt($(cols[5]).text().trim(), 10);

    if (!subjectName) return;

    subjects.push({
      semester,
      paperCode,
      subject: subjectName,
      credits: creditsMap[subjectName] ?? null,
      internal: isNaN(internal) ? null : internal,
      external: isNaN(external) ? null : external,
      total: isNaN(total) ? null : total,
    });
  });

  // 🔥 graceful fallback instead of error
  if (subjects.length === 0) {
    return {
      studentInfo,
      subjects: [],
      message: "Result not found or not available",
    };
  }

  return {
    studentInfo,
    subjects,
  };
};

module.exports = { parseResult };