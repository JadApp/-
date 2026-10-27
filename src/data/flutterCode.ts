import { CodeFile } from '../types';

export const FLUTTER_FILES: CodeFile[] = [
  {
    name: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter dependencies for Google ML Kit OCR, Translator, and Overlay Window',
    descriptionAr: 'ملف الحزم والاعتماديات لتطبيق Flutter مع مكتبات ML Kit والنوافذ العائمة',
    content: `name: screen_translator_app
description: "Instant Mobile Screen Translator with Floating Overlay and Google ML Kit"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # Google ML Kit Text Recognition (Fast On-Device OCR)
  google_mlkit_text_recognition: ^0.13.0

  # Google ML Kit Translation (Offline / On-Device English to Arabic)
  google_mlkit_translation: ^0.10.0

  # Floating Window Widget over other apps and games
  flutter_overlay_window: ^0.5.0

  # Screen Capturer & MediaProjection helper
  screen_capturer: ^0.2.1

  # Path provider & image processing
  path_provider: ^2.1.2
  image: ^4.1.7

  # UI icons & state
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
  },
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    description: 'Entry point initializing Flutter app and overlay entry point',
    descriptionAr: 'نقطة دخول التطبيق وتهيئة النوافذ العائمة واختبار الأذونات',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';
import 'views/home_screen.dart';
import 'views/floating_bubble_overlay.dart';

// Overlay entry point (runs in isolated Android overlay window)
@pragma("vm:entry-point")
void overlayMain() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: FloatingBubbleOverlay(),
  ));
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ScreenTranslatorApp());
}

class ScreenTranslatorApp extends StatelessWidget {
  const ScreenTranslatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Screen Translator',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF4F46E5),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}`,
  },
  {
    name: 'home_screen.dart',
    path: 'lib/views/home_screen.dart',
    language: 'dart',
    description: 'Main dashboard screen with Start Service toggle, permissions, and language picker',
    descriptionAr: 'شاشة التحكم الرئيسية بزر التشغيل والفحص التلقائي لأذونات الظهور فوق التطبيقات',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isServiceActive = false;

  @override
  void initState() {
    super.initState();
    _checkOverlayStatus();
  }

  Future<void> _checkOverlayStatus() async {
    final isActive = await FlutterOverlayWindow.isActive();
    setState(() => _isServiceActive = isActive);
  }

  Future<void> _toggleService() async {
    if (_isServiceActive) {
      await FlutterOverlayWindow.closeOverlay();
      setState(() => _isServiceActive = false);
    } else {
      // 1. Request Draw Over Other Apps permission
      final bool? isGranted = await FlutterOverlayWindow.isPermissionGranted();
      if (isGranted != true) {
        final bool? requested = await FlutterOverlayWindow.requestPermission();
        if (requested != true) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Overlay permission is required!')),
            );
          }
          return;
        }
      }

      // 2. Launch Floating Bubble Widget over other apps
      await FlutterOverlayWindow.showOverlay(
        enableDrag: true,
        overlayTitle: "Screen Translator Active",
        overlayContent: "Tap floating widget to translate screen",
        flag: OverlayFlag.defaultFlag,
        alignment: OverlayAlignment.centerRight,
        visibility: NotificationVisibility.visibilityPublic,
        positionGravity: PositionGravity.auto,
        height: 120,
        width: 120,
      );

      setState(() => _isServiceActive = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('مترجم الشاشة الفوري (Screen Translator)'),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _isServiceActive ? Icons.translate_rounded : Icons.g_translate_outlined,
                size: 80,
                color: _isServiceActive ? Colors.greenAccent : Colors.indigoAccent,
              ),
              const SizedBox(height: 24),
              Text(
                _isServiceActive ? "الخدمة قيد التشغيل (Service Running)" : "الخدمة متوقفة (Service Stopped)",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                "يظهر زر عائم فوق الألعاب والتطبيقات لترجمة النصوص فورياً",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 40),
              ElevatedButton.icon(
                onPressed: _toggleService,
                icon: Icon(_isServiceActive ? Icons.stop_rounded : Icons.play_arrow_rounded),
                label: Text(
                  _isServiceActive ? "إيقاف الخدمة (Stop Service)" : "بدء الخدمة (Start Service)",
                  style: const TextStyle(fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isServiceActive ? Colors.redAccent : Colors.indigoAccent,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(260, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`,
  },
  {
    name: 'floating_bubble_overlay.dart',
    path: 'lib/views/floating_bubble_overlay.dart',
    language: 'dart',
    description: 'Draggable circular floating action widget rendered in overlay window',
    descriptionAr: 'واجهة الزر العائم الصغير الذي يطفو فوق الشاشة وينفذ التقاط الشاشة عند لمسه',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_overlay_window/flutter_overlay_window.dart';
import '../services/ocr_service.dart';
import '../services/translate_service.dart';

class FloatingBubbleOverlay extends StatefulWidget {
  const FloatingBubbleOverlay({super.key});

  @override
  State<FloatingBubbleOverlay> createState() => _FloatingBubbleOverlayState();
}

class _FloatingBubbleOverlayState extends State<FloatingBubbleOverlay> {
  bool _isProcessing = false;
  final OcrService _ocrService = OcrService();
  final TranslateService _translateService = TranslateService();

  Future<void> _handleBubbleTap() async {
    if (_isProcessing) return;

    setState(() => _isProcessing = true);

    try {
      // 1. Capture screen snapshot
      final screenshotPath = await _ocrService.captureScreen();
      if (screenshotPath != null) {
        // 2. Run Google ML Kit Text Recognition
        final detectedBlocks = await _ocrService.extractTextBlocks(screenshotPath);

        // 3. Translate to Arabic
        final translatedBlocks = await _translateService.translateAll(detectedBlocks);

        // 4. Send translated blocks to Overlay Canvas
        await FlutterOverlayWindow.shareData({
          'action': 'SHOW_OVERLAY',
          'blocks': translatedBlocks,
        });
      }
    } catch (e) {
      debugPrint('Screen translation error: \$e');
    } finally {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleBubbleTap,
      child: Container(
        width: 60,
        height: 60,
        decoration: BoxDecoration(
          color: const Color(0xFF4F46E5).withOpacity(0.9),
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
          border: Border.all(color: Colors.white.withOpacity(0.6), width: 2),
        ),
        child: Center(
          child: _isProcessing
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                )
              : const Icon(Icons.translate_rounded, color: Colors.white, size: 28),
        ),
      ),
    );
  }
}`,
  },
  {
    name: 'ocr_service.dart',
    path: 'lib/services/ocr_service.dart',
    language: 'dart',
    description: 'Extracts English text blocks from screenshot using google_mlkit_text_recognition',
    descriptionAr: 'خدمة التعرف البصري OCR واستخراج الإحداثيات في بيئة Flutter',
    content: `import 'dart:io';
import 'dart:ui';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:screen_capturer/screen_capturer.dart';
import 'package:path_provider/path_provider.dart';

class DetectedBlockModel {
  final String text;
  final Rect boundingBox;
  String translatedText;

  DetectedBlockModel({
    required this.text,
    required this.boundingBox,
    this.translatedText = '',
  });

  Map<String, dynamic> toMap() => {
    'text': text,
    'translatedText': translatedText,
    'left': boundingBox.left,
    'top': boundingBox.top,
    'width': boundingBox.width,
    'height': boundingBox.height,
  };
}

class OcrService {
  final TextRecognizer _textRecognizer = TextRecognizer(script: TextRecognitionScript.latin);

  Future<String?> captureScreen() async {
    final Directory directory = await getTemporaryDirectory();
    final String imagePath = '\${directory.path}/screen_snap_\${DateTime.now().millisecondsSinceEpoch}.png';

    final CapturedData? captured = await ScreenCapturer.instance.capture(
      mode: CaptureMode.screen,
      imagePath: imagePath,
      copyToClipboard: false,
    );

    return captured?.imagePath;
  }

  Future<List<DetectedBlockModel>> extractTextBlocks(String imagePath) async {
    final inputImage = InputImage.fromFilePath(imagePath);
    final RecognizedText recognizedText = await _textRecognizer.processImage(inputImage);

    final List<DetectedBlockModel> blocks = [];

    for (final block in recognizedText.blocks) {
      if (block.text.trim().isNotEmpty) {
        blocks.add(DetectedBlockModel(
          text: block.text.trim(),
          boundingBox: block.boundingBox,
        ));
      }
    }

    return blocks;
  }

  void dispose() {
    _textRecognizer.close();
  }
}`,
  },
  {
    name: 'translate_service.dart',
    path: 'lib/services/translate_service.dart',
    language: 'dart',
    description: 'On-device translation to Arabic using google_mlkit_translation',
    descriptionAr: 'خدمة الترجمة الفورية باستخدام Google ML Kit On-Device Translation',
    content: `import 'package:google_mlkit_translation/google_mlkit_translation.dart';
import 'ocr_service.dart';

class TranslateService {
  late final OnDeviceTranslator _onDeviceTranslator;
  bool _isModelReady = false;

  TranslateService() {
    _onDeviceTranslator = OnDeviceTranslator(
      sourceLanguage: TranslateLanguage.english,
      targetLanguage: TranslateLanguage.arabic,
    );
  }

  Future<void> _prepareModel() async {
    if (_isModelReady) return;
    final modelManager = OnDeviceTranslatorModelManager();
    final bool isDownloaded = await modelManager.isModelDownloaded(TranslateLanguage.arabic.bcpCode);
    if (!isDownloaded) {
      await modelManager.downloadModel(TranslateLanguage.arabic.bcpCode);
    }
    _isModelReady = true;
  }

  Future<List<DetectedBlockModel>> translateAll(List<DetectedBlockModel> blocks) async {
    await _prepareModel();

    for (final block in blocks) {
      try {
        final translated = await _onDeviceTranslator.translateText(block.text);
        block.translatedText = translated;
      } catch (e) {
        block.translatedText = block.text;
      }
    }

    return blocks;
  }

  void dispose() {
    _onDeviceTranslator.close();
  }
}`,
  },
];
