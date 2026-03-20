import { ParticleSentence } from '@/types';

/**
 * Particle fill-in-the-blank sentences for the Particle Quiz.
 * Each sentence has 1–3 blanks where the user must choose the correct particle.
 * Data is verified for JLPT accuracy (N5 / N4 / N3).
 */
export const particleSentences: ParticleSentence[] = [
  // ── N5 SENTENCES (1 blank each) ──────────────────────
  {
    id: 'p001', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'は' },
      { type: 'text', content: '<ruby>学生<rp>(</rp><rt>がくせい</rt><rp>)</rp></ruby>です。' }
    ],
    english: 'I am a student.',
    hint: 'は marks the topic of the sentence.'
  },
  {
    id: 'p002', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>水<rp>(</rp><rt>みず</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'を' },
      { type: 'text', content: '<ruby>飲<rp>(</rp><rt>の</rt><rp>)</rp></ruby>みます。' }
    ],
    english: 'I drink water.',
    hint: 'を marks the direct object of an action.'
  },
  {
    id: 'p003', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>学校<rp>(</rp><rt>がっこう</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'に' },
      { type: 'text', content: '<ruby>行<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きます。' }
    ],
    english: 'I go to school.',
    hint: 'に marks destination with movement verbs.'
  },
  {
    id: 'p004', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>猫<rp>(</rp><rt>ねこ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'が' },
      { type: 'text', content: 'います。' }
    ],
    english: 'There is a cat.',
    hint: 'が marks the subject, especially with existence verbs.'
  },
  {
    id: 'p005', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'も' },
      { type: 'text', content: '<ruby>行<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きます。' }
    ],
    english: 'I am going too.',
    hint: 'も means "also" or "too", replacing は or が.'
  },
  {
    id: 'p006', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>図書館<rp>(</rp><rt>としょかん</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'で' },
      { type: 'text', content: '<ruby>勉強<rp>(</rp><rt>べんきょう</rt><rp>)</rp></ruby>します。' }
    ],
    english: 'I study at the library.',
    hint: 'で marks the location where an action takes place.'
  },
  {
    id: 'p007', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>机<rp>(</rp><rt>つくえ</rt><rp>)</rp></ruby>の<ruby>上<rp>(</rp><rt>うえ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'に' },
      { type: 'text', content: '<ruby>本<rp>(</rp><rt>ほん</rt><rp>)</rp></ruby>があります。' }
    ],
    english: 'There is a book on the desk.',
    hint: 'に marks location with existence verbs (あります/います).'
  },
  {
    id: 'p008', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: 'これ' },
      { type: 'blank', content: 'は' },
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>のペンです。' }
    ],
    english: 'This is my pen.',
    hint: 'は marks the topic being introduced.'
  },
  {
    id: 'p009', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>電車<rp>(</rp><rt>でんしゃ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'で' },
      { type: 'text', content: '<ruby>来<rp>(</rp><rt>き</rt><rp>)</rp></ruby>ました。' }
    ],
    english: 'I came by train.',
    hint: 'で marks the means or method of doing something.'
  },
  {
    id: 'p010', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: 'パン' },
      { type: 'blank', content: 'も' },
      { type: 'text', content: 'ください。' }
    ],
    english: 'Please give me bread too.',
    hint: 'も adds "also/too" to the request.'
  },

  // ── N5 SENTENCES (2 blanks each) ─────────────────────
  {
    id: 'p011', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'は' },
      { type: 'text', content: '<ruby>公園<rp>(</rp><rt>こうえん</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'で' },
      { type: 'text', content: '<ruby>走<rp>(</rp><rt>はし</rt><rp>)</rp></ruby>ります。' }
    ],
    english: 'I run in the park.',
    hint: 'は = topic marker; で = location of action.'
  },
  {
    id: 'p012', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>妹<rp>(</rp><rt>いもうと</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'が' },
      { type: 'text', content: 'ジュース' },
      { type: 'blank', content: 'を' },
      { type: 'text', content: '<ruby>飲<rp>(</rp><rt>の</rt><rp>)</rp></ruby>んでいます。' }
    ],
    english: 'My sister is drinking juice.',
    hint: 'が = subject marker; を = object marker.'
  },
  {
    id: 'p013', jlptLevel: 'N5',
    segments: [
      { type: 'text', content: '<ruby>先生<rp>(</rp><rt>せんせい</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'も' },
      { type: 'text', content: '<ruby>学校<rp>(</rp><rt>がっこう</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'に' },
      { type: 'text', content: 'います。' }
    ],
    english: 'The teacher is also at school.',
    hint: 'も = also/too; に = location with います.'
  },

  // ── N4 SENTENCES (1 blank each) ──────────────────────
  {
    id: 'p014', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>駅<rp>(</rp><rt>えき</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'へ' },
      { type: 'text', content: '<ruby>向<rp>(</rp><rt>む</rt><rp>)</rp></ruby>かっています。' }
    ],
    english: 'I am heading toward the station.',
    hint: 'へ marks direction of movement (toward).'
  },
  {
    id: 'p015', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>友達<rp>(</rp><rt>ともだち</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'と' },
      { type: 'text', content: '<ruby>映画<rp>(</rp><rt>えいが</rt><rp>)</rp></ruby>を<ruby>見<rp>(</rp><rt>み</rt><rp>)</rp></ruby>ました。' }
    ],
    english: 'I watched a movie with a friend.',
    hint: 'と means "together with" a person.'
  },
  {
    id: 'p016', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'から' },
      { type: 'text', content: '<ruby>来<rp>(</rp><rt>き</rt><rp>)</rp></ruby>ました。' }
    ],
    english: 'I came from Tokyo.',
    hint: 'から marks the starting point or origin.'
  },
  {
    id: 'p017', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '９<ruby>時<rp>(</rp><rt>じ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'まで' },
      { type: 'text', content: '<ruby>働<rp>(</rp><rt>はたら</rt><rp>)</rp></ruby>きます。' }
    ],
    english: 'I work until 9 o\'clock.',
    hint: 'まで marks an endpoint in time or space.'
  },
  {
    id: 'p018', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>雨<rp>(</rp><rt>あめ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'が' },
      { type: 'text', content: '<ruby>降<rp>(</rp><rt>ふ</rt><rp>)</rp></ruby>っています。' }
    ],
    english: 'It is raining.',
    hint: 'が marks the subject of the natural event.'
  },
  {
    id: 'p019', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>母<rp>(</rp><rt>はは</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'に' },
      { type: 'text', content: 'プレゼントをあげました。' }
    ],
    english: 'I gave a present to my mother.',
    hint: 'に marks the recipient of an action.'
  },
  {
    id: 'p020', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>電話<rp>(</rp><rt>でんわ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'で' },
      { type: 'text', content: '<ruby>話<rp>(</rp><rt>はな</rt><rp>)</rp></ruby>しました。' }
    ],
    english: 'I spoke by phone.',
    hint: 'で marks the means of communication.'
  },

  // ── N4 SENTENCES (2 blanks each) ─────────────────────
  {
    id: 'p021', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>大阪<rp>(</rp><rt>おおさか</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'から' },
      { type: 'text', content: '<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'まで' },
      { type: 'text', content: '<ruby>新幹線<rp>(</rp><rt>しんかんせん</rt><rp>)</rp></ruby>で<ruby>行<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きます。' }
    ],
    english: 'I go from Osaka to Tokyo by bullet train.',
    hint: 'から = from (start); まで = until/to (end).'
  },
  {
    id: 'p022', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>友達<rp>(</rp><rt>ともだち</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'と' },
      { type: 'text', content: '<ruby>駅<rp>(</rp><rt>えき</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'へ' },
      { type: 'text', content: '<ruby>行<rp>(</rp><rt>い</rt><rp>)</rp></ruby>きました。' }
    ],
    english: 'I went to the station with my friend.',
    hint: 'と = with (person); へ = toward (direction).'
  },
  {
    id: 'p023', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'は' },
      { type: 'text', content: '<ruby>先生<rp>(</rp><rt>せんせい</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'に' },
      { type: 'text', content: '<ruby>質問<rp>(</rp><rt>しつもん</rt><rp>)</rp></ruby>しました。' }
    ],
    english: 'I asked the teacher a question.',
    hint: 'は = topic; に = direction of action toward a person.'
  },

  // ── N4 SENTENCES (3 blanks each) ─────────────────────
  {
    id: 'p024', jlptLevel: 'N4',
    segments: [
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'は' },
      { type: 'text', content: '<ruby>日本食<rp>(</rp><rt>にほんしょく</rt><rp>)</rp></ruby>レストラン' },
      { type: 'blank', content: 'で' },
      { type: 'text', content: '<ruby>日本語<rp>(</rp><rt>にほんご</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'を' },
      { type: 'text', content: '<ruby>勉強<rp>(</rp><rt>べんきょう</rt><rp>)</rp></ruby>しています。' }
    ],
    english: 'I am studying Japanese at a Japanese restaurant.',
    hint: 'は = topic; で = location of action; を = object.'
  },

  // ── N3 SENTENCES (1 blank each) ──────────────────────
  {
    id: 'p025', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>彼女<rp>(</rp><rt>かのじょ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'より' },
      { type: 'text', content: '<ruby>上手<rp>(</rp><rt>じょうず</rt><rp>)</rp></ruby>です。' }
    ],
    english: 'I am better than her.',
    hint: 'より marks a comparison point (better than, more than).'
  },
  {
    id: 'p026', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>疲<rp>(</rp><rt>つか</rt><rp>)</rp></ruby>れた' },
      { type: 'blank', content: 'けど' },
      { type: 'text', content: '<ruby>頑張<rp>(</rp><rt>がんば</rt><rp>)</rp></ruby>ります。' }
    ],
    english: 'I\'m tired, but I\'ll do my best.',
    hint: 'けど is a soft contrasting conjunction (but/however).'
  },
  {
    id: 'p027', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>雨<rp>(</rp><rt>あめ</rt><rp>)</rp></ruby>が<ruby>降<rp>(</rp><rt>ふ</rt><rp>)</rp></ruby>っている' },
      { type: 'blank', content: 'ので' },
      { type: 'text', content: '<ruby>傘<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>を<ruby>持<rp>(</rp><rt>も</rt><rp>)</rp></ruby>ってきました。' }
    ],
    english: 'Because it is raining, I brought an umbrella.',
    hint: 'ので gives a natural/objective reason (because).'
  },
  {
    id: 'p028', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>約束<rp>(</rp><rt>やくそく</rt><rp>)</rp></ruby>した' },
      { type: 'blank', content: 'のに' },
      { type: 'text', content: '<ruby>来<rp>(</rp><rt>こ</rt><rp>)</rp></ruby>なかった。' }
    ],
    english: 'Even though they promised, they didn\'t come.',
    hint: 'のに expresses disappointment or contrast with expectation.'
  },
  {
    id: 'p029', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>山<rp>(</rp><rt>やま</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'より' },
      { type: 'text', content: '<ruby>海<rp>(</rp><rt>うみ</rt><rp>)</rp></ruby>が<ruby>好<rp>(</rp><rt>す</rt><rp>)</rp></ruby>きです。' }
    ],
    english: 'I like the sea more than the mountains.',
    hint: 'より sets the comparison baseline.'
  },
  {
    id: 'p030', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>寒<rp>(</rp><rt>さむ</rt><rp>)</rp></ruby>い' },
      { type: 'blank', content: 'けど' },
      { type: 'text', content: '<ruby>窓<rp>(</rp><rt>まど</rt><rp>)</rp></ruby>を<ruby>開<rp>(</rp><rt>あ</rt><rp>)</rp></ruby>けてください。' }
    ],
    english: 'It\'s cold, but please open the window.',
    hint: 'けど softens the contrast, polite in tone.'
  },

  // ── N3 SENTENCES (2 blanks each) ─────────────────────
  {
    id: 'p031', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>彼<rp>(</rp><rt>かれ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'より' },
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>の<ruby>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>が<ruby>背<rp>(</rp><rt>せ</rt><rp>)</rp></ruby>が<ruby>高<rp>(</rp><rt>たか</rt><rp>)</rp></ruby>い' },
      { type: 'blank', content: 'けど' },
      { type: 'text', content: '、<ruby>彼<rp>(</rp><rt>かれ</rt><rp>)</rp></ruby>の<ruby>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>が<ruby>速<rp>(</rp><rt>はや</rt><rp>)</rp></ruby>い。' }
    ],
    english: 'I am taller than him, but he is faster.',
    hint: 'より = comparison; けど = but/however.'
  },
  {
    id: 'p032', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>試験<rp>(</rp><rt>しけん</rt><rp>)</rp></ruby>がある' },
      { type: 'blank', content: 'ので' },
      { type: 'text', content: '、<ruby>勉強<rp>(</rp><rt>べんきょう</rt><rp>)</rp></ruby>している' },
      { type: 'blank', content: 'のに' },
      { type: 'text', content: '、<ruby>眠<rp>(</rp><rt>ねむ</rt><rp>)</rp></ruby>い。' }
    ],
    english: 'Because there is an exam I am studying, yet I am sleepy.',
    hint: 'ので = objective reason; のに = unexpected contrast.'
  },

  // ── N3 SENTENCES (3 blanks each) ─────────────────────
  {
    id: 'p033', jlptLevel: 'N3',
    segments: [
      { type: 'text', content: '<ruby>彼女<rp>(</rp><rt>かのじょ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'より' },
      { type: 'text', content: '<ruby>私<rp>(</rp><rt>わたし</rt><rp>)</rp></ruby>の<ruby>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>が<ruby>早<rp>(</rp><rt>はや</rt><rp>)</rp></ruby>く<ruby>起<rp>(</rp><rt>お</rt><rp>)</rp></ruby>きる' },
      { type: 'blank', content: 'のに' },
      { type: 'text', content: '、いつも<ruby>彼女<rp>(</rp><rt>かのじょ</rt><rp>)</rp></ruby>' },
      { type: 'blank', content: 'の' },
      { type: 'text', content: '<ruby>方<rp>(</rp><rt>ほう</rt><rp>)</rp></ruby>が<ruby>先<rp>(</rp><rt>さき</rt><rp>)</rp></ruby>に<ruby>着<rp>(</rp><rt>つ</rt><rp>)</rp></ruby>く。' }
    ],
    english: 'Even though I wake up earlier than her, she always arrives first.',
    hint: 'より = comparison; のに = unexpected result; の = possessive connector.'
  },
];
