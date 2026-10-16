import type { Assessment, ExamType, Question, QuestionDifficulty } from "@/types";
import type { Language } from "@/utils/i18n";

interface BilingualQuestion {
  en: Question;
  ar: Question;
}

type TextPair = [en: string, ar: string];

const labels = ["A", "B", "C", "D"];
const difficulties: QuestionDifficulty[] = ["Easy", "Medium", "Hard"];
const cache = new Map<string, BilingualQuestion[]>();

function pair(value: string | number, arValue?: string | number): TextPair {
  return [String(value), String(arValue ?? value)];
}

function buildQuestion(
  assessmentId: string,
  index: number,
  examType: ExamType,
  section: string,
  topic: TextPair,
  prompt: TextPair,
  correct: TextPair,
  distractors: TextPair[],
  explanation: TextPair,
  seed: number
): BilingualQuestion {
  const options = [correct, ...distractors.slice(0, 3)];
  const offset = seed % options.length;
  const rotated = options.map((_, optionIndex) => options[(optionIndex + offset) % options.length]);
  const correctIndex = rotated.findIndex((option) => option === correct);
  const id = `${assessmentId}-q-${String(index + 1).padStart(3, "0")}`;
  const normalizedSection =
    examType === "tahsili" && section === "Science"
      ? topic[0].split(" - ")[0]
      : section;
  const base = {
    id,
    examType,
    section: normalizedSection,
    difficulty: difficulties[(index + seed) % difficulties.length],
    type: "Multiple Choice" as const,
    correctChoiceId: labels[correctIndex],
    status: "Approved" as const,
    source: "bank" as const,
    generatedAt: "2026-09-01",
  };

  return {
    en: {
      ...base,
      topic: topic[0],
      prompt: prompt[0],
      choices: rotated.map((option, optionIndex) => ({
        id: labels[optionIndex],
        label: labels[optionIndex],
        text: option[0],
      })),
      explanation: explanation[0],
    },
    ar: {
      ...base,
      topic: topic[1],
      prompt: prompt[1],
      choices: rotated.map((option, optionIndex) => ({
        id: labels[optionIndex],
        label: labels[optionIndex],
        text: option[1],
      })),
      explanation: explanation[1],
    },
  };
}

function quantitativeQuestion(
  assessmentId: string,
  index: number,
  variant: number
): BilingualQuestion {
  const cycle = Math.floor(index / 10);
  const kind = index % 10;
  const seed = variant + index;

  if (kind === 0) {
    const base = 80 + cycle * 20;
    const percentage = [10, 20, 25, 30, 15, 40][cycle];
    const result = base * (1 + percentage / 100);
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Percentages", "النسب المئوية"],
      [`A price of ${base} SAR increases by ${percentage}%. What is the new price?`, `زاد سعر مقداره ${base} ريالاً بنسبة ${percentage}%. فما السعر الجديد؟`],
      pair(result),
      [pair(result - 10), pair(result + 10), pair(base + percentage)],
      [`Increase = ${base} × ${percentage}% = ${result - base}; new price = ${result} SAR.`, `مقدار الزيادة = ${base} × ${percentage}% = ${result - base}؛ إذن السعر الجديد ${result} ريالاً.`],
      seed
    );
  }
  if (kind === 1) {
    const first = 2 + (cycle % 3);
    const second = 5 + (cycle % 2);
    const factor = 4 + cycle;
    const total = (first + second) * factor;
    const answer = second * factor;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Ratios", "النسب"],
      [`The ratio of boys to girls is ${first}:${second}. If the class has ${total} students, how many are girls?`, `نسبة الطلاب إلى الطالبات هي ${first}:${second}. إذا كان عدد طلاب الفصل ${total}، فكم عدد الطالبات؟`],
      pair(answer),
      [pair(first * factor), pair(answer - factor), pair(answer + factor)],
      [`There are ${first + second} ratio parts; each part is ${factor}, so girls = ${second} × ${factor} = ${answer}.`, `مجموع أجزاء النسبة ${first + second}، وقيمة الجزء ${factor}؛ إذن عدد الطالبات = ${second} × ${factor} = ${answer}.`],
      seed
    );
  }
  if (kind === 2) {
    const x = 5 + cycle * 2;
    const coefficient = 2 + (cycle % 3);
    const constant = 3 + cycle;
    const result = coefficient * x + constant;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Algebra", "الجبر"],
      [`If ${coefficient}x + ${constant} = ${result}, what is x?`, `إذا كان ${coefficient}س + ${constant} = ${result}، فما قيمة س؟`],
      pair(x),
      [pair(x - 2), pair(x + 2), pair(x + coefficient)],
      [`Subtract ${constant}, then divide by ${coefficient}: x = ${x}.`, `نطرح ${constant} ثم نقسم على ${coefficient}، فنحصل على س = ${x}.`],
      seed
    );
  }
  if (kind === 3) {
    const length = 8 + cycle * 2;
    const width = 4 + cycle;
    const area = length * width;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Geometry", "الهندسة"],
      [`A rectangle is ${length} cm long and ${width} cm wide. What is its area?`, `مستطيل طوله ${length} سم وعرضه ${width} سم. ما مساحته؟`],
      pair(`${area} cm²`, `${area} سم²`),
      [pair(`${2 * (length + width)} cm²`, `${2 * (length + width)} سم²`), pair(`${area + width} cm²`, `${area + width} سم²`), pair(`${length + width} cm²`, `${length + width} سم²`)],
      [`Area = length × width = ${length} × ${width} = ${area} cm².`, `المساحة = الطول × العرض = ${length} × ${width} = ${area} سم².`],
      seed
    );
  }
  if (kind === 4) {
    const middle = 18 + cycle * 3;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Averages", "المتوسطات"],
      [`What is the average of ${middle - 6}, ${middle}, and ${middle + 6}?`, `ما متوسط الأعداد ${middle - 6}، ${middle}، ${middle + 6}؟`],
      pair(middle),
      [pair(middle - 3), pair(middle + 3), pair(middle + 6)],
      [`The numbers are equally spaced around ${middle}, so their average is ${middle}.`, `الأعداد متساوية التباعد حول ${middle}، لذا متوسطها ${middle}.`],
      seed
    );
  }
  if (kind === 5) {
    const start = 3 + cycle;
    const step = 4 + cycle;
    const answer = start + 5 * step;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Sequences", "المتتابعات"],
      [`Find the sixth term of the sequence ${start}, ${start + step}, ${start + 2 * step}, ...`, `أوجد الحد السادس في المتتابعة ${start}، ${start + step}، ${start + 2 * step}، ...`],
      pair(answer),
      [pair(answer - step), pair(answer + step), pair(answer - 1)],
      [`This is an arithmetic sequence with difference ${step}; a₆ = ${start} + 5(${step}) = ${answer}.`, `هذه متتابعة حسابية فرقها ${step}؛ الحد السادس = ${start} + 5(${step}) = ${answer}.`],
      seed
    );
  }
  if (kind === 6) {
    const speed = 60 + cycle * 5;
    const time = 3 + (cycle % 3);
    const distance = speed * time;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Rate and Distance", "السرعة والمسافة"],
      [`A car travels at ${speed} km/h for ${time} hours. How far does it travel?`, `تسير سيارة بسرعة ${speed} كم/ساعة لمدة ${time} ساعات. فما المسافة التي تقطعها؟`],
      pair(`${distance} km`, `${distance} كم`),
      [pair(`${distance - speed} km`, `${distance - speed} كم`), pair(`${distance + speed} km`, `${distance + speed} كم`), pair(`${speed + time} km`, `${speed + time} كم`)],
      [`Distance = speed × time = ${speed} × ${time} = ${distance} km.`, `المسافة = السرعة × الزمن = ${speed} × ${time} = ${distance} كم.`],
      seed
    );
  }
  if (kind === 7) {
    const red = 2 + cycle;
    const blue = 4 + cycle;
    const total = red + blue;
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Probability", "الاحتمالات"],
      [`A bag contains ${red} red and ${blue} blue balls. What is the probability of drawing a red ball?`, `يحتوي كيس على ${red} كرات حمراء و${blue} كرات زرقاء. ما احتمال سحب كرة حمراء؟`],
      pair(`${red}/${total}`),
      [pair(`${blue}/${total}`), pair(`1/${total}`), pair(`${red}/${blue}`)],
      [`Probability = favorable outcomes ÷ total outcomes = ${red}/${total}.`, `الاحتمال = عدد النتائج المطلوبة ÷ مجموع النتائج = ${red}/${total}.`],
      seed
    );
  }
  if (kind === 8) {
    const original = 200 + cycle * 50;
    const discount = [10, 20, 25, 30, 15, 40][cycle];
    const sale = original * (1 - discount / 100);
    return buildQuestion(
      assessmentId, index, "qudurat", "Quantitative",
      ["Discounts", "الخصومات"],
      [`An item costs ${original} SAR and is discounted by ${discount}%. What is the sale price?`, `سعر سلعة ${original} ريالاً وخُفّض بنسبة ${discount}%. فما سعرها بعد الخصم؟`],
      pair(`${sale} SAR`, `${sale} ريالاً`),
      [pair(`${original - discount} SAR`, `${original - discount} ريالاً`), pair(`${sale + 10} SAR`, `${sale + 10} ريالاً`), pair(`${original * discount / 100} SAR`, `${original * discount / 100} ريالاً`)],
      [`Discount = ${original * discount / 100} SAR; sale price = ${sale} SAR.`, `قيمة الخصم = ${original * discount / 100} ريالاً؛ وسعر البيع = ${sale} ريالاً.`],
      seed
    );
  }
  const days = 12 + cycle * 2;
  return buildQuestion(
    assessmentId, index, "qudurat", "Quantitative",
    ["Work Rate", "معدل الإنجاز"],
    [`One worker completes a task in ${days} days. At the same rate, how many days do two workers need?`, `ينجز عامل مهمة في ${days} يوماً. كم يوماً يحتاج عاملان بالمعدل نفسه؟`],
    pair(days / 2),
    [pair(days), pair(days / 2 + 2), pair(days - 2)],
    [`Doubling the workers halves the time: ${days} ÷ 2 = ${days / 2} days.`, `مضاعفة عدد العمال تخفض الزمن إلى النصف: ${days} ÷ 2 = ${days / 2} أيام.`],
    seed
  );
}

const verbalItems: Array<{
  topic: TextPair;
  prompt: TextPair;
  correct: TextPair;
  distractors: TextPair[];
  explanation: TextPair;
}> = [
  { topic: ["Analogy", "التناظر اللفظي"], prompt: ["Doctor : Hospital :: Teacher : ?", "طبيب : مستشفى :: معلم : ؟"], correct: pair("School", "مدرسة"), distractors: [pair("Book", "كتاب"), pair("Student", "طالب"), pair("Board", "سبورة")], explanation: ["The relation is a profession and its workplace.", "العلاقة بين المهنة ومكان العمل."] },
  { topic: ["Analogy", "التناظر اللفظي"], prompt: ["Pen : Writing :: Brush : ?", "قلم : كتابة :: فرشاة : ؟"], correct: pair("Painting", "رسم"), distractors: [pair("Reading", "قراءة"), pair("Cutting", "قص"), pair("Measuring", "قياس")], explanation: ["Each tool is paired with its primary use.", "كل أداة مرتبطة باستخدامها الأساسي."] },
  { topic: ["Analogy", "التناظر اللفظي"], prompt: ["Seed : Tree :: Egg : ?", "بذرة : شجرة :: بيضة : ؟"], correct: pair("Bird", "طائر"), distractors: [pair("Nest", "عش"), pair("Feather", "ريشة"), pair("Wing", "جناح")], explanation: ["The first develops into the second.", "الأول ينمو أو يتطور ليصبح الثاني."] },
  { topic: ["Analogy", "التناظر اللفظي"], prompt: ["Hour : Time :: Meter : ?", "ساعة : زمن :: متر : ؟"], correct: pair("Length", "طول"), distractors: [pair("Weight", "وزن"), pair("Volume", "حجم"), pair("Speed", "سرعة")], explanation: ["The first is a unit used to measure the second.", "الأول وحدة لقياس الثاني."] },
  { topic: ["Analogy", "التناظر اللفظي"], prompt: ["Thirst : Water :: Hunger : ?", "عطش : ماء :: جوع : ؟"], correct: pair("Food", "طعام"), distractors: [pair("Sleep", "نوم"), pair("Air", "هواء"), pair("Medicine", "دواء")], explanation: ["The second satisfies the need expressed by the first.", "الثاني يلبي الحاجة التي يعبّر عنها الأول."] },
  { topic: ["Sentence Completion", "إكمال الجمل"], prompt: ["Although the task was ___, the team completed it accurately.", "رغم أن المهمة كانت ___، أنجزها الفريق بدقة."], correct: pair("difficult", "صعبة"), distractors: [pair("simple", "بسيطة"), pair("short", "قصيرة"), pair("familiar", "مألوفة")], explanation: ["“Although” signals contrast between difficulty and successful completion.", "تفيد «رغم» التضاد بين صعوبة المهمة ونجاح الإنجاز."] },
  { topic: ["Sentence Completion", "إكمال الجمل"], prompt: ["The researcher repeated the experiment to ___ the reliability of the results.", "كرر الباحث التجربة من أجل ___ موثوقية النتائج."], correct: pair("verify", "التحقق من"), distractors: [pair("ignore", "تجاهل"), pair("reduce", "تقليل"), pair("hide", "إخفاء")], explanation: ["Repeating an experiment is used to verify reliability.", "تكرار التجربة يُستخدم للتحقق من موثوقية النتائج."] },
  { topic: ["Sentence Completion", "إكمال الجمل"], prompt: ["A successful plan must be clear, realistic, and ___.", "يجب أن تكون الخطة الناجحة واضحة وواقعية و___."], correct: pair("measurable", "قابلة للقياس"), distractors: [pair("ambiguous", "غامضة"), pair("random", "عشوائية"), pair("temporary", "مؤقتة")], explanation: ["Measurability allows progress to be evaluated.", "قابلية القياس تتيح تقييم التقدم."] },
  { topic: ["Sentence Completion", "إكمال الجمل"], prompt: ["The speaker presented evidence that was both relevant and ___.", "عرض المتحدث أدلةً وثيقة الصلة و___."], correct: pair("convincing", "مقنعة"), distractors: [pair("contradictory", "متناقضة"), pair("unrelated", "بعيدة"), pair("unclear", "مبهمة")], explanation: ["Relevant, convincing evidence supports an argument.", "الأدلة ذات الصلة والمقنعة تدعم الحجة."] },
  { topic: ["Sentence Completion", "إكمال الجمل"], prompt: ["Reading widely helps a learner ___ vocabulary and improve expression.", "تساعد القراءة الواسعة المتعلم على ___ حصيلته اللغوية وتحسين التعبير."], correct: pair("expand", "توسيع"), distractors: [pair("limit", "تقليص"), pair("forget", "نسيان"), pair("repeat", "تكرار")], explanation: ["Wide reading expands vocabulary.", "القراءة الواسعة توسع الحصيلة اللغوية."] },
  { topic: ["Vocabulary", "المفردات"], prompt: ["Choose the closest meaning of “abundant.”", "اختر المرادف الأقرب لكلمة «وفير»."], correct: pair("Plentiful", "كثير"), distractors: [pair("Rare", "نادر"), pair("Weak", "ضعيف"), pair("Narrow", "ضيق")], explanation: ["Abundant means plentiful or more than enough.", "وفير تعني كثيراً أو غزيراً."] },
  { topic: ["Vocabulary", "المفردات"], prompt: ["Choose the closest meaning of “precise.”", "اختر المرادف الأقرب لكلمة «دقيق»."], correct: pair("Accurate", "محكم"), distractors: [pair("Vague", "غامض"), pair("Broad", "واسع"), pair("Rapid", "سريع")], explanation: ["Precise means accurate and exact.", "دقيق تعني محكماً ومضبوطاً."] },
  { topic: ["Vocabulary", "المفردات"], prompt: ["Choose the opposite of “temporary.”", "اختر عكس كلمة «مؤقت»."], correct: pair("Permanent", "دائم"), distractors: [pair("Brief", "قصير"), pair("Sudden", "مفاجئ"), pair("Flexible", "مرن")], explanation: ["Permanent is the opposite of temporary.", "دائم هو عكس مؤقت."] },
  { topic: ["Vocabulary", "المفردات"], prompt: ["Choose the opposite of “optimistic.”", "اختر عكس كلمة «متفائل»."], correct: pair("Pessimistic", "متشائم"), distractors: [pair("Patient", "صبور"), pair("Generous", "كريم"), pair("Confident", "واثق")], explanation: ["Pessimistic is the direct opposite of optimistic.", "متشائم هو العكس المباشر لمتفائل."] },
  { topic: ["Vocabulary", "المفردات"], prompt: ["Choose the closest meaning of “initiative.”", "اختر المعنى الأقرب لكلمة «مبادرة»."], correct: pair("Taking the first step", "البدء بالفعل"), distractors: [pair("Waiting for orders", "انتظار الأوامر"), pair("Avoiding responsibility", "تجنب المسؤولية"), pair("Repeating a mistake", "تكرار الخطأ")], explanation: ["Initiative is readiness to act without being prompted.", "المبادرة هي الاستعداد للبدء بالفعل دون انتظار توجيه."] },
  { topic: ["Reading Comprehension", "استيعاب المقروء"], prompt: ["A city planted trees along busy roads. After two years, nearby summer temperatures fell and air quality improved. What is the main idea?", "زرعت مدينة أشجاراً على الطرق المزدحمة. وبعد عامين انخفضت درجات الحرارة صيفاً وتحسنت جودة الهواء. ما الفكرة الرئيسة؟"], correct: pair("Urban trees can improve the local environment.", "تسهم الأشجار الحضرية في تحسين البيئة المحلية."), distractors: [pair("Roads should be closed in summer.", "يجب إغلاق الطرق صيفاً."), pair("Trees grow only near roads.", "لا تنمو الأشجار إلا قرب الطرق."), pair("Air quality never changes.", "لا تتغير جودة الهواء.")], explanation: ["The passage links tree planting with lower temperatures and cleaner air.", "تربط الفقرة زراعة الأشجار بانخفاض الحرارة وتحسن الهواء."] },
  { topic: ["Reading Comprehension", "استيعاب المقروء"], prompt: ["Students who reviewed material over several days remembered more than those who studied once for many hours. What does the passage support?", "تذكر الطلاب الذين راجعوا المادة على عدة أيام أكثر ممن درسوها مرة واحدة لساعات طويلة. ماذا تدعم الفقرة؟"], correct: pair("Spaced review improves retention.", "المراجعة المتباعدة تحسن التذكر."), distractors: [pair("Long sessions are always best.", "الجلسات الطويلة أفضل دائماً."), pair("Memory cannot improve.", "لا يمكن تحسين الذاكرة."), pair("Reviewing is unnecessary.", "المراجعة غير ضرورية.")], explanation: ["The comparison favors study distributed across several days.", "تفضّل المقارنة الدراسة الموزعة على عدة أيام."] },
  { topic: ["Reading Comprehension", "استيعاب المقروء"], prompt: ["The library extended its hours during exams, and evening attendance doubled. Which conclusion is best supported?", "مددت المكتبة ساعات العمل أثناء الاختبارات، فتضاعف الحضور مساءً. أي استنتاج تدعمه الفقرة؟"], correct: pair("Longer hours met student demand.", "لبّت الساعات الإضافية حاجة الطلاب."), distractors: [pair("Students stopped studying.", "توقف الطلاب عن الدراسة."), pair("Morning attendance disappeared.", "اختفى الحضور صباحاً."), pair("The library reduced its services.", "قللت المكتبة خدماتها.")], explanation: ["Higher evening attendance indicates demand for extended access.", "ارتفاع الحضور مساءً يدل على الحاجة إلى وقت إضافي."] },
  { topic: ["Contextual Error", "الخطأ السياقي"], prompt: ["Choose the word that does not fit: “The careful engineer ignored the measurements and verified every result.”", "اختر الكلمة غير المناسبة سياقياً: «تجاهل المهندس الدقيق القياسات وتحقق من كل نتيجة»."], correct: pair("ignored", "تجاهل"), distractors: [pair("careful", "الدقيق"), pair("measurements", "القياسات"), pair("verified", "تحقق")], explanation: ["A careful engineer who verifies results would not ignore measurements.", "المهندس الدقيق الذي يتحقق من النتائج لا يتجاهل القياسات."] },
  { topic: ["Contextual Error", "الخطأ السياقي"], prompt: ["Choose the word that does not fit: “The medicine relieved the pain and increased the patient's comfort and suffering.”", "اختر الكلمة غير المناسبة سياقياً: «خفف الدواء الألم وزاد راحة المريض ومعاناته»."], correct: pair("suffering", "معاناته"), distractors: [pair("relieved", "خفف"), pair("pain", "الألم"), pair("comfort", "راحة")], explanation: ["Relief and comfort conflict with increased suffering.", "التخفيف والراحة يتعارضان مع زيادة المعاناة."] },
];

const vocabularyItems: Array<{
  word: TextPair;
  synonym: TextPair;
  antonym: TextPair;
}> = [
  { word: ["abundant", "وفير"], synonym: ["plentiful", "غزير"], antonym: ["scarce", "نادر"] },
  { word: ["concise", "موجز"], synonym: ["brief", "مختصر"], antonym: ["verbose", "مسهب"] },
  { word: ["diligent", "مجتهد"], synonym: ["hardworking", "مثابر"], antonym: ["negligent", "مهمل"] },
  { word: ["transparent", "شفاف"], synonym: ["clear", "واضح"], antonym: ["opaque", "معتم"] },
  { word: ["ancient", "قديم"], synonym: ["old", "عتيق"], antonym: ["modern", "حديث"] },
  { word: ["fragile", "هش"], synonym: ["delicate", "رقيق"], antonym: ["durable", "متين"] },
  { word: ["optimistic", "متفائل"], synonym: ["hopeful", "مستبشر"], antonym: ["pessimistic", "متشائم"] },
  { word: ["generous", "كريم"], synonym: ["giving", "سخي"], antonym: ["stingy", "بخيل"] },
  { word: ["rapid", "سريع"], synonym: ["swift", "عاجل"], antonym: ["slow", "بطيء"] },
  { word: ["accurate", "دقيق"], synonym: ["precise", "محكم"], antonym: ["erroneous", "خاطئ"] },
  { word: ["calm", "هادئ"], synonym: ["tranquil", "ساكن"], antonym: ["agitated", "مضطرب"] },
  { word: ["expand", "يوسع"], synonym: ["enlarge", "يكبر"], antonym: ["contract", "يقلص"] },
  { word: ["complex", "معقد"], synonym: ["intricate", "متشابك"], antonym: ["simple", "بسيط"] },
  { word: ["permit", "يسمح"], synonym: ["allow", "يجيز"], antonym: ["forbid", "يمنع"] },
  { word: ["benefit", "منفعة"], synonym: ["advantage", "فائدة"], antonym: ["harm", "ضرر"] },
  { word: ["victory", "نصر"], synonym: ["triumph", "فوز"], antonym: ["defeat", "هزيمة"] },
  { word: ["honest", "صادق"], synonym: ["truthful", "أمين"], antonym: ["deceitful", "مخادع"] },
  { word: ["flexible", "مرن"], synonym: ["adaptable", "قابل للتكيف"], antonym: ["rigid", "جامد"] },
  { word: ["essential", "أساسي"], synonym: ["necessary", "ضروري"], antonym: ["optional", "اختياري"] },
  { word: ["visible", "ظاهر"], synonym: ["apparent", "مرئي"], antonym: ["hidden", "مخفي"] },
];

function verbalQuestion(
  assessmentId: string,
  index: number,
  variant: number
): BilingualQuestion {
  if (index >= verbalItems.length) {
    const vocabularyIndex = (index - verbalItems.length) % vocabularyItems.length;
    const item = vocabularyItems[vocabularyIndex];
    const asksForAntonym = index >= verbalItems.length + vocabularyItems.length;
    const correct = asksForAntonym ? item.antonym : item.synonym;
    const opposite = asksForAntonym ? item.synonym : item.antonym;
    const prompt: TextPair = asksForAntonym
      ? [
          `Which word is the antonym of “${item.word[0]}”?`,
          `ما الكلمة المضادة لكلمة «${item.word[1]}»؟`,
        ]
      : [
          `Which word is closest in meaning to “${item.word[0]}”?`,
          `ما الكلمة الأقرب في المعنى لكلمة «${item.word[1]}»؟`,
        ];
    const explanation: TextPair = asksForAntonym
      ? [
          `“${correct[0]}” is the antonym of “${item.word[0]}.”`,
          `«${correct[1]}» هي عكس «${item.word[1]}».`,
        ]
      : [
          `“${correct[0]}” is a synonym of “${item.word[0]}.”`,
          `«${correct[1]}» هي مرادف «${item.word[1]}».`,
        ];

    return buildQuestion(
      assessmentId,
      60 + index,
      "qudurat",
      "Verbal",
      ["Vocabulary", "المفردات"],
      prompt,
      correct,
      [opposite, pair("noisy", "صاخب"), pair("distant", "بعيد")],
      explanation,
      variant + index * 2
    );
  }

  const template = verbalItems[(index + variant) % verbalItems.length];
  return buildQuestion(
    assessmentId,
    60 + index,
    "qudurat",
    "Verbal",
    template.topic,
    template.prompt,
    template.correct,
    template.distractors,
    template.explanation,
    variant + index * 2
  );
}

function tahsiliMathQuestion(assessmentId: string, index: number, variant: number): BilingualQuestion {
  const cycle = Math.floor(index / 5);
  const kind = index % 5;
  const seed = variant + index;
  if (kind === 0) {
    const x = 2 + cycle;
    return buildQuestion(assessmentId, index, "tahsili", "Mathematics", ["Functions", "الدوال"], [`If f(x) = 2x² − 3x + 1, what is f(${x})?`, `إذا كانت د(س) = 2س² − 3س + 1، فما قيمة د(${x})؟`], pair(2 * x * x - 3 * x + 1), [pair(2 * x * x - 3 * x), pair(x * x + 1), pair(2 * x - 2)], [`Substitute x = ${x} into the function.`, `نعوّض س = ${x} في الدالة ثم نبسّط.`], seed);
  }
  if (kind === 1) {
    const slope = 2 + cycle;
    const intercept = 1 + cycle;
    return buildQuestion(assessmentId, index, "tahsili", "Mathematics", ["Linear Equations", "المعادلات الخطية"], [`What is the slope of y = ${slope}x + ${intercept}?`, `ما ميل المستقيم ص = ${slope}س + ${intercept}؟`], pair(slope), [pair(intercept), pair(-slope), pair(slope + intercept)], ["In y = mx + b, the slope is m.", "في الصورة ص = م س + ب، يمثل م ميل المستقيم."], seed);
  }
  if (kind === 2) {
    const first = 3 + cycle;
    const difference = 2 + cycle;
    const n = 8;
    const sum = (n / 2) * (2 * first + (n - 1) * difference);
    return buildQuestion(assessmentId, index, "tahsili", "Mathematics", ["Sequences and Series", "المتتابعات والمتسلسلات"], [`Find the sum of the first ${n} terms of an arithmetic sequence with a₁ = ${first} and d = ${difference}.`, `أوجد مجموع أول ${n} حدود من متتابعة حسابية حدها الأول ${first} وأساسها ${difference}.`], pair(sum), [pair(sum - difference * n), pair(sum + difference * n), pair(first + (n - 1) * difference)], [`Sₙ = n/2[2a₁ + (n−1)d] = ${sum}.`, `مجموع المتتابعة = ن/2 [2ح₁ + (ن−1)د] = ${sum}.`], seed);
  }
  if (kind === 3) {
    const values = [30, 45, 60, 90, 0, 180];
    const angle = values[cycle];
    const sinValues: Record<number, string> = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1", 180: "0" };
    return buildQuestion(assessmentId, index, "tahsili", "Mathematics", ["Trigonometry", "حساب المثلثات"], [`What is sin(${angle}°)?`, `ما قيمة جا(${angle}°)؟`], pair(sinValues[angle]), [pair("1/2"), pair("√2/2"), pair("1")], ["Use the standard unit-circle values.", "نستخدم القيم المثلثية الأساسية على دائرة الوحدة."], seed);
  }
  const radius = 3 + cycle;
  return buildQuestion(assessmentId, index, "tahsili", "Mathematics", ["Geometry", "الهندسة"], [`What is the area of a circle with radius ${radius} cm?`, `ما مساحة دائرة نصف قطرها ${radius} سم؟`], pair(`${radius * radius}π cm²`, `${radius * radius}π سم²`), [pair(`${2 * radius}π cm²`, `${2 * radius}π سم²`), pair(`${radius}π cm²`, `${radius}π سم²`), pair(`${2 * radius * radius}π cm²`, `${2 * radius * radius}π سم²`)], [`Area = πr² = ${radius * radius}π cm².`, `المساحة = π نق² = ${radius * radius}π سم².`], seed);
}

function physicsQuestion(assessmentId: string, index: number, variant: number): BilingualQuestion {
  const cycle = Math.floor(index / 5);
  const kind = index % 5;
  const seed = variant + index;
  if (kind === 0) {
    const velocity = 12 + cycle * 3;
    const time = 3 + cycle;
    const acceleration = velocity / time;
    return buildQuestion(assessmentId, 30 + index, "tahsili", "Science", ["Physics - Mechanics", "الفيزياء - الميكانيكا"], [`An object accelerates from rest to ${velocity} m/s in ${time} s. What is its acceleration?`, `تسارع جسم من السكون إلى ${velocity} م/ث خلال ${time} ث. ما تسارعه؟`], pair(`${acceleration} m/s²`, `${acceleration} م/ث²`), [pair(`${acceleration + 1} m/s²`, `${acceleration + 1} م/ث²`), pair(`${velocity * time} m/s²`, `${velocity * time} م/ث²`), pair(`${velocity - time} m/s²`, `${velocity - time} م/ث²`)], ["Acceleration = change in velocity ÷ time.", "التسارع = التغير في السرعة ÷ الزمن."], seed);
  }
  if (kind === 1) {
    const mass = 2 + cycle;
    const acceleration = 3 + cycle;
    return buildQuestion(assessmentId, 30 + index, "tahsili", "Science", ["Physics - Forces", "الفيزياء - القوى"], [`What force accelerates a ${mass} kg mass at ${acceleration} m/s²?`, `ما القوة اللازمة لتسريع كتلة مقدارها ${mass} كجم بتسارع ${acceleration} م/ث²؟`], pair(`${mass * acceleration} N`, `${mass * acceleration} نيوتن`), [pair(`${mass + acceleration} N`, `${mass + acceleration} نيوتن`), pair(`${mass / acceleration} N`, `${mass / acceleration} نيوتن`), pair(`${mass * acceleration * 2} N`, `${mass * acceleration * 2} نيوتن`)], ["Newton's second law: F = ma.", "قانون نيوتن الثاني: القوة = الكتلة × التسارع."], seed);
  }
  if (kind === 2) {
    const mass = 2 + cycle;
    const speed = 3 + cycle;
    const energy = 0.5 * mass * speed * speed;
    return buildQuestion(assessmentId, 30 + index, "tahsili", "Science", ["Physics - Energy", "الفيزياء - الطاقة"], [`Find the kinetic energy of a ${mass} kg object moving at ${speed} m/s.`, `أوجد الطاقة الحركية لجسم كتلته ${mass} كجم ويتحرك بسرعة ${speed} م/ث.`], pair(`${energy} J`, `${energy} جول`), [pair(`${mass * speed} J`, `${mass * speed} جول`), pair(`${mass * speed * speed} J`, `${mass * speed * speed} جول`), pair(`${energy + mass} J`, `${energy + mass} جول`)], ["Kinetic energy = ½mv².", "الطاقة الحركية = ½ ك ع²."], seed);
  }
  if (kind === 3) {
    const voltage = 12 + cycle * 6;
    const resistance = 3 + cycle;
    const current = voltage / resistance;
    return buildQuestion(assessmentId, 30 + index, "tahsili", "Science", ["Physics - Electricity", "الفيزياء - الكهرباء"], [`A resistor of ${resistance} Ω is connected to ${voltage} V. What current flows?`, `وُصلت مقاومة مقدارها ${resistance} أوم بجهد ${voltage} فولت. ما شدة التيار؟`], pair(`${current} A`, `${current} أمبير`), [pair(`${voltage * resistance} A`, `${voltage * resistance} أمبير`), pair(`${current + 1} A`, `${current + 1} أمبير`), pair(`${resistance / voltage} A`, `${resistance / voltage} أمبير`)], ["Ohm's law: I = V/R.", "قانون أوم: شدة التيار = الجهد ÷ المقاومة."], seed);
  }
  const frequency = 4 + cycle;
  const wavelength = 2 + cycle;
  return buildQuestion(assessmentId, 30 + index, "tahsili", "Science", ["Physics - Waves", "الفيزياء - الموجات"], [`A wave has frequency ${frequency} Hz and wavelength ${wavelength} m. What is its speed?`, `موجة ترددها ${frequency} هرتز وطولها الموجي ${wavelength} م. ما سرعتها؟`], pair(`${frequency * wavelength} m/s`, `${frequency * wavelength} م/ث`), [pair(`${frequency + wavelength} m/s`, `${frequency + wavelength} م/ث`), pair(`${frequency / wavelength} m/s`, `${frequency / wavelength} م/ث`), pair(`${wavelength / frequency} m/s`, `${wavelength / frequency} م/ث`)], ["Wave speed = frequency × wavelength.", "سرعة الموجة = التردد × الطول الموجي."], seed);
}

function chemistryQuestion(assessmentId: string, index: number, variant: number): BilingualQuestion {
  const cycle = Math.floor(index / 5);
  const kind = index % 5;
  const seed = variant + index;
  if (kind === 0) {
    const moles = 1 + cycle;
    const mass = 18 * moles;
    return buildQuestion(assessmentId, 60 + index, "tahsili", "Science", ["Chemistry - Moles", "الكيمياء - المولات"], [`How many moles are in ${mass} g of water (molar mass 18 g/mol)?`, `كم مولاً يوجد في ${mass} جم من الماء (الكتلة المولية 18 جم/مول)؟`], pair(`${moles} mol`, `${moles} مول`), [pair(`${moles + 1} mol`, `${moles + 1} مول`), pair(`${mass} mol`, `${mass} مول`), pair(`${18 / moles} mol`, `${18 / moles} مول`)], ["Moles = mass ÷ molar mass.", "عدد المولات = الكتلة ÷ الكتلة المولية."], seed);
  }
  if (kind === 1) {
    const moles = 1 + cycle;
    const volume = 2 + cycle;
    const concentration = Number((moles / volume).toFixed(2));
    return buildQuestion(assessmentId, 60 + index, "tahsili", "Science", ["Chemistry - Solutions", "الكيمياء - المحاليل"], [`${moles} mol of solute is dissolved to make ${volume} L of solution. What is the molarity?`, `أُذيب ${moles} مول من المذاب لتكوين ${volume} لتر من المحلول. ما التركيز المولاري؟`], pair(`${concentration} M`), [pair(`${moles * volume} M`), pair(`${concentration + 0.5} M`), pair(`${volume / moles} M`)], ["Molarity = moles of solute ÷ liters of solution.", "التركيز المولاري = مولات المذاب ÷ حجم المحلول باللتر."], seed);
  }
  if (kind === 2) {
    const moles = 1 + cycle;
    const volume = Number((22.4 * moles).toFixed(1));
    return buildQuestion(assessmentId, 60 + index, "tahsili", "Science", ["Chemistry - Gases", "الكيمياء - الغازات"], [`What volume does ${moles} mol of an ideal gas occupy at STP?`, `ما الحجم الذي يشغله ${moles} مول من غاز مثالي في الظروف القياسية؟`], pair(`${volume} L`, `${volume} لتر`), [pair(`${volume / 2} L`, `${volume / 2} لتر`), pair(`${volume + 22.4} L`, `${volume + 22.4} لتر`), pair(`${moles} L`, `${moles} لتر`)], ["At STP, one mole of an ideal gas occupies 22.4 L.", "في الظروف القياسية يشغل مول الغاز المثالي 22.4 لتراً."], seed);
  }
  if (kind === 3) {
    const h2 = 2 + cycle * 2;
    const water = h2;
    return buildQuestion(assessmentId, 60 + index, "tahsili", "Science", ["Chemistry - Stoichiometry", "الكيمياء - الحسابات الكيميائية"], [`In 2H₂ + O₂ → 2H₂O, how many moles of water form from ${h2} mol H₂ with excess O₂?`, `في المعادلة 2H₂ + O₂ → 2H₂O، كم مولاً من الماء ينتج من ${h2} مول H₂ مع وفرة الأكسجين؟`], pair(`${water} mol`, `${water} مول`), [pair(`${water / 2} mol`, `${water / 2} مول`), pair(`${water * 2} mol`, `${water * 2} مول`), pair(`${water + 1} mol`, `${water + 1} مول`)], ["The mole ratio H₂:H₂O is 2:2, or 1:1.", "النسبة المولية بين H₂ وH₂O هي 2:2، أي 1:1."], seed);
  }
  const exponent = 2 + cycle;
  return buildQuestion(assessmentId, 60 + index, "tahsili", "Science", ["Chemistry - Acids and Bases", "الكيمياء - الأحماض والقواعد"], [`What is the pH of a solution with [H⁺] = 1 × 10⁻${exponent} M?`, `ما الرقم الهيدروجيني لمحلول تركيز +H فيه 1 × 10⁻${exponent} مولاري؟`], pair(exponent), [pair(exponent - 1), pair(exponent + 1), pair(14 - exponent)], ["pH = −log[H⁺].", "الرقم الهيدروجيني = −لوغاريتم تركيز +H."], seed);
}

const biologyFacts: Array<[TextPair, TextPair, TextPair[], TextPair]> = [
  [["Which organelle produces most cellular ATP?", "ما العُضيّة التي تنتج معظم طاقة ATP في الخلية؟"], pair("Mitochondrion", "الميتوكوندريا"), [pair("Ribosome", "الريبوسوم"), pair("Golgi apparatus", "جهاز جولجي"), pair("Lysosome", "الجسيم الحال")], ["Mitochondria carry out cellular respiration.", "تجري عملية التنفس الخلوي في الميتوكوندريا."]],
  [["Where does protein synthesis occur?", "أين يحدث تصنيع البروتين؟"], pair("Ribosomes", "الريبوسومات"), [pair("Nucleus only", "النواة فقط"), pair("Vacuoles", "الفجوات"), pair("Centrioles", "المريكزات")], ["Ribosomes translate mRNA into protein.", "تترجم الريبوسومات mRNA إلى بروتين."]],
  [["Which molecule carries hereditary information?", "أي جزيء يحمل المعلومات الوراثية؟"], pair("DNA", "DNA"), [pair("ATP", "ATP"), pair("Glucose", "الجلوكوز"), pair("Lipid", "الدهون")], ["DNA stores genetic instructions.", "يخزن DNA التعليمات الوراثية."]],
  [["What is the main function of red blood cells?", "ما الوظيفة الرئيسة لخلايا الدم الحمراء؟"], pair("Transport oxygen", "نقل الأكسجين"), [pair("Produce antibodies", "إنتاج الأجسام المضادة"), pair("Digest bacteria", "هضم البكتيريا"), pair("Form hormones", "تكوين الهرمونات")], ["Hemoglobin in red blood cells binds oxygen.", "يرتبط الهيموجلوبين في خلايا الدم الحمراء بالأكسجين."]],
  [["Which process produces genetically identical body cells?", "أي عملية تنتج خلايا جسدية متماثلة وراثياً؟"], pair("Mitosis", "الانقسام المتساوي"), [pair("Meiosis", "الانقسام المنصف"), pair("Fertilization", "الإخصاب"), pair("Crossing over", "العبور")], ["Mitosis produces two genetically identical daughter cells.", "ينتج الانقسام المتساوي خليتين متماثلتين وراثياً."]],
  [["Which hormone lowers blood glucose?", "أي هرمون يخفض مستوى الجلوكوز في الدم؟"], pair("Insulin", "الإنسولين"), [pair("Glucagon", "الجلوكاجون"), pair("Adrenaline", "الأدرينالين"), pair("Thyroxine", "الثيروكسين")], ["Insulin promotes glucose uptake and storage.", "يعزز الإنسولين دخول الجلوكوز إلى الخلايا وتخزينه."]],
  [["Gas exchange in human lungs occurs mainly in the:", "يحدث تبادل الغازات في رئتي الإنسان أساساً في:"], pair("Alveoli", "الحويصلات الهوائية"), [pair("Trachea", "القصبة الهوائية"), pair("Bronchi", "الشعب الهوائية"), pair("Diaphragm", "الحجاب الحاجز")], ["Alveoli provide a thin, large surface for diffusion.", "توفر الحويصلات سطحاً واسعاً ورقيقاً للانتشار."]],
  [["Which tissue transports water upward in plants?", "أي نسيج ينقل الماء إلى أعلى في النبات؟"], pair("Xylem", "الخشب"), [pair("Phloem", "اللحاء"), pair("Epidermis", "البشرة"), pair("Cambium", "الكامبيوم")], ["Xylem conducts water and minerals from roots.", "ينقل الخشب الماء والأملاح من الجذور."]],
  [["Photosynthesis occurs primarily in the:", "تحدث عملية البناء الضوئي أساساً في:"], pair("Chloroplast", "البلاستيدة الخضراء"), [pair("Mitochondrion", "الميتوكوندريا"), pair("Nucleus", "النواة"), pair("Cell wall", "الجدار الخلوي")], ["Chloroplasts contain chlorophyll and photosynthetic machinery.", "تحتوي البلاستيدات الخضراء على الكلوروفيل وأجهزة البناء الضوئي."]],
  [["What type of immunity results from vaccination?", "ما نوع المناعة الناتجة عن التطعيم؟"], pair("Active acquired immunity", "مناعة مكتسبة نشطة"), [pair("Passive natural immunity", "مناعة طبيعية سلبية"), pair("Innate immunity", "مناعة فطرية"), pair("Mechanical immunity", "مناعة ميكانيكية")], ["Vaccines stimulate the person's own immune response and memory.", "تحفز اللقاحات استجابة الجسم المناعية وتكوين الذاكرة المناعية."]],
  [["Which enzyme begins starch digestion in the mouth?", "أي إنزيم يبدأ هضم النشا في الفم؟"], pair("Amylase", "الأميليز"), [pair("Pepsin", "البيبسين"), pair("Lipase", "الليباز"), pair("Trypsin", "التربسين")], ["Salivary amylase breaks starch into smaller sugars.", "يحلل الأميليز اللعابي النشا إلى سكريات أصغر."]],
  [["The functional unit of the kidney is the:", "الوحدة الوظيفية للكلية هي:"], pair("Nephron", "النفرون"), [pair("Neuron", "العصبون"), pair("Alveolus", "الحويصلة"), pair("Villus", "الزغابة")], ["Nephrons filter blood and form urine.", "ترشح النفرونات الدم وتكوّن البول."]],
  [["Which relationship benefits both organisms?", "أي علاقة يستفيد فيها الكائنان معاً؟"], pair("Mutualism", "تبادل المنفعة"), [pair("Parasitism", "التطفل"), pair("Predation", "الافتراس"), pair("Competition", "التنافس")], ["In mutualism, both species gain a benefit.", "في تبادل المنفعة يستفيد كلا النوعين."]],
  [["Natural selection directly favors organisms that:", "يفضل الانتخاب الطبيعي مباشرة الكائنات التي:"], pair("Reproduce successfully in their environment", "تنجح في التكاثر ضمن بيئتها"), [pair("Are always the largest", "تكون الأكبر دائماً"), pair("Never mutate", "لا تحدث لها طفرات"), pair("Live alone", "تعيش منفردة")], ["Traits that improve reproductive success become more common.", "تزداد الصفات التي تحسن النجاح التكاثري شيوعاً."]],
  [["A dominant allele is expressed when:", "يظهر تأثير الأليل السائد عندما:"], pair("At least one copy is present", "توجد منه نسخة واحدة على الأقل"), [pair("Only two copies are present", "توجد منه نسختان فقط"), pair("No allele is present", "لا يوجد أي أليل"), pair("The environment is constant", "تكون البيئة ثابتة")], ["One dominant allele is sufficient for the dominant phenotype.", "تكفي نسخة واحدة من الأليل السائد لظهور الصفة."]],
];

function biologyQuestion(assessmentId: string, index: number, variant: number): BilingualQuestion {
  const fact = biologyFacts[(index + variant) % biologyFacts.length];
  return buildQuestion(
    assessmentId,
    90 + index,
    "tahsili",
    "Science",
    ["Biology", "الأحياء"],
    fact[0],
    fact[1],
    fact[2],
    fact[3],
    variant + index
  );
}

function buildBank(assessment: Assessment): BilingualQuestion[] {
  const variant = assessment.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  if (assessment.examType === "qudurat") {
    return [
      ...Array.from({ length: 60 }, (_, index) =>
        quantitativeQuestion(assessment.id, index, variant)
      ),
      ...Array.from({ length: 60 }, (_, index) =>
        verbalQuestion(assessment.id, index, variant)
      ),
    ];
  }

  return [
    ...Array.from({ length: 30 }, (_, index) =>
      tahsiliMathQuestion(assessment.id, index, variant)
    ),
    ...Array.from({ length: 30 }, (_, index) =>
      physicsQuestion(assessment.id, index, variant)
    ),
    ...Array.from({ length: 30 }, (_, index) =>
      chemistryQuestion(assessment.id, index, variant)
    ),
    ...Array.from({ length: 30 }, (_, index) =>
      biologyQuestion(assessment.id, index, variant)
    ),
  ];
}

function getBilingualBank(assessment: Assessment): BilingualQuestion[] {
  const existing = cache.get(assessment.id);
  if (existing) return existing;
  const bank = buildBank(assessment);
  cache.set(assessment.id, bank);
  return bank;
}

export function getAssessmentQuestionBank(
  assessment: Assessment,
  lang: Language = "en"
): Question[] {
  return getBilingualBank(assessment).map((question) =>
    lang === "ar" ? question.ar : question.en
  );
}
