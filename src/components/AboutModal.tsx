import React, { useEffect } from 'react';
import { X, Cloud, Calendar, MapPin, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity duration-200 ${
        isLight ? 'bg-slate-900/40' : 'bg-black/75'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className={`relative w-[92vw] max-w-[460px] max-h-[92vh] overflow-y-auto rounded-[30px] transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-[#FFFFFF] to-[#F5F3FF] border border-indigo-200/70 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.2),0_0_20px_rgba(99,102,241,0.06)]'
            : 'bg-[#080C1D] border border-indigo-500/25 shadow-2xl shadow-indigo-950/90 shadow-[0_25px_60px_-15px_rgba(5,8,22,0.95)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Clean space (24-28px) from edges, prominent contrast in both modes */}
        <button
          type="button"
          className={`absolute top-6 right-6 sm:top-7 sm:right-7 z-20 w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
            isLight
              ? 'bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#1E1B4B] border-[#C4B5FD] active:scale-95'
              : 'bg-[#1E1A4E]/85 hover:bg-[#2D2775] text-white border-indigo-400/40 backdrop-blur-md active:scale-95'
          }`}
          onClick={onClose}
          aria-label="Close About modal"
        >
          <X size={16} strokeWidth={2.4} />
        </button>

        {/* Full-bleed Background Artwork Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* ==============================================================
              DARK THEME SCENIC VECTOR (Exact, Untouched Night Artwork)
              ============================================================== */}
          {!isLight && (
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 460 620"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Deep Indigo -> Purple -> Twilight Magenta Sky */}
                <linearGradient id="nightSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#080B1E" />
                  <stop offset="25%" stopColor="#0E1235" />
                  <stop offset="48%" stopColor="#1E154A" />
                  <stop offset="68%" stopColor="#3C1658" />
                  <stop offset="84%" stopColor="#6C1E62" />
                  <stop offset="94%" stopColor="#9E2E6E" />
                  <stop offset="100%" stopColor="#C94A79" />
                </linearGradient>

                {/* Horizon Sunset Glow */}
                <radialGradient id="nightHorizonGlow" cx="80%" cy="58%" r="48%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.45" />
                  <stop offset="35%" stopColor="#E11D48" stopOpacity="0.28" />
                  <stop offset="70%" stopColor="#881337" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#881337" stopOpacity="0" />
                </radialGradient>

                {/* Multi-layered Warm Radiant Moon Glow */}
                <radialGradient id="nightMoonGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                  <stop offset="28%" stopColor="#F59E0B" stopOpacity="0.48" />
                  <stop offset="55%" stopColor="#FB7185" stopOpacity="0.26" />
                  <stop offset="80%" stopColor="#A855F7" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </radialGradient>

                {/* Luminous Warm Cream Crescent Moon Body */}
                <radialGradient id="nightMoonBody" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFDF7" />
                  <stop offset="55%" stopColor="#FEF3C7" />
                  <stop offset="85%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </radialGradient>

                {/* Mountain Gradients */}
                <linearGradient id="nightMtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#642468" />
                  <stop offset="100%" stopColor="#221442" />
                </linearGradient>
                <linearGradient id="nightMtnMid" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2D1D5A" />
                  <stop offset="100%" stopColor="#121338" />
                </linearGradient>
                <linearGradient id="nightMtnNear" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#181B45" />
                  <stop offset="100%" stopColor="#080C1D" />
                </linearGradient>

                {/* Lake Water Surface Gradient */}
                <linearGradient id="nightLakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E1949" />
                  <stop offset="28%" stopColor="#131538" />
                  <stop offset="70%" stopColor="#0C0E28" />
                  <stop offset="100%" stopColor="#060918" />
                </linearGradient>

                {/* Vertical Moonlit Water Reflection Sheen */}
                <linearGradient id="nightWaterSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.4" />
                  <stop offset="35%" stopColor="#F43F5E" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#381656" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0C0E28" stopOpacity="0" />
                </linearGradient>

                {/* Left-to-Right Text Scrim */}
                <linearGradient id="nightTextScrim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#080C1D" stopOpacity="1" />
                  <stop offset="48%" stopColor="#080C1D" stopOpacity="0.98" />
                  <stop offset="68%" stopColor="#080C1D" stopOpacity="0.75" />
                  <stop offset="85%" stopColor="#080C1D" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#080C1D" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Sky Background */}
              <rect width="460" height="620" fill="url(#nightSkyGrad)" />

              {/* Horizon Sunset Glow */}
              <rect x="150" y="240" width="310" height="170" fill="url(#nightHorizonGlow)" />

              {/* Evening clouds on horizon */}
              <path
                d="M 160 270 Q 220 250 270 265 T 370 238 T 460 252 L 460 350 L 160 350 Z"
                fill="#742A68"
                opacity="0.38"
              />
              <path
                d="M 220 290 Q 280 268 340 280 T 440 258 L 460 275 L 460 370 L 220 370 Z"
                fill="#4A1C5C"
                opacity="0.48"
              />

              {/* Radiant Warm Moon Glow Corona */}
              <circle cx="372" cy="148" r="62" fill="url(#nightMoonGlow)" />
              <circle cx="372" cy="148" r="40" fill="url(#nightMoonGlow)" opacity="0.8" />

              {/* Prominent Crescent Moon */}
              <path
                d="M 378 116 A 32 32 0 1 0 410 148 A 25 25 0 1 1 378 116 Z"
                fill="url(#nightMoonBody)"
              />

              {/* Twinkling Stars */}
              <circle cx="310" cy="90" r="1.3" fill="#FFFFFF" opacity="0.85" />
              <circle cx="340" cy="65" r="1.5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="430" cy="100" r="1.7" fill="#FFFFFF" opacity="0.9" />
              <circle cx="425" cy="195" r="1.4" fill="#FFFFFF" opacity="0.75" />
              <circle cx="325" cy="165" r="1.2" fill="#FFFFFF" opacity="0.55" />
              <circle cx="290" cy="178" r="1.3" fill="#FFFFFF" opacity="0.6" />
              <circle cx="440" cy="155" r="1.5" fill="#FFFFFF" opacity="0.75" />

              {/* Sparkle Star */}
              <path
                d="M 318 126 L 320 130 L 324 132 L 320 134 L 318 138 L 316 134 L 312 132 L 316 130 Z"
                fill="#FFFFFF"
                opacity="0.85"
              />

              {/* Far Mountain */}
              <path
                d="M 170 335 Q 230 260 285 290 T 375 230 T 460 252 L 460 410 L 170 410 Z"
                fill="url(#nightMtnFar)"
              />

              {/* Mid Mountain */}
              <path
                d="M 215 365 Q 275 290 335 320 T 435 265 L 460 285 L 460 435 L 215 435 Z"
                fill="url(#nightMtnMid)"
              />

              {/* Near Mountain Ridge */}
              <path
                d="M 255 410 Q 325 335 395 350 T 460 320 L 460 465 L 255 465 Z"
                fill="url(#nightMtnNear)"
              />

              {/* Calm Lake Water Surface */}
              <rect x="170" y="395" width="290" height="225" fill="url(#nightLakeGrad)" />

              {/* Reflection Sheen Column */}
              <rect x="330" y="395" width="80" height="210" fill="url(#nightWaterSheen)" />

              {/* Lake Moonlight Shimmer Streaks on Water */}
              <g stroke="#FB7185" strokeLinecap="round" strokeOpacity="0.45">
                <line x1="336" y1="414" x2="400" y2="414" strokeWidth="2.8" />
                <line x1="328" y1="432" x2="410" y2="432" strokeWidth="3.6" />
                <line x1="322" y1="452" x2="416" y2="452" strokeWidth="4.2" />
                <line x1="316" y1="474" x2="422" y2="474" strokeWidth="3.8" />
                <line x1="312" y1="502" x2="426" y2="502" strokeWidth="3.4" />
                <line x1="318" y1="532" x2="420" y2="532" strokeWidth="2.8" />
              </g>

              <g stroke="#FEF08A" strokeLinecap="round">
                <line x1="352" y1="405" x2="384" y2="405" strokeWidth="1.8" strokeOpacity="0.65" />
                <line x1="344" y1="412" x2="390" y2="412" strokeWidth="2.2" strokeOpacity="0.8" />
                <line x1="356" y1="419" x2="382" y2="419" strokeWidth="1.6" strokeOpacity="0.55" />
                <line x1="338" y1="426" x2="396" y2="426" strokeWidth="2.5" strokeOpacity="0.85" />
                <line x1="348" y1="434" x2="388" y2="434" strokeWidth="2.0" strokeOpacity="0.7" />
                <line x1="332" y1="443" x2="404" y2="443" strokeWidth="3.0" strokeOpacity="0.9" />
                <line x1="342" y1="452" x2="398" y2="452" strokeWidth="2.2" strokeOpacity="0.75" />
                <line x1="328" y1="462" x2="410" y2="462" strokeWidth="3.2" strokeOpacity="0.85" />
                <line x1="336" y1="473" x2="402" y2="473" strokeWidth="2.4" strokeOpacity="0.65" />
                <line x1="324" y1="485" x2="414" y2="485" strokeWidth="3.0" strokeOpacity="0.8" />
                <line x1="334" y1="498" x2="406" y2="498" strokeWidth="2.2" strokeOpacity="0.6" />
                <line x1="320" y1="512" x2="420" y2="512" strokeWidth="2.8" strokeOpacity="0.7" />
                <line x1="330" y1="527" x2="412" y2="527" strokeWidth="2.0" strokeOpacity="0.5" />
                <line x1="316" y1="543" x2="422" y2="543" strokeWidth="2.5" strokeOpacity="0.55" />
                <line x1="328" y1="561" x2="412" y2="561" strokeWidth="1.8" strokeOpacity="0.4" />
              </g>

              {/* Shoreline & Foothill Pine Trees */}
              <g fill="#070A18">
                <polygon points="255,420 251,435 259,435" />
                <polygon points="263,417 258,437 268,437" />
                <polygon points="272,421 268,439 276,439" />
                <polygon points="283,413 277,440 289,440" />
                <polygon points="293,418 288,440 298,440" />
                <polygon points="320,400 314,427 326,427" />
                <polygon points="332,395 325,430 339,430" />
                <polygon points="345,390 337,433 353,433" />
                <polygon points="360,383 351,435 369,435" />
                <polygon points="380,370 371,445 389,445" />
                <polygon points="395,363 385,455 405,455" />
                <polygon points="413,357 402,465 424,465" />
                <polygon points="431,350 419,475 443,475" />
                <polygon points="450,345 437,485 463,485" />
                <path d="M 245 437 L 460 437 L 460 620 L 245 620 Z" opacity="0.65" />
              </g>

              {/* Left-to-Right Text Scrim */}
              <rect width="460" height="620" fill="url(#nightTextScrim)" />
            </svg>
          )}

          {/* ==============================================================
              LIGHT THEME SCENIC VECTOR (Clean Dedicated Daytime Scene)
              ============================================================== */}
          {isLight && (
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 460 620"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Soft Light Blue to Gentle Lavender Sky */}
                <linearGradient id="daySkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#F8FAFC" />
                  <stop offset="55%" stopColor="#EEF2FF" />
                  <stop offset="78%" stopColor="#E0E7FF" />
                  <stop offset="92%" stopColor="#F5F3FF" />
                  <stop offset="100%" stopColor="#FEF3C7" />
                </linearGradient>

                {/* Soft Morning Sun Glow (Warm Yellow-Orange) */}
                <radialGradient id="daySunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
                  <stop offset="45%" stopColor="#FDE68A" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#FDE68A" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
                </radialGradient>

                {/* Solid Warm Sun Core */}
                <linearGradient id="daySunBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>

                {/* Subtle Daytime Mountain Silhouettes (Soft Periwinkle / Lavender) */}
                <linearGradient id="dayMtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="dayMtnMid" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C7D2FE" />
                  <stop offset="100%" stopColor="#A5B4FC" />
                </linearGradient>
                <linearGradient id="dayMtnNear" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>

                {/* Soft Daytime Lake Water */}
                <linearGradient id="dayLakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E0E7FF" />
                  <stop offset="35%" stopColor="#C7D2FE" />
                  <stop offset="70%" stopColor="#A5B4FC" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>

                {/* Sunlight Water Reflection Sheen */}
                <linearGradient id="dayWaterSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.75" />
                  <stop offset="40%" stopColor="#FEF3C7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0" />
                </linearGradient>

                {/* Solid Pure White Left Scrim: Guarantees 100% Solid Light Backing for Text */}
                <linearGradient id="dayTextScrim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="60%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="76%" stopColor="#FFFFFF" stopOpacity="0.92" />
                  <stop offset="90%" stopColor="#FFFFFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Sky Background */}
              <rect width="460" height="620" fill="url(#daySkyGrad)" />

              {/* Soft Horizon Warmth */}
              <rect x="220" y="270" width="240" height="130" fill="url(#daySunGlow)" opacity="0.5" />

              {/* Soft Warm Sun (Top-right corner, exactly matching position) */}
              <circle cx="372" cy="148" r="54" fill="url(#daySunGlow)" />
              <circle cx="372" cy="148" r="26" fill="url(#daySunBody)" />

              {/* Simple Radiant Sun Rays */}
              <g stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" opacity="0.65">
                <line x1="372" y1="108" x2="372" y2="100" />
                <line x1="372" y1="188" x2="372" y2="196" />
                <line x1="332" y1="148" x2="324" y2="148" />
                <line x1="412" y1="148" x2="420" y2="148" />
                <line x1="344" y1="120" x2="338" y2="114" />
                <line x1="400" y1="176" x2="406" y2="182" />
                <line x1="344" y1="176" x2="338" y2="182" />
                <line x1="400" y1="120" x2="406" y2="114" />
              </g>

              {/* Far Mountain (Soft Lavender - stays strictly in right 40%) */}
              <path
                d="M 270 340 Q 320 280 365 305 T 425 250 T 460 268 L 460 410 L 270 410 Z"
                fill="url(#dayMtnFar)"
                opacity="0.75"
              />

              {/* Mid Mountain (Soft Periwinkle) */}
              <path
                d="M 290 370 Q 340 310 390 330 T 450 280 L 460 295 L 460 435 L 290 435 Z"
                fill="url(#dayMtnMid)"
                opacity="0.8"
              />

              {/* Near Mountain (Gentle Slate-Indigo) */}
              <path
                d="M 315 415 Q 365 355 420 365 T 460 335 L 460 465 L 315 465 Z"
                fill="url(#dayMtnNear)"
                opacity="0.85"
              />

              {/* Calm Lake Water Surface in Lower Right */}
              <rect x="270" y="395" width="190" height="225" fill="url(#dayLakeGrad)" opacity="0.9" />

              {/* Reflection Column */}
              <rect x="340" y="395" width="75" height="210" fill="url(#dayWaterSheen)" />

              {/* Daylight Shimmer Ripples on Lake */}
              <g stroke="#FFFFFF" strokeLinecap="round" strokeOpacity="0.85">
                <line x1="352" y1="412" x2="390" y2="412" strokeWidth="2.2" />
                <line x1="344" y1="426" x2="396" y2="426" strokeWidth="2.5" />
                <line x1="340" y1="443" x2="404" y2="443" strokeWidth="3.0" />
                <line x1="336" y1="462" x2="410" y2="462" strokeWidth="3.2" />
                <line x1="334" y1="485" x2="414" y2="485" strokeWidth="3.0" />
                <line x1="332" y1="512" x2="420" y2="512" strokeWidth="2.8" />
              </g>

              {/* Shoreline Pine Trees in Soft Navy-Indigo - Kept strictly in right area */}
              <g fill="#4338CA" opacity="0.3">
                <polygon points="315,418 310,436 320,436" />
                <polygon points="325,412 319,438 331,438" />
                <polygon points="338,405 331,438 345,438" />
                <polygon points="352,398 344,438 360,438" />
                <polygon points="368,390 359,442 377,442" />
                <polygon points="385,382 375,445 395,445" />
                <polygon points="405,372 394,452 416,452" />
                <polygon points="425,364 413,460 437,460" />
                <polygon points="445,355 432,468 458,468" />
              </g>

              {/* Solid Pure White Scrim Covering the Entire Left 65% of the Card */}
              <rect width="310" height="620" fill="#FFFFFF" opacity="0.96" />
              <rect width="460" height="620" fill="url(#dayTextScrim)" />
            </svg>
          )}
        </div>

        {/* Modal Foreground Content - Generous 28-32px padding on all 4 sides */}
        <div className="relative z-10 p-7 sm:p-8 pb-8 sm:pb-9 flex flex-col no-underline">
          {/* Header Row: Icon Badge on LEFT, Title + Subtitle side by side on RIGHT, Left-Aligned */}
          <div className="flex items-center gap-3.5 pr-12 text-left">
            {/* Gradient Rounded-Square Weather Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25 border border-white/20">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Glowing Sun Rays */}
                <path
                  d="M12 2V4M12 20V22M4 12H2M22 12H20M17.65 6.35L16.24 7.76M7.76 16.24L6.35 17.65M17.65 17.65L16.24 16.24M7.76 7.76L6.35 6.35"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Sun Center */}
                <circle cx="12" cy="12" r="3.5" fill="#FBBF24" />
                {/* Overlaid Cloud */}
                <path
                  d="M17.5 19H7.5C5.01 19 3 16.99 3 14.5C3 12.18 4.75 10.28 7.03 10.03C7.62 7.69 9.73 6 12.25 6C15.17 6 17.57 8.21 17.82 11.08C19.64 11.45 21 13.07 21 15C21 17.21 19.43 19 17.5 19Z"
                  fill="#FFFFFF"
                  stroke="#E0E7FF"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="text-left">
              <h2
                id="about-modal-title"
                className={`text-[20px] font-bold tracking-tight leading-tight text-left no-underline ${
                  isLight ? 'text-[#1E1B2E]' : 'text-white'
                }`}
              >
                About This App
              </h2>
              <p
                className={`text-xs mt-0.5 font-medium text-left no-underline ${
                  isLight ? 'text-[#6366F1]' : 'text-indigo-200/85 font-normal'
                }`}
              >
                SkyCast – Your Weather, Your Day
              </p>
            </div>
          </div>

          {/* Description Paragraph: Left-aligned block of text, 20-24px vertical margin, solid contrast */}
          <p
            className={`text-[12.5px] sm:text-[13px] leading-relaxed mt-5 sm:mt-6 max-w-[340px] text-left font-normal no-underline ${
              isLight ? 'text-[#475569]' : 'text-slate-200/90'
            }`}
          >
            SkyCast is a modern and simple weather application that gives you
            accurate and up-to-date weather forecasts for cities around the
            world. Get real-time weather information, plan your day, and stay
            prepared — always.
          </p>

          {/* Soft divider line before feature list */}
          <div
            className={`my-5 sm:my-6 border-b w-full transition-colors ${
              isLight ? 'border-indigo-100' : 'border-white/10'
            }`}
          />

          {/* 4 Feature Rows: Icon Badge on the LEFT, Title + Description on the RIGHT, Left-Aligned */}
          <div className="space-y-3 text-left">
            {/* Feature 1: Real-time Weather Data */}
            <div
              className={`flex items-center gap-3.5 text-left rounded-2xl transition-all ${
                isLight ? 'bg-white/80 border border-indigo-50/80 p-2.5 -ml-1.5' : 'p-1.5 -ml-1.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isLight
                    ? 'bg-[#EEF2FF] border border-indigo-200/80 text-[#4F46E5] shadow-xs'
                    : 'bg-indigo-950/70 border border-indigo-400/25 text-indigo-300'
                }`}
              >
                <Cloud size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[13.5px] font-semibold leading-tight text-left no-underline ${
                    isLight ? 'text-[#1E1B2E]' : 'text-white'
                  }`}
                >
                  Real-time Weather Data
                </span>
                <span
                  className={`text-[11.5px] leading-snug mt-1 text-left no-underline ${
                    isLight ? 'text-[#475569]' : 'text-slate-400'
                  }`}
                >
                  Live updates from trusted weather APIs.
                </span>
              </div>
            </div>

            {/* Feature 2: 7-Day Forecast */}
            <div
              className={`flex items-center gap-3.5 text-left rounded-2xl transition-all ${
                isLight ? 'bg-white/80 border border-indigo-50/80 p-2.5 -ml-1.5' : 'p-1.5 -ml-1.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isLight
                    ? 'bg-[#F5F3FF] border border-purple-200/80 text-[#7C3AED] shadow-xs'
                    : 'bg-purple-950/70 border border-purple-400/25 text-purple-300'
                }`}
              >
                <Calendar size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[13.5px] font-semibold leading-tight text-left no-underline ${
                    isLight ? 'text-[#1E1B2E]' : 'text-white'
                  }`}
                >
                  7-Day Forecast
                </span>
                <span
                  className={`text-[11.5px] leading-snug mt-1 text-left no-underline ${
                    isLight ? 'text-[#475569]' : 'text-slate-400'
                  }`}
                >
                  Plan ahead with detailed daily forecasts.
                </span>
              </div>
            </div>

            {/* Feature 3: Location Search - Dedicated scrim over mountain backdrop in light mode */}
            <div
              className={`flex items-center gap-3.5 text-left rounded-2xl transition-all ${
                isLight
                  ? 'bg-white/95 border border-indigo-100 shadow-[0_2px_8px_rgba(99,102,241,0.06)] p-2.5 -ml-1.5'
                  : 'p-1.5 -ml-1.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isLight
                    ? 'bg-[#EFF6FF] border border-blue-200/80 text-[#2563EB] shadow-xs'
                    : 'bg-blue-950/70 border border-blue-400/25 text-blue-300'
                }`}
              >
                <MapPin size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[13.5px] font-semibold leading-tight text-left no-underline ${
                    isLight ? 'text-[#1E1B2E]' : 'text-white'
                  }`}
                >
                  Location Search
                </span>
                <span
                  className={`text-[11.5px] leading-snug mt-1 text-left no-underline ${
                    isLight ? 'text-[#475569]' : 'text-slate-400'
                  }`}
                >
                  Find weather by city or use your current location.
                </span>
              </div>
            </div>

            {/* Feature 4: Clean & Modern UI - Dedicated scrim over shoreline tree backdrop in light mode */}
            <div
              className={`flex items-center gap-3.5 text-left rounded-2xl transition-all ${
                isLight
                  ? 'bg-white/95 border border-indigo-100 shadow-[0_2px_8px_rgba(99,102,241,0.06)] p-2.5 -ml-1.5'
                  : 'p-1.5 -ml-1.5'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isLight
                    ? 'bg-[#ECFEFF] border border-cyan-200/80 text-[#0891B2] shadow-xs'
                    : 'bg-cyan-950/70 border border-cyan-400/25 text-cyan-300'
                }`}
              >
                <Sparkles size={18} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col text-left">
                <span
                  className={`text-[13.5px] font-semibold leading-tight text-left no-underline ${
                    isLight ? 'text-[#1E1B2E]' : 'text-white'
                  }`}
                >
                  Clean & Modern UI
                </span>
                <span
                  className={`text-[11.5px] leading-snug mt-1 text-left no-underline ${
                    isLight ? 'text-[#475569]' : 'text-slate-400'
                  }`}
                >
                  A smooth and simple experience.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Pill: Made with Heart for weather lovers - Centered, with at least 24-28px bottom room */}
          <div className="mt-7 sm:mt-8 flex justify-center">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md no-underline transition-colors ${
                isLight
                  ? 'bg-[#F5F3FF] border border-indigo-200/90 text-[#1E1B2E] shadow-sm'
                  : 'bg-[#101535]/90 border border-indigo-400/25 text-indigo-200/90 shadow-md'
              }`}
            >
              <span className="no-underline">Made with</span>
              <Heart
                size={13}
                className={`shrink-0 ${
                  isLight ? 'fill-rose-500 text-rose-500' : 'fill-rose-400 text-rose-400'
                }`}
              />
              <span className="no-underline">for weather lovers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
