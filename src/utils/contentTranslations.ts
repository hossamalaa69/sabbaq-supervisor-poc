import type { Assessment, Question, SabbaqClass, StudyMaterial } from "@/types";
import type { Language } from "./i18n";

type ClassContent = Pick<SabbaqClass, "name" | "description">;
type MaterialContent = Pick<StudyMaterial, "title" | "subject" | "topic">;
type QuestionContent = Pick<Question, "topic" | "prompt" | "explanation"> & {
  choices?: string[];
  reviewFeedback?: string;
};
type AssessmentContent = Pick<Assessment, "name">;

const arabicClasses: Record<string, ClassContent> = {
  "cls-qdr-quant": {
    name: "القدرات - الكمي",
    description: "الاستعداد للقسم الكمي في اختبار القدرات، مع تدريبات على الأعداد والجبر والهندسة.",
  },
  "cls-qdr-verbal": {
    name: "القدرات - اللفظي",
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
  return localized ? { ...value, ...localized } : value;
}

export function localizeMaterialContent(value: StudyMaterial, lang: Language): StudyMaterial {
  const localized = lang === "ar" ? arabicMaterials[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
}

export function localizeAssessmentContent(value: Assessment, lang: Language): Assessment {
  const localized = lang === "ar" ? arabicAssessments[value.id] : undefined;
  return localized ? { ...value, ...localized } : value;
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
          text: choices[index] ?? choice.text,
        }))
      : value.choices,
    reviewFeedback: reviewFeedback ?? value.reviewFeedback,
  };
}
