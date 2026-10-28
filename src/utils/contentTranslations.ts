import type {
  AIInsight,
  Alert,
  Assessment,
  AdminRequest,
  Assignment,
  Question,
  SabbaqClass,
  StudyMaterial,
  StudyRoom,
  Teacher,
} from "@/types";
import type { Language } from "./i18n";

type ClassContent = Pick<SabbaqClass, "name" | "description">;
type MaterialContent = Pick<StudyMaterial, "title" | "subject" | "topic">;
type QuestionContent = Pick<Question, "topic" | "prompt" | "explanation"> & {
  choices?: string[];
  reviewFeedback?: string;
};
type AssessmentContent = Pick<Assessment, "name">;
type AssignmentContent = Pick<Assignment, "title">;
type StudyRoomContent = Pick<StudyRoom, "name" | "description">;

const arabicInsights: Record<string, string> = {
  "ins-1": "تحسن أداء الصف العاشر (أ) بنسبة 12٪ في القسم الكمي من اختبار القدرات خلال آخر ثلاثة اختبارات.",
  "ins-2": "يواجه 18 طالباً صعوبة في مهارات التفكير الكمي في اختبار القدرات.",
  "ins-3": "حقق الطلاب الذين أكملوا أحدث مادة دراسية في رياضيات التحصيلي درجات أعلى بمتوسط 17٪.",
  "ins-4": "يتحسن أداء الطلاب في القسم اللفظي من اختبار القدرات بوتيرة أسرع من القسم الكمي.",
  "ins-5": "انخفضت درجات العلوم في اختبار التحصيلي قليلاً هذا الأسبوع؛ يُنصح بتكليف الطلاب بمراجعة الحسابات الكيميائية.",
  "ins-6": "تحسن الطلاب الذين يتدربون يومياً على أسئلة القسم الكمي في اختبار القدرات بوتيرة أسرع بنسبة 23٪.",
};

const arabicAlerts: Record<string, string> = {
  "alt-1": "انخفضت درجة أحد الطلاب بنسبة 18٪ في آخر اختبارين للقدرات.",
  "alt-2": "لم يُكمل 7 طلاب أحدث اختبار للتحصيلي.",
  "alt-3": "يواجه 12 طالباً صعوبة في مهارات التفكير الكمي.",
  "alt-4": "لم يشارك 9 طلاب في الأنشطة منذ أكثر من أسبوع.",
  "alt-5": "انخفض معدل إكمال اختبار العلوم في التحصيلي إلى 75٪.",
  "alt-6": "حصل 3 طلاب على أقل من 50٪ في أحدث تدريب للقسم اللفظي في اختبار القدرات.",
  "alt-7": "ارتفع التفاعل العام للصف العاشر (أ) بنسبة 9٪ هذا الأسبوع.",
  "alt-8": "لم يبدأ 5 طلاب واجب رياضيات التحصيلي المستحق غداً.",
  "alt-9": "تجاوز متوسط درجات فصل القسم الكمي في اختبار القدرات 75٪ للمرة الأولى هذا الفصل.",
  "alt-10": "طلب طالبان جلسات دعم إضافية هذا الأسبوع.",
};

const arabicStudyRooms: Record<
  string,
  StudyRoomContent & {
    messages: Record<string, string>;
    topics: Record<string, { title: string; description: string; messages: Record<string, string> }>;
    questionPosts: Record<string, { prompt: string; choices: string[] }>;
  }
> = {
  "room-1": {
    name: "مراجعة القسم الكمي في اختبار القدرات",
    description: "جلسة مراجعة أسبوعية للتفكير الكمي، تتضمن مسائل تدريبية وأسئلة سريعة قبل الاختبارات.",
    messages: {
      "msg-1": "مساء الخير جميعاً! لنراجع اليوم مسائل النسب قبل الاختبار التدريبي يوم الخميس.",
      "msg-2": "أستاذ، هل يمكنك شرح مسألة سرعة القطار التي ناقشناها سابقاً مرة أخرى؟",
      "msg-3": "بالتأكيد؛ السرعة تساوي المسافة مقسومة على الزمن. سنحل معاً مثالاً جديداً بعد قليل.",
      "msg-4": "شكراً! هل يمكننا أيضاً مراجعة قوانين مساحة الأشكال الهندسية؟",
    },
    topics: {
      "topic-1": {
        title: "التفكير الكمي",
        description: "مهارات التفكير الكمي الأساسية: النسب المئوية والتناسب والمتتابعات والمسائل اللفظية.",
        messages: {
          "tmsg-1": "لنبدأ بمسائل النسب المئوية. تذكّروا تحويل النسبة المئوية إلى عدد عشري قبل إجراء الحساب.",
          "tmsg-2": "فهمت، هذا يجعل مسائل الزيادة بنسبة 20٪ أسهل بكثير.",
        },
      },
      "topic-2": {
        title: "استراتيجيات الاختبار",
        description: "إدارة الوقت وترتيب حل الأسئلة في القسم الكمي من اختبار القدرات.",
        messages: {
          "tmsg-3": "نصيحة: تجاوزوا السؤال إذا استغرق أكثر من 90 ثانية، ثم عودوا إليه في النهاية.",
        },
      },
    },
    questionPosts: {
      "qp-1": {
        prompt: "إذا زاد عدد بنسبة 20٪ فأصبح 120، فما العدد الأصلي؟",
        choices: ["أ", "ب", "ج", "د"],
      },
    },
  },
  "room-2": {
    name: "مجموعة دراسة رياضيات التحصيلي",
    description: "غرفة دراسة تعاونية لرياضيات التحصيلي تشمل الجبر والدوال وحساب المثلثات والإحصاء.",
    messages: {
      "msg-5": "سنركز هذا الأسبوع على الدوال. يرجى مراجعة ترميز الدوال قبل جلستنا.",
      "msg-6": "تم. هل ما زال الاختبار التدريبي يوم الأحد؟",
      "msg-7": "نعم، يوم الأحد الساعة الخامسة مساءً. سأنشر تذكيراً في قسم المواد الدراسية أيضاً.",
    },
    topics: {
      "topic-3": {
        title: "الرياضيات",
        description: "مفاهيم الجبر والدوال والإحصاء الأساسية في قسم الرياضيات من اختبار التحصيلي.",
        messages: {
          "tmsg-4": "تذكّروا أن الدالة تربط كل مدخل بمخرج واحد فقط. لنتدرب على إيجاد قيمة الدالة عند أعداد مختلفة.",
        },
      },
      "topic-4": {
        title: "الفيزياء",
        description: "مفاهيم الميكانيكا والطاقة في قسم العلوم من اختبار التحصيلي.",
        messages: {},
      },
    },
    questionPosts: {
      "qp-2": {
        prompt: "إذا كان 3س − 7 = 2س + 5، فما قيمة س؟",
        choices: ["أ", "ب", "ج", "د"],
      },
    },
  },
};

const arabicAdminRequests: Record<string, Pick<AdminRequest, "subject" | "message">> = {
  "admin-req-1": {
    subject: "إضافة اختبارات تدريبية إضافية للتحصيلي في الكيمياء",
    message: "يرجى إضافة اختبارين تدريبيين شاملين للتحصيلي، مع التركيز على أقسام الكيمياء.",
  },
  "admin-req-2": {
    subject: "ملاحظات حول سهولة استخدام غرفة الدراسة",
    message: "تصميم غرفة الدراسة واضح وسهل الاستخدام للطلاب.",
  },
};

const arabicTeacher: Partial<Teacher> = {
  name: "حسام علاء",
  role: "معلم القدرات والتحصيلي",
  school: "مدرسة النور الدولية",
  certificates: ["بكالوريوس الرياضيات", "شهادة تدريس", "شهادة معلم القدرات"],
};

const arabicNameParts: Record<string, string> = {
  Abdullah: "عبدالله",
  Mohammed: "محمد",
  Ahmed: "أحمد",
  Khalid: "خالد",
  Faisal: "فيصل",
  Saad: "سعد",
  Omar: "عمر",
  Yousef: "يوسف",
  Nasser: "ناصر",
  Turki: "تركي",
  Fahad: "فهد",
  Sultan: "سلطان",
  Majed: "ماجد",
  Bandar: "بندر",
  Talal: "طلال",
  Rayan: "ريان",
  Ziad: "زياد",
  Hamza: "حمزة",
  Sara: "سارة",
  Noura: "نورة",
  Lama: "لمى",
  Reem: "ريم",
  Haya: "هيا",
  Jawaher: "جواهر",
  Dana: "دانة",
  Munira: "منيرة",
  Lina: "لينا",
  Alya: "علياء",
  Aisha: "عائشة",
  Maha: "مها",
  Shaikha: "شيخة",
  Amal: "أمل",
  Hind: "هند",
  Ghada: "غادة",
  Rawan: "روان",
  Lujain: "لجين",
  Nawaf: "نواف",
  Salman: "سلمان",
  Mariam: "مريم",
  Hossam: "حسام",
  "Al-Qahtani": "القحطاني",
  "Al-Harbi": "الحربي",
  "Al-Otaibi": "العتيبي",
  "Al-Zahrani": "الزهراني",
  "Al-Ghamdi": "الغامدي",
  "Al-Shehri": "الشهري",
  "Al-Dosari": "الدوسري",
  "Al-Mutairi": "المطيري",
  "Al-Shammari": "الشمري",
  "Al-Rashidi": "الرشيدي",
  "Al-Enezi": "العنزي",
  "Al-Subaie": "السبيعي",
  Alaa: "علاء",
};

const arabicClasses: Record<string, ClassContent> = {
  "cls-qdr-quant": {
    name: "القدرات - القسم الكمي",
    description: "الاستعداد للقسم الكمي في اختبار القدرات، مع تدريبات على الأعداد والجبر والهندسة.",
  },
  "cls-qdr-verbal": {
    name: "القدرات - القسم اللفظي",
    description: "تدريبات على الاستدلال اللفظي والتناظر اللفظي لاختبار القدرات.",
  },
  "cls-tah-math": {
    name: "التحصيلي - الرياضيات",
    description: "منهج الرياضيات الأساسي المتوافق مع اختبار التحصيل الدراسي.",
  },
  "cls-tah-science": {
    name: "التحصيلي - العلوم",
    description: "مراجعة الفيزياء والكيمياء والأحياء لاختبار التحصيل الدراسي.",
  },
};

const arabicMaterials: Record<string, MaterialContent> = {
  "mat-1": {
    title: "القدرات الكمي — ملخص النسب والتناسب",
    subject: "الكمي",
    topic: "النسب",
  },
  "mat-2": {
    title: "القدرات اللفظي — ورقة مراجعة التناظر اللفظي",
    subject: "اللفظي",
    topic: "التناظر اللفظي",
  },
  "mat-3": {
    title: "رياضيات التحصيلي — شرح متعمق للدوال",
    subject: "الرياضيات",
    topic: "الدوال",
  },
  "mat-4": {
    title: "علوم التحصيلي — حزمة تمارين الحسابات الكيميائية",
    subject: "العلوم",
    topic: "الكيمياء",
  },
  "mat-5": {
    title: "القدرات الكمي — مرجع قوانين الهندسة",
    subject: "الكمي",
    topic: "الهندسة",
  },
  "mat-6": {
    title: "علوم التحصيلي — ملاحظات مراجعة الميكانيكا",
    subject: "العلوم",
    topic: "الفيزياء",
  },
};

const arabicAssessments: Record<string, AssessmentContent> = {
  "as-1": { name: "اختبار تدريبي - القدرات الكمي" },
  "as-2": { name: "اختبار تدريبي - القدرات اللفظي" },
  "as-3": { name: "اختبار تدريبي - رياضيات التحصيلي" },
  "as-4": { name: "اختبار تدريبي - علوم التحصيلي" },
  "as-5": { name: "مراجعة القدرات الكمي" },
  "as-6": { name: "مراجعة رياضيات التحصيلي" },
  "as-7": { name: "مراجعة مهارات القدرات اللفظي" },
  "as-8": { name: "أساسيات علوم التحصيلي" },
};

const arabicAssignments: Record<string, AssignmentContent> = {
  "assignment-1": { title: "مراجعة الاستدلال الكمي" },
  "assignment-2": { title: "مراجعة أساسيات العلوم" },
};

const arabicQuestions: Record<string, QuestionContent> = {
  "q-1": {
    topic: "النسب المئوية",
    prompt: "إذا زاد عدد بنسبة 20% فأصبح 120، فما العدد الأصلي؟",
    explanation: "لنفرض أن العدد الأصلي هو س. إذن س + 0.2س = 120، أي 1.2س = 120، ومنه س = 100.",
    choices: ["80", "90", "100", "110"],
  },
  "q-2": {
    topic: "النسب",
    prompt: "نسبة الأولاد إلى البنات في فصل هي 3:5. إذا كان مجموع الطلاب 24 طالباً، فكم عدد البنات؟",
    explanation: "مجموع الأجزاء = 3 + 5 = 8. قيمة كل جزء = 24 ÷ 8 = 3. عدد البنات = 5 × 3 = 15.",
    choices: ["9", "12", "15", "18"],
  },
  "q-3": {
    topic: "الهندسة",
    prompt: "محيط مستطيل يساوي 36 سم. إذا كان طوله ضعف عرضه، فما مساحته بالسنتيمتر المربع؟",
    explanation: "2(الطول + العرض) = 36، إذن الطول + العرض = 18. وبما أن الطول = 2 × العرض، فإن 3 × العرض = 18، فيكون العرض 6 والطول 12. المساحة = 6 × 12 = 72.",
    choices: ["54", "72", "96", "108"],
    reviewFeedback: "يرجى إضافة رسم توضيحي لمساعدة المتعلمين بصرياً.",
  },
  "q-4": {
    topic: "المتتابعات",
    prompt: "ما العدد التالي في المتتابعة: 3، 7، 15، 31، ...؟",
    explanation: "كل حد يساوي ضعف الحد السابق مضافاً إليه 1: ‏3←7، ثم 7←15، ثم 15←31، ولذلك 31 × 2 + 1 = 63.",
    choices: ["47", "55", "63", "71"],
  },
  "q-5": {
    topic: "التناظر اللفظي",
    prompt: "طبيب : مستشفى كما مُعلّم : ؟",
    explanation: "العلاقة هي علاقة الشخص بمكان عمله؛ فالطبيب يعمل في المستشفى والمعلم يعمل في المدرسة.",
    choices: ["كتاب", "مدرسة", "سبورة", "طالب"],
  },
  "q-6": {
    topic: "إكمال الجمل",
    prompt: "رغم ___ الطقس، أصرّ الفريق على إكمال الرحلة.",
    explanation: "كلمة «رغم» تدل على التضاد، لذا الأنسب هو «سوء» الطقس الذي قد يمنع إكمال الرحلة.",
    choices: ["اعتدال", "سوء", "صفاء", "دفء"],
  },
  "q-7": {
    topic: "استيعاب المقروء",
    prompt: "بناءً على الفقرة المرفقة، العبارة التالية صحيحة: «اعتمد الكاتب في المقال على الاستدلال الاستقرائي فقط».",
    explanation: "استخدم الكاتب مزيجاً من الاستدلال الاستقرائي والاستنباطي، وليس الاستقرائي فقط.",
    choices: ["صحيح", "خطأ"],
    reviewFeedback: "الفقرة المشار إليها غير واضحة وتحتاج إلى مصدر أكثر وضوحاً.",
  },
  "q-8": {
    topic: "الجبر",
    prompt: "إذا كان 3س − 7 = 2س + 5، فما قيمة س؟",
    explanation: "3س − 2س = 5 + 7، ومنه س = 12.",
    choices: ["8", "10", "12", "14"],
  },
  "q-9": {
    topic: "الدوال",
    prompt: "إذا كانت د(س) = 2س² − 3س + 1، فما قيمة د(2)؟",
    explanation: "د(2) = 2(4) − 3(2) + 1 = 8 − 6 + 1 = 3.",
    choices: ["1", "3", "5", "7"],
  },
  "q-10": {
    topic: "حساب المثلثات",
    prompt: "ما قيمة جا(30°)؟",
    explanation: "جا(30°) = 1/2، وهي إحدى القيم المثلثية الأساسية.",
    choices: ["0", "1/2", "√2/2", "1"],
  },
  "q-11": {
    topic: "الفيزياء - الميكانيكا",
    prompt: "تسارعت سيارة بانتظام من السكون إلى سرعة 20 م/ث خلال 4 ثوانٍ. فما تسارعها؟",
    explanation: "التسارع = التغير في السرعة ÷ الزمن = 20 ÷ 4 = 5 م/ث².",
    choices: ["2 م/ث²", "4 م/ث²", "5 م/ث²", "8 م/ث²"],
  },
  "q-12": {
    topic: "الكيمياء - الحسابات الكيميائية",
    prompt: "كم مولاً من الأكسجين يلزم للاحتراق الكامل لمولين من الميثان (CH₄ + 2O₂ → CO₂ + 2H₂O)؟",
    explanation: "يحتاج كل مول من الميثان إلى مولين من O₂، ولذلك يحتاج مولان من CH₄ إلى 4 مولات من O₂.",
    choices: ["1", "2", "4", "6"],
    reviewFeedback: "يرجى ضبط عرض المعادلة؛ فالأرقام السفلية لا تظهر بصورة صحيحة.",
  },
  "q-13": {
    topic: "الأحياء - تركيب الخلية",
    prompt: "الميتوكوندريا مسؤولة عن تصنيع البروتين في الخلية.",
    explanation: "الميتوكوندريا تنتج الطاقة (ATP)، بينما الريبوسومات هي المسؤولة عن تصنيع البروتين.",
    choices: ["صحيح", "خطأ"],
  },
  "q-14": {
    topic: "المسائل اللفظية",
    prompt: "يقطع قطار مسافة 300 كم خلال 4 ساعات. إذا استمر بالسرعة نفسها، فكم يستغرق لقطع 450 كم؟",
    explanation: "السرعة = 300 ÷ 4 = 75 كم/ساعة. الزمن = 450 ÷ 75 = 6 ساعات.",
    choices: ["5 ساعات", "5.5 ساعات", "6 ساعات", "6.5 ساعات"],
  },
  "q-15": {
    topic: "الفيزياء - الطاقة",
    prompt: "ما الطاقة الحركية لجسم كتلته 2 كجم ويتحرك بسرعة 3 م/ث؟",
    explanation: "الطاقة الحركية = ½ × الكتلة × مربع السرعة = ½ × 2 × 9 = 9 جول.",
    choices: ["3 جول", "6 جول", "9 جول", "18 جول"],
  },
  "q-16": {
    topic: "المفردات",
    prompt: "المرادف الأقرب لكلمة «وفير» هو:",
    explanation: "«وفير» تعني كثيراً أو غزيراً.",
    choices: ["نادر", "كثير", "قليل", "ضعيف"],
  },
  "q-17": {
    topic: "الإحصاء",
    prompt: "ما المتوسط الحسابي لمجموعة البيانات: 4، 8، 6، 10، 2؟",
    explanation: "المتوسط = (4 + 8 + 6 + 10 + 2) ÷ 5 = 30 ÷ 5 = 6.",
    choices: ["5", "6", "7", "8"],
  },
};

export function localizeClassContent(value: SabbaqClass, lang: Language): SabbaqClass {
  const localized = lang === "ar" ? arabicClasses[value.id] : undefined;
  if (localized) return { ...value, ...localized };
  if (lang !== "ar") return value;

  const examName = value.examType === "qudurat" ? "القدرات" : "التحصيلي";
  const sectionName: Record<string, string> = {
    Quantitative: "القسم الكمي",
    Verbal: "القسم اللفظي",
    Mathematics: "الرياضيات",
    Science: "العلوم",
  };
  return {
    ...value,
    name: `${examName} - ${sectionName[value.section] ?? value.section}`,
  };
}

export function localizeMaterialContent(value: StudyMaterial, lang: Language): StudyMaterial {
  const localized = lang === "ar" ? arabicMaterials[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
}

export function localizeAssessmentContent(value: Assessment, lang: Language): Assessment {
  const localized = lang === "ar" ? arabicAssessments[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
}

export function localizeAssignmentContent(value: Assignment, lang: Language): Assignment {
  const localized = lang === "ar" ? arabicAssignments[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
}

export function localizeInsightContent(value: AIInsight, lang: Language): AIInsight {
  const message = lang === "ar" ? arabicInsights[value.id] : undefined;
  return message ? { ...value, message } : value;
}

export function localizeAlertContent(value: Alert, lang: Language): Alert {
  const message = lang === "ar" ? arabicAlerts[value.id] : undefined;
  return message ? { ...value, message } : value;
}

export function localizeAdminRequestContent(value: AdminRequest, lang: Language): AdminRequest {
  const localized = lang === "ar" ? arabicAdminRequests[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
}

export function localizeTeacherContent(value: Teacher, lang: Language): Teacher {
  if (lang !== "ar" || value.name !== "Hossam Alaa") return value;
  return { ...value, ...arabicTeacher };
}

export function localizePersonName(value: string, lang: Language): string {
  if (lang !== "ar") return value;
  return value
    .split(" ")
    .map((part) => arabicNameParts[part] ?? part)
    .join(" ");
}

export function localizeStudyRoomContent(value: StudyRoom, lang: Language): StudyRoom {
  const localized = lang === "ar" ? arabicStudyRooms[value.id] : undefined;
  if (!localized) return value;
  return {
    ...value,
    name: localized.name,
    description: localized.description,
    messages: value.messages.map((message) => ({
      ...message,
      authorName: localizePersonName(message.authorName, lang),
      text: localized.messages[message.id] ?? message.text,
    })),
    topics: value.topics.map((topic) => {
      const localizedTopic = localized.topics[topic.id];
      if (!localizedTopic) return topic;
      return {
        ...topic,
        ...localizedTopic,
        messages: topic.messages.map((message) => ({
          ...message,
          authorName: localizePersonName(message.authorName, lang),
          text: localizedTopic.messages[message.id] ?? message.text,
        })),
      };
    }),
    questionPosts: value.questionPosts.map((post) => {
      const localizedPost = localized.questionPosts[post.id];
      if (!localizedPost) return post;
      return {
        ...post,
        prompt: localizedPost.prompt,
        choices: post.choices.map((choice, index) => ({
          ...choice,
          label: localizedPost.choices[index] ?? choice.label,
        })),
      };
    }),
  };
}

export function localizeQuestionContent(value: Question, lang: Language): Question {
  const localized = lang === "ar" ? arabicQuestions[value.id] : undefined;
  if (!localized) return value;
  const { choices, reviewFeedback, ...text } = localized;
  return {
    ...value,
    ...text,
    choices: choices
      ? value.choices.map((choice, index) => ({
          ...choice,
          label: localizeChoiceLabel(
            choice.label,
            index,
            lang,
            value.type === "True/False"
          ),
          text: choices[index] ?? choice.text,
        }))
      : value.choices,
    reviewFeedback: reviewFeedback ?? value.reviewFeedback,
  };
}

export function localizeChoiceLabel(
  label: string,
  index: number,
  lang: Language,
  isTrueFalse = false
): string {
  if (lang !== "ar") return label;
  if (isTrueFalse) return index === 0 ? "صحيح" : "خطأ";
  return ["أ", "ب", "ج", "د", "هـ", "و"][index] ?? label;
}
