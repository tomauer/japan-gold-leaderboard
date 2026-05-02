import type { Prefecture, JapanRegion } from "@/types";

export const PREFECTURES: Prefecture[] = [
  // Hokkaido
  { code: "JP-01", nameEn: "Hokkaido", nameJa: "北海道", region: "Hokkaido" },

  // Tohoku
  { code: "JP-02", nameEn: "Aomori", nameJa: "青森県", region: "Tohoku" },
  { code: "JP-03", nameEn: "Iwate", nameJa: "岩手県", region: "Tohoku" },
  { code: "JP-04", nameEn: "Miyagi", nameJa: "宮城県", region: "Tohoku" },
  { code: "JP-05", nameEn: "Akita", nameJa: "秋田県", region: "Tohoku" },
  { code: "JP-06", nameEn: "Yamagata", nameJa: "山形県", region: "Tohoku" },
  { code: "JP-07", nameEn: "Fukushima", nameJa: "福島県", region: "Tohoku" },

  // Kanto
  { code: "JP-08", nameEn: "Ibaraki", nameJa: "茨城県", region: "Kanto" },
  { code: "JP-09", nameEn: "Tochigi", nameJa: "栃木県", region: "Kanto" },
  { code: "JP-10", nameEn: "Gunma", nameJa: "群馬県", region: "Kanto" },
  { code: "JP-11", nameEn: "Saitama", nameJa: "埼玉県", region: "Kanto" },
  { code: "JP-12", nameEn: "Chiba", nameJa: "千葉県", region: "Kanto" },
  { code: "JP-13", nameEn: "Tokyo", nameJa: "東京都", region: "Kanto" },
  { code: "JP-14", nameEn: "Kanagawa", nameJa: "神奈川県", region: "Kanto" },

  // Chubu
  { code: "JP-15", nameEn: "Niigata", nameJa: "新潟県", region: "Chubu" },
  { code: "JP-16", nameEn: "Toyama", nameJa: "富山県", region: "Chubu" },
  { code: "JP-17", nameEn: "Ishikawa", nameJa: "石川県", region: "Chubu" },
  { code: "JP-18", nameEn: "Fukui", nameJa: "福井県", region: "Chubu" },
  { code: "JP-19", nameEn: "Yamanashi", nameJa: "山梨県", region: "Chubu" },
  { code: "JP-20", nameEn: "Nagano", nameJa: "長野県", region: "Chubu" },
  { code: "JP-21", nameEn: "Gifu", nameJa: "岐阜県", region: "Chubu" },
  { code: "JP-22", nameEn: "Shizuoka", nameJa: "静岡県", region: "Chubu" },
  { code: "JP-23", nameEn: "Aichi", nameJa: "愛知県", region: "Chubu" },

  // Kinki
  { code: "JP-24", nameEn: "Mie", nameJa: "三重県", region: "Kinki" },
  { code: "JP-25", nameEn: "Shiga", nameJa: "滋賀県", region: "Kinki" },
  { code: "JP-26", nameEn: "Kyoto", nameJa: "京都府", region: "Kinki" },
  { code: "JP-27", nameEn: "Osaka", nameJa: "大阪府", region: "Kinki" },
  { code: "JP-28", nameEn: "Hyogo", nameJa: "兵庫県", region: "Kinki" },
  { code: "JP-29", nameEn: "Nara", nameJa: "奈良県", region: "Kinki" },
  { code: "JP-30", nameEn: "Wakayama", nameJa: "和歌山県", region: "Kinki" },

  // Chugoku
  { code: "JP-31", nameEn: "Tottori", nameJa: "鳥取県", region: "Chugoku" },
  { code: "JP-32", nameEn: "Shimane", nameJa: "島根県", region: "Chugoku" },
  { code: "JP-33", nameEn: "Okayama", nameJa: "岡山県", region: "Chugoku" },
  { code: "JP-34", nameEn: "Hiroshima", nameJa: "広島県", region: "Chugoku" },
  { code: "JP-35", nameEn: "Yamaguchi", nameJa: "山口県", region: "Chugoku" },

  // Shikoku
  { code: "JP-36", nameEn: "Tokushima", nameJa: "徳島県", region: "Shikoku" },
  { code: "JP-37", nameEn: "Kagawa", nameJa: "香川県", region: "Shikoku" },
  { code: "JP-38", nameEn: "Ehime", nameJa: "愛媛県", region: "Shikoku" },
  { code: "JP-39", nameEn: "Kochi", nameJa: "高知県", region: "Shikoku" },

  // Kyushu
  { code: "JP-40", nameEn: "Fukuoka", nameJa: "福岡県", region: "Kyushu" },
  { code: "JP-41", nameEn: "Saga", nameJa: "佐賀県", region: "Kyushu" },
  { code: "JP-42", nameEn: "Nagasaki", nameJa: "長崎県", region: "Kyushu" },
  { code: "JP-43", nameEn: "Kumamoto", nameJa: "熊本県", region: "Kyushu" },
  { code: "JP-44", nameEn: "Oita", nameJa: "大分県", region: "Kyushu" },
  { code: "JP-45", nameEn: "Miyazaki", nameJa: "宮崎県", region: "Kyushu" },
  { code: "JP-46", nameEn: "Kagoshima", nameJa: "鹿児島県", region: "Kyushu" },

  // Okinawa
  { code: "JP-47", nameEn: "Okinawa", nameJa: "沖縄県", region: "Okinawa" },
];

export const PREFECTURE_MAP = new Map<string, Prefecture>(
  PREFECTURES.map((p) => [p.code, p])
);

export const REGION_NAMES_JA: Record<JapanRegion, string> = {
  Hokkaido: "北海道",
  Tohoku: "東北",
  Kanto: "関東",
  Chubu: "中部",
  Kinki: "近畿",
  Chugoku: "中国",
  Shikoku: "四国",
  Kyushu: "九州",
  Okinawa: "沖縄",
};

export const REGIONS: JapanRegion[] = [
  "Hokkaido",
  "Tohoku",
  "Kanto",
  "Chubu",
  "Kinki",
  "Chugoku",
  "Shikoku",
  "Kyushu",
  "Okinawa",
];

export function getPrefectureByCode(code: string): Prefecture | undefined {
  return PREFECTURE_MAP.get(code);
}

export function getPrefecturesByRegion(region: JapanRegion): Prefecture[] {
  return PREFECTURES.filter((p) => p.region === region);
}
