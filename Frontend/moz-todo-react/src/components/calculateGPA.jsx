export function calculateGrade(total) {
  if (total >= 90) return "O";
  if (total >= 75) return "A+";
  if (total >= 65) return "A";
  if (total >= 55) return "B+";
  if (total >= 50) return "B";
  if (total >= 45) return "C";
  if (total >= 40) return "P";
  return "F";
}

function getGradePoint(total) {
  if (total >= 90) return 10;
  if (total >= 75) return 9;
  if (total >= 65) return 8;
  if (total >= 55) return 7;
  if (total >= 50) return 6;
  if (total >= 45) return 5;
  if (total >= 40) return 4;
  return 0;
}

// For each semester, deduplicate subjects by paperCode
// If a subject has multiple attempts, pick the latest passing one, else latest fail
function deduplicateSubjects(semSubjects) {
  const map = {};

  semSubjects.forEach((s) => {
    const key = s.paperCode;
    if (!map[key]) {
      map[key] = s;
    } else {
      const existingPassed = map[key].total >= 40;
      const newPassed = s.total >= 40;
      if (!existingPassed && newPassed) {
        map[key] = s; // replace fail with pass
      } else if (existingPassed && newPassed) {
        map[key] = s; // keep latest passing attempt
      }
      // if new is fail and existing is pass, keep existing
    }
  });

  return Object.values(map);
}

export function calculateSemesterGpa(subjects) {
  const grouped = {};

  subjects.forEach((s) => {
    if (!grouped[s.semester]) grouped[s.semester] = [];
    grouped[s.semester].push(s);
  });

  return Object.keys(grouped).map((sem) => {
    const deduped = deduplicateSubjects(grouped[sem]);
    const validSubjects = deduped.filter((s) => s.credits != null);
    const totalCredits = validSubjects.reduce((sum, s) => sum + s.credits, 0);
    const totalWeighted = validSubjects.reduce((sum, s) => sum + getGradePoint(s.total) * s.credits, 0);
    const sgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;
    const totalMarks = deduped.reduce((sum, s) => sum + (s.total || 0), 0);
    const maxMarks = deduped.length * 100;
    const percentile = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : "N/A";

    return {
      semester: `Sem ${sem}`,
      gpa: sgpa,
      sgpa: sgpa.toFixed(2),
      credits: totalCredits,
      subjects: deduped.length,
      totalMarks,
      maxMarks,
      percentile,
    };
  });
}

export function calculateCGPA(subjects) {
  let totalWeightedPoints = 0;
  let totalCredits = 0;

  subjects.forEach((s) => {
    if (s.credits == null) return;
    totalWeightedPoints += s.credits * getGradePoint(s.total);
    totalCredits += s.credits;
  });

  return totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "N/A";
}

export function gradeDistribution(subjects) {
  const counts = {};

  subjects.forEach((s) => {
    const grade = calculateGrade(s.total);
    counts[grade] = (counts[grade] || 0) + 1;
  });

  return Object.keys(counts).map((g) => ({
    grade: g,
    value: counts[g],
  }));
}
