import type { Student, StudentGroup, StudentCategorySummary, StudentJoinRequest } from "@/types";
import { mockClasses } from "./classes";

const firstNames = [
  "Abdullah", "Mohammed", "Ahmed", "Khalid", "Faisal", "Saad", "Omar", "Yousef",
  "Nasser", "Turki", "Fahad", "Sultan", "Majed", "Bandar", "Talal", "Rayan",
  "Ziad", "Hamza", "Sara", "Noura", "Lama", "Reem", "Haya", "Jawaher",
  "Dana", "Munira", "Lina", "Alya", "Aisha", "Maha", "Shaikha", "Amal",
  "Hind", "Ghada", "Rawan", "Lujain",
];

const familyNames = [
  "Al-Qahtani", "Al-Harbi", "Al-Otaibi", "Al-Zahrani", "Al-Ghamdi", "Al-Shehri",
  "Al-Dosari", "Al-Mutairi", "Al-Shammari", "Al-Rashidi", "Al-Enezi", "Al-Subaie",
];

const groups: StudentGroup[] = ["Advanced", "Intermediate", "Needs Support"];
const avatarColors = ["#4C44E4", "#8155E7", "#F56A47", "#1C9D6D", "#E0A519"];

function daysAgoISO(days: number): string {
  const d = new Date("2026-10-07T09:00:00Z");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function buildStudents(): Student[] {
  const students: Student[] = [];
  let globalIndex = 0;

  for (const cls of mockClasses) {
    for (let i = 0; i < cls.studentCount; i++) {
      const first = firstNames[globalIndex % firstNames.length];
      const last = familyNames[(globalIndex * 3 + 1) % familyNames.length];
      const group = groups[globalIndex % groups.length];

      // Spread scores and activity recency deterministically across the roster
      const baseScore = 55 + ((globalIndex * 7) % 40); // 55-94
      const improvement = -12 + ((globalIndex * 5) % 30); // -12..+17
      const inactivityBucket = globalIndex % 10;
      const lastActivityDays = inactivityBucket === 0 ? 12 + globalIndex % 6 : globalIndex % 4;
      const status = lastActivityDays > 7 ? "inactive" : "active";

      const trend = Array.from({ length: 5 }, (_, t) =>
        Math.max(35, Math.min(99, baseScore - improvement + t * (improvement / 5)))
      ).map((n) => Math.round(n));

      students.push({
        id: `stu-${globalIndex + 1}`,
        name: `${first} ${last}`,
        avatarColor: avatarColors[globalIndex % avatarColors.length],
        classId: cls.id,
        examType: cls.examType,
        group,
        averageScore: baseScore,
        improvementPct: improvement,
        lastActivity: daysAgoISO(lastActivityDays),
        status,
        accessStatus: "active",
        email: `${first.toLowerCase().replace("-", "")}.${last.toLowerCase().replace("al-", "")}${globalIndex}@sabbaqmail.com`,
        phone: `+966 5${(globalIndex % 9) + 1} ${String(100 + globalIndex).padStart(3, "0")} ${String(1000 + globalIndex * 7).slice(-4)}`,
        assessmentsCompleted: 4 + (globalIndex % 9),
        trend,
      });

      globalIndex++;
    }
  }

  return students;
}

export const mockStudents: Student[] = buildStudents();

export const mockStudentJoinRequests: StudentJoinRequest[] = [
  {
    id: "join-1",
    name: "Nawaf Al-Harbi",
    email: "nawaf.alharbi@sabbaqmail.com",
    phone: "+966 55 210 4821",
    classId: "cls-qdr-quant",
    examType: "qudurat",
    requestedAt: "2026-10-07T10:30:00Z",
    source: "code",
  },
  {
    id: "join-2",
    name: "Mariam Al-Qahtani",
    email: "mariam.alqahtani@sabbaqmail.com",
    phone: "+966 50 842 1935",
    classId: "cls-tah-math",
    examType: "tahsili",
    requestedAt: "2026-10-07T12:15:00Z",
    source: "link",
  },
  {
    id: "join-3",
    name: "Salman Al-Otaibi",
    email: "salman.alotaibi@sabbaqmail.com",
    phone: "+966 54 671 3208",
    classId: "cls-qdr-verbal",
    examType: "qudurat",
    requestedAt: "2026-10-07T14:05:00Z",
    source: "code",
  },
];

export function getStudentCategorySummaries(students: Student[] = mockStudents): StudentCategorySummary[] {
  const total = students.length || 1;
  const improving = students.filter((s) => s.improvementPct > 3).length;
  const struggling = students.filter((s) => s.improvementPct <= 3 && s.averageScore < 65).length;
  const inactive = students.filter((s) => s.status === "inactive").length;

  return [
    {
      category: "improving",
      label: "Improving",
      count: improving,
      percentage: Math.round((improving / total) * 100),
    },
    {
      category: "struggling",
      label: "Struggling",
      count: struggling,
      percentage: Math.round((struggling / total) * 100),
    },
    {
      category: "inactive",
      label: "Inactive",
      count: inactive,
      percentage: Math.round((inactive / total) * 100),
    },
  ];
}
