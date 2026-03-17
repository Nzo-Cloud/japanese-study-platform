export interface DakutenPair {
  base: {
    character: string;
    romanization: string;
  };
  voiced: {
    character: string;
    romanization: string;
  };
}

export interface DakutenGroup {
  name: string;
  pairs: DakutenPair[];
}

export const hiraganaDakutenData: DakutenGroup[] = [
  {
    name: 'K Group (G)',
    pairs: [
      { base: { character: 'か', romanization: 'ka' }, voiced: { character: 'が', romanization: 'ga' } },
      { base: { character: 'き', romanization: 'ki' }, voiced: { character: 'ぎ', romanization: 'gi' } },
      { base: { character: 'く', romanization: 'ku' }, voiced: { character: 'ぐ', romanization: 'gu' } },
      { base: { character: 'け', romanization: 'ke' }, voiced: { character: 'げ', romanization: 'ge' } },
      { base: { character: 'こ', romanization: 'ko' }, voiced: { character: 'ご', romanization: 'go' } },
    ],
  },
  {
    name: 'S Group (Z)',
    pairs: [
      { base: { character: 'さ', romanization: 'sa' }, voiced: { character: 'ざ', romanization: 'za' } },
      { base: { character: 'し', romanization: 'shi' }, voiced: { character: 'じ', romanization: 'ji' } },
      { base: { character: 'す', romanization: 'su' }, voiced: { character: 'ず', romanization: 'zu' } },
      { base: { character: 'せ', romanization: 'se' }, voiced: { character: 'ぜ', romanization: 'ze' } },
      { base: { character: 'そ', romanization: 'so' }, voiced: { character: 'ぞ', romanization: 'zo' } },
    ],
  },
  {
    name: 'T Group (D)',
    pairs: [
      { base: { character: 'た', romanization: 'ta' }, voiced: { character: 'だ', romanization: 'da' } },
      { base: { character: 'ち', romanization: 'chi' }, voiced: { character: 'ぢ', romanization: 'ji (di)' } },
      { base: { character: 'つ', romanization: 'tsu' }, voiced: { character: 'づ', romanization: 'zu (du)' } },
      { base: { character: 'て', romanization: 'te' }, voiced: { character: 'で', romanization: 'de' } },
      { base: { character: 'と', romanization: 'to' }, voiced: { character: 'ど', romanization: 'do' } },
    ],
  },
  {
    name: 'H Group (B)',
    pairs: [
      { base: { character: 'は', romanization: 'ha' }, voiced: { character: 'ば', romanization: 'ba' } },
      { base: { character: 'ひ', romanization: 'hi' }, voiced: { character: 'び', romanization: 'bi' } },
      { base: { character: 'ふ', romanization: 'fu' }, voiced: { character: 'ぶ', romanization: 'bu' } },
      { base: { character: 'へ', romanization: 'he' }, voiced: { character: 'べ', romanization: 'be' } },
      { base: { character: 'ほ', romanization: 'ho' }, voiced: { character: 'ぼ', romanization: 'bo' } },
    ],
  },
  {
    name: 'H Group (P) [Handakuten]',
    pairs: [
      { base: { character: 'は', romanization: 'ha' }, voiced: { character: 'ぱ', romanization: 'pa' } },
      { base: { character: 'ひ', romanization: 'hi' }, voiced: { character: 'ぴ', romanization: 'pi' } },
      { base: { character: 'ふ', romanization: 'fu' }, voiced: { character: 'ぷ', romanization: 'pu' } },
      { base: { character: 'へ', romanization: 'he' }, voiced: { character: 'ぺ', romanization: 'pe' } },
      { base: { character: 'ほ', romanization: 'ho' }, voiced: { character: 'ぽ', romanization: 'po' } },
    ],
  },
];

export const katakanaDakutenData: DakutenGroup[] = [
  {
    name: 'K Group (G)',
    pairs: [
      { base: { character: 'カ', romanization: 'ka' }, voiced: { character: 'ガ', romanization: 'ga' } },
      { base: { character: 'キ', romanization: 'ki' }, voiced: { character: 'ギ', romanization: 'gi' } },
      { base: { character: 'ク', romanization: 'ku' }, voiced: { character: 'グ', romanization: 'gu' } },
      { base: { character: 'ケ', romanization: 'ke' }, voiced: { character: 'ゲ', romanization: 'ge' } },
      { base: { character: 'コ', romanization: 'ko' }, voiced: { character: 'ゴ', romanization: 'go' } },
    ],
  },
  {
    name: 'S Group (Z)',
    pairs: [
      { base: { character: 'サ', romanization: 'sa' }, voiced: { character: 'ザ', romanization: 'za' } },
      { base: { character: 'シ', romanization: 'shi' }, voiced: { character: 'ジ', romanization: 'ji' } },
      { base: { character: 'ス', romanization: 'su' }, voiced: { character: 'ズ', romanization: 'zu' } },
      { base: { character: 'セ', romanization: 'se' }, voiced: { character: 'ゼ', romanization: 'ze' } },
      { base: { character: 'ソ', romanization: 'so' }, voiced: { character: 'ゾ', romanization: 'zo' } },
    ],
  },
  {
    name: 'T Group (D)',
    pairs: [
      { base: { character: 'タ', romanization: 'ta' }, voiced: { character: 'ダ', romanization: 'da' } },
      { base: { character: 'チ', romanization: 'chi' }, voiced: { character: 'ヂ', romanization: 'ji (di)' } },
      { base: { character: 'ツ', romanization: 'tsu' }, voiced: { character: 'ヅ', romanization: 'zu (du)' } },
      { base: { character: 'テ', romanization: 'te' }, voiced: { character: 'デ', romanization: 'de' } },
      { base: { character: 'ト', romanization: 'to' }, voiced: { character: 'ド', romanization: 'do' } },
    ],
  },
  {
    name: 'H Group (B)',
    pairs: [
      { base: { character: 'ハ', romanization: 'ha' }, voiced: { character: 'バ', romanization: 'ba' } },
      { base: { character: 'ヒ', romanization: 'hi' }, voiced: { character: 'ビ', romanization: 'bi' } },
      { base: { character: 'フ', romanization: 'fu' }, voiced: { character: 'ブ', romanization: 'bu' } },
      { base: { character: 'ヘ', romanization: 'he' }, voiced: { character: 'ベ', romanization: 'be' } },
      { base: { character: 'ホ', romanization: 'ho' }, voiced: { character: 'ボ', romanization: 'bo' } },
    ],
  },
  {
    name: 'H Group (P) [Handakuten]',
    pairs: [
      { base: { character: 'ハ', romanization: 'ha' }, voiced: { character: 'パ', romanization: 'pa' } },
      { base: { character: 'ヒ', romanization: 'hi' }, voiced: { character: 'ピ', romanization: 'pi' } },
      { base: { character: 'フ', romanization: 'fu' }, voiced: { character: 'プ', romanization: 'pu' } },
      { base: { character: 'ヘ', romanization: 'he' }, voiced: { character: 'ペ', romanization: 'pe' } },
      { base: { character: 'ホ', romanization: 'ho' }, voiced: { character: 'ポ', romanization: 'po' } },
    ],
  },
];
