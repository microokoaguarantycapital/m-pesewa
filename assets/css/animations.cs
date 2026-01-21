/* assets/css/animations.css */

/* ===== FADE ANIMATIONS ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.fade-out {
    animation: fadeOut 0.3s ease-out;
}

/* ===== SLIDE ANIMATIONS ===== */
@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.slide-in-up {
    animation: slideInUp 0.3s ease-out;
}

@keyframes slideInDown {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.slide-in-down {
    animation: slideInDown 0.3s ease-out;
}

@keyframes slideInLeft {
    from {
        transform: translateX(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in-left {
    animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        transform: translateX(20px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in-right {
    animation: slideInRight 0.3s ease-out;
}

/* ===== BOUNCE ANIMATIONS ===== */
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
}

.bounce {
    animation: bounce 2s infinite;
}

/* ===== PULSE ANIMATIONS ===== */
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.pulse {
    animation: pulse 2s infinite;
}

/* ===== SHAKE ANIMATIONS ===== */
@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
        transform: translateX(-5px);
    }
    20%, 40%, 60%, 80% {
        transform: translateX(5px);
    }
}

.shake {
    animation: shake 0.5s ease-in-out;
}

/* ===== ROTATE ANIMATIONS ===== */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.rotate {
    animation: rotate 2s linear infinite;
}

/* ===== FLOATING ANIMATIONS ===== */
@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    25% {
        transform: translateY(-10px) rotate(1deg);
    }
    50% {
        transform: translateY(-5px) rotate(-1deg);
    }
    75% {
        transform: translateY(-8px) rotate(0.5deg);
    }
}

.float {
    animation: float 6s ease-in-out infinite;
}

/* ===== CATEGORY CARD FLOATING VARIATIONS ===== */
.float-delay-1 {
    animation-delay: 0.2s;
}

.float-delay-2 {
    animation-delay: 0.4s;
}

.float-delay-3 {
    animation-delay: 0.6s;
}

.float-delay-4 {
    animation-delay: 0.8s;
}

.float-delay-5 {
    animation-delay: 1s;
}

/* ===== MARQUEE ANIMATIONS ===== */
@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.marquee {
    animation: marquee 30s linear infinite;
}

@keyframes marqueeSlow {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-25%);
    }
}

.marquee-slow {
    animation: marqueeSlow 60s linear infinite;
}

/* ===== TYPEWRITER EFFECT ===== */
@keyframes typewriter {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}

.typewriter {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 3s steps(40) 1s 1 normal both;
}

/* ===== BLINKING CURSOR ===== */
@keyframes blink {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

.blink {
    animation: blink 1s infinite;
}

/* ===== ZOOM ANIMATIONS ===== */
@keyframes zoomIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.zoom-in {
    animation: zoomIn 0.3s ease-out;
}

@keyframes zoomOut {
    from {
        transform: scale(1);
        opacity: 1;
    }
    to {
        transform: scale(0.9);
        opacity: 0;
    }
}

.zoom-out {
    animation: zoomOut 0.3s ease-in;
}

/* ===== FLIP ANIMATIONS ===== */
@keyframes flip {
    0% {
        transform: perspective(400px) rotateY(0);
    }
    50% {
        transform: perspective(400px) rotateY(180deg);
    }
    100% {
        transform: perspective(400px) rotateY(360deg);
    }
}

.flip {
    animation: flip 2s infinite;
    backface-visibility: visible;
}

/* ===== LOADING BAR ANIMATION ===== */
@keyframes loadingBar {
    0% {
        width: 0;
        left: 0;
    }
    50% {
        width: 100%;
        left: 0;
    }
    100% {
        width: 0;
        left: 100%;
    }
}

.loading-bar {
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--primary-purple), transparent);
    animation: loadingBar 2s ease-in-out infinite;
}

/* ===== WAVE ANIMATION ===== */
@keyframes wave {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-15px);
    }
}

.wave {
    display: inline-block;
    animation: wave 1.5s ease-in-out infinite;
}

.wave-delay-1 {
    animation-delay: 0.1s;
}

.wave-delay-2 {
    animation-delay: 0.2s;
}

.wave-delay-3 {
    animation-delay: 0.3s;
}

.wave-delay-4 {
    animation-delay: 0.4s;
}

/* ===== GLOW ANIMATION ===== */
@keyframes glow {
    0%, 100% {
        box-shadow: 0 0 5px var(--primary-purple);
    }
    50% {
        box-shadow: 0 0 20px var(--primary-purple), 0 0 30px var(--primary-purple);
    }
}

.glow {
    animation: glow 2s infinite;
}

/* ===== HEARTBEAT ANIMATION ===== */
@keyframes heartbeat {
    0% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.1);
    }
    50% {
        transform: scale(1);
    }
    75% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.heartbeat {
    animation: heartbeat 1.5s infinite;
}

/* ===== PAGE TRANSITIONS ===== */
.page-enter {
    opacity: 0;
    transform: translateY(20px);
}

.page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
}

.page-exit {
    opacity: 1;
    transform: translateY(0);
}

.page-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 300ms, transform 300ms;
}

/* ===== STAGGERED CHILDREN ANIMATION ===== */
.stagger-children > * {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.5s; }
.stagger-children > *:nth-child(6) { animation-delay: 0.6s; }
.stagger-children > *:nth-child(7) { animation-delay: 0.7s; }
.stagger-children > *:nth-child(8) { animation-delay: 0.8s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== HOVER EFFECTS ===== */
.hover-lift {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.hover-glow {
    transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
    box-shadow: 0 0 15px rgba(43, 29, 79, 0.3);
}

.hover-scale {
    transition: transform 0.2s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}

/* ===== TEXT ANIMATIONS ===== */
@keyframes textShine {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}

.text-gradient {
    background: linear-gradient(
        90deg,
        var(--primary-purple),
        var(--primary-purple-light),
        var(--primary-gold),
        var(--primary-purple)
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textShine 3s linear infinite;
}

/* ===== REVEAL ANIMATIONS ===== */
.reveal {
    position: relative;
    overflow: hidden;
}

.reveal::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--primary-purple);
    transform: translateX(-100%);
    animation: reveal 1s ease-out forwards;
}

@keyframes reveal {
    to {
        transform: translateX(100%);
    }
}

/* ===== PAGE LOAD ANIMATION ===== */
.page-load {
    animation: pageLoad 0.6s ease-out;
}

@keyframes pageLoad {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== SCROLL ANIMATIONS (Intersection Observer triggered) ===== */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
}

.fade-in-left {
    transform: translateX(-30px);
}

.fade-in-right {
    transform: translateX(30px);
}

.fade-in-up {
    transform: translateY(30px);
}

.fade-in-down {
    transform: translateY(-30px);
}

/* ===== BUTTON PRESS ANIMATION ===== */
@keyframes buttonPress {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
    }
}

.button-press:active {
    animation: buttonPress 0.2s ease;
}

/* ===== NOTIFICATION ENTER/EXIT ===== */
@keyframes notificationEnter {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes notificationExit {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-enter {
    animation: notificationEnter 0.3s ease forwards;
}

.notification-exit {
    animation: notificationExit 0.3s ease forwards;
}

/* ===== RIPPLE EFFECT ===== */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.ripple {
    position: relative;
    overflow: hidden;
}

.ripple::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.6);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
}

.ripple:focus:not(:active)::after {
    animation: ripple 1s ease-out;
}

/* ===== SPINNER VARIATIONS ===== */
.spinner-fast {
    animation: spin 0.5s linear infinite;
}

.spinner-slow {
    animation: spin 2s linear infinite;
}

.spinner-reverse {
    animation: spin 1s linear infinite reverse;
}

/* ===== BOUNCE VARIATIONS ===== */
.bounce-slow {
    animation: bounce 3s infinite;
}

.bounce-fast {
    animation: bounce 1s infinite;
}

/* ===== FLOAT VARIATIONS ===== */
.float-slow {
    animation: float 8s ease-in-out infinite;
}

.float-fast {
    animation: float 4s ease-in-out infinite;
}

/* ===== PULSE VARIATIONS ===== */
.pulse-slow {
    animation: pulse 3s infinite;
}

.pulse-fast {
    animation: pulse 1s infinite;
}

/* ===== SLIDE VARIATIONS ===== */
.slide-in-up-fast {
    animation: slideInUp 0.2s ease-out;
}

.slide-in-up-slow {
    animation: slideInUp 0.6s ease-out;
}

/* ===== FADE VARIATIONS ===== */
.fade-in-fast {
    animation: fadeIn 0.1s ease-in;
}

.fade-in-slow {
    animation: fadeIn 0.6s ease-in;
}

/* ===== LOADING SKELETON ===== */
@keyframes skeleton-loading {
    0% {
        background-color: var(--neutral-light);
    }
    50% {
        background-color: #e0e0e0;
    }
    100% {
        background-color: var(--neutral-light);
    }
}

.skeleton {
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-md);
}

.skeleton-text {
    height: 1em;
    margin-bottom: var(--spacing-xs);
}

.skeleton-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

/* ===== COUNTER ANIMATION ===== */
@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.count-up {
    animation: countUp 0.5s ease-out;
}

/* ===== CHECKMARK ANIMATION ===== */
@keyframes checkmark {
    0% {
        stroke-dashoffset: 100;
        opacity: 0;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}

.checkmark {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: checkmark 0.5s ease-out forwards;
}

/* ===== X MARK ANIMATION ===== */
@keyframes xmark {
    0% {
        stroke-dashoffset: 100;
        opacity: 0;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}

.xmark {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: xmark 0.5s ease-out forwards;
}

/* ===== FLASH ANIMATION ===== */
@keyframes flash {
    0%, 50%, 100% {
        opacity: 1;
    }
    25%, 75% {
        opacity: 0.5;
    }
}

.flash {
    animation: flash 2s infinite;
}

/* ===== JELLO ANIMATION ===== */
@keyframes jello {
    0%, 11.1%, 100% {
        transform: translate3d(0, 0, 0);
    }
    22.2% {
        transform: skewX(-12.5deg) skewY(-12.5deg);
    }
    33.3% {
        transform: skewX(6.25deg) skewY(6.25deg);
    }
    44.4% {
        transform: skewX(-3.125deg) skewY(-3.125deg);
    }
    55.5% {
        transform: skewX(1.5625deg) skewY(1.5625deg);
    }
    66.6% {
        transform: skewX(-0.78125deg) skewY(-0.78125deg);
    }
    77.7% {
        transform: skewX(0.390625deg) skewY(0.390625deg);
    }
    88.8% {
        transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
    }
}

.jello {
    animation: jello 1s infinite;
}

/* ===== TADA ANIMATION ===== */
@keyframes tada {
    0% {
        transform: scale(1);
    }
    10%, 20% {
        transform: scale(0.9) rotate(-3deg);
    }
    30%, 50%, 70%, 90% {
        transform: scale(1.1) rotate(3deg);
    }
    40%, 60%, 80% {
        transform: scale(1.1) rotate(-3deg);
    }
    100% {
        transform: scale(1) rotate(0);
    }
}

.tada {
    animation: tada 1s;
}

/* ===== WOBBLE ANIMATION ===== */
@keyframes wobble {
    0%, 100% {
        transform: translateX(0%);
    }
    15% {
        transform: translateX(-25%) rotate(-5deg);
    }
    30% {
        transform: translateX(20%) rotate(3deg);
    }
    45% {
        transform: translateX(-15%) rotate(-3deg);
    }
    60% {
        transform: translateX(10%) rotate(2deg);
    }
    75% {
        transform: translateX(-5%) rotate(-1deg);
    }
}

.wobble {
    animation: wobble 1s;
}

/* ===== FLIP IN X ===== */
@keyframes flipInX {
    0% {
        transform: perspective(400px) rotateX(90deg);
        opacity: 0;
    }
    40% {
        transform: perspective(400px) rotateX(-10deg);
    }
    70% {
        transform: perspective(400px) rotateX(10deg);
    }
    100% {
        transform: perspective(400px) rotateX(0deg);
        opacity: 1;
    }
}

.flip-in-x {
    animation: flipInX 0.6s ease-out;
}

/* ===== FLIP IN Y ===== */
@keyframes flipInY {
    0% {
        transform: perspective(400px) rotateY(90deg);
        opacity: 0;
    }
    40% {
        transform: perspective(400px) rotateY(-10deg);
    }
    70% {
        transform: perspective(400px) rotateY(10deg);
    }
    100% {
        transform: perspective(400px) rotateY(0deg);
        opacity: 1;
    }
}

.flip-in-y {
    animation: flipInY 0.6s ease-out;
}

/* ===== LIGHTSPEED IN ===== */
@keyframes lightSpeedIn {
    0% {
        transform: translateX(100%) skewX(-30deg);
        opacity: 0;
    }
    60% {
        transform: translateX(-20%) skewX(30deg);
        opacity: 1;
    }
    80% {
        transform: translateX(0%) skewX(-15deg);
        opacity: 1;
    }
    100% {
        transform: translateX(0%) skewX(0deg);
        opacity: 1;
    }
}

.light-speed-in {
    animation: lightSpeedIn 0.5s ease-out;
}

/* ===== ROLL IN ===== */
@keyframes rollIn {
    0% {
        opacity: 0;
        transform: translateX(-100%) rotate(-120deg);
    }
    100% {
        opacity: 1;
        transform: translateX(0px) rotate(0deg);
    }
}

.roll-in {
    animation: rollIn 0.6s;
}

/* ===== RUBBER BAND ===== */
@keyframes rubberBand {
    0% {
        transform: scale(1);
    }
    30% {
        transform: scaleX(1.25) scaleY(0.75);
    }
    40% {
        transform: scaleX(0.75) scaleY(1.25);
    }
    50% {
        transform: scaleX(1.15) scaleY(0.85);
    }
    65% {
        transform: scaleX(0.95) scaleY(1.05);
    }
    75% {
        transform: scaleX(1.05) scaleY(0.95);
    }
    100% {
        transform: scale(1);
    }
}

.rubber-band {
    animation: rubberBand 1s;
}

/* ===== SWING ===== */
@keyframes swing {
    20% {
        transform: rotate(15deg);
    }
    40% {
        transform: rotate(-10deg);
    }
    60% {
        transform: rotate(5deg);
    }
    80% {
        transform: rotate(-5deg);
    }
    100% {
        transform: rotate(0deg);
    }
}

.swing {
    transform-origin: top center;
    animation: swing 1s;
}

/* ===== ZOOM IN DOWN ===== */
@keyframes zoomInDown {
    0% {
        opacity: 0;
        transform: scale(0.1) translateY(-1000px);
        animation-timing-function: ease-in-out;
    }
    60% {
        opacity: 1;
        transform: scale(0.475) translateY(60px);
        animation-timing-function: ease-out;
    }
}

.zoom-in-down {
    animation: zoomInDown 0.6s;
}

/* ===== SLIDE OUT UP ===== */
@keyframes slideOutUp {
    0% {
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px);
    }
}

.slide-out-up {
    animation: slideOutUp 0.3s ease-out;
}

/* ===== SLIDE OUT DOWN ===== */
@keyframes slideOutDown {
    0% {
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(100px);
    }
}

.slide-out-down {
    animation: slideOutDown 0.3s ease-out;
}

/* ===== SLIDE OUT LEFT ===== */
@keyframes slideOutLeft {
    0% {
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-100px);
    }
}

.slide-out-left {
    animation: slideOutLeft 0.3s ease-out;
}

/* ===== SLIDE OUT RIGHT ===== */
@keyframes slideOutRight {
    0% {
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(100px);
    }
}

.slide-out-right {
    animation: slideOutRight 0.3s ease-out;
}

/* ===== ZOOM OUT ===== */
@keyframes zoomOut {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0;
        transform: scale(0.3);
    }
    100% {
        opacity: 0;
    }
}

.zoom-out {
    animation: zoomOut 0.3s ease-in;
}

/* ===== FLIP OUT X ===== */
@keyframes flipOutX {
    0% {
        transform: perspective(400px) rotateX(0deg);
        opacity: 1;
    }
    100% {
        transform: perspective(400px) rotateX(90deg);
        opacity: 0;
    }
}

.flip-out-x {
    animation: flipOutX 0.3s ease-in;
}

/* ===== FLIP OUT Y ===== */
@keyframes flipOutY {
    0% {
        transform: perspective(400px) rotateY(0deg);
        opacity: 1;
    }
    100% {
        transform: perspective(400px) rotateY(90deg);
        opacity: 0;
    }
}

.flip-out-y {
    animation: flipOutY 0.3s ease-in;
}

/* ===== HINGE ===== */
@keyframes hinge {
    0% {
        transform: rotate(0);
        transform-origin: top left;
        animation-timing-function: ease-in-out;
    }
    20%, 60% {
        transform: rotate(80deg);
        transform-origin: top left;
        animation-timing-function: ease-in-out;
    }
    40% {
        transform: rotate(60deg);
        transform-origin: top left;
        animation-timing-function: ease-in-out;
    }
    80% {
        transform: rotate(60deg) translateY(0);
        transform-origin: top left;
        animation-timing-function: ease-in-out;
    }
    100% {
        transform: translateY(700px);
    }
}

.hinge {
    animation: hinge 2s;
}

/* ===== JACK IN THE BOX ===== */
@keyframes jackInTheBox {
    0% {
        opacity: 0;
        transform: scale(0.1) rotate(30deg);
        transform-origin: center bottom;
    }
    50% {
        transform: rotate(-10deg);
    }
    70% {
        transform: rotate(3deg);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.jack-in-the-box {
    animation: jackInTheBox 0.6s ease-out;
}

/* ===== ROLL OUT ===== */
@keyframes rollOut {
    0% {
        opacity: 1;
        transform: translateX(0px) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translateX(100%) rotate(120deg);
    }
}

.roll-out {
    animation: rollOut 0.6s;
}