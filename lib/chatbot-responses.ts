import type { AnalysisResult, EmotionData } from "@/app/page"

export function generateEmpatheticResponse(analysis: AnalysisResult, emotions: EmotionData): string {
  const { dominantEmotion, classification, stabilityIndex } = analysis

  const empathyResponses = {
    Joy: [
      "I can sense the joy radiating from your emotional state! It's wonderful to see you experiencing such positive energy. This brightness you're feeling is a beautiful part of the human experience.",
      "Your joy is truly uplifting! The mathematical analysis shows this positive emotion is dominant in your emotional landscape right now. Embrace this feeling - it's a gift.",
    ],
    Sadness: [
      "I can feel the weight of sadness in your emotional profile. It's completely natural to experience these deeper emotions - they're part of what makes us human. You're not alone in feeling this way.",
      "The sadness you're experiencing is valid and important. Sometimes our hearts need to process difficult feelings. Be gentle with yourself during this time.",
    ],
    Anger: [
      "I can sense the intensity of anger in your emotional state. These feelings are completely valid - anger often signals that something important to you needs attention. It's okay to feel this way.",
      "Your anger is coming through clearly in the analysis. This emotion, while intense, can be a powerful signal that boundaries have been crossed or values challenged. You have every right to feel this.",
    ],
    Fear: [
      "I can detect the fear present in your emotional landscape. Fear can feel overwhelming, but it's also your mind's way of trying to protect you. You're brave for acknowledging these feelings.",
      "The fear you're experiencing is showing up strongly in your emotional geometry. Remember that feeling afraid doesn't make you weak - it makes you human. You have the strength to work through this.",
    ],
    Surprise: [
      "I can sense the element of surprise in your emotional state! Life has a way of catching us off guard, doesn't it? This unexpected feeling can be both exciting and unsettling.",
      "The surprise in your emotional profile suggests you're processing something unexpected. These moments of surprise often lead to growth and new perspectives.",
    ],
    Disgust: [
      "I can feel the disgust present in your emotional analysis. This emotion often arises when our values or boundaries are violated. It's your inner compass telling you something isn't right.",
      "The disgust you're experiencing is a protective emotion - it helps you identify what doesn't align with your values. Trust this feeling; it's guiding you toward what feels authentic.",
    ],
  }

  const stabilityComments = {
    Stable: "Your emotional stability is quite good right now, which gives you a solid foundation to work from.",
    Unstable:
      "I notice some emotional fluctuation in your state. This is completely normal - emotions naturally ebb and flow.",
    Volatile:
      "Your emotions are quite intense right now. During times like these, it's especially important to be patient and kind with yourself.",
  }

  const responses = empathyResponses[dominantEmotion as keyof typeof empathyResponses] || [
    "I can sense the complexity of your emotional state right now. Every feeling you're experiencing is valid and important.",
  ]

  const empathyResponse = responses[Math.floor(Math.random() * responses.length)]
  const stabilityComment = stabilityComments[classification as keyof typeof stabilityComments]

  return `${empathyResponse} ${stabilityComment} Remember, I'm here to support you through whatever you're feeling.`
}

export function generateAdvice(analysis: AnalysisResult, emotions: EmotionData): string {
  const { dominantEmotion, classification, stabilityIndex, biometricFlags } = analysis

  const adviceMap = {
    Joy: [
      "Since joy is your dominant emotion, this is a wonderful time to share your positive energy with others or engage in activities that amplify this feeling. Consider expressing gratitude, spending time with loved ones, or pursuing creative endeavors.",
      "Your joyful state is a gift! Use this positive energy to tackle challenges you've been putting off, or to strengthen relationships. Joy is contagious - spread it around!",
    ],
    Sadness: [
      "When sadness is prominent, it's important to honor these feelings rather than push them away. Consider gentle activities like journaling, listening to music, or talking with a trusted friend. Sometimes sadness needs to be felt to be healed.",
      "Allow yourself to process this sadness fully. Engage in self-care activities like taking a warm bath, going for a quiet walk in nature, or practicing mindfulness. Reach out to supportive people in your life.",
    ],
    Anger: [
      "Channel your anger constructively by identifying what triggered it and what needs to change. Physical exercise, deep breathing, or writing about your feelings can help process this intensity. Consider what boundaries might need to be set.",
      "Use this anger as fuel for positive change. Try vigorous exercise, creative expression, or advocacy for causes you care about. The key is transforming this energy into something productive rather than destructive.",
    ],
    Fear: [
      "When fear is dominant, grounding techniques can be very helpful. Try the 5-4-3-2-1 method: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Break overwhelming situations into smaller, manageable steps.",
      "Address fear by gathering information about what's worrying you and creating a plan. Practice relaxation techniques like deep breathing or progressive muscle relaxation. Remember that courage isn't the absence of fear - it's acting despite it.",
    ],
    Surprise: [
      "Surprise can be disorienting, so give yourself time to process unexpected changes. Reflect on what this surprise might teach you or how it might open new opportunities. Stay curious rather than immediately judging the situation.",
      "Use this surprise as a chance to practice adaptability. Take some time to sit with the unexpected feelings, then consider how you might embrace or learn from this new situation.",
    ],
    Disgust: [
      "When disgust is prominent, it's often signaling a values conflict. Reflect on what specifically is triggering this feeling and consider what changes might align better with your authentic self. This emotion can guide you toward better choices.",
      "Trust your disgust as a moral compass. It might be time to distance yourself from situations or people that don't align with your values. Focus on surrounding yourself with what feels authentic and positive.",
    ],
  }

  const stabilityAdvice = {
    Stable:
      "Your emotional stability gives you a great foundation. This is an excellent time to work on personal goals or help others who might be struggling.",
    Unstable:
      "With some emotional fluctuation present, focus on grounding activities like meditation, regular sleep, and maintaining routines. Small, consistent self-care practices can help stabilize your emotional state.",
    Volatile:
      "During emotionally volatile times, prioritize basic self-care: adequate sleep, nutrition, and gentle movement. Consider limiting major decisions until you feel more centered. Professional support might also be beneficial.",
  }

  const biometricAdvice =
    biometricFlags.length > 0
      ? ` Your biometric indicators suggest ${biometricFlags.join(", ").toLowerCase()}. Consider stress-reduction techniques like deep breathing, meditation, or gentle exercise.`
      : ""

  const emotionAdvice =
    adviceMap[dominantEmotion as keyof typeof adviceMap]?.[Math.floor(Math.random() * 2)] ||
    "Focus on self-compassion and gentle self-care as you navigate your current emotional state."

  const stabilityGuidance = stabilityAdvice[classification as keyof typeof stabilityAdvice]

  return `${emotionAdvice} ${stabilityGuidance}${biometricAdvice} Remember, emotions are temporary - this too shall pass.`
}
