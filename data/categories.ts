import { VocabularyCategory } from '@/types';

export const categoriesData: VocabularyCategory[] = [
  {
    id: "numbers",
    titleEn: "Numbers",
    titleJp: "数字",
    words: [
      { id: "n1", character: "一", furiganaHTML: "<ruby>一<rt>いち</rt></ruby>", romaji: "ichi", meaning: "One" },
      { id: "n2", character: "二", furiganaHTML: "<ruby>二<rt>に</rt></ruby>", romaji: "ni", meaning: "Two" },
      { id: "n3", character: "三", furiganaHTML: "<ruby>三<rt>さん</rt></ruby>", romaji: "san", meaning: "Three" },
      { id: "n4", character: "四", furiganaHTML: "<ruby>四<rt>よん</rt></ruby>", romaji: "yon / shi", meaning: "Four" },
      { id: "n5", character: "五", furiganaHTML: "<ruby>五<rt>ご</rt></ruby>", romaji: "go", meaning: "Five" },
      { id: "n6", character: "六", furiganaHTML: "<ruby>六<rt>ろく</rt></ruby>", romaji: "roku", meaning: "Six" },
      { id: "n7", character: "七", furiganaHTML: "<ruby>七<rt>なな</rt></ruby>", romaji: "nana / shichi", meaning: "Seven" },
      { id: "n8", character: "八", furiganaHTML: "<ruby>八<rt>はち</rt></ruby>", romaji: "hachi", meaning: "Eight" },
      { id: "n9", character: "九", furiganaHTML: "<ruby>九<rt>きゅう</rt></ruby>", romaji: "kyuu / ku", meaning: "Nine" },
      { id: "n10", character: "十", furiganaHTML: "<ruby>十<rt>じゅう</rt></ruby>", romaji: "juu", meaning: "Ten" },
      { id: "n11", character: "百", furiganaHTML: "<ruby>百<rt>ひゃく</rt></ruby>", romaji: "hyaku", meaning: "Hundred" },
      { id: "n12", character: "千", furiganaHTML: "<ruby>千<rt>せん</rt></ruby>", romaji: "sen", meaning: "Thousand" },
      { id: "n13", character: "万", furiganaHTML: "<ruby>万<rt>まん</rt></ruby>", romaji: "man", meaning: "Ten Thousand" },
    ]
  },
  {
    id: "days",
    titleEn: "Days of the Week",
    titleJp: "曜日",
    words: [
      { id: "d1", character: "月曜日", furiganaHTML: "<ruby>月<rt>げつ</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "getsuyoubi", meaning: "Monday" },
      { id: "d2", character: "火曜日", furiganaHTML: "<ruby>火<rt>か</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "kayoubi", meaning: "Tuesday" },
      { id: "d3", character: "水曜日", furiganaHTML: "<ruby>水<rt>すい</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "suiyoubi", meaning: "Wednesday" },
      { id: "d4", character: "木曜日", furiganaHTML: "<ruby>木<rt>もく</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "mokuyoubi", meaning: "Thursday" },
      { id: "d5", character: "金曜日", furiganaHTML: "<ruby>金<rt>きん</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "kinyoubi", meaning: "Friday" },
      { id: "d6", character: "土曜日", furiganaHTML: "<ruby>土<rt>ど</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "doyoubi", meaning: "Saturday" },
      { id: "d7", character: "日曜日", furiganaHTML: "<ruby>日<rt>にち</rt></ruby><ruby>曜<rt>よう</rt></ruby><ruby>日<rt>び</rt></ruby>", romaji: "nichiyoubi", meaning: "Sunday" },
      { id: "d8", character: "平日", furiganaHTML: "<ruby>平<rt>へい</rt></ruby><ruby>日<rt>じつ</rt></ruby>", romaji: "heijitsu", meaning: "Weekday" },
      { id: "d9", character: "週末", furiganaHTML: "<ruby>週<rt>しゅう</rt></ruby><ruby>末<rt>まつ</rt></ruby>", romaji: "shuumatsu", meaning: "Weekend" }
    ]
  },
  {
    id: "months",
    titleEn: "Months",
    titleJp: "月",
    words: [
      { id: "m1", character: "一月", furiganaHTML: "<ruby>一<rt>いち</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "ichigatsu", meaning: "January" },
      { id: "m2", character: "二月", furiganaHTML: "<ruby>二<rt>に</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "nigatsu", meaning: "February" },
      { id: "m3", character: "三月", furiganaHTML: "<ruby>三<rt>さん</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "sangatsu", meaning: "March" },
      { id: "m4", character: "四月", furiganaHTML: "<ruby>四<rt>し</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "shigatsu", meaning: "April" },
      { id: "m5", character: "五月", furiganaHTML: "<ruby>五<rt>ご</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "gogatsu", meaning: "May" },
      { id: "m6", character: "六月", furiganaHTML: "<ruby>六<rt>ろく</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "rokugatsu", meaning: "June" },
      { id: "m7", character: "七月", furiganaHTML: "<ruby>七<rt>しち</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "shichigatsu", meaning: "July" },
      { id: "m8", character: "八月", furiganaHTML: "<ruby>八<rt>はち</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "hachigatsu", meaning: "August" },
      { id: "m9", character: "九月", furiganaHTML: "<ruby>九<rt>く</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "kugatsu", meaning: "September" },
      { id: "m10", character: "十月", furiganaHTML: "<ruby>十<rt>じゅう</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "juugatsu", meaning: "October" },
      { id: "m11", character: "十一月", furiganaHTML: "<ruby>十<rt>じゅう</rt></ruby><ruby>一<rt>いち</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "juuichigatsu", meaning: "November" },
      { id: "m12", character: "十二月", furiganaHTML: "<ruby>十<rt>じゅう</rt></ruby><ruby>二<rt>に</rt></ruby><ruby>月<rt>がつ</rt></ruby>", romaji: "juunigatsu", meaning: "December" },
    ]
  },
  {
    id: "time",
    titleEn: "Time",
    titleJp: "時間",
    words: [
      { id: "t1", character: "今", furiganaHTML: "<ruby>今<rt>いま</rt></ruby>", romaji: "ima", meaning: "Now" },
      { id: "t2", character: "今日", furiganaHTML: "<ruby>今日<rt>きょう</rt></ruby>", romaji: "kyou", meaning: "Today" },
      { id: "t3", character: "明日", furiganaHTML: "<ruby>明日<rt>あした</rt></ruby>", romaji: "ashita", meaning: "Tomorrow" },
      { id: "t4", character: "昨日", furiganaHTML: "<ruby>昨日<rt>きのう</rt></ruby>", romaji: "kinou", meaning: "Yesterday" },
      { id: "t5", character: "朝", furiganaHTML: "<ruby>朝<rt>あさ</rt></ruby>", romaji: "asa", meaning: "Morning" },
      { id: "t6", character: "昼", furiganaHTML: "<ruby>昼<rt>ひる</rt></ruby>", romaji: "hiru", meaning: "Noon / Daytime" },
      { id: "t7", character: "夜", furiganaHTML: "<ruby>夜<rt>よる</rt></ruby>", romaji: "yoru", meaning: "Night" },
      { id: "t8", character: "午前", furiganaHTML: "<ruby>午<rt>ご</rt></ruby><ruby>前<rt>ぜん</rt></ruby>", romaji: "gozen", meaning: "A.M. (Morning)" },
      { id: "t9", character: "午後", furiganaHTML: "<ruby>午<rt>ご</rt></ruby><ruby>後<rt>ご</rt></ruby>", romaji: "gogo", meaning: "P.M. (Afternoon)" },
      { id: "t10", character: "時間", furiganaHTML: "<ruby>時<rt>じ</rt></ruby><ruby>間<rt>かん</rt></ruby>", romaji: "jikan", meaning: "Time / Hour" }
    ]
  },
  {
    id: "body-parts",
    titleEn: "Body Parts",
    titleJp: "体",
    words: [
      { id: "b1", character: "頭", furiganaHTML: "<ruby>頭<rt>あたま</rt></ruby>", romaji: "atama", meaning: "Head" },
      { id: "b2", character: "目", furiganaHTML: "<ruby>目<rt>め</rt></ruby>", romaji: "me", meaning: "Eye" },
      { id: "b3", character: "耳", furiganaHTML: "<ruby>耳<rt>みみ</rt></ruby>", romaji: "mimi", meaning: "Ear" },
      { id: "b4", character: "口", furiganaHTML: "<ruby>口<rt>くち</rt></ruby>", romaji: "kuchi", meaning: "Mouth" },
      { id: "b5", character: "鼻", furiganaHTML: "<ruby>鼻<rt>はな</rt></ruby>", romaji: "hana", meaning: "Nose" },
      { id: "b6", character: "顔", furiganaHTML: "<ruby>顔<rt>かお</rt></ruby>", romaji: "kao", meaning: "Face" },
      { id: "b7", character: "手", furiganaHTML: "<ruby>手<rt>て</rt></ruby>", romaji: "te", meaning: "Hand" },
      { id: "b8", character: "足", furiganaHTML: "<ruby>足<rt>あし</rt></ruby>", romaji: "ashi", meaning: "Foot / Leg" },
      { id: "b9", character: "髪", furiganaHTML: "<ruby>髪<rt>かみ</rt></ruby>", romaji: "kami", meaning: "Hair" },
      { id: "b10", character: "体", furiganaHTML: "<ruby>体<rt>からだ</rt></ruby>", romaji: "karada", meaning: "Body" }
    ]
  },
  {
    id: "colors",
    titleEn: "Colors",
    titleJp: "色",
    words: [
      { id: "c1", character: "赤", furiganaHTML: "<ruby>赤<rt>あか</rt></ruby>", romaji: "aka", meaning: "Red" },
      { id: "c2", character: "青", furiganaHTML: "<ruby>青<rt>あお</rt></ruby>", romaji: "ao", meaning: "Blue" },
      { id: "c3", character: "白", furiganaHTML: "<ruby>白<rt>しろ</rt></ruby>", romaji: "shiro", meaning: "White" },
      { id: "c4", character: "黒", furiganaHTML: "<ruby>黒<rt>くろ</rt></ruby>", romaji: "kuro", meaning: "Black" },
      { id: "c5", character: "黄色", furiganaHTML: "<ruby>黄<rt>き</rt></ruby><ruby>色<rt>いろ</rt></ruby>", romaji: "kiiro", meaning: "Yellow" },
      { id: "c6", character: "緑", furiganaHTML: "<ruby>緑<rt>みどり</rt></ruby>", romaji: "midori", meaning: "Green" },
      { id: "c7", character: "茶色", furiganaHTML: "<ruby>茶<rt>ちゃ</rt></ruby><ruby>色<rt>いろ</rt></ruby>", romaji: "chairo", meaning: "Brown" },
      { id: "c8", character: "紫", furiganaHTML: "<ruby>紫<rt>むらさき</rt></ruby>", romaji: "murasaki", meaning: "Purple" },
      { id: "c9", character: "ピンク", furiganaHTML: null, romaji: "pinku", meaning: "Pink" },
      { id: "c10", character: "色", furiganaHTML: "<ruby>色<rt>いろ</rt></ruby>", romaji: "iro", meaning: "Color" }
    ]
  },
  {
    id: "family",
    titleEn: "Family",
    titleJp: "家族",
    words: [
      { id: "f1", character: "家族", furiganaHTML: "<ruby>家<rt>か</rt></ruby><ruby>族<rt>ぞく</rt></ruby>", romaji: "kazoku", meaning: "Family" },
      { id: "f2", character: "父", furiganaHTML: "<ruby>父<rt>ちち</rt></ruby>", romaji: "chichi", meaning: "Father (my)" },
      { id: "f3", character: "母", furiganaHTML: "<ruby>母<rt>はは</rt></ruby>", romaji: "haha", meaning: "Mother (my)" },
      { id: "f4", character: "兄", furiganaHTML: "<ruby>兄<rt>あに</rt></ruby>", romaji: "ani", meaning: "Older Brother (my)" },
      { id: "f5", character: "姉", furiganaHTML: "<ruby>姉<rt>あね</rt></ruby>", romaji: "ane", meaning: "Older Sister (my)" },
      { id: "f6", character: "弟", furiganaHTML: "<ruby>弟<rt>おとうと</rt></ruby>", romaji: "otouto", meaning: "Younger Brother" },
      { id: "f7", character: "妹", furiganaHTML: "<ruby>妹<rt>いもうと</rt></ruby>", romaji: "imouto", meaning: "Younger Sister" },
      { id: "f8", character: "お父さん", furiganaHTML: "お<ruby>父<rt>とう</rt></ruby>さん", romaji: "otousan", meaning: "Father (someone else's)" },
      { id: "f9", character: "お母さん", furiganaHTML: "お<ruby>母<rt>かあ</rt></ruby>さん", romaji: "okaasan", meaning: "Mother (someone else's)" },
      { id: "f10", character: "子供", furiganaHTML: "<ruby>子<rt>こ</rt></ruby><ruby>供<rt>ども</rt></ruby>", romaji: "kodomo", meaning: "Child" }
    ]
  },
  {
    id: "food-drink",
    titleEn: "Food & Drink",
    titleJp: "食べ物と飲み物",
    words: [
      { id: "fd1", character: "水", furiganaHTML: "<ruby>水<rt>みず</rt></ruby>", romaji: "mizu", meaning: "Water" },
      { id: "fd2", character: "ご飯", furiganaHTML: "ご<ruby>飯<rt>はん</rt></ruby>", romaji: "gohan", meaning: "Rice / Meal" },
      { id: "fd3", character: "パン", furiganaHTML: null, romaji: "pan", meaning: "Bread" },
      { id: "fd4", character: "肉", furiganaHTML: "<ruby>肉<rt>にく</rt></ruby>", romaji: "niku", meaning: "Meat" },
      { id: "fd5", character: "魚", furiganaHTML: "<ruby>魚<rt>さかな</rt></ruby>", romaji: "sakana", meaning: "Fish" },
      { id: "fd6", character: "野菜", furiganaHTML: "<ruby>野<rt>や</rt></ruby><ruby>菜<rt>さい</rt></ruby>", romaji: "yasai", meaning: "Vegetable" },
      { id: "fd7", character: "果物", furiganaHTML: "<ruby>果<rt>くだ</rt></ruby><ruby>物<rt>もの</rt></ruby>", romaji: "kudamono", meaning: "Fruit" },
      { id: "fd8", character: "お茶", furiganaHTML: "お<ruby>茶<rt>ちゃ</rt></ruby>", romaji: "ocha", meaning: "Tea" },
      { id: "fd9", character: "牛乳", furiganaHTML: "<ruby>牛<rt>ぎゅう</rt></ruby><ruby>乳<rt>にゅう</rt></ruby>", romaji: "gyuunyuu", meaning: "Milk" },
      { id: "fd10", character: "卵", furiganaHTML: "<ruby>卵<rt>たまご</rt></ruby>", romaji: "tamago", meaning: "Egg" }
    ]
  },
  {
    id: "animals",
    titleEn: "Animals",
    titleJp: "動物",
    words: [
      { id: "a1", character: "犬", furiganaHTML: "<ruby>犬<rt>いぬ</rt></ruby>", romaji: "inu", meaning: "Dog" },
      { id: "a2", character: "猫", furiganaHTML: "<ruby>猫<rt>ねこ</rt></ruby>", romaji: "neko", meaning: "Cat" },
      { id: "a3", character: "鳥", furiganaHTML: "<ruby>鳥<rt>とり</rt></ruby>", romaji: "tori", meaning: "Bird" },
      { id: "a4", character: "馬", furiganaHTML: "<ruby>馬<rt>うま</rt></ruby>", romaji: "uma", meaning: "Horse" },
      { id: "a5", character: "牛", furiganaHTML: "<ruby>牛<rt>うし</rt></ruby>", romaji: "ushi", meaning: "Cow" },
      { id: "a6", character: "豚", furiganaHTML: "<ruby>豚<rt>ぶた</rt></ruby>", romaji: "buta", meaning: "Pig" },
      { id: "a7", character: "猿", furiganaHTML: "<ruby>猿<rt>さる</rt></ruby>", romaji: "saru", meaning: "Monkey" },
      { id: "a8", character: "熊", furiganaHTML: "<ruby>熊<rt>くま</rt></ruby>", romaji: "kuma", meaning: "Bear" },
      { id: "a9", character: "動物", furiganaHTML: "<ruby>動<rt>どう</rt></ruby><ruby>物<rt>ぶつ</rt></ruby>", romaji: "doubutsu", meaning: "Animal" },
      { id: "a10", character: "虫", furiganaHTML: "<ruby>虫<rt>むし</rt></ruby>", romaji: "mushi", meaning: "Insect" }
    ]
  },
  {
    id: "places",
    titleEn: "Places",
    titleJp: "場所",
    words: [
      { id: "p1", character: "学校", furiganaHTML: "<ruby>学<rt>がっ</rt></ruby><ruby>校<rt>こう</rt></ruby>", romaji: "gakkou", meaning: "School" },
      { id: "p2", character: "駅", furiganaHTML: "<ruby>駅<rt>えき</rt></ruby>", romaji: "eki", meaning: "Train Station" },
      { id: "p3", character: "病院", furiganaHTML: "<ruby>病<rt>びょう</rt></ruby><ruby>院<rt>いん</rt></ruby>", romaji: "byouin", meaning: "Hospital" },
      { id: "p4", character: "図書館", furiganaHTML: "<ruby>図<rt>と</rt></ruby><ruby>書<rt>しょ</rt></ruby><ruby>館<rt>かん</rt></ruby>", romaji: "toshokan", meaning: "Library" },
      { id: "p5", character: "店", furiganaHTML: "<ruby>店<rt>みせ</rt></ruby>", romaji: "mise", meaning: "Shop / Store" },
      { id: "p6", character: "家", furiganaHTML: "<ruby>家<rt>いえ</rt></ruby>", romaji: "ie", meaning: "House / Home" },
      { id: "p7", character: "公園", furiganaHTML: "<ruby>公<rt>こう</rt></ruby><ruby>園<rt>えん</rt></ruby>", romaji: "kouen", meaning: "Park" },
      { id: "p8", character: "会社", furiganaHTML: "<ruby>会<rt>かい</rt></ruby><ruby>社<rt>しゃ</rt></ruby>", romaji: "kaisha", meaning: "Company / Office" },
      { id: "p9", character: "銀行", furiganaHTML: "<ruby>銀<rt>ぎん</rt></ruby><ruby>行<rt>こう</rt></ruby>", romaji: "ginkou", meaning: "Bank" },
      { id: "p10", character: "郵便局", furiganaHTML: "<ruby>郵<rt>ゆう</rt></ruby><ruby>便<rt>びん</rt></ruby><ruby>局<rt>きょく</rt></ruby>", romaji: "yuubinkyoku", meaning: "Post Office" }
    ]
  }
];
