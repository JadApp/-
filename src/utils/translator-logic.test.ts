import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOverlayFontSize,
  doBoxesOverlap,
  normalizeGeminiBox,
  fastLocalTranslate,
  SUPPORTED_LANGUAGES,
  BoundingBox,
} from './translator-logic';

test('SUPPORTED_LANGUAGES contains Arabic, English, French, Spanish, Japanese, and more', () => {
  const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
  assert.ok(codes.includes('ar'), 'should include Arabic');
  assert.ok(codes.includes('fr'), 'should include French');
  assert.ok(codes.includes('es'), 'should include Spanish');
  assert.ok(codes.includes('ja'), 'should include Japanese');
  assert.ok(codes.includes('de'), 'should include German');
  assert.ok(codes.length >= 10, 'should support at least 10 languages');
});

test('normalizeGeminiBox maps [0, 1000] scale into 0-100 percentage box correctly', () => {
  const rawBox: [number, number, number, number] = [120, 250, 240, 750];
  const normalized = normalizeGeminiBox(rawBox);

  assert.equal(normalized.top, 12);
  assert.equal(normalized.left, 25);
  assert.equal(normalized.height, 12);
  assert.equal(normalized.width, 50);
});

test('calculateOverlayFontSize returns reasonable font sizes bounded between 10 and 22', () => {
  const box: BoundingBox = { top: 10, left: 10, width: 40, height: 8 };
  const containerHeight = 600;
  const size = calculateOverlayFontSize(box, 15, containerHeight);

  assert.ok(size >= 10, `Font size should be >= 10, got ${size}`);
  assert.ok(size <= 22, `Font size should be <= 22, got ${size}`);
});

test('doBoxesOverlap identifies overlapping and non-overlapping rectangles', () => {
  const box1: BoundingBox = { top: 10, left: 10, width: 20, height: 20 };
  const box2: BoundingBox = { top: 15, left: 15, width: 20, height: 20 };
  const box3: BoundingBox = { top: 50, left: 50, width: 20, height: 20 };

  assert.equal(doBoxesOverlap(box1, box2), true, 'box1 and box2 should overlap');
  assert.equal(doBoxesOverlap(box1, box3), false, 'box1 and box3 should not overlap');
});

test('fastLocalTranslate translates to Arabic, French, Spanish, Japanese and German correctly', () => {
  // Arabic
  assert.equal(fastLocalTranslate('Quest Complete', 'ar'), 'اكتملت المهمة');
  assert.equal(fastLocalTranslate('Health +500', 'ar'), 'الصحة +500');

  // French
  assert.equal(fastLocalTranslate('Quest Complete', 'fr'), 'Quête terminée');
  assert.equal(fastLocalTranslate('Health +500', 'fr'), 'Santé +500');

  // Spanish
  assert.equal(fastLocalTranslate('Quest Complete', 'es'), 'Misión completada');
  assert.equal(fastLocalTranslate('Health +500', 'es'), 'Salud +500');

  // Japanese
  assert.equal(fastLocalTranslate('Quest Complete', 'ja'), 'クエスト完了');
  assert.equal(fastLocalTranslate('Health +500', 'ja'), 'HP +500');

  // German
  assert.equal(fastLocalTranslate('Quest Complete', 'de'), 'Quest abgeschlossen');
});
