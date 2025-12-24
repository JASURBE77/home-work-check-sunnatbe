import fuzzysort from "fuzzysort";

export const knowledgeBase = [
  {
    keywords: [
      "uyga vazifa",
      "vazifa topish",
      "yangi vazifa",
      "dars topshiriq",
      "homework",
    ],
    answer:
      "O‘quvchi sifatida siz uyga vazifalarni 'Uyga vazifalar' bo‘limida ko‘rishingiz va topshirishingiz mumkin. Vazifa linki GitHub, Netlify yoki Codesandbox bo‘lishi kerak.",
  },

  {
    keywords: [
      "ball",
      "natija",
      "score",
      "topshiriq ball",
      "vazifa baho",
    ],
    answer:
      "O‘qituvchi topshirilgan vazifalarga ball qo‘yadi va siz natijani o‘zingizning panelingizdan ko‘rishingiz mumkin.",
  },

  {
    keywords: [
      "status",
      "tekshirildi",
      "bajarilmagan",
      "qayta ishlansin",
      "to‘liq bajarildi",
    ],
    answer:
      "Har bir vazifa statusi quyidagicha ko‘rsatiladi: 'Bajarilmagan', 'Qayta ishlansin', 'Tekshirildi'. Bu orqali vazifangiz holatini kuzatishingiz mumkin.",
  },

  {
    keywords: [
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
