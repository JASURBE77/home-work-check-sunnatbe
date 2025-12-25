import fuzzysort from "fuzzysort";

export const knowledgeBase = [
  {
    keywords: [
<<<<<<< HEAD
      "uyga vazifa",
      "vazifa topish",
      "yangi vazifa",
      "dars topshiriq",
      "homework",
    ],
    answer:
      "O‘quvchi sifatida siz uyga vazifalarni 'Uyga vazifalar' bo‘limida ko‘rishingiz va topshirishingiz mumkin. Vazifa linki GitHub, Netlify yoki Codesandbox bo‘lishi kerak.",
=======
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
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
  },

  {
    keywords: [
<<<<<<< HEAD
      "ball",
      "natija",
      "score",
      "topshiriq ball",
      "vazifa baho",
    ],
    answer:
      "O‘qituvchi topshirilgan vazifalarga ball qo‘yadi va siz natijani o‘zingizning panelingizdan ko‘rishingiz mumkin.",
=======
      "qaytarish",
      "qaytarib berish",
      "qaytarib bo‘ladimi",
      "qaytarib yuborish",
      "xato keldi",
      "orqaga qaytarish",
    ],
    answer:
      "Mahsulotni qaytarish uchun sotuvchi yoki admin bilan bog‘lanishingiz kerak.",
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
  },

  {
    keywords: [
<<<<<<< HEAD
      "status",
      "tekshirildi",
      "bajarilmagan",
      "qayta ishlansin",
      "to‘liq bajarildi",
    ],
    answer:
      "Har bir vazifa statusi quyidagicha ko‘rsatiladi: 'Bajarilmagan', 'Qayta ishlansin', 'Tekshirildi'. Bu orqali vazifangiz holatini kuzatishingiz mumkin.",
=======
      "dostavka",
      "yetkazib",
      "keladi",
      "necha kunda",
      "buyurtma kelishi",
      "kuryer",
    ],
    answer:
      "Yetkazib berish muddati 24–48 soat. Savollar bo‘lsa: +998 91 554 56 65",
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
  },

  {
    keywords: [
<<<<<<< HEAD
      "komentar",
      "feedback",
      "o‘qituvchi javobi",
      "teacher comment",
    ],
    answer:
      "O‘qituvchi har bir topshirilgan vazifa bo‘yicha komentariya qoldiradi. Bu sizga qaysi joylarni yaxshilash kerakligini ko‘rsatadi.",
  },

  {
    keywords: [
      "reyting",
      "guruh reyting",
      "umumiy reyting",
      "ranking",
      "scoreboard",
    ],
    answer:
      "Reyting ikki turga bo‘linadi: guruh ichidagi va umumiy (global) reyting. Bu orqali siz o‘quvchi sifatida o‘zingizning natijangizni kuzatishingiz mumkin.",
  },

  {
    keywords: [
      "o‘qituvchi",
      "teacher panel",
      "guruh",
      "lesson management",
      "vazifa boshqarish",
    ],
    answer:
      "O‘qituvchi panelida siz guruhlarni ko‘rishingiz, yangi vazifalar yaratishingiz, mavjud vazifalarni tahrirlashingiz va ball qo‘yishingiz mumkin.",
  },

  {
    keywords: [
      "admin",
      "rollar",
      "foydalanuvchi boshqarish",
      "user management",
      "super admin",
    ],
    answer:
      "Admin panelida siz barcha foydalanuvchilarni, rollarni, guruhlarni va vazifalarni boshqarishingiz mumkin. Admin barcha huquqlarga ega.",
  },

  {
    keywords: [
      "ota-ona",
      "farzand natija",
      "child progress",
      "parent panel",
    ],
    answer:
      "Ota-ona paneli orqali farzandingizning barcha topshiriqlari, ballari va o‘qituvchi kommentariyalarini kuzatishingiz mumkin. O‘zgartirish huquqi yo‘q.",
  },

  {
    keywords: [
      "deadline",
      "muddati",
      "topshirish sanasi",
      "deadline vazifa",
    ],
    answer:
      "Har bir uyga vazifa uchun topshirish muddati belgilangan. Siz panelda sanani ko‘rishingiz va o‘z vaqtida topshirishingiz mumkin.",
  },

  {
    keywords: [
      "platforma",
      "login",
      "ro‘yxatdan o‘tish",
      "system",
      "site",
    ],
    answer:
      "Platforma Frontend: React + Tailwind CSS + DaisyUI; Backend: Node.js + MongoDB. Foydalanuvchilar roli: o‘quvchi, o‘qituvchi, ota-ona, admin.",
=======
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
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 668f6e499cbcb6a854d97ccc9ef853068bf6615d
