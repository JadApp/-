import { CodeFile } from '../types';

export const ANDROID_KOTLIN_FILES: CodeFile[] = [
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Declares required permissions: SYSTEM_ALERT_WINDOW, FOREGROUND_SERVICE_MEDIA_PROJECTION, and services',
    descriptionAr: 'تصريحات الأذونات الأساسية للرسم فوق التطبيقات والتقاط الشاشة وخدمات الخلفية',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.screentranslator.app">

    <!-- Permission to display floating widget over other apps and games -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <!-- Permission for Foreground Service to capture screen via MediaProjection -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />

    <!-- Network permissions for Google Translate API & ML Kit model downloading -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Notification permission for Android 13+ (Tiramisu) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ScreenTranslator"
        tools:targetApi="34">

        <activity
            android:name=".ui.MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ScreenTranslator">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Floating Bubble Overlay Service -->
        <service
            android:name=".service.FloatingBubbleService"
            android:enabled="true"
            android:exported="false" />

        <!-- MediaProjection Screen Capture Foreground Service (Android 14 compliant) -->
        <service
            android:name=".service.ScreenCaptureService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

    </application>
</manifest>`,
  },
  {
    name: 'build.gradle.kts (App Level)',
    path: 'app/build.gradle.kts',
    language: 'groovy',
    description: 'Gradle build script with Google ML Kit OCR and Translation dependencies',
    descriptionAr: 'ملف الاعتماديات الذي يربط مكتبات Google ML Kit للتعرف البصري والترجمة السريعة',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.screentranslator.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.screentranslator.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // AndroidX & Jetpack Compose UI
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.5")

    // Google ML Kit: Text Recognition (Latin / English OCR) - Fast on-device processing
    implementation("com.google.android.gms:play-services-mlkit-text-recognition:19.0.1")

    // Google ML Kit: On-Device Translation (English <-> Arabic)
    implementation("com.google.mlkit:translate:17.0.3")

    // Kotlin Coroutines for async non-blocking OCR & UI rendering
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.8.1")

    // WindowManager & AndroidX Core
    implementation("androidx.core:core-ktx:1.13.1")
}`,
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/screentranslator/app/ui/MainActivity.kt',
    language: 'kotlin',
    description: 'Main UI with Start Service button, overlay permission checker, and MediaProjection token requester',
    descriptionAr: 'واجهة التحكم الرئيسية لطلب أذونات الرسم والتقاط الشاشة وتفعيل الزر العائم',
    content: `package com.screentranslator.app.ui

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.screentranslator.app.service.FloatingBubbleService
import com.screentranslator.app.service.ScreenCaptureService

class MainActivity : ComponentActivity() {

    private lateinit var mediaProjectionManager: MediaProjectionManager
    private var isServiceRunning by mutableStateOf(false)

    // Screen Capture (MediaProjection) launcher
    private val screenCaptureLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            startTranslationServices(result.resultCode, result.data!!)
            isServiceRunning = true
            Toast.makeText(this, "Screen Translator started! Bubble is active.", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Screen capture permission denied", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        mediaProjectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager

        setContent {
            MaterialTheme {
                Scaffold { padding ->
                    MainScreen(
                        modifier = Modifier.padding(padding),
                        isServiceRunning = isServiceRunning,
                        onToggleService = {
                            if (isServiceRunning) {
                                stopTranslationServices()
                                isServiceRunning = false
                            } else {
                                checkPermissionsAndStart()
                            }
                        }
                    )
                }
            }
        }
    }

    private fun checkPermissionsAndStart() {
        // 1. Check Overlay Permission ("Display over other apps")
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
            Toast.makeText(this, "Please grant 'Display over other apps' permission", Toast.LENGTH_LONG).show()
            return
        }

        // 2. Request MediaProjection permission for live screen capture
        val captureIntent = mediaProjectionManager.createScreenCaptureIntent()
        screenCaptureLauncher.launch(captureIntent)
    }

    private fun startTranslationServices(resultCode: Int, data: Intent) {
        // Start MediaProjection Foreground Service
        val captureServiceIntent = Intent(this, ScreenCaptureService::class.java).apply {
            putExtra(ScreenCaptureService.EXTRA_RESULT_CODE, resultCode)
            putExtra(ScreenCaptureService.EXTRA_RESULT_DATA, data)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(captureServiceIntent)
        } else {
            startService(captureServiceIntent)
        }

        // Start Floating Bubble Overlay Service
        val bubbleIntent = Intent(this, FloatingBubbleService::class.java)
        startService(bubbleIntent)
    }

    private fun stopTranslationServices() {
        stopService(Intent(this, FloatingBubbleService::class.java))
        stopService(Intent(this, ScreenCaptureService::class.java))
        Toast.makeText(this, "Screen Translator stopped", Toast.LENGTH_SHORT).show()
    }
}

@Composable
fun MainScreen(
    modifier: Modifier = Modifier,
    isServiceRunning: Boolean,
    onToggleService: () -> Unit
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Screen Translator",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Instant Screen Translation for Games & Apps",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(48.dp))

        Button(
            onClick = onToggleService,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isServiceRunning) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
            ),
            modifier = Modifier
                .fillMaxWidth(0.7f)
                .height(56.dp)
        ) {
            Text(if (isServiceRunning) "Stop Service" else "Start Service")
        }
    }
}`,
  },
  {
    name: 'FloatingBubbleService.kt',
    path: 'app/src/main/java/com/screentranslator/app/service/FloatingBubbleService.kt',
    language: 'kotlin',
    description: 'Creates draggable floating widget over other apps and handles tap triggers',
    descriptionAr: 'خدمة الويدجت العائم القابل للسحب والتحريك فوق شاشات الألعاب والتطبيقات',
    content: `package com.screentranslator.app.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import com.screentranslator.app.R

class FloatingBubbleService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private lateinit var layoutParams: WindowManager.LayoutParams

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        // Inflate floating bubble widget layout
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_bubble, null)

        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 100
            y = 300
        }

        windowManager.addView(floatingView, layoutParams)
        setupDragAndClickListener()
    }

    private fun setupDragAndClickListener() {
        val bubbleIcon = floatingView.findViewById<ImageView>(R.id.bubble_icon)

        bubbleIcon.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var initialTouchX = 0f
            private var initialTouchY = 0f
            private var isDragging = false

            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = layoutParams.x
                        initialY = layoutParams.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        isDragging = false
                        return true
                    }
                    MotionEvent.ACTION_MOVE -> {
                        val dx = (event.rawX - initialTouchX).toInt()
                        val dy = (event.rawY - initialTouchY).toInt()

                        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                            isDragging = true
                            layoutParams.x = initialX + dx
                            layoutParams.y = initialY + dy
                            windowManager.updateViewLayout(floatingView, layoutParams)
                        }
                        return true
                    }
                    MotionEvent.ACTION_UP -> {
                        if (!isDragging) {
                            // User tapped the bubble -> Trigger Screen Capture & Translation!
                            triggerScreenTranslation()
                        }
                        return true
                    }
                }
                return false
            }
        })
    }

    private fun triggerScreenTranslation() {
        // Send Broadcast to ScreenCaptureService to take screenshot & run ML Kit OCR
        val intent = Intent(ScreenCaptureService.ACTION_CAPTURE_AND_TRANSLATE)
        sendBroadcast(intent)
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::floatingView.isInitialized) {
            windowManager.removeView(floatingView)
        }
    }
}`,
  },
  {
    name: 'ScreenCaptureService.kt',
    path: 'app/src/main/java/com/screentranslator/app/service/ScreenCaptureService.kt',
    language: 'kotlin',
    description: 'Handles VirtualDisplay, ImageReader, PixelCopy screenshot capture and triggers OCR',
    descriptionAr: 'خدمة التقاط صورة الشاشة الفورية باستخدام MediaProjection وImageReader وتحويلها لـ Bitmap',
    content: `package com.screentranslator.app.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.IBinder
import android.util.DisplayMetrics
import android.view.WindowManager
import androidx.core.app.NotificationCompat
import com.screentranslator.app.ml.MlKitOcrHelper
import com.screentranslator.app.ml.TranslationHelper
import com.screentranslator.app.ui.OverlayTranslationView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ScreenCaptureService : Service() {

    companion object {
        const val EXTRA_RESULT_CODE = "EXTRA_RESULT_CODE"
        const val EXTRA_RESULT_DATA = "EXTRA_RESULT_DATA"
        const val ACTION_CAPTURE_AND_TRANSLATE = "com.screentranslator.app.ACTION_CAPTURE"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "ScreenTranslatorChannel"
    }

    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var imageReader: ImageReader? = null
    private var screenWidth = 1080
    private var screenHeight = 2400
    private var screenDensity = 420

    private val ocrHelper = MlKitOcrHelper()
    private val translationHelper = TranslationHelper()
    private val scope = CoroutineScope(Dispatchers.Default)

    private val captureReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == ACTION_CAPTURE_AND_TRANSLATE) {
                captureAndProcessScreen()
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(NOTIFICATION_ID, createNotification())

        val resultCode = intent?.getIntExtra(EXTRA_RESULT_CODE, 0) ?: 0
        val resultData = intent?.getParcelableExtra<Intent>(EXTRA_RESULT_DATA)

        if (resultCode != 0 && resultData != null) {
            val projectionManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            mediaProjection = projectionManager.getMediaProjection(resultCode, resultData)
            setupVirtualDisplay()
        }

        registerReceiver(captureReceiver, IntentFilter(ACTION_CAPTURE_AND_TRANSLATE), RECEIVER_NOT_EXPORTED)
        return START_STICKY
    }

    private fun setupVirtualDisplay() {
        val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val metrics = DisplayMetrics()
        windowManager.defaultDisplay.getRealMetrics(metrics)

        screenWidth = metrics.widthPixels
        screenHeight = metrics.heightPixels
        screenDensity = metrics.densityDpi

        imageReader = ImageReader.newInstance(screenWidth, screenHeight, PixelFormat.RGBA_8888, 2)
        virtualDisplay = mediaProjection?.createVirtualDisplay(
            "ScreenTranslatorCapture",
            screenWidth,
            screenHeight,
            screenDensity,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            imageReader?.surface,
            null,
            null
        )
    }

    private fun captureAndProcessScreen() {
        scope.launch {
            val image = imageReader?.acquireLatestImage() ?: return@launch
            val planes = image.planes
            val buffer = planes[0].buffer
            val pixelStride = planes[0].pixelStride
            val rowStride = planes[0].rowStride
            val rowPadding = rowStride - pixelStride * screenWidth

            val bitmap = Bitmap.createBitmap(
                screenWidth + rowPadding / pixelStride,
                screenHeight,
                Bitmap.Config.ARGB_8888
            )
            bitmap.copyPixelsFromBuffer(buffer)
            image.close()

            // 1. Run Google ML Kit OCR to recognize text blocks and coordinates
            val textBlocks = ocrHelper.recognizeText(bitmap)

            // 2. Translate extracted English text into Arabic
            val translatedBlocks = translationHelper.translateBlocks(textBlocks)

            // 3. Render In-Place Overlay on UI thread
            withContext(Dispatchers.Main) {
                OverlayTranslationView.show(applicationContext, translatedBlocks)
            }
        }
    }

    private fun createNotification(): Notification {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Screen Translator Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Screen Translator is Active")
            .setContentText("Tap the floating bubble to translate screen text")
            .setSmallIcon(android.R.drawable.ic_menu_search)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(captureReceiver)
        virtualDisplay?.release()
        imageReader?.close()
        mediaProjection?.stop()
    }
}`,
  },
  {
    name: 'MlKitOcrHelper.kt',
    path: 'app/src/main/java/com/screentranslator/app/ml/MlKitOcrHelper.kt',
    language: 'kotlin',
    description: 'Fast on-device text recognition using Google ML Kit TextRecognition client',
    descriptionAr: 'معالج التعرف الضوئي على النصوص OCR باستخدام Google ML Kit باستخراج المستطيلات والنصوص',
    content: `package com.screentranslator.app.ml

import android.graphics.Bitmap
import android.graphics.Rect
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.tasks.await

data class RecognizedBlock(
    val id: String,
    val text: String,
    val boundingBox: Rect,
    var translatedText: String = ""
)

class MlKitOcrHelper {

    // Latin / English on-device recognizer (ultra-fast, zero internet required)
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    suspend fun recognizeText(bitmap: Bitmap): List<RecognizedBlock> {
        val inputImage = InputImage.fromBitmap(bitmap, 0)
        val visionText: Text = recognizer.process(inputImage).await()

        val recognizedList = mutableListOf<RecognizedBlock>()

        for ((index, block) in visionText.textBlocks.withIndex()) {
            val box = block.boundingBox ?: continue
            val cleanText = block.text.trim()
            if (cleanText.isNotEmpty()) {
                recognizedList.add(
                    RecognizedBlock(
                        id = "block_\${index}_\${System.currentTimeMillis()}",
                        text = cleanText,
                        boundingBox = box
                    )
                )
            }
        }
        return recognizedList
    }
}`,
  },
  {
    name: 'TranslationHelper.kt',
    path: 'app/src/main/java/com/screentranslator/app/ml/TranslationHelper.kt',
    language: 'kotlin',
    description: 'Google ML Kit On-Device Translation into Arabic (or Cloud Translate fallback)',
    descriptionAr: 'محرك الترجمة الفورية إلى اللغة العربية باستخدام ML Kit On-Device Translate في وضع عدم الاتصال',
    content: `package com.screentranslator.app.ml

import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.Translator
import com.google.mlkit.nl.translate.TranslatorOptions
import kotlinx.coroutines.tasks.await

class TranslationHelper {

    private val options = TranslatorOptions.Builder()
        .setSourceLanguage(TranslateLanguage.ENGLISH)
        .setTargetLanguage(TranslateLanguage.ARABIC)
        .build()

    private val translator: Translator = Translation.getClient(options)
    private var isModelDownloaded = false

    suspend fun translateBlocks(blocks: List<RecognizedBlock>): List<RecognizedBlock> {
        ensureModelDownloaded()

        return blocks.map { block ->
            try {
                val arabic = translator.translate(block.text).await()
                block.copy(translatedText = arabic)
            } catch (e: Exception) {
                block.copy(translatedText = block.text)
            }
        }
    }

    private suspend fun ensureModelDownloaded() {
        if (!isModelDownloaded) {
            val conditions = DownloadConditions.Builder()
                .requireWifi()
                .build()
            translator.downloadModelIfNeeded(conditions).await()
            isModelDownloaded = true
        }
    }

    fun close() {
        translator.close()
    }
}`,
  },
  {
    name: 'OverlayTranslationView.kt',
    path: 'app/src/main/java/com/screentranslator/app/ui/OverlayTranslationView.kt',
    language: 'kotlin',
    description: 'WindowManager full-screen overlay drawing translated Arabic text directly over original coordinates',
    descriptionAr: 'واجهة عرض الشاشة الكاملة لرسم الترجمة العربية في نفس مكان النص الأصلي (In-place Replacement)',
    content: `package com.screentranslator.app.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Typeface
import android.os.Build
import android.view.View
import android.view.WindowManager
import com.screentranslator.app.ml.RecognizedBlock

class OverlayTranslationView(context: Context, private val blocks: List<RecognizedBlock>) : View(context) {

    private val bgPaint = Paint().apply {
        color = Color.parseColor("#E60F172A") // Deep slate semi-opaque
        style = Paint.Style.FILL
    }

    private val textPaint = Paint().apply {
        color = Color.WHITE
        isAntiAlias = true
        typeface = Typeface.DEFAULT_BOLD
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        for (block in blocks) {
            val rect = block.boundingBox
            val roundRect = RectF(
                rect.left.toFloat() - 8,
                rect.top.toFloat() - 4,
                rect.right.toFloat() + 8,
                rect.bottom.toFloat() + 4
            )

            // Draw replacement background over original text
            canvas.drawRoundRect(roundRect, 8f, 8f, bgPaint)

            // Auto-scale font size to fit inside original bounding box
            val availableHeight = rect.height().toFloat()
            textPaint.textSize = (availableHeight * 0.65f).coerceIn(24f, 48f)

            // Draw Arabic translated text
            val textX = roundRect.right - 12 // RTL alignment
            val textY = roundRect.centerY() + (textPaint.textSize / 3)
            canvas.drawText(block.translatedText, textX, textY, textPaint)
        }
    }

    companion object {
        private var currentOverlay: OverlayTranslationView? = null

        fun show(context: Context, blocks: List<RecognizedBlock>) {
            val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
            dismiss(context)

            val overlay = OverlayTranslationView(context, blocks)
            val params = WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                else
                    WindowManager.LayoutParams.TYPE_PHONE,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
            )

            // Dismiss overlay on tap
            overlay.setOnClickListener {
                dismiss(context)
            }

            wm.addView(overlay, params)
            currentOverlay = overlay
        }

        fun dismiss(context: Context) {
            currentOverlay?.let {
                val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
                wm.removeView(it)
                currentOverlay = null
            }
        }
    }
}`,
  },
];
