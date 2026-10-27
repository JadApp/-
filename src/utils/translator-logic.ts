export interface BoundingBox {
  top: number; // percentage 0-100
  left: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface DetectedTextBlock {
  id: string;
  originalText: string;
  translatedText: string;
  box: BoundingBox;
  confidence?: number;
  fontSize?: number; // estimated px or em
  bgColor?: string;
  textColor?: string;
}

export interface TranslatorSettings {
  sourceLang: string;
  targetLang: string;
  displayMode: 'in-place' | 'popup' | 'both';
  ocrEngine: 'mlkit-offline' | 'cloud-vision';
  bubbleOpacity: number;
  bubbleSize: 'small' | 'medium' | 'large';
  autoTranslateOnTap: boolean;
  hapticFeedback: boolean;
  showOriginalOnLongPress: boolean;
}

export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageItem[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];

/**
 * Calculates responsive font size for an in-place overlay based on bounding box
 */
export function calculateOverlayFontSize(box: BoundingBox, textLength: number, containerHeight: number): number {
  if (textLength <= 0) return 12;
  const boxHeightPx = (box.height / 100) * containerHeight;
  const estimated = Math.max(10, Math.min(22, Math.floor(boxHeightPx * 0.72)));
  return estimated;
}

/**
 * Validates if two bounding boxes overlap
 */
export function doBoxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(
    a.left + a.width <= b.left ||
    b.left + b.width <= a.left ||
    a.top + a.height <= b.top ||
    b.top + b.height <= a.top
  );
}

/**
 * Converts normalized 0-1000 coordinate box [ymin, xmin, ymax, xmax] to percentage BoundingBox
 */
export function normalizeGeminiBox(box: [number, number, number, number]): BoundingBox {
  const [ymin, xmin, ymax, xmax] = box;
  const top = Math.max(0, Math.min(100, ymin / 10));
  const left = Math.max(0, Math.min(100, xmin / 10));
  const height = Math.max(2, Math.min(100 - top, (ymax - ymin) / 10));
  const width = Math.max(3, Math.min(100 - left, (xmax - xmin) / 10));

  return {
    top: Number(top.toFixed(2)),
    left: Number(left.toFixed(2)),
    width: Number(width.toFixed(2)),
    height: Number(height.toFixed(2)),
  };
}

/**
 * Multilingual dictionary for offline translation across top languages
 */
export const MULTILINGUAL_DICTIONARY: Record<string, Record<string, string>> = {
  // Arabic (ar)
  ar: {
    'quest complete': 'اكتملت المهمة',
    'quest complete: 3/3 crystals gathered': 'اكتملت المهمة: تم جمع 3/3 بلورات',
    'defeat the shadow dragon': 'اهزم تنين الظلال',
    'defeat the shadow dragon to unlock the ancient gates': 'اهزم تنين الظلال لفتح البوابات القديمة',
    'equip legendary blade': 'تجهيز السيف الأسطوري',
    'equip legendary blade [atk +850]': 'تجهيز السيف الأسطوري [هجوم +850]',
    'health +500': 'الصحة +500',
    'mana +250': 'المانا +250',
    'health +500 | mana +250': 'الصحة +500 | المانا +250',
    'claim daily quest reward': 'استلم مكافأة المهمة اليومية',
    'tap to continue': 'المس للمتابعة',
    'what is this mysterious power?!': 'ما هذه القوة الغامضة؟!',
    'we need to find the ancient sanctuary before sunset.': 'علينا العثور على الملاذ القديم قبل غروب الشمس.',
    'behind you! watch out!': 'خلفك! احترس!',
    'breaking news: major breakthrough in quantum computing announced today.': 'أخبار عاجلة: الإعلان اليوم عن تقدم ثوري في الحوسبة الكمومية.',
    'researchers achieve room-temperature quantum coherence.': 'باحثون يحققون تماسكاً كمومياً في درجة حرارة الغرفة.',
    'read full article': 'اقرأ المقال كاملاً',
    'share with friends': 'شارك مع الأصدقاء',
    'system warning: battery level is critically low. connect charger immediately.': 'تحذير النظام: مستوى البطارية منخفض للغاية. قم بتوصيل الشاحن فوراً.',
    'battery saver': 'توفير الطاقة',
    'dismiss': 'تجاهل',
  },

  // French (fr)
  fr: {
    'quest complete': 'Quête terminée',
    'quest complete: 3/3 crystals gathered': 'Quête terminée: 3/3 cristaux collectés',
    'defeat the shadow dragon': "Vainquez le dragon de l'ombre",
    'defeat the shadow dragon to unlock the ancient gates': "Vainquez le dragon de l'ombre pour ouvrir les portes anciennes",
    'equip legendary blade': 'Équiper la lame légendaire',
    'equip legendary blade [atk +850]': 'Équiper la lame légendaire [ATQ +850]',
    'health +500': 'Santé +500',
    'mana +250': 'Mana +250',
    'health +500 | mana +250': 'Santé +500 | Mana +250',
    'claim daily quest reward': 'Récupérer la récompense quotidienne',
    'tap to continue': 'Appuyez pour continuer',
    'what is this mysterious power?!': 'Quel est ce mystérieux pouvoir ?!',
    'we need to find the ancient sanctuary before sunset.': "Nous devons trouver l'ancien sanctuaire avant le coucher du soleil.",
    'behind you! watch out!': 'Derrière toi ! Attention !',
    'breaking news: major breakthrough in quantum computing announced today.': "Dernière minute: avancée majeure en informatique quantique annoncée aujourd'hui.",
    'researchers achieve room-temperature quantum coherence.': 'Les chercheurs atteignent la cohérence quantique à température ambiante.',
    'read full article': "Lire l'article complet",
    'share with friends': 'Partager avec des amis',
    'system warning: battery level is critically low. connect charger immediately.': 'Alerte système: niveau de batterie critique. Branchez le chargeur.',
    'battery saver': 'Économiseur de batterie',
    'dismiss': 'Ignorer',
  },

  // Spanish (es)
  es: {
    'quest complete': 'Misión completada',
    'quest complete: 3/3 crystals gathered': 'Misión completada: 3/3 cristales reunidos',
    'defeat the shadow dragon': 'Derrota al dragón de las sombras',
    'defeat the shadow dragon to unlock the ancient gates': 'Derrota al dragón de las sombras para abrir las puertas antiguas',
    'equip legendary blade': 'Equipar espada legendaria',
    'equip legendary blade [atk +850]': 'Equipar espada legendaria [ATQ +850]',
    'health +500': 'Salud +500',
    'mana +250': 'Maná +250',
    'health +500 | mana +250': 'Salud +500 | Maná +250',
    'claim daily quest reward': 'Reclamar recompensa diaria',
    'tap to continue': 'Toca para continuar',
    'what is this mysterious power?!': '¡¿Qué es este poder misterioso?!',
    'we need to find the ancient sanctuary before sunset.': 'Debemos encontrar el santuario antiguo antes del atardecer.',
    'behind you! watch out!': '¡Detrás de ti! ¡Cuidado!',
    'breaking news: major breakthrough in quantum computing announced today.': 'Última hora: gran avance en computación cuántica anunciado hoy.',
    'researchers achieve room-temperature quantum coherence.': 'Investigadores logran coherencia cuántica a temperatura ambiente.',
    'read full article': 'Leer artículo completo',
    'share with friends': 'Compartir con amigos',
    'system warning: battery level is critically low. connect charger immediately.': 'Aviso del sistema: nivel de batería crítico. Conecta el cargador.',
    'battery saver': 'Ahorro de batería',
    'dismiss': 'Descartar',
  },

  // Japanese (ja)
  ja: {
    'quest complete': 'クエスト完了',
    'quest complete: 3/3 crystals gathered': 'クエスト完了: クリスタル 3/3 個獲得',
    'defeat the shadow dragon': 'シャドウドラゴンを討伐せよ',
    'defeat the shadow dragon to unlock the ancient gates': '古代の門を開くためシャドウドラゴンを倒せ',
    'equip legendary blade': '伝説の剣を装備',
    'equip legendary blade [atk +850]': '伝説の剣を装備 [攻撃力 +850]',
    'health +500': 'HP +500',
    'mana +250': 'MP +250',
    'health +500 | mana +250': 'HP +500 | MP +250',
    'claim daily quest reward': 'デイリークエスト報酬を受け取る',
    'tap to continue': 'タップして続ける',
    'what is this mysterious power?!': 'この謎の力は何だ？！',
    'we need to find the ancient sanctuary before sunset.': '日没前に古代の神殿を見つけ出さねばならない。',
    'behind you! watch out!': '後ろだ！危ない！',
    'breaking news: major breakthrough in quantum computing announced today.': '速報：量子コンピューティングにおける画期的なブレークスルーが発表。',
    'researchers achieve room-temperature quantum coherence.': '研究者たちが室温での量子コヒーレンスを達成。',
    'read full article': '記事全文を読む',
    'share with friends': '友達に共有する',
    'system warning: battery level is critically low. connect charger immediately.': 'システム警告：バッテリー残量が極端に低下しています。充電器を接続してください。',
    'battery saver': 'バッテリーセーバー',
    'dismiss': '閉じる',
  },

  // German (de)
  de: {
    'quest complete': 'Quest abgeschlossen',
    'quest complete: 3/3 crystals gathered': 'Quest abgeschlossen: 3/3 Kristalle gesammelt',
    'defeat the shadow dragon': 'Besiege den Schattendrachen',
    'defeat the shadow dragon to unlock the ancient gates': 'Besiege den Schattendrachen, um die alten Tore zu öffnen',
    'equip legendary blade': 'Legendäre Klinge ausrüsten',
    'equip legendary blade [atk +850]': 'Legendäre Klinge ausrüsten [ANG +850]',
    'health +500': 'Leben +500',
    'mana +250': 'Mana +250',
    'health +500 | mana +250': 'Leben +500 | Mana +250',
    'claim daily quest reward': 'Tägliche Belohnung abholen',
    'tap to continue': 'Tippen zum Fortfahren',
    'what is this mysterious power?!': 'Was ist diese geheimnisvolle Kraft?!',
    'we need to find the ancient sanctuary before sunset.': 'Wir müssen das uralte Heiligtum vor Sonnenuntergang finden.',
    'behind you! watch out!': 'Hinter dir! Pass auf!',
    'breaking news: major breakthrough in quantum computing announced today.': 'Eilmeldung: Großer Durchbruch in der Quanteninformatik verkündet.',
    'read full article': 'Vollständigen Artikel lesen',
    'share with friends': 'Mit Freunden teilen',
    'system warning: battery level is critically low. connect charger immediately.': 'Systemwarnung: Akkustand kritisch niedrig. Bitte Ladegerät anschließen.',
    'battery saver': 'Energiesparmodus',
    'dismiss': 'Schließen',
  },
};

/**
 * Fast local translation lookup with multilingual dictionary
 */
export function fastLocalTranslate(text: string, targetLang: string = 'ar'): string {
  const clean = text.trim().toLowerCase();
  const dict = MULTILINGUAL_DICTIONARY[targetLang];
  if (dict && dict[clean]) {
    return dict[clean];
  }

  // Look for partial key matches in the chosen target language
  if (dict) {
    for (const [key, val] of Object.entries(dict)) {
      if (clean.includes(key) || key.includes(clean)) {
        return val;
      }
    }
  }

  // If source and target are the same, return text
  if (targetLang === 'en') {
    return text;
  }

  return text;
}
