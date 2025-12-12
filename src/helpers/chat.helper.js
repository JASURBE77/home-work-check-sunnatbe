import fuzzysort from "fuzzysort";

export const knowledgeBase = [
  {
    keywords: [
      "shikoyat",
      "sotuvchi ustidan shikoyat",
      "sotuvchi bilan muammo",
      "sotuvchi aldagan",
      "sotuvchi yomon gapirdi",
      "admin kerak",
      "operator kerak",
      "yordam kerak",
    ],
    answer:
      "Sotuvchi ustidan shikoyat berish uchun operator bilan bog‘laning: +998910118353",
  },

  {
    keywords: [
      "qaytarish",
      "qaytarib berish",
      "qaytarib bo‘ladimi",
      "qaytarib yuborish",
      "xato keldi",
      "orqaga qaytarish",
    ],
    answer:
      "Mahsulotni qaytarish uchun sotuvchi yoki admin bilan bog‘lanishingiz kerak.",
  },

  {
    keywords: [
      "dostavka",
      "yetkazib",
      "keladi",
      "necha kunda",
      "buyurtma kelishi",
      "kuryer",
    ],
    answer:
      "Yetkazib berish muddati 24–48 soat. Savollar bo‘lsa: +998 91 554 56 65",
  },

  {
    keywords: [
      "tolov",
      "pulini qanday",
      "karta orqali",
      "naqd",
      "online to‘lov",
      "payme",
      "click",
      "uzum",
    ],
    answer:
      "To‘lov mahsulot yetkazilgandan keyin amalga oshiriladi. Naqd yoki karta orqali.",
  },

  {
    keywords: [
      "kafolat",
      "garantiya",
      "nosoz",
      "ishlamayapti",
      "ta’mirlash",
      "servis",
    ],
    answer:
      "Nosoz mahsulot bo‘lsa qaytarib yuborishingiz yoki almashtirishingiz mumkin.",
  },

  {
    keywords: [
      "operator",
      "boglanish",
      "telefon",
      "aloqa",
      "raqam",
      "admin bilan gaplashaman",
    ],
    answer: "Operator bilan bog‘lanish: +998 91 --- -- --",
  },

  {
    keywords: [
      "qoidalar",
      "offerta",
      "maxfiylik",
      "foydalanish shartlari",
      "shartnoma",
    ],
    answer:
      "Qoidalar bilan tanishish uchun havola: https://texnopbazaar/offerta",
  },

  {
    keywords: [
      "zakaz berish",
      "buyurtma",
      "olmoqchiman",
      "sotib olaman",
      "savatcha",
    ],
    answer:
      "Mahsulotlarni savatchaga qo‘shib, manzilni kiritgan holda buyurtma berishingiz mumkin.",
  },

  {
    keywords: [
      "seller",
      "sotuvchi bo‘laman",
      "do‘kon ochaman",
      "tovar joylash",
      "platformada sotish",
    ],
    answer: "Seller bo‘lish uchun admin bilan bog‘laning: https://t.me/y_bahodirovich",
  },

  {
    keywords: [
      "shikoyat yuborish",
      "kamchilik bor",
      "feedback",
      "noroziman",
    ],
    answer:
      "Shikoyat yuborish uchun: https://t.me/savdo_x_bot",
  },

  {
    keywords: ["versiya", "update", "sayt versiyasi"],
    answer: "Saytning joriy versiyasi: 2.2.6",
  },
];

// ==========================================================================================
// SMART REPLY FUNCTION
// ==========================================================================================

export function generateSmartReply(text) {
  if (!text) return "Savolingizni tushunmadim, iltimos qayta yozing.";

  const q = text.toLowerCase();
  const words = q.split(/\s+/);

  let bestMatch = null;
  let bestScore = -Infinity;

  for (const item of knowledgeBase) {
    let totalScore = 0;
    let matchCount = 0;

    for (const keyword of item.keywords) {
      for (const word of words) {
        const result = fuzzysort.single(keyword, word);
        if (result) {
          totalScore += result.score;
          matchCount++;
        }
      }
    }

    const avgScore = matchCount > 0 ? totalScore / matchCount : -9999;

    if (avgScore > bestScore) {
      bestScore = avgScore;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore > -200) {
    return bestMatch.answer;
  }

  return "Assalomu alaykum! Sizga qanday yordam bera olaman?";
}