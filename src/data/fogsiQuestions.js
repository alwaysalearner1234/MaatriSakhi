// Complete FOGSI-based Preconception Care Question Schema
// Primary Sources:
// 1. FOGSI Safe Motherhood Committee - Preconception Care E-Booklet, Book 1
// 2. FOGSI Preconception Care - Complete Clinician Checklist

export const SECTIONS_META = [
  { id: 'intention', titleKey: 'intention', icon: 'HeartHandshake' },
  { id: 'medical', titleKey: 'medical', icon: 'Activity' },
  { id: 'obstetric', titleKey: 'obstetric', icon: 'Baby' },
  { id: 'medications', titleKey: 'medications', icon: 'Pill' },
  { id: 'family', titleKey: 'family', icon: 'Dna' },
  { id: 'infections', titleKey: 'infections', icon: 'ShieldCheck' },
  { id: 'environment', titleKey: 'environment', icon: 'Trees' },
  { id: 'lifestyle', titleKey: 'lifestyle', icon: 'Coffee' },
  { id: 'mental', titleKey: 'mental', icon: 'Smile' },
  { id: 'nutrition', titleKey: 'nutrition', icon: 'Apple' }
];

export const QUESTIONS = [
  // SECTION 1: PREGNANCY INTENTION & SPACING
  {
    id: 'planning_pregnancy',
    section: 'intention',
    type: 'yes_no_unknown',
    source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 13) & Checklist #1',
    question: {
      en: "Are you currently planning a pregnancy in the next 3 to 12 months?",
      hi: "क्या आप अगले 3 से 12 महीनों में गर्भधारण की योजना बना रही हैं?",
      te: "మీరు రాబోయే 3 నుండి 12 నెలల్లో గర్భధారణను ప్లాన్ చేస్తున్నారా?",
      ta: "அடுத்த 3 முதல் 12 மாதங்களில் நீங்கள் கர்ப்பம் தரிக்க திட்டமிடுகிறீர்களா?",
      kn: "ನೀವು ಮುಂದಿನ 3 ರಿಂದ 12 ತಿಂಗಳುಗಳಲ್ಲಿ ಗರ್ಭಧಾರಣೆಯನ್ನು ಯೋಜಿಸುತ್ತಿದ್ದೀರಾ?",
      ml: "അടുത്ത 3 മുതൽ 12 മാസത്തിനുള്ളിൽ നിങ്ങൾ ഒരു ഗർഭം ധരിക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি আগামী ৩ থেকে ১২ মাসের মধ্যে গর্ভধারণের পরিকল্পনা করছেন?",
      mr: "तुम्ही पुढील ३ ते १२ महिन्यांत गर्भधारणेची योजना आखत आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'pregnancy_timeframe',
        section: 'intention',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 9: Ideally schedule 3 to 6 months before trying',
        question: {
          en: "When are you hoping to conceive?",
          hi: "आप कब तक गर्भधारण करने की उम्मीद कर रही हैं?",
          te: "మీరు ఎప్పుడు గర్భం దాల్చాలనుకుంటున్నారు?",
          ta: "நீங்கள் எப்போது கருத்தரிக்க விரும்புகிறீர்கள்?",
          kn: "ನೀವು ಯಾವಾಗ ಗರ್ಭಧರಿಸಲು ಬಯಸುತ್ತೀರಿ?",
          ml: "എപ്പോഴാണ് ഗർഭം ധരിക്കാൻ പ്രതീക്ഷിക്കുന്നത്?",
          bn: "আপনি কখন গর্ভধারণ করতে চান?",
          mr: "तुम्ही कधी गर्भधारणा करू इच्छिता?"
        },
        options: [
          { value: 'under_3m', label: { en: 'Within 3 months', hi: '3 महीने के भीतर', te: '3 నెలల్లోపు', ta: '3 மாதங்களுக்குள்', kn: '3 ತಿಂಗಳೊಳಗೆ', ml: '3 മാസത്തിനുള്ളിൽ', bn: '৩ মাসের মধ্যে', mr: '३ महिन्यांत' } },
          { value: '3_to_6m', label: { en: 'In 3 to 6 months (Recommended)', hi: '3 से 6 महीने में (अनुशंसित)', te: '3 నుండి 6 నెలల్లో', ta: '3 முதல் 6 மாதங்களில்', kn: '3 ರಿಂದ 6 ತಿಂಗಳಲ್ಲಿ', ml: '3 മുതൽ 6 മാസത്തിൽ', bn: '৩ থেকে ৬ মাসে', mr: '३ ते ६ महिन्यांत' } },
          { value: '6_to_12m', label: { en: 'In 6 to 12 months', hi: '6 से 12 महीने में', te: '6 నుండి 12 నెలల్లో', ta: '6 முதல் 12 மாதங்களில்', kn: '6 ರಿಂದ 12 ತಿಂಗಳಲ್ಲಿ', ml: '6 മുതൽ 12 മാസത്തിൽ', bn: '৬ থেকে ১২ মাসে', mr: '६ ते १२ महिन्यांत' } },
          { value: 'undecided', label: { en: 'Not yet decided', hi: 'अभी तय नहीं है', te: 'ఇంకా నిర్ణయించలేదు', ta: 'இன்னும் முடிவு செய்யவில்லை', kn: 'ಇನ್ನೂ ನಿರ್ಧರಿಸಿಲ್ಲ', ml: 'തീരുമാനിച്ചിട്ടില്ല', bn: 'এখনো ঠিক করিনি', mr: 'अद्याप ठरलेले नाही' } }
        ]
      }
    ]
  },
  {
    id: 'prior_deliveries',
    section: 'intention',
    type: 'yes_no',
    source: 'FOGSI Checklist Item #1 & E-Booklet Book 1, p. 13 (Pregnancy Spacing)',
    question: {
      en: "Have you given birth to a baby before?",
      hi: "क्या आपने पहले किसी बच्चे को जन्म दिया है?",
      te: "మీరు ఇంతకు ముందు బిడ్డకు జన్మనిచ్చారా?",
      ta: "நீங்கள் இதற்கு முன் குழந்தை பெற்றெடுத்துள்ளீர்களா?",
      kn: "ನೀವು ಈ ಹಿಂದೆ ಮಗುವಿಗೆ ಜನ್ಮ ನೀಡಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ ഇതിനുമുമ്പ് പ്രസവിച്ചിട്ടുണ്ടോ?",
      bn: "আপনি কি এর আগে সন্তানের জন্ম দিয়েছেন?",
      mr: "तुम्ही आधी बाळाला जन्म दिला आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'delivery_interval',
        section: 'intention',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 13: Inter-pregnancy interval minimum 6 months, 18 months ideal',
        question: {
          en: "How long has it been since your most recent delivery?",
          hi: "आपकी पिछली डिलीवरी को कितना समय हुआ है?",
          te: "మీ చివరి ప్రసవం జరిగి ఎంత కాలమైంది?",
          ta: "உங்கள் கடைசி பிரசவம் நடந்து எவ்வளவு காலம் ஆகிறது?",
          kn: "ನಿಮ್ಮ ಕೊನೆಯ ಹೆರಿಗೆಯಾಗಿ ಎಷ್ಟು ಸಮಯವಾಗಿದೆ?",
          ml: "അവസാന പ്രസവം കഴിഞ്ഞ് എത്ര കാലമായി?",
          bn: "আপনার শেষ প্রসবের পর কতদিন হয়েছে?",
          mr: "तुमची शेवटची प्रसूती होऊन किती वेळ झाला आहे?"
        },
        options: [
          { value: 'less_6m', label: { en: 'Less than 6 months', hi: '6 महीने से कम', te: '6 నెలల కంటే తక్కువ', ta: '6 மாதங்களுக்கும் குறைவாக', kn: '6 ತಿಂಗಳುಗಳಿಗಿಂತ ಕಡಿಮೆ', ml: '6 മാസത്തിൽ താഴെ', bn: '৬ মাসের কম', mr: '६ महिन्यांपेक्षा कमी' } },
          { value: '6_to_18m', label: { en: 'Between 6 and 18 months', hi: '6 से 18 महीने के बीच', te: '6 నుండి 18 నెలల మధ్య', ta: '6 முதல் 18 மாதங்கள் வரை', kn: '6 ರಿಂದ 18 ತಿಂಗಳ ನಡುವೆ', ml: '6 മുതൽ 18 മാസം വരെ', bn: '৬ থেকে ১৮ মাসের মধ্যে', mr: '६ ते १८ महिन्यांच्या दरम्यान' } },
          { value: 'more_18m', label: { en: 'More than 18 months', hi: '18 महीने से अधिक', te: '18 నెలల కంటే ఎక్కువ', ta: '18 மாதங்களுக்கும் மேல்', kn: '18 ತಿಂಗಳುಗಳಿಗಿಂತ ಹೆಚ್ಚು', ml: '18 മാസത്തിൽ കൂടുതൽ', bn: '১৮ মাসের বেশি', mr: '१८ महिन्यांपेक्षा जास्त' } }
        ]
      }
    ]
  },
  {
    id: 'bariatric_surgery',
    section: 'intention',
    type: 'yes_no',
    source: 'FOGSI E-Booklet Book 1, p. 13 & Checklist #1: Post-bariatric wait 12–24 months',
    question: {
      en: "Have you ever had weight-loss (bariatric) surgery?",
      hi: "क्या आपकी कभी वजन घटाने की (Bariatric) सर्जरी हुई है?",
      te: "మీకు బరువు తగ్గే (బేరియాట్రిక్) శస్త్రచికిత్స జరిగిందా? (Bariatric surgery)",
      ta: "நீங்கள் உடல் எடையைக் குறைக்கும் (பேரியாட்ரிக்) அறுவை சிகிச்சை செய்துள்ளீர்களா? (Bariatric surgery)",
      kn: "ನೀವು ತೂಕ ಇಳಿಸುವ (ಬೇರಿಯಾಟ್ರಿಕ್) ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗೆ ಒಳಗಾಗಿದ್ದೀರಾ? (Bariatric surgery)",
      ml: "നിങ്ങൾ ശരീരഭാരം കുറയ്ക്കാനുള്ള (ബാരിയാട്രിക്) ശസ്ത്രക്രിയ ചെയ്തിട്ടുണ്ടോ? (Bariatric surgery)",
      bn: "আপনার কি ওজন কমানোর (ব্যারিয়াট্রিক) অস্ত্রোপচার হয়েছে? (Bariatric surgery)",
      mr: "तुमची कधी वजन कमी करण्याची (Bariatric) शस्त्रक्रिया झाली आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'bariatric_interval',
        section: 'intention',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 13: Wait 12–24 months until rapid weight loss slows',
        question: {
          en: "Was this surgery done within the past 12 to 24 months?",
          hi: "क्या यह सर्जरी पिछले 12 से 24 महीनों के भीतर हुई थी?",
          te: "ఈ శస్త్రచికిత్స గత 12 నుండి 24 నెలల్లో జరిగిందా?",
          ta: "இந்த அறுவை சிகிச்சை கடந்த 12 முதல் 24 மாதங்களுக்குள் செய்யப்பட்டதா?",
          kn: "ಈ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯು ಕಳೆದ 12 ರಿಂದ 24 ತಿಂಗಳುಗಳಲ್ಲಿ ನಡೆದಿದೆಯೇ?",
          ml: "കഴിഞ്ഞ 12 മുതൽ 24 മാസത്തിനുള്ളിലാണോ ഈ ശസ്ത്രക്രിയ നടത്തിയത്?",
          bn: "এই অস্ত্রোপচার কি গত ১২ থেকে ২৪ মাসের মধ্যে হয়েছে?",
          mr: "ही शस्त्रक्रिया मागील १२ ते २४ महिन्यांत झाली होती का?"
        },
        options: [
          { value: 'yes_recent', label: { en: 'Yes, within last 12–24 months', hi: 'हाँ, पिछले 12–24 महीनों में', te: 'అవును, గత 12-24 నెలల్లో', ta: 'ஆம், கடந்த 12-24 மாதங்களில்', kn: 'ಹೌದು, ಕಳೆದ 12-24 ತಿಂಗಳುಗಳಲ್ಲಿ', ml: 'അതെ, കഴിഞ്ഞ 12-24 മാസത്തിൽ', bn: 'হ্যাঁ, গত ১২-২৪ মাসে', mr: 'होय, मागील १२-२४ महिन्यांत' } },
          { value: 'no_older', label: { en: 'No, more than 2 years ago', hi: 'नहीं, 2 साल से अधिक पहले', te: 'కాదు, 2 సంవత్సరాల కంటే ముందు', ta: 'இல்லை, 2 ஆண்டுகளுக்கு முன்', kn: 'ಇಲ್ಲ, 2 ವರ್ಷಗಳಿಗಿಂತ ಹಿಂದೆ', ml: 'അല്ല, 2 വർഷത്തിന് മുൻപ്', bn: 'না, ২ বছরের বেশি আগে', mr: 'नाही, २ वर्षांपूर्वी' } }
        ]
      }
    ]
  },
  {
    id: 'menstrual_regularity',
    section: 'intention',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 13: Fertile Window (days 6–21 carry >=10% chance)',
    question: {
      en: "Are your menstrual periods generally regular (occurring every 24 to 35 days)?",
      hi: "क्या आपका मासिक धर्म आमतौर पर नियमित है (हर 24 से 35 दिनों में आता है)?",
      te: "మీ నెలసరి పీరియడ్స్ సాధారణంగా క్రమబద్ధంగా ఉంటాయా (ప్రతి 24 నుండి 35 రోజులకు)?",
      ta: "உங்கள் மாதவிடாய் பொதுவாக சீரானதாக உள்ளதா (24 முதல் 35 நாட்களுக்கு ஒருமுறை)?",
      kn: "ನಿಮ್ಮ ಮುಟ್ಟು ಸಾಮಾನ್ಯವಾಗಿ ನಿಯಮಿತವಾಗಿದೆಯೇ (ಪ್ರತಿ 24 ರಿಂದ 35 ದಿನಗಳಿಗೊಮ್ಮೆ)?",
      ml: "നിങ്ങളുടെ ആർത്തവം സാധാരണയായി കൃത്യമാണോ (ഓരോ 24 മുതൽ 35 ദിവസത്തിലും)?",
      bn: "আপনার মাসিক কি সাধারণত নিয়মিত হয় (প্রতি ২৪ থেকে ৩৫ দিনে)?",
      mr: "तुमची मासिक पाळी सामान्यतः नियमित आहे का (दर २४ ते ३५ दिवसांनी)?"
    }
  },
  {
    id: 'cervical_screening',
    section: 'intention',
    type: 'yes_no_unknown',
    source: 'FOGSI Checklist Item #1: Verify cervical cancer screening is up-to-date',
    question: {
      en: "Have you had a cervical screening test (Pap smear or HPV test) within the last 3 years?",
      hi: "क्या आपने पिछले 3 वर्षों में गर्भाशय ग्रीवा जांच (Pap smear या HPV test) कराई है?",
      te: "గత 3 సంవత్సరాలలో మీరు గర్భాశయ స్క్రీనింగ్ పరీక్ష (Pap smear లేదా HPV) చేయించుకున్నారా?",
      ta: "கடந்த 3 ஆண்டுகளில் நீங்கள் கர்ப்பப்பை வாய் பரிசோதனை (Pap smear / HPV) செய்துள்ளீர்களா?",
      kn: "ಕಳೆದ 3 ವರ್ಷಗಳಲ್ಲಿ ನೀವು ಗರ್ಭಕಂಠದ ಪರೀಕ್ಷೆಯನ್ನು (Pap smear / HPV) ಮಾಡಿಸಿಕೊಂಡಿದ್ದೀರಾ?",
      ml: "കഴിഞ്ഞ 3 വർഷത്തിനിടെ നിങ്ങൾ ഗർഭാശയമുഖ കാൻസർ പരിശോധന (Pap smear / HPV) നടത്തിയിട്ടുണ്ടോ?",
      bn: "গত ৩ বছরে কি আপনার সার্ভিকাল স্ক্রীনিং (Pap smear বা HPV test) হয়েছে?",
      mr: "तुम्ही गेल्या ३ वर्षांत गर्भाशय ग्रीवा तपासणी (Pap smear किंवा HPV) केली आहे का?"
    }
  },

  // SECTION 2: CHRONIC MEDICAL CONDITIONS
  {
    id: 'medical_diabetes',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 11, 16, 21: Target HbA1c < 6.5%; insulin if required',
    question: {
      en: "Do you have diabetes mellitus or elevated blood sugar?",
      hi: "क्या आपको डायबिटीज (मधुमेह) या शुगर की बीमारी है? (Diabetes mellitus)",
      te: "మీకు మధుమేహం (షుగర్ వ్యాధి) ఉందా? (Diabetes mellitus)",
      ta: "உங்களுக்கு நீரிழிவு (சர்க்கரை நோய்) உள்ளதா? (Diabetes mellitus)",
      kn: "ನಿಮಗೆ ಮಧುಮೇಹ (ಸಕ್ಕರೆ ಕಾಯಿಲೆ) ಇದೆಯೇ? (Diabetes mellitus)",
      ml: "നിങ്ങൾക്ക് പ്രമേഹം (ഷുഗർ) ഉണ്ടോ? (Diabetes mellitus)",
      bn: "আপনার কি ডায়াবেটিস বা অতিরিক্ত ব্লাড সুগার আছে? (Diabetes mellitus)",
      mr: "तुम्हाला मधुमेह (डायबिटीज) किंवा रक्तातील साखरेचे प्रमाण जास्त आहे का? (Diabetes mellitus)"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'diabetes_duration',
        section: 'medical',
        type: 'choice',
        question: {
          en: "How long have you had diabetes?",
          hi: "आपको कितने समय से डायबिटीज है?",
          te: "మీకు ఎంత కాలంగా మధుమేహం ఉంది?",
          ta: "உங்களுக்கு எவ்வளவு காலமாக நீரிழிவு உள்ளது?",
          kn: "ನಿಮಗೆ ಎಷ್ಟು ಸಮಯದಿಂದ ಮಧುಮೇಹವಿದೆ?",
          ml: "എത്ര കാലമായി പ്രമേഹമുണ്ട്?",
          bn: "কতদিন ধরে আপনার ডায়াবেটিস আছে?",
          mr: "तुम्हाला किती काळापासून मधुमेह आहे?"
        },
        options: [
          { value: 'under_1y', label: { en: 'Less than 1 year', hi: '1 साल से कम', te: '1 సంవత్సరం కంటే తక్కువ', ta: '1 வருடத்திற்கும் குறைவாக', kn: '1 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ml: '1 വർഷത്തിൽ താഴെ', bn: '১ বছরের কম', mr: '१ वर्षापेक्षा कमी' } },
          { value: '1_to_5y', label: { en: '1 to 5 years', hi: '1 से 5 साल', te: '1 నుండి 5 సంవత్సరాలు', ta: '1 முதல் 5 ஆண்டுகள்', kn: '1 ರಿಂದ 5 ವರ್ಷಗಳು', ml: '1 മുതൽ 5 വർഷം', bn: '১ থেকে ৫ বছর', mr: '१ ते ५ वर्षे' } },
          { value: 'over_5y', label: { en: 'More than 5 years', hi: '5 साल से अधिक', te: '5 సంవత్సరాల కంటే ఎక్కువ', ta: '5 ஆண்டுகளுக்கும் மேல்', kn: '5 ವರ್ಷಗಳಿಗಿಂತ ಹೆಚ್ಚು', ml: '5 വർഷത്തിൽ കൂടുതൽ', bn: '৫ বছরের বেশি', mr: '५ वर्षांपेक्षा जास्त' } }
        ]
      },
      {
        id: 'diabetes_treatment',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16: Insulin if required for preconception glycaemic control',
        question: {
          en: "What treatment do you currently use for diabetes?",
          hi: "डायबिटीज के लिए आप अभी क्या इलाज ले रही हैं?",
          te: "మధుమేహం కోసం మీరు ప్రస్తుతం ఏ చికిత్స తీసుకుంటున్నారు?",
          ta: "நீரிழிவு நோய்க்கு தற்போது என்ன சிகிச்சை எடுத்துக்கொள்கிறீர்கள்?",
          kn: "ಮಧುಮೇಹಕ್ಕೆ ನೀವು ಪ್ರಸ್ತುತ ಯಾವ ಚಿಕಿತ್ಸೆ ಪಡೆಯುತ್ತಿದ್ದೀರಿ?",
          ml: "പ്രമേഹത്തിന് ഇപ്പോൾ എന്തെങ്കിലും ചികിത്സ എടുക്കുന്നുണ്ടോ?",
          bn: "ডায়াবেটিসের জন্য বর্তমানে আপনি কী চিকিৎসা নিচ্ছেন?",
          mr: "मधुमेहासाठी सध्या तुम्ही काय उपचार घेत आहात?"
        },
        options: [
          { value: 'insulin', label: { en: 'Insulin injections', hi: 'इंसुलिन इंजेक्शन', te: 'ఇన్సులిన్ ఇంజెక్షన్లు', ta: 'இன்சுலின் ஊசி', kn: 'ಇನ್ಸುಲಿನ್ ಚುಚ್ಚುಮದ್ದು', ml: 'ഇൻസുലിൻ കുത്തിവയ്പ്പ്', bn: 'ইনসুলিন ইনজেকশন', mr: 'इन्सुलिन इंजेक्टेबल' } },
          { value: 'tablets', label: { en: 'Oral tablets (Metformin, etc.)', hi: 'दवाइयों की गोलियां', te: 'మాత్రలు', ta: 'மாத்திரைகள்', kn: 'ಮಾತ್ರೆಗಳು', ml: 'ഗുളികകൾ', bn: 'ওষুধের ট্যাবলেট', mr: 'गोळ्या' } },
          { value: 'diet_exercise', label: { en: 'Diet and lifestyle only', hi: 'केवल खान-पान और व्यायाम', te: 'ఆహారం & వ్యాయామం మాత్రమే', ta: 'உணவு மற்றும் உடற்பயிற்சி மட்டும்', kn: 'ಆಹಾರ ಮತ್ತು ವ್ಯಾಯಾಮ ಮಾತ್ರ', ml: 'ഭക്ഷണക്രമവും വ്യായാമവും മാത്രം', bn: 'শুধু ডায়েট ও ব্যায়াম', mr: 'फक्त आहार व व्यायाम' } },
          { value: 'none', label: { en: 'Not taking treatment currently', hi: 'अभी कोई दवा नहीं ले रही', te: 'చికిత్స తీసుకోవడం లేదు', ta: 'சிகிச்சை எடுக்கவில்லை', kn: 'ಯಾವುದೇ ಚಿಕಿತ್ಸೆ ಪಡೆಯುತ್ತಿಲ್ಲ', ml: 'ചികിത്സ എടുക്കുന്നില്ല', bn: 'চিকিৎসা নিচ্ছি না', mr: 'उपचार घेत नाही' } }
        ]
      },
      {
        id: 'diabetes_hba1c',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16: Target HbA1c < 6.5% before conception',
        question: {
          en: "Do you know your latest 3-month blood sugar average (HbA1c)?",
          hi: "क्या आपको अपना हालिया 3 महीने का शुगर टेस्ट (HbA1c) पता है?",
          te: "మీ తాజా HbA1c ఫలితం తెలుసా?",
          ta: "உங்கள் சமீபத்திய HbA1c அளவு தெரியுமா?",
          kn: "ನಿಮ್ಮ ಇತ್ತೀಚಿನ HbA1c ಪ್ರಮಾಣ ತಿಳಿದಿದೆಯೇ?",
          ml: "നിങ്ങളുടെ ഏറ്റവും പുതിയ HbA1c മൂല്യം അറിയാമോ?",
          bn: "আপনার সাম্প্রতিক HbA1c রিপোর্ট জানা আছে কি?",
          mr: "तुमची अलीकडील HbA1c पातळी माहीत आहे का?"
        },
        options: [
          { value: 'under_6_5', label: { en: 'Yes, under 6.5% (Optimal)', hi: 'हाँ, 6.5% से कम (उत्तम)', te: 'అవును, 6.5% కంటే తక్కువ', ta: 'ஆம், 6.5% க்கும் குறைவு', kn: 'ಹೌದು, 6.5% ಗಿಂತ ಕಡಿಮೆ', ml: 'അതെ, 6.5% ൽ താഴെ', bn: 'হ্যাঁ, ৬.৫% এর কম', mr: 'होय, ६.५% पेक्षा कमी' } },
          { value: 'over_6_5', label: { en: 'Yes, 6.5% or higher', hi: 'हाँ, 6.5% या उससे अधिक', te: 'అవును, 6.5% లేదా ఎక్కువ', ta: 'ஆம், 6.5% அல்லது அதிகம்', kn: 'ಹೌದು, 6.5% ಅಥವಾ ಹೆಚ್ಚು', ml: 'അതെ, 6.5% അല്ലെങ്കിൽ കൂടുതൽ', bn: 'হ্যাঁ, ৬.৫% বা বেশি', mr: 'होय, ६.५% किंवा जास्त' } },
          { value: 'unknown', label: { en: 'Not sure / Not tested recently', hi: 'पता नहीं / हाल ही में जांच नहीं कराई', te: 'తెలియదు / ఇటీవల పరీక్షించలేదు', ta: 'தெரியாது / அண்மையில் பரிசோதிக்கவில்லை', kn: 'ಗೊತ್ತಿಲ್ಲ / ಇತ್ತೀಚೆಗೆ ಪರೀಕ್ಷಿಸಿಲ್ಲ', ml: 'അറിയില്ല / അടുത്തിടെ പരിശോധിച്ചില്ല', bn: 'জানা নেই / পরীক্ষা করাইনি', mr: 'माहित नाही / तपासणी केलेली नाही' } }
        ]
      }
    ]
  },
  {
    id: 'medical_hypertension',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 16, 21: Chronic HTN >= 140/90 mmHg; pregnancy-safe drugs',
    question: {
      en: "Do you have high blood pressure (Hypertension)?",
      hi: "क्या आपको हाई ब्लड प्रेशर (उच्च रक्तचाप) की समस्या है? (Hypertension)",
      te: "మీకు రక్తపోటు (బీపీ) సమస్య ఉందా? (Hypertension)",
      ta: "உங்களுக்கு உயர் ரத்த அழுத்தம் (BP) உள்ளதா? (Hypertension)",
      kn: "ನಿಮಗೆ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (BP) ಇದೆಯೇ? (Hypertension)",
      ml: "നിങ്ങൾക്ക് ഉയർന്ന രക്തസമ്മർദ്ദം (പ്രഷർ) ഉണ്ടോ? (Hypertension)",
      bn: "আপনার কি হাই ব্লাড প্রেশার (উচ্চ রক্তচাপ) আছে? (Hypertension)",
      mr: "तुम्हाला उच्च रक्तदाब (High BP) चा त्रास आहे का? (Hypertension)"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'htn_medications',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16, 22: Switch to pregnancy-safe antihypertensive (e.g. labetalol)',
        question: {
          en: "Are you currently taking medicines for blood pressure?",
          hi: "क्या आप अभी ब्लड प्रेशर की दवा ले रही हैं?",
          te: "మీరు ప్రస్తుతం బీపీ కోసం మందులు వాడుతున్నారా?",
          ta: "நீங்கள் தற்போது ரத்த அழுத்தத்திற்கு மாத்திரை சாப்பிடுகிறீர்களா?",
          kn: "ನೀವು ಪ್ರಸ್ತುತ ರಕ್ತದೊತ್ತಡಕ್ಕೆ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
          ml: "രക്തസമ്മർദ്ദത്തിന് ഇപ്പോൾ മരുന്ന് കഴിക്കുന്നുണ്ടോ?",
          bn: "আপনি কি প্রেশারের জন্য ওষুধ খাচ্ছেন?",
          mr: "तुम्ही सध्या रक्तदाबाची औषधे घेत आहात का?"
        },
        options: [
          { value: 'yes_taking', label: { en: 'Yes, taking daily BP medicine', hi: 'हाँ, रोज़ाना बीपी की दवा लेती हूँ', te: 'అవును, రోజూ మందులు వాడుతున్నాను', ta: 'ஆம், தினமும் மருந்து எடுத்துக்கொள்கிறேன்', kn: 'ಹೌದು, ಪ್ರತಿದಿನ ಮಾತ್ರೆ ತಗೋತೀನಿ', ml: 'അതെ, ദിവസേന മരുന്ന് കഴിക്കുന്നുണ്ട്', bn: 'হ্যাঁ, নিয়মিত ওষুধ খাই', mr: 'होय, रोज औषध घेते' } },
          { value: 'no_not_taking', label: { en: 'No, not currently taking medicine', hi: 'नहीं, अभी कोई दवा नहीं ले रही', te: 'లేదు, ప్రస్తుతం వాడటం లేదు', ta: 'இல்லை, மருந்து சாப்பிடவில்லை', kn: 'ಇಲ್ಲ, ಪ್ರಸ್ತುತ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿಲ್ಲ', ml: 'ഇല്ല, ഇപ്പോൾ മരുന്ന് കഴിക്കുന്നില്ല', bn: 'না, ওষুধ খাই না', mr: 'नाही, सध्या औषध घेत नाही' } }
        ]
      },
      {
        id: 'htn_latest_bp',
        section: 'medical',
        type: 'choice',
        question: {
          en: "Do you know your typical blood pressure reading?",
          hi: "क्या आपको अपना सामान्य बीपी रीडिंग पता है?",
          te: "మీ సాధారణ బీపీ రీడింగ్ మీకు తెలుసా?",
          ta: "உங்கள் வழக்கமான BP அளவு உங்களுக்குத் தெரியுமா?",
          kn: "ನಿಮ್ಮ ಸಾಮಾನ್ಯ BP ರೀಡಿಂಗ್ ನಿಮಗೆ ತಿಳಿದಿದೆಯೇ?",
          ml: "സാധാരണ ബിപി എത്രയാണെന്ന് അറിയാമോ?",
          bn: "আপনার সাধারণ প্রেশার কত থাকে জানেন কি?",
          mr: "तुमचे सामान्य रक्तदाब रीडिंग तुम्हाला माहीत आहे का?"
        },
        options: [
          { value: 'normal_under_140_90', label: { en: 'Normal (Under 140/90 mmHg)', hi: 'सामान्य (140/90 से कम)', te: 'సాధారణం (140/90 కంటే తక్కువ)', ta: 'சாதாரணமானது (140/90 க்கும் குறைவு)', kn: 'ಸಾಮಾನ್ಯ (140/90 ಗಿಂತ ಕಡಿಮೆ)', ml: 'സാധാരണ (140/90 ൽ താഴെ)', bn: 'স্বাভাবিক (১৪০/৯০ এর নিচে)', mr: 'सामान्य (१४०/९० पेक्षा कमी)' } },
          { value: 'high_over_140_90', label: { en: 'Elevated (140/90 mmHg or higher)', hi: 'अधिक (140/90 या उससे अधिक)', te: 'ఎక్కువ (140/90 లేదా అంతకంటే ఎక్కువ)', ta: 'அதிகம் (140/90 அல்லது அதற்கு மேல்)', kn: 'ಹೆಚ್ಚು (140/90 ಅಥವಾ ಹೆಚ್ಚು)', ml: 'കൂടുതൽ (140/90 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ)', bn: 'বেশি (১৪০/৯০ বা বেশি)', mr: 'जास्त (१४०/९० किंवा जास्त)' } },
          { value: 'unknown', label: { en: 'Not sure / Not checked recently', hi: 'पता नहीं / हाल ही में नहीं नापा', te: 'తెలియదు / ఇటీవల చెక్ చేయలేదు', ta: 'தெரியாது / அண்மையில் பார்க்கவில்லை', kn: 'ಗೊತ್ತಿಲ್ಲ / ಇತ್ತೀಚೆಗೆ ಪರೀಕ್ಷಿಸಿಲ್ಲ', ml: 'അറിയില്ല / അടുത്തിടെ നോക്കിയില്ല', bn: 'জানা নেই / পরীক্ষা করিনি', mr: 'माहित नाही / नुकतेच तपासले नाही' } }
        ]
      }
    ]
  },
  {
    id: 'medical_thyroid',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 16, 22: Correct hypo- or hyperthyroidism before conception',
    question: {
      en: "Do you have a thyroid disorder (hypothyroidism or hyperthyroidism)?",
      hi: "क्या आपको थायरॉइड की बीमारी है? (Thyroid disorder)",
      te: "మీకు థైరాయిడ్ సమస్య ఉందా? (Thyroid disorder)",
      ta: "உங்களுக்கு தைராய்டு பிரச்சனை உள்ளதா? (Thyroid disorder)",
      kn: "ನಿಮಗೆ ಥೈರಾಯ್ಡ್ ಸಮಸ್ಯೆ ಇದೆಯೇ? (Thyroid disorder)",
      ml: "നിങ്ങൾക്ക് തൈറോയ്ഡ് രോഗമുണ്ടോ? (Thyroid disorder)",
      bn: "আপনার কি থাইরয়েডের কোনো সমস্যা আছে? (Thyroid disorder)",
      mr: "तुम्हाला थायरॉईडचा आजार आहे का? (Thyroid disorder)"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'thyroid_medication',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16: Maintain euthyroid status',
        question: {
          en: "Are you taking thyroid medicine (such as Thyroxine / Eltroxin / Thyronorm)?",
          hi: "क्या आप थायरॉइड की दवा (Thyroxine / Thyronorm आदि) ले रही हैं?",
          te: "మీరు థైరాయిడ్ మందులు (Thyronorm మొదలైనవి) వాడుతున్నారా?",
          ta: "நீங்கள் தைராய்டு மாத்திரை சாப்பிடுகிறீர்களா?",
          kn: "ನೀವು ಥೈರಾಯ್ಡ್ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
          ml: "തൈറോയ്ഡ് മരുന്ന് കഴിക്കുന്നുണ്ടോ?",
          bn: "আপনি কি থাইরয়েডের ওষুধ খাচ্ছেন?",
          mr: "तुम्ही थायरॉईडची औषधे घेत आहात का?"
        },
        options: [
          { value: 'yes', label: { en: 'Yes, taking daily medication', hi: 'हाँ, रोज़ाना दवा लेती हूँ', te: 'అవును, రోజూ తీసుకుంటున్నాను', ta: 'ஆம், தினமும் சாப்பிடுகிறேன்', kn: 'ಹೌದು, ಪ್ರತಿದಿನ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ', ml: 'അതെ, ദിവസവും കഴിക്കുന്നുണ്ട്', bn: 'হ্যাঁ, নিয়মিত ওষুধ খাই', mr: 'होय, दररोज औषध घेते' } },
          { value: 'no', label: { en: 'No, not currently on medication', hi: 'नहीं, अभी कोई दवा नहीं ले रही', te: 'లేదు, మందులు వాడటం లేదు', ta: 'இல்லை, மாத்திரை சாப்பிடவில்லை', kn: 'ಇಲ್ಲ, ಪ್ರಸ್ತುತ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿಲ್ಲ', ml: 'ഇല്ല, ഇപ്പോൾ മരുന്നില്ല', bn: 'না, ওষুধ খাই না', mr: 'नाही, सध्या औषध घेत नाही' } }
        ]
      }
    ]
  },
  {
    id: 'medical_epilepsy',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 16, 26, 27 & Checklist #4A: Epilepsy: lowest effective dose + high dose folic acid; avoid valproate',
    question: {
      en: "Have you ever had epilepsy, convulsions, or seizure episodes?",
      hi: "क्या आपको कभी मिर्गी या दौरे पड़ने (Epilepsy/Seizures) की शिकायत रही है?",
      te: "మీకు ఎప్పుడైనా మూర్ఛ లేదా ఫిట్స్ (Seizures) వచ్చాయా? (Epilepsy)",
      ta: "உங்களுக்கு எப்போதாவது வலிப்பு அல்லது முடக்குவாதம் வந்துள்ளதா? (Epilepsy)",
      kn: "ನಿಮಗೆ ಎಂದಾದರೂ ಅಪಸ್ಮಾರ ಅಥವಾ ಫಿಟ್ಸ್ (Epilepsy/Seizures) ಬಂದಿದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് എപ്പോഴെങ്കിലും അപസ്മാരം (ഫിറ്റ്സ്) ഉണ്ടായിട്ടുണ്ടോ? (Epilepsy)",
      bn: "আপনার কি মৃগীরোগ বা খিঁচুনি (Epilepsy/Seizures) হয়েছে কখনো?",
      mr: "तुम्हाला कधी फेफरे किंवा फिट्स (Epilepsy/Seizures) चा त्रास झाला आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'epilepsy_medication',
        section: 'medical',
        type: 'text_input',
        source: 'FOGSI E-Booklet p. 16, 27: Avoid sodium valproate; high dose folic acid 4-5mg',
        question: {
          en: "What anti-seizure medicines are you taking? (Important: Please do NOT stop without consulting your neurologist)",
          hi: "आप दौरे की कौन सी दवा ले रही हैं? (कृपया डॉक्टर की सलाह के बिना दवा बंद न करें)",
          te: "మీరు ఫిట్స్ కోసం ఏ మందులు వాడుతున్నారు? (వైద్యుని సంప్రదించకుండా ఆపవద్దు)",
          ta: "வலிப்புக்காக என்ன மாத்திரை சாப்பிடுகிறீர்கள்? (மருத்துவர் அனுமதியின்றி நிறுத்த வேண்டாம்)",
          kn: "ಫಿಟ್ಸ್‌ಗಾಗಿ ನೀವು ಯಾವ ಔಷಧಿಯನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಿ? (ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ನಿಲ್ಲಿಸಬೇಡಿ)",
          ml: "ഫിറ്റ്സിന് എന്തൊക്കെ മരുന്നുകളാണ് കഴിക്കുന്നത്? (ഡോക്ടറുടെ നിർദ്ദേശമില്ലാതെ നിർത്തരുത്)",
          bn: "খিঁচুনির জন্য কী ওষুধ খাচ্ছেন? (ডাক্তারের পরামর্শ ছাড়া ওষুধ বন্ধ করবেন না)",
          mr: "तुम्ही फिट्ससाठी कोणती औषधे घेत आहात? (कृपया डॉक्टरांच्या सल्ल्याशिवाय बंद करू नका)"
        }
      }
    ]
  },
  {
    id: 'medical_cardiac',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 16 & Checklist #4A: Pre-pregnancy cardiology evaluation',
    question: {
      en: "Do you have any heart disease, valve problems, or cardiac condition?",
      hi: "क्या आपको दिल की कोई बीमारी या वॉल्व की समस्या है? (Cardiac disease)",
      te: "మీకు ఏదైనా గుండె జబ్బు లేదా వాల్వ్ సమస్య ఉందా? (Heart disease)",
      ta: "உங்களுக்கு ஏதேனும் இதய நோய் அல்லது வால்வு பிரச்சனை உள்ளதா? (Heart disease)",
      kn: "ನಿಮಗೆ ಯಾವುದೇ ಹೃದಯ ಕಾಯಿಲೆ ಅಥವಾ ಕವಾಟದ ಸಮಸ್ಯೆ ಇದೆಯೇ? (Heart disease)",
      ml: "നിങ്ങൾക്ക് എന്തെങ്കിലും ഹൃദ്രോഗമോ വാൽവ് പ്രശ്നമോ ഉണ്ടോ? (Heart disease)",
      bn: "আপনার কি কোনো হৃদরোগ বা হার্টের ভালভের সমস্যা আছে? (Cardiac disease)",
      mr: "तुम्हाला हृदयाचा आजार किंवा झडपेची काही अडचण आहे का? (Heart disease)"
    }
  },
  {
    id: 'medical_renal',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 16 & Checklist #4A: Assess renal function and proteinuria',
    question: {
      en: "Do you have any kidney or renal disease?",
      hi: "क्या आपको गुर्दे (किडनी) की कोई बीमारी है? (Renal disease)",
      te: "మీకు మూత్రపిండాల (కిడ్నీ) వ్యాధి ఉందా? (Kidney disease)",
      ta: "உங்களுக்கு சிறுநீரக நோய் ஏதேனும் உள்ளதா? (Kidney disease)",
      kn: "ನಿಮಗೆ ಮೂತ್ರಪಿಂಡದ (ಕಿಡ್ನಿ) ಕಾಯಿಲೆ ಇದೆಯೇ? (Kidney disease)",
      ml: "നിങ്ങൾക്ക് വൃക്കസംബന്ധമായ രോഗങ്ങളുണ്ടോ? (Kidney disease)",
      bn: "আপনার কি কিডনি বা বৃক্কের কোনো রোগ আছে? (Renal disease)",
      mr: "तुम्हाला मूत्रपिंडाचा (किडनी) आजार आहे का? (Renal disease)"
    }
  },
  {
    id: 'medical_autoimmune',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 16 & Checklist #4A: Ensure disease remission before conception (e.g. Lupus/SLE, RA)',
    question: {
      en: "Do you have an autoimmune condition (such as Lupus/SLE or Rheumatoid Arthritis)?",
      hi: "क्या आपको कोई ऑटोइम्यून बीमारी है (जैसे ल्यूपस / गठिया आदि)? (Autoimmune disease)",
      te: "మీకు ఆటో ఇమ్యూన్ వ్యాధి ఉందా (ఉదా. లూపస్ లేదా రుమటాయిడ్ ఆర్థరైటిస్)? (Autoimmune disease)",
      ta: "உங்களுக்கு ஏதேனும் ஆட்டோ இம்யூன் நோய் உள்ளதா (எ.கா. லூபஸ், வாத நோய்)? (Autoimmune disease)",
      kn: "ನಿಮಗೆ ಆಟೋಇಮ್ಯೂನ್ ಕಾಯಿಲೆ ಇದೆಯೇ (ಲೂಪಸ್ ಅಥವಾ ಸಂಧಿವಾತ)? (Autoimmune disease)",
      ml: "നിങ്ങൾക്ക് ഓട്ടോ ഇമ്മ്യൂൺ രോഗമുണ്ടോ (ലൂപ്പസ്, റൂമറ്റോയ്ഡ് ആർത്രൈറ്റിസ്)? (Autoimmune disease)",
      bn: "আপনার কি কোনো অটোইমিউন রোগ আছে (যেমন লুপাস বা রিউমাটয়েড আর্থ্রাইটিস)? (Autoimmune disease)",
      mr: "तुम्हाला ऑटोइम्यून आजार आहे का (जसे ल्युपस किंवा संधिवात)? (Autoimmune disease)"
    }
  },
  {
    id: 'medical_thrombophilia',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 9, 15 & Checklist #4A: Thrombophilia / deep vein thrombosis history',
    question: {
      en: "Have you ever had blood clots in your legs or lungs, or a known clotting disorder (Thrombophilia)?",
      hi: "क्या आपको कभी नसों में खून का थक्का जमने (DVT / Thrombophilia) की समस्या रही है?",
      te: "మీకు ఎప్పుడైనా కాళ్ళలో లేదా ఊపిరితిత్తులలో రక్తం గడ్డకట్టే సమస్య ఉందా? (Thrombophilia)",
      ta: "கால்களிலோ நுரையீரலிலோ ரத்தம் உறைதல் பிரச்சனை ஏற்பட்டுள்ளதா? (Thrombophilia)",
      kn: "ನಿಮಗೆ ರಕ್ತ ಹೆಪ್ಪುಗಟ್ಟುವ ಕಾಯಿಲೆ (Thrombophilia) ಇದೆಯೇ?",
      ml: "രക്തം കട്ടപിടിക്കുന്ന അസുഖം ഉണ്ടായിട്ടുണ്ടോ? (Thrombophilia)",
      bn: "আপনার কি রক্ত জমাট বাঁধার সমস্যা (Thrombophilia) আছে?",
      mr: "तुम्हाला रक्ताची गुठळी होण्याची (Thrombophilia) समस्या कधी झाली आहे का?"
    }
  },
  {
    id: 'medical_periodontal',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 12, 23 & Checklist #4A: Periodontal/gum disease linked to preterm birth',
    question: {
      en: "Do you experience swollen, bleeding gums or dental/periodontal disease?",
      hi: "क्या आपके मसूड़ों से खून आता है या मसूड़ों में सूजन की बीमारी है? (Periodontal disease)",
      te: "మీ చిగుళ్ళ నుండి రక్తం కారడం లేదా చిగుళ్ల వ్యాధి ఉందా? (Periodontal disease)",
      ta: "உங்கள் ஈறுகளில் ரத்தக்கசிவு அல்லது ஈறு நோய் உள்ளதா? (Periodontal disease)",
      kn: "ನಿಮ್ಮ ಒಸಡುಗಳಿಂದ ರಕ್ತಸ್ರಾವವಾಗುತ್ತದೆಯೇ ಅಥವಾ ಒಸಡಿನ ಕಾಯಿಲೆ ಇದೆಯೇ? (Periodontal disease)",
      ml: "മോണയിൽ നിന്ന് രക്തം വരികയോ മോണരോഗമോ ഉണ്ടോ? (Periodontal disease)",
      bn: "আপনার কি মাড়ি দিয়ে রক্ত পড়া বা দাঁতের মাড়ির সমস্যা আছে? (Periodontal disease)",
      mr: "तुमच्या हिरड्यांमधून रक्त येते का किंवा हिरड्यांचा त्रास आहे का? (Periodontal disease)"
    }
  },
  {
    id: 'medical_weight',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 11, 22 & Checklist #3: Target healthy BMI; counsel on weight optimization',
    question: {
      en: "Do you have concerns regarding being significantly underweight or overweight?",
      hi: "क्या आपको अपने वजन (बहुत कम या बहुत अधिक वजन) को लेकर कोई चिंता है?",
      te: "మీ బరువు (చాలా తక్కువ లేదా అధిక బరువు) గురించి ఏవైనా సమస్యలు ఉన్నాయా?",
      ta: "உடல் எடை (மிகக் குறைவு அல்லது அதிக எடை) குறித்து உங்களுக்கு கவலை உள்ளதா?",
      kn: "ನಿಮ್ಮ ದೇಹದ ತೂಕದ ಬಗ್ಗೆ (ತುಂಬಾ ಕಡಿಮೆ ಅಥವಾ ಅತಿಯಾದ ತೂಕ) ಕಾಳಜಿ ಇದೆಯೇ?",
      ml: "ശരീരഭാരം (വളരെ കുറവോ കൂടുതലോ) സംബന്ധിച്ച് എന്തെങ്കിലും പ്രശ്നമുണ്ടോ?",
      bn: "আপনার ওজন কি অতিরিক্ত কম বা বেশি যা নিয়ে আপনার উদ্বেগ আছে?",
      mr: "तुमच्या वजनाबद्दल (खूप कमी किंवा जास्त वजन) काही काळजी आहे का?"
    }
  },

  // SECTION 3: OBSTETRIC & SURGICAL HISTORY
  {
    id: 'obstetric_complications',
    section: 'obstetric',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 9, 13 & Checklist #1: Review previous pregnancy complications; recurrence risk',
    question: {
      en: "In any previous pregnancy, did you experience complications (such as high BP, gestational diabetes, miscarriage, or preterm birth)?",
      hi: "क्या पिछली किसी गर्भावस्था में कोई समस्या हुई थी (जैसे बीपी, शुगर, गर्भपात, या समय से पहले प्रसव)?",
      te: "గతంలో గర్భధారణ సమయంలో ఏవైనా సమస్యలు వచ్చాయా (బీపీ, షుగర్, గర్భస్రావం మొదలైనవి)?",
      ta: "முந்தைய கர்ப்பத்தில் ஏதேனும் சிக்கல்கள் ஏற்பட்டதா (உயர் BP, சர்க்கரை, கருச்சிதைவு போன்றவை)?",
      kn: "ಹಿಂದಿನ ಗರ್ಭಧಾರಣೆಯಲ್ಲಿ ಏನಾದರೂ ಸಮಸ್ಯೆಗಳಾಗಿದ್ದವೇ (ಅಧಿಕ ರಕ್ತದೊತ್ತಡ, ಮಧುಮೇಹ, ಗರ್ಭಪಾತ)?",
      ml: "മുൻ ഗർഭധാരണങ്ങളിൽ എന്തെങ്കിലും സങ്കീർണ്ണതകൾ (പ്രഷർ, ഷുഗർ, അലസിപ്പോകൽ) ഉണ്ടായിട്ടുണ്ടോ?",
      bn: "আগের কোনো গর্ভাবস্থায় কি কোনো জটিলতা হয়েছিল (যেমন উচ্চ রক্তচাপ, সুগার, গর্ভপাত)?",
      mr: "मागील गर्भधारणेदरम्यान काही त्रास झाला होता का (जसे बीपी, साखर, गर्भपात किंवा मुदतपूर्व प्रसूती)?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'obstetric_details',
        section: 'obstetric',
        type: 'multi_select',
        source: 'FOGSI E-Booklet p. 11-13 & Checklist #1',
        question: {
          en: "Which of the following occurred in previous pregnancies? (Select all that apply)",
          hi: "पिछली गर्भावस्थाओं में इनमें से क्या हुआ था? (जो लागू हों उन्हें चुनें)",
          te: "గత గర్భధారణలో వీటిలో ఏవి జరిగాయి? (వర్తించే వాటిని ఎంచుకోండి)",
          ta: "முந்தைய கர்ப்பங்களில் எவை நிகழ்ந்தன? (பொருந்துபவற்றைத் தேர்ந்தெடுக்கவும்)",
          kn: "ಹಿಂದಿನ ಗರ್ಭಧಾರಣೆಯಲ್ಲಿ ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಸಂಭವಿಸಿದೆ?",
          ml: "മുൻ ഗർഭങ്ങളിൽ താഴെ പറയുന്നവയിൽ എന്തെങ്കിലും സംഭവിച്ചിട്ടുണ്ടോ?",
          bn: "পূর্বের গর্ভাবস্থায় এগুলির মধ্যে কোনটি হয়েছিল? (প্রযোজ্যগুলি নির্বাচন করুন)",
          mr: "मागील गर्भधारणेदरम्यान खालीलपैकी काय घडले होते? (लागू असलेले निवडा)"
        },
        options: [
          { value: 'preeclampsia', label: { en: 'High BP in pregnancy / Pre-eclampsia', hi: 'गर्भावस्था में हाई बीपी / प्री-एक्लेम्पसिया', te: 'గర్భధారణలో అధిక బీపీ', ta: 'கர்ப்பகால உயர் ரத்த அழுத்தம்', kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ', ml: 'ഗർഭകാലത്തെ ഉയർന്ന പ്രഷർ', bn: 'গর্ভাবস্থায় উচ্চ রক্তচাপ', mr: 'गर्भधारणेत उच्च रक्तदाब' } },
          { value: 'gdm', label: { en: 'Gestational Diabetes (Sugar during pregnancy)', hi: 'गर्भावस्था में डायबिटीज (GDM)', te: 'గర్భధారణ మధుమేహం (GDM)', ta: 'கர்ப்பகால சர்க்கரை நோய் (GDM)', kn: 'ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹ (GDM)', ml: 'ഗർഭകാലത്തെ പ്രമേഹം (GDM)', bn: 'গর্ভকালীন ডায়াবেটিস (GDM)', mr: 'गर्भधारणेतील मधुमेह (GDM)' } },
          { value: 'preterm', label: { en: 'Preterm birth (Delivery before 37 weeks)', hi: 'समय से पहले प्रसव (37 सप्ताह से पहले)', te: 'నెలలు నిండకముందే ప్రసవం (37 వారాల కంటే ముందు)', ta: 'குறைப்பிரசவம் (37 வாரங்களுக்கு முன்)', kn: 'ಅವಧಿಗೆ ಮುನ್ನ ಹೆರಿಗೆ (37 ವಾರಗಳಿಗಿಂತ ಮೊದಲು)', ml: 'മാസം തികയാതെയുള്ള പ്രസവം (37 ആഴ്ചയ്ക്ക് മുമ്പ്)', bn: 'নির্দিষ্ট সময়ের পূর্বে প্রসব (৩৭ সপ্তাহের আগে)', mr: 'मुदतपूर्व प्रसूती (३७ आठवड्यांपूर्वी)' } },
          { value: 'miscarriage', label: { en: 'Miscarriage or recurrent pregnancy loss', hi: 'गर्भपात (Miscarriage)', te: 'గర్భస్రావం (Miscarriage)', ta: 'கருச்சிதைவு (Miscarriage)', kn: 'ಗರ್ಭಪಾತ (Miscarriage)', ml: 'ഗർഭച്ഛിദ്രം / അലസിപ്പോകൽ', bn: 'গর্ভপাত (Miscarriage)', mr: 'गर्भपात (Miscarriage)' } },
          { value: 'stillbirth', label: { en: 'Stillbirth or non-live birth', hi: 'मृत शिशु जन्म (Stillbirth)', te: 'మృత శిశు జననం (Stillbirth)', ta: 'குழந்தை இறந்து பிறத்தல் (Stillbirth)', kn: 'ಮೃತ ಮಗುವಿನ ಜನನ (Stillbirth)', ml: 'പ്രസവസമയത്തെ ശിശുമരണം (Stillbirth)', bn: 'মৃত সন্তান প্রসব (Stillbirth)', mr: 'मृत अर्भकाचा जन्म (Stillbirth)' } },
          { value: 'growth_restriction', label: { en: 'Fetal growth restriction / low birth weight', hi: 'शिशु का वजन बहुत कम होना (LBW/FGR)', te: 'శిశువు తక్కువ బరువుతో పుట్టడం (LBW)', ta: 'குறைந்த எடையுடன் குழந்தை பிறத்தல்', kn: 'ಕಡಿಮೆ ತೂಕದ ಮಗುವಿನ ಜನನ', ml: 'കുഞ്ഞിന് ഭാരക്കുറവ്', bn: 'কম ওজনের শিশু জন্ম (LBW)', mr: 'कमी वजनाचे बाळ जन्मणे' } }
        ]
      }
    ]
  },
  {
    id: 'prior_surgeries',
    section: 'obstetric',
    type: 'yes_no',
    source: 'FOGSI Checklist Item #2: Surgical history',
    question: {
      en: "Have you had any major surgeries (such as C-section, uterine surgery, appendix, or gallbladder)?",
      hi: "क्या आपकी कभी कोई बड़ी सर्जरी (जैसे सिजेरियन, बच्चेदानी की सर्जरी, अपेंडिक्स) हुई है?",
      te: "మీకు గతంలో ఏవైనా పెద్ద ఆపరేషన్లు (సిజేరియన్, గర్భాశయ శస్త్రచికిత్స మొదలైనవి) జరిగాయా?",
      ta: "உங்களுக்கு ஏதேனும் பெரிய அறுவை சிகிச்சை (சிசேரியன், கர்ப்பப்பை அறுவைசிகிச்சை போன்றவை) நடந்துள்ளதா?",
      kn: "ನಿಮಗೆ ಈ ಹಿಂದೆ ಯಾವುದೇ ಪ್ರಮುಖ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು (ಸಿ-ಸೆಕ್ಷನ್, ಗರ್ಭಾಶಯ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ) ಆಗಿವೆಯೇ?",
      ml: "സിസേറിയൻ, ഗർഭാശയ ശസ്ത്രക്രിയ തുടങ്ങിയ എന്തെങ്കിലും സർജറികൾ നടന്നിട്ടുണ്ടോ?",
      bn: "আপনার কি কোনো বড় অস্ত্রোপচার (যেমন সি-সেকশন বা জরায়ু সার্জারি) হয়েছে?",
      mr: "तुमची कधी कोणती मोठी शस्त्रक्रिया (जसे सिझेरियन किंवा गर्भाशयाची शस्त्रक्रिया) झाली आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'surgery_details',
        section: 'obstetric',
        type: 'text_input',
        question: {
          en: "What surgery did you have and approximately which year?",
          hi: "आपकी कौन सी सर्जरी हुई थी और लगभग किस वर्ष में?",
          te: "ఏ శస్త్రచికిత్స జరిగింది మరియు ఏ సంవత్సరంలో?",
          ta: "என்ன அறுவை சிகிச்சை செய்யப்பட்டது, எந்த வருடம்?",
          kn: "ಯಾವ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಮಾಡಲಾಗಿತ್ತು ಮತ್ತು ಯಾವ ವರ್ಷದಲ್ಲಿ?",
          ml: "ഏത് ശസ്ത്രക്രിയയാണ് ചെയ്തത്, ഏത് വർഷം?",
          bn: "কী অস্ত্রোপচার হয়েছিল এবং আনুমানিক কোন সালে?",
          mr: "कोणती शस्त्रक्रिया झाली होती आणि अंदाजे कोणत्या वर्षी?"
        }
      }
    ]
  },

  // SECTION 4: MEDICATIONS & FOLIC ACID
  {
    id: 'taking_medications',
    section: 'medications',
    type: 'yes_no',
    source: 'FOGSI E-Booklet p. 9, 16, 22 & Checklist #2: Review all current medications for teratogenicity',
    question: {
      en: "Are you currently taking any prescription medicines, daily supplements, or herbal/ayurvedic remedies?",
      hi: "क्या आप अभी कोई डॉक्टर की दवा, दैनिक सप्लीमेंट्स या हर्बल/आयुर्वेदिक उत्पाद ले रही हैं?",
      te: "మీరు ప్రస్తుతం ఏవైనా మందులు, విటమిన్లు లేదా ఆయుర్వేద ఉత్పత్తులను వాడుతున్నారా?",
      ta: "நீங்கள் தற்போது ஏதேனும் பரிந்துரைக்கப்பட்ட மருந்துகள் அல்லது மூலிகை மருந்துகளை எடுத்துக்கொள்கிறீர்களா?",
      kn: "ನೀವು ಪ್ರಸ್ತುತ ಯಾವುದೇ ಔಷಧಗಳು, ಸಪ್ಲಿಮೆಂಟ್‌ಗಳು ಅಥವಾ ಗಿಡಮೂಲಿಕೆ ಉತ್ಪನ್ನಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ ഇപ്പോൾ എന്തെങ്കിലും അലോപ്പതി മരുന്നുകളോ ആയുർവേദ/ഹെർബൽ ഉൽപ്പന്നങ്ങളോ കഴിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি বর্তমানে কোনো প্রেসক্রিপশনের ওষুধ বা ভেষজ/আয়ুর্বেদিক ওষুধ খাচ্ছেন?",
      mr: "तुम्ही सध्या कोणतीही औषधे, सप्लिमेंट्स किंवा आयुर्वेदिक औषधे घेत आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'medication_names',
        section: 'medications',
        type: 'text_input',
        source: 'FOGSI E-Booklet p. 16: Review medications for safety, efficacy & dosing adjustments',
        question: {
          en: "Please list the names of the medicines you take and the reasons for taking them: (We will flag them for your doctor to review for pregnancy safety)",
          hi: "कृपया अपनी दवाओं के नाम और लेने का कारण लिखें: (हम आपके डॉक्टर को गर्भावस्था सुरक्षा के लिए इनकी समीक्षा करने के लिए सूचित करेंगे)",
          te: "దయచేసి మీరు తీసుకుంటున్న మందుల పేర్లను రాయండి: (వైద్యుని సమీక్ష కోసం మేము వీటిని ఫ్లాగ్ చేస్తాము)",
          ta: "தயவுசெய்து நீங்கள் எடுத்துக்கொள்ளும் மருந்துகளின் பெயர்களைக் குறிப்பிடவும்:",
          kn: "ದಯವಿಟ್ಟು ನೀವು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿರುವ ಔಷಧಿಗಳ ಹೆಸರುಗಳನ್ನು ಬರೆಯಿರಿ:",
          ml: "നിങ്ങൾ കഴിക്കുന്ന മരുന്നുകളുടെ പേരുകൾ എഴുതുക:",
          bn: "দয়া করে আপনি যে ওষুধগুলি খান তার নাম এবং কারণ লিখুন:",
          mr: "कृपया तुम्ही घेत असलेल्या औषधांची नावे आणि कारण लिहा:"
        }
      }
    ]
  },
  {
    id: 'folic_acid_status',
    section: 'medications',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 11, 18, 21, 23, 25 & Checklist #6: Folic acid 400-800 mcg low risk, 4-5 mg high risk; neural tube closes by 28 days',
    question: {
      en: "Are you currently taking Folic Acid tablets daily?",
      hi: "क्या आप अभी रोज़ाना फोलिक एसिड (Folic Acid) की गोली ले रही हैं?",
      te: "మీరు ప్రస్తుతం రోజూ ఫోలిక్ యాసిడ్ (Folic Acid) మాత్రలు తీసుకుంటున్నారా?",
      ta: "நீங்கள் தற்போது தினமும் ஃபோலிக் அமிலம் (Folic Acid) மாத்திரை சாப்பிடுகிறீர்களா?",
      kn: "ನೀವು ಪ್ರಸ್ತುತ ಪ್ರತಿದಿನ ಫೋಲಿಕ್ ಆಮ್ಲ (Folic Acid) ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ ഇപ്പോൾ ദിവസവും ഫോളിക് ആസിഡ് (Folic Acid) ഗുളിക കഴിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি বর্তমানে প্রতিদিন ফলিক অ্যাসিড (Folic Acid) ট্যাবলেট খাচ্ছেন?",
      mr: "तुम्ही सध्या दररोज फॉलिक ॲसिड (Folic Acid) गोळ्या घेत आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'folic_acid_dose',
        section: 'medications',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 18, 21: Low risk 400-800 mcg/day; High risk (diabetes, epilepsy, prior NTD) 4-5 mg/day',
        question: {
          en: "Do you know what dose of Folic Acid you are taking?",
          hi: "क्या आपको पता है कि आप फोलिक एसिड की कितनी खुराक (डोज़) ले रही हैं?",
          te: "మీరు తీసుకుంటున్న ఫోలిక్ యాసిడ్ మోతాదు తెలుసా?",
          ta: "நீங்கள் எடுத்துக்கொள்ளும் ஃபோலிக் அமிலத்தின் அளவு தெரியுமா?",
          kn: "ನೀವು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿರುವ ಫೋಲಿಕ್ ಆಮ್ಲದ ಪ್ರಮಾಣ ತಿಳಿದಿದೆಯೇ?",
          ml: "കഴിക്കുന്ന ഫോളിക് ആസിഡിന്റെ അളവ് എത്രയെന്ന് അറിയാമോ?",
          bn: "আপনি ফলিক অ্যাসিডের কী পরিমাণ ডোজ খাচ্ছেন জানেন কি?",
          mr: "तुम्ही फॉलिक ॲसिडचा किती डोस घेत आहात हे माहीत आहे का?"
        },
        options: [
          { value: 'standard_400_800', label: { en: 'Standard dose (400–800 μg or 0.4–0.8 mg)', hi: 'सामान्य डोज़ (400–800 माइक्रोग्राम या 0.5 mg)', te: 'సాధారణ మోతాదు (400–800 మైక్రోగ్రాములు)', ta: 'நிலையான அளவு (400–800 மைக்ரோகிராம்)', kn: 'ಸಾಮಾನ್ಯ ಪ್ರಮಾಣ (400–800 ಮೈಕ್ರೋಗ್ರಾಂ)', ml: 'സാധാരണ ഡോസ് (400–800 മൈക്രോഗ്രാം)', bn: 'সাধারণ মাত্রা (৪০০–৮০০ মাইক্রোগ্রাম)', mr: 'सामान्य डोस (४००–८०० मायक्रोग्रॅम)' } },
          { value: 'high_5mg', label: { en: 'High dose (5 mg daily)', hi: 'हाई डोज़ (5 मिलीग्राम प्रतिदिन)', te: 'అధిక మోతాదు (5 మి.గ్రా)', ta: 'அதிக அளவு (5 மிகி)', kn: 'ಹೆಚ್ಚಿನ ಪ್ರಮಾಣ (5 ಮಿಲಿಗ್ರಾಂ)', ml: 'കൂടിയ ഡോസ് (5 മില്ലിഗ്രാം)', bn: 'উচ্চ মাত্রা (৫ মিলিগ্রাম)', mr: 'जास्त डोस (५ मिग्रॅ प्रतिदिन)' } },
          { value: 'unknown', label: { en: 'Not sure of the exact strength', hi: 'सटीक मात्रा पता नहीं है', te: 'ఖచ్చితమైన మోతాదు తెలియదు', ta: 'சரியான அளவு தெரியாது', kn: 'ನಿಖರವಾದ ಪ್ರಮಾಣ ತಿಳಿದಿಲ್ಲ', ml: 'കൃത്യമായ അളവ് അറിയില്ല', bn: 'সঠিক মাত্রা নিশ্চিত নই', mr: 'डोस नक्की माहीत नाही' } }
        ]
      }
    ]
  },

  // SECTION 5: FAMILY & GENETIC HISTORY
  {
    id: 'family_genetic',
    section: 'family',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 9, 15 & Checklist #4C: Thalassemia screening of utmost importance, Sickle cell, SMA, Cystic Fibrosis',
    question: {
      en: "Does anyone in your family or your partner's family have Thalassemia, Sickle Cell, or another inherited genetic condition?",
      hi: "क्या आपके या आपके पति के परिवार में थैलेसीमिया (Thalassemia), सिकल सेल या कोई अन्य आनुवंशिक बीमारी है?",
      te: "మీ కుటుంబంలో లేదా మీ భర్త కుటుంబంలో తలసేమియా, సికిల్ సెల్ వంటి జన్యుపరమైన రక్త వ్యాధులు ఉన్నాయా? (Thalassemia)",
      ta: "உங்கள் அல்லது உங்கள் துணையின் குடும்பத்தில் தலசீமியா (Thalassemia) அல்லது மரபணு நோய்கள் ஏதேனும் உள்ளதா?",
      kn: "ನಿಮ್ಮ ಅಥವಾ ನಿಮ್ಮ ಪತಿಯ ಕುಟುಂಬದಲ್ಲಿ ಥಲಸ್ಸೆಮಿಯಾ (Thalassemia) ಅಥವಾ ಆನುವಂಶಿಕ ಕಾಯಿಲೆಗಳಿವೆಯೇ?",
      ml: "നിങ്ങളുടെയോ പങ്കാളിയുടെയോ കുടുംബത്തിൽ തലസീമിയ (Thalassemia) പോലുള്ള പാരമ്പര്യ രോഗങ്ങളുണ്ടോ?",
      bn: "আপনার বা আপনার সঙ্গীর পরিবারে থ্যালাসেমিয়া (Thalassemia) বা কোনো বংশগত রোগ আছে কি?",
      mr: "तुमच्या किंवा तुमच्या पतीच्या कुटुंबात थॅलेसेमिया (Thalassemia) किंवा इतर अनुवांशिक आजार आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'genetic_condition_details',
        section: 'family',
        type: 'text_input',
        source: 'FOGSI E-Booklet p. 15: Refer for genetic counselling; prenatal carrier screening',
        question: {
          en: "Which condition is present and which family relative has it?",
          hi: "परिवार में कौन सी बीमारी है और किस रिश्तेदार को है?",
          te: "కుటుంబంలో ఏ సమస్య ఉంది మరియు ఎవరికి ఉంది?",
          ta: "குடும்பத்தில் யாருக்கு என்ன பாதிப்பு உள்ளது?",
          kn: "ಯಾವ ಕಾಯಿಲೆ ಇದೆ ಮತ್ತು ಯಾರಿಗೆ ಇದೆ?",
          ml: "കുടുംബത്തിൽ ആർക്കാണ്, എന്ത് അസുഖമാണ് ഉള്ളത്?",
          bn: "পরিবারে কার এবং কী রোগ আছে?",
          mr: "कुटुंबात कोणाला आणि कोणता आजार आहे?"
        }
      }
    ]
  },

  // SECTION 6: INFECTIONS & IMMUNITY SCREENING
  {
    id: 'tested_rubella',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 17, 24 & Checklist #8: Screen Rubella IgG; give MMR if non-immune and avoid pregnancy >=4 weeks (28 days)',
    question: {
      en: "Do you know if you are immune to Rubella (German Measles) or if you received the MMR vaccine?",
      hi: "क्या आपको पता है कि आप रूबेला (जर्मन खसरा) से सुरक्षित हैं या आपने MMR का टीका लगवाया है? (Rubella/MMR)",
      te: "మీరు రుబెల్లా (జర్మన్ మీజిల్స్) నుండి రోగనిరోధకత కలిగి ఉన్నారా లేదా MMR టీకా తీసుకున్నారా?",
      ta: "உங்களுக்கு ருபெல்லா (Rubella) நோய் எதிர்ப்பு சக்தி உள்ளதா அல்லது MMR தடுப்பூசி போட்டுள்ளீர்களா?",
      kn: "ನೀವು ರುಬೆಲ್ಲಾ (Rubella) ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಹೊಂದಿದ್ದೀರಾ ಅಥವಾ MMR ಲಸಿಕೆ ಪಡೆದಿದ್ದೀರಾ?",
      ml: "റുബെല്ല (Rubella) രോഗത്തിനെതിരെ പ്രതിരോധശേഷിയുണ്ടോ അല്ലെങ്കിൽ MMR വാക്സിൻ എടുത്തിട്ടുണ്ടോ?",
      bn: "আপনি কি রুবেলা (জার্মান হাম) সুরক্ষিত বা MMR টিকা নিয়েছেন? (Rubella/MMR)",
      mr: "तुम्हाला रुबेला (Rubella) आजाराविरुद्ध प्रतिकारशक्ती आहे का किंवा MMR लस घेतली आहे का?"
    },
    options: [
      { value: 'immune_vaccinated', label: { en: 'Yes, vaccinated / test showed immune', hi: 'हाँ, टीका लगा है / जांच में सुरक्षित पाया गया', te: 'అవును, టీకా తీసుకున్నాను / రోగనిరోధకత ఉంది', ta: 'ஆம், தடுப்பூசி போட்டுள்ளேன்', kn: 'ಹೌದು, ಲಸಿಕೆ ಪಡೆದಿದ್ದೇನೆ', ml: 'അതെ, വാക്സിൻ എടുത്തിട്ടുണ്ട്', bn: 'হ্যাঁ, টিকা নেওয়া আছে', mr: 'होय, लस घेतली आहे / सुरक्षित आहे' } },
      { value: 'not_immune', label: { en: 'No, not immune / not vaccinated', hi: 'नहीं, टीका नहीं लगा है / सुरक्षित नहीं हूँ', te: 'లేదు, రోగనిరోధకత లేదు', ta: 'இல்லை, தடுப்பூசி போடவில்லை', kn: 'ಇಲ್ಲ, ಲಸಿಕೆ ಪಡೆದಿಲ್ಲ', ml: 'അല്ല, പ്രതിരോധശേഷിയില്ല', bn: 'না, টিকা নেওয়া নেই', mr: 'नाही, लस घेतलेली नाही' } },
      { value: 'not_sure', label: { en: 'Not sure / don\'t remember', hi: 'पता नहीं / याद नहीं है', te: 'ఖచ్చితంగా తెలియదు', ta: 'நிச்சயமாகத் தெரியவில்லை', kn: 'ಖಚಿತವಿಲ್ಲ', ml: 'ഉറപ്പില്ല', bn: 'নিশ্চিত নই', mr: 'नक्की माहीत नाही' } }
    ]
  },
  {
    id: 'tested_varicella',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 17, 24 & Checklist #8: Varicella live vaccine, wait 4 weeks after dose',
    question: {
      en: "Have you had chickenpox in the past, or have you received the chickenpox (Varicella) vaccine?",
      hi: "क्या आपको पहले कभी चेचक/माता (Chickenpox) हुआ है या आपने इसका टीका लगवाया है?",
      te: "మీకు గతంలో ఆటలమ్మ (చికెన్ పాక్స్) వచ్చిందా లేదా టీకా తీసుకున్నారా? (Varicella)",
      ta: "உங்களுக்கு முன்பு சின்னம்மை (Chickenpox) வந்துள்ளதா அல்லது தடுப்பூசி போட்டுள்ளீர்களா?",
      kn: "ನಿಮಗೆ ಈ ಹಿಂದೆ ಚಿಕನ್ ಪಾಕ್ಸ್ (ಅಮ್ಮ) ಬಂದಿತ್ತೇ ಅಥವಾ ಲಸಿಕೆ ಪಡೆದಿದ್ದೀರಾ?",
      ml: "മുമ്പ് ചിക്കൻപോക്സ് വന്നിട്ടുണ്ടോ അല്ലെങ്കിൽ വാക്സിൻ എടുത്തിട്ടുണ്ടോ?",
      bn: "আপনার কি আগে চিকেনপক্স (জলবসন্ত) হয়েছিল বা এর টিকা নিয়েছেন?",
      mr: "तुम्हाला आधी कांजिण्या (Chickenpox) आल्या होत्या का किंवा लस घेतली आहे का?"
    },
    options: [
      { value: 'had_disease_or_vaccine', label: { en: 'Yes, had chickenpox or took vaccine', hi: 'हाँ, चिकनपॉक्स हुआ था या टीका लिया था', te: 'అవును, వచ్చింది లేదా టీకా తీసుకున్నాను', ta: 'ஆம், வந்துள்ளது அல்லது தடுப்பூசி போட்டேன்', kn: 'ಹೌದು, ಬಂದಿತ್ತು ಅಥವಾ ಲಸಿಕೆ ಹಾಕಿಸಿಕೊಂಡಿದ್ದೇನೆ', ml: 'അതെ, വന്നിട്ടുണ്ട് അല്ലെങ്കിൽ വാക്സിൻ എടുത്തിട്ടുണ്ട്', bn: 'হ্যাঁ, হয়েছিল বা টিকা নিয়েছি', mr: 'होय, झाले होते किंवा लस घेतली होती' } },
      { value: 'never_had_or_vaccinated', label: { en: 'No, never had chickenpox nor vaccinated', hi: 'नहीं, कभी नहीं हुआ और न ही टीका लगा', te: 'లేదు, ఎప్పుడూ రాలేదు / టీకా తీసుకోలేదు', ta: 'இல்லை, வரவும் இல்லை தடுப்பூசியும் போடவில்லை', kn: 'ಇಲ್ಲ, ಎಂದೂ ಬಂದಿಲ್ಲ / ಲಸಿಕೆ ಪಡೆದಿಲ್ಲ', ml: 'ഇല്ല, ഒരിക്കലും വന്നിട്ടില്ല / എടുത്തിട്ടില്ല', bn: 'না, কখনো হয়নি বা টিকা নিইনি', mr: 'नाही, कधीच झाले नाही व लस घेतली नाही' } },
      { value: 'not_sure', label: { en: 'Not sure', hi: 'निश्चित रूप से पता नहीं', te: 'తెలియదు', ta: 'தெரியாது', kn: 'ಗೊತ್ತಿಲ್ಲ', ml: 'അറിയില്ല', bn: 'নিশ্চিত নই', mr: 'माहित नाही' } }
    ]
  },
  {
    id: 'tested_hepb_hiv',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 12, 16, 22 & Checklist #4B: HIV, HBsAg, VDRL/Syphilis testing',
    question: {
      en: "Have you ever been tested for Hepatitis B or HIV, or do you know your status?",
      hi: "क्या आपकी कभी हेपेटाइटिस बी (Hepatitis B) या एचआईवी (HIV) की जांच हुई है?",
      te: "మీకు ఎప్పుడైనా హెపటైటిస్ బి లేదా హెచ్ఐవి పరీక్ష జరిగిందా? (Hepatitis B / HIV)",
      ta: "உங்களுக்கு எப்போதாவது ஹெபடைடிஸ் பி அல்லது எச்.ஐ.வி பரிசோதனை செய்யப்பட்டுள்ளதா?",
      kn: "ನೀವು ಎಂದಾದರೂ ಹೆಪಟೈಟಿಸ್ ಬಿ ಅಥವಾ ಎಚ್‌ಐವಿ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿಕೊಂಡಿದ್ದೀರಾ?",
      ml: "ഹെപ്പറ്റൈറ്റിസ് ബി അല്ലെങ്കിൽ എച്ച്.ഐ.വി പരിശോധന നടത്തിയിട്ടുണ്ടോ?",
      bn: "আপনার কি হেপাটাইটিস বি বা এইচআইভি পরীক্ষা করা হয়েছে কখনো?",
      mr: "तुम्ही कधी हिपॅटायटीस बी किंवा एचआयव्ही तपासणी केली आहे का?"
    },
    options: [
      { value: 'tested_negative', label: { en: 'Yes, tested negative', hi: 'हाँ, जांच में नेगेटिव आया था', te: 'అవును, నెగటివ్ వచ్చింది', ta: 'ஆம், நெகட்டிவ் என்று வந்தது', kn: 'ಹೌದು, ನೆಗೆಟಿವ್ ಬಂದಿದೆ', ml: 'അതെ, നെഗറ്റീവ് ആയിരുന്നു', bn: 'হ্যাঁ, নেগেটিভ রিপোর্ট ছিল', mr: 'होय, निगेटिव्ह आले होते' } },
      { value: 'never_tested', label: { en: 'Never been tested', hi: 'कभी जांच नहीं कराई', te: 'ఎప్పుడూ పరీక్షించలేదు', ta: 'பரிசோதிக்கவில்லை', kn: 'ಎಂದೂ ಪರೀಕ್ಷಿಸಿಲ್ಲ', ml: 'പരിശോധിച്ചിട്ടില്ല', bn: 'কখনো পরীক্ষা করাইনি', mr: 'कधीही तपासणी केली नाही' } },
      { value: 'known_positive', label: { en: 'Tested positive / undergoing care', hi: 'पॉजिटिव आया था / इलाज चल रहा है', te: 'పాజిటివ్ వచ్చింది / చికిత్సలో ఉన్నాను', ta: 'பாசிட்டிவ் / சிகிச்சை எடுக்கிறேன்', kn: 'ಪಾಸಿಟಿವ್ / ಚಿಕಿತ್ಸೆಯಲ್ಲಿದ್ದೇನೆ', ml: 'പോസിറ്റീവ് / ചികിത്സയിലാണ്', bn: 'পজিটিভ / চিকিৎসার মধ্যে আছি', mr: 'पॉझिटिव्ह / उपचार सुरू आहेत' } },
      { value: 'not_sure', label: { en: 'Not sure', hi: 'पता नहीं', te: 'తెలియదు', ta: 'தெரியாது', kn: 'ಗೊತ್ತಿಲ್ಲ', ml: 'അറിയില്ല', bn: 'নিশ্চিত নই', mr: 'माहित नाही' } }
    ]
  },
  {
    id: 'history_tuberculosis',
    section: 'infections',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet p. 15 & Checklist #4B: Tuberculosis screening (if indicated)',
    question: {
      en: "Have you or your partner ever been treated for Tuberculosis (TB), or had chronic cough/fever recently?",
      hi: "क्या आपको या आपके साथी को कभी टीबी (Tuberculosis) की बीमारी रही है या हाल ही में लंबे समय से खांसी/बुखार है?",
      te: "మీకు లేదా మీ భాగస్వామికి ఎప్పుడైనా క్షయ (టీబీ) వ్యాధి వచ్చిందా? (Tuberculosis)",
      ta: "உங்களுக்கு அல்லது உங்கள் துணைக்கு காசநோய் (TB) பாதிப்பு ஏற்பட்டுள்ளதா?",
      kn: "ನಿಮಗೆ ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿಗೆ ಕ್ಷಯರೋಗ (TB) ಇತ್ತೇ?",
      ml: "നിങ്ങൾക്കോ പങ്കാളിക്കോ ക്ഷയരോഗം (TB) വന്നിട്ടുണ്ടോ?",
      bn: "আপনার বা আপনার সঙ্গীর কি কখনো যক্ষ্মা (TB) হয়েছিল?",
      mr: "तुम्हाला किंवा तुमच्या जोडीदाराला कधी क्षयरोग (टीबी) झाला होता का?"
    }
  },

  // SECTION 7: OCCUPATIONAL & ENVIRONMENTAL EXPOSURES
  {
    id: 'environmental_hazards',
    section: 'environment',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 17, 19, 20 & Checklist #4D: Screen lead, pesticides, solvents, radiation, heat, biomass fuel',
    question: {
      en: "Does your work or home involve pesticides, chemical solvents, radiation, heavy metals, indoor chulha/wood smoke, or extreme heat?",
      hi: "क्या आपके काम या घर के वातावरण में कीटनाशक (pesticides), रसायन, एक्स-रे/रेडिएशन, चूल्हे का धुआं या बहुत तेज गर्मी का संपर्क होता है?",
      te: "మీ పని లేదా ఇంట్లో పురుగుమందులు, రసాయనాలు, రేడియేషన్, పొగ లేదా తీవ్రమైన వేడికి గురవుతున్నారా?",
      ta: "உங்கள் வேலை அல்லது வீட்டில் பூச்சிக்கொல்லிகள், ரசாயனங்கள், கதிர்வீச்சு, அடுப்பு புகை அல்லது அதிக வெப்பம் உள்ளதா?",
      kn: "ನಿಮ್ಮ ಕೆಲಸ ಅಥವಾ ಮನೆಯಲ್ಲಿ ಕೀಟನಾಶಕಗಳು, ರಾಸಾಯನಿಕಗಳು, ವಿಕಿರಣ ಅಥವಾ ಅತಿಯಾದ ಶಾಖದ ಸಂಪರ್ಕವಿದೆಯೇ?",
      ml: "ജോലിസ്ഥലത്തോ വീട്ടിലോ കീടനാശിനികൾ, രാസവസ്തുക്കൾ, വികിരണങ്ങൾ, പുക അല്ലെങ്കിൽ കഠിനമായ ചൂട് എന്നിവ ഏൽക്കാറുണ്ടോ?",
      bn: "আপনার কর্মক্ষেত্র বা বাড়িতে কি কীটনাশক, রাসায়নিক, তেজস্ক্রিয়তা, কাঠের ধোঁয়া বা অতিরিক্ত তাপমাত্রার সংস্পর্শ রয়েছে?",
      mr: "तुमच्या कामाच्या ठिकाणी किंवा घरी कीटकनाशके, रसायने, रेडिएशन, धूर किंवा अतिउष्णतेचा संपर्क येतो का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'hazard_types',
        section: 'environment',
        type: 'multi_select',
        source: 'FOGSI E-Booklet p. 19-20: Ambient air, heavy metals, EDC/plastics, agrochemicals, solvents, heat, biomass',
        question: {
          en: "What specific environmental exposures are present? (Select all that apply)",
          hi: "इनमें से कौन से जोखिम मौजूद हैं? (सभी लागू विकल्प चुनें)",
          te: "వీటిలో ఏ అంశాలు మీకు ఎదురవుతున్నాయి?",
          ta: "குறிப்பிட்ட பாதிப்புகள் எவை? (பொருந்துபவற்றைத் தேர்ந்தெடுக்கவும்)",
          kn: "ಯಾವ ನಿರ್ದಿಷ್ಟ ಅಪಾಯಗಳು ಕಂಡುಬರುತ್ತವೆ?",
          ml: "ഇതിൽ ഏതൊക്കെയാണ് നിങ്ങളുടെ ചുറ്റുപാടിലുള്ളത്?",
          bn: "কোন কোন পরিবেশগত ঝুঁকি উপস্থিত রয়েছে? (প্রযোজ্যগুলি নির্বাচন করুন)",
          mr: "यापैकी नेमका कशाचा संपर्क येतो? (लागू असलेले सर्व निवडा)"
        },
        options: [
          { value: 'pesticides', label: { en: 'Agricultural pesticides / gardening chemicals', hi: 'खेती के कीटनाशक / रासायनिक खाद', te: 'పురుగుమందులు / రసాయన ఎరువులు', ta: 'விவசாய பூச்சிக்கொல்லிகள்', kn: 'ಕೃಷಿ ಕೀಟನಾಶಕಗಳು', ml: 'കീടനാശിനികൾ', bn: 'কীটনাশক বা রাসায়নিক সার', mr: 'शेतीची कीटकनाशके / खते' } },
          { value: 'solvents_metals', label: { en: 'Industrial solvents, paints, or heavy metals (lead, mercury)', hi: 'पेंट्स, सॉल्वैंट्स, लेड (सीसा) या भारी धातुएं', te: 'పారిశ్రామిక రసాయనాలు / పెయింట్లు / లోహాలు', ta: 'தொழில்துறை கரைப்பான்கள், வண்ணப்பூச்சுகள், உலோகங்கள்', kn: 'ಕೈಗಾರಿಕಾ ದ್ರಾವಕಗಳು, ಬಣ್ಣಗಳು', ml: 'പെയിന്റുകൾ, രാസലായനികൾ, ലെഡ്', bn: 'শিল্প রাসায়নিক, রং বা ভারী ধাতু', mr: 'इंडस्ट्रियल सॉल्व्हेंट्स, पेंट्स, शिसे (Lead)' } },
          { value: 'radiation', label: { en: 'Medical X-rays, ionising radiation, or high lab exposures', hi: 'एक्स-रे या रेडिएशन का संपर्क', te: 'ఎక్స్-రే లేదా రేడియేషన్', ta: 'எக்ஸ்-ரே அல்லது கதிர்வீச்சு', kn: 'ಎಕ್ಸ್-ರೇ ಅಥವಾ ವಿಕಿರಣ', ml: 'എക്സ്-റേ അല്ലെങ്കിൽ റേഡിയേഷൻ', bn: 'এক্স-রে বা রেডিয়েশন', mr: 'एक्स-रे किंवा रेडिएशन' } },
          { value: 'biomass_smoke', label: { en: 'Indoor biomass fuel smoke (wood/chulha smoke)', hi: 'चूल्हे / लकड़ी का धुआं (Indoor smoke)', te: 'కట్టెల పొయ్యి పొగ', ta: 'விறகு அடுப்பு புகை', kn: 'ಒಲೆಯ ಹೊಗೆ / ಕಟ್ಟಿಗೆಯ ಹೊಗೆ', ml: 'വിറകടുപ്പിലെ പുക', bn: 'উনুনের বা কাঠের ধোঁয়া', mr: 'चुलीचा / लाकडाचा धूर' } },
          { value: 'extreme_heat', label: { en: 'Extreme outdoor heatwaves / high heat occupational exposure', hi: 'अत्यधिक गर्मी / लू में काम करना', te: 'తీవ్రమైన ఎండ లేదా వేడి', ta: 'கடும் வெயில் மற்றும் வெப்பம்', kn: 'ಅತಿಯಾದ ಬಿಸಿಲು / ಶಾಖ', ml: 'കഠിനമായ ചൂട് / വെയിൽ', bn: 'প্রচণ্ড গরম বা রোদে কাজ', mr: 'अतिउष्णता / उन्हात काम' } }
        ]
      }
    ]
  },

  // SECTION 8: LIFESTYLE & SUBSTANCE USE (BOTH PARTNERS)
  {
    id: 'tobacco_use',
    section: 'lifestyle',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 12, 20 & Checklist #4E: Tobacco screen BOTH partners; cessation support started at visit',
    question: {
      en: "Do you or your partner currently smoke bidis/cigarettes, vape, or chew tobacco (gutkha, khaini, paan masala)?",
      hi: "क्या आप या आपके साथी बीड़ी, सिगरेट, हुक्का, या तंबाकू (गुटखा, खैनी, पान मसाला) का सेवन करते हैं?",
      te: "మీరు లేదా మీ భాగస్వామి సిగరెట్, బీడీ, గుట్కా లేదా పొగాకు వాడుతున్నారా?",
      ta: "நீங்கள் அல்லது உங்கள் துணை புகைபிடித்தல், குட்கா அல்லது புகையிலை பயன்படுத்துகிறீர்களா?",
      kn: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಸಿಗರೇಟ್, ಬೀಡಿ, ಗುಟ್ಕಾ ಅಥವಾ ತಂಬಾಕು ಬಳಸುತ್ತೀರಾ?",
      ml: "നിങ്ങളോ പങ്കാളിയോ പുകവലിക്കുകയോ പുകയില ഉൽപ്പന്നങ്ങൾ (ഗുട്ക) ഉപയോഗിക്കുകയോ ചെയ്യുന്നുണ്ടോ?",
      bn: "আপনি বা আপনার সঙ্গী কি সিগারেট, বিড়ি, গুটখা বা তামাক ব্যবহার করেন?",
      mr: "तुम्ही किंवा तुमचे जोडीदार विडी, सिगारेट, गुटखा, तंबाखूचे सेवन करता का?"
    },
    options: [
      { value: 'neither', label: { en: 'Neither of us (No tobacco use)', hi: 'हम दोनों में से कोई नहीं', te: 'మాలో ఎవరూ వాడరు', ta: 'இருவரும் இல்லை', kn: 'ನಾವಿಬ್ಬರೂ ಬಳಸುವುದಿಲ್ಲ', ml: 'ഞങ്ങൾ ആരും ഉപയോഗിക്കുന്നില്ല', bn: 'আমরা কেউই না', mr: 'आमच्यापैकी कोणीही नाही' } },
      { value: 'partner_only', label: { en: 'Only my partner uses tobacco', hi: 'केवल मेरे साथी इस्तेमाल करते हैं', te: 'నా భాగస్వామి మాత్రమే', ta: 'என் துணை மட்டும்', kn: 'ನನ್ನ ಸಂಗಾತಿ ಮಾತ್ರ', ml: 'പങ്കാളി മാത്രം', bn: 'শুধু আমার সঙ্গী ব্যবহার করেন', mr: 'फक्त माझे जोडीदार' } },
      { value: 'patient_only', label: { en: 'Only I use tobacco', hi: 'केवल मैं इस्तेमाल करती हूँ', te: 'నేను మాత్రమే', ta: 'நான் மட்டும்', kn: 'ನಾನು ಮಾತ್ರ', ml: 'ഞാൻ മാത്രം', bn: 'শুধু আমি ব্যবহার করি', mr: 'फक्त मी वापरते' } },
      { value: 'both', label: { en: 'Both of us use tobacco', hi: 'हम दोनों इस्तेमाल करते हैं', te: 'మేమిద్దరం వాడుతున్నాం', ta: 'நாங்கள் இருவருமே', kn: 'ನಾವಿಬ್ಬರೂ ಬಳಸುತ್ತೇವೆ', ml: 'ഞങ്ങൾ രണ്ടുപേരും', bn: 'আমরা দুজনেই ব্যবহার করি', mr: 'आम्ही दोघेही वापरतो' } }
    ]
  },
  {
    id: 'alcohol_use',
    section: 'lifestyle',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 12, 20 & Checklist #4E: Alcohol is a teratogen, advise abstinence before attempting conception',
    question: {
      en: "Do you or your partner consume alcoholic drinks?",
      hi: "क्या आप या आपके साथी शराब (Alcohol) का सेवन करते हैं?",
      te: "మీరు లేదా మీ భాగస్వామి మద్యం సేవిస్తారా?",
      ta: "நீங்கள் அல்லது உங்கள் துணை மது அருந்துகிறீர்களா?",
      kn: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಮದ್ಯಪಾನ ಮಾಡುತ್ತೀರಾ?",
      ml: "നിങ്ങളോ പങ്കാളിയോ മദ്യം കഴിക്കാറുണ്ടോ?",
      bn: "আপনি বা আপনার সঙ্গী কি অ্যালকোহল পান করেন?",
      mr: "तुम्ही किंवा तुमचे जोडीदार मद्यपान करता का?"
    },
    options: [
      { value: 'neither', label: { en: 'Neither of us drinks alcohol', hi: 'हम दोनों में से कोई नहीं पीता', te: 'మాలో ఎవరూ తాగరు', ta: 'இருவரும் அருந்துவதில்லை', kn: 'ನಾವಿಬ್ಬರೂ ಮದ್ಯಪಾನ ಮಾಡುವುದಿಲ್ಲ', ml: 'ഞങ്ങൾ ആരും മദ്യപിക്കാറില്ല', bn: 'আমরা কেউই পান করি না', mr: 'आमच्यापैकी कोणीही घेत नाही' } },
      { value: 'partner_only', label: { en: 'Only my partner drinks', hi: 'केवल मेरे साथी पीते हैं', te: 'నా భాగస్వామి మాత్రమే', ta: 'என் துணை மட்டும்', kn: 'ನನ್ನ ಸಂಗಾತಿ ಮಾತ್ರ', ml: 'പങ്കാളി മാത്രം', bn: 'শুধু আমার সঙ্গী পান করেন', mr: 'फक्त माझे जोडीदार' } },
      { value: 'patient_occasional', label: { en: 'I drink occasionally / socially', hi: 'मैं कभी-कभार पीती हूँ', te: 'నేను అప్పుడప్పుడు తాగుతాను', ta: 'நான் எப்போதாவது அருந்துகிறேன்', kn: 'ನಾನು ಸಾಂದರ್ಭಿಕವಾಗಿ ಕುಡಿಯುತ್ತೇನೆ', ml: 'ഞാൻ വല്ലപ്പോഴും കഴിക്കാറുണ്ട്', bn: 'আমি মাঝে মাঝে পান করি', mr: 'मी कधीतरी घेते' } },
      { value: 'both', label: { en: 'Both of us consume alcohol', hi: 'हम दोनों शराब पीते हैं', te: 'మేమిద్దరం తాగుతాము', ta: 'இருவரும் அருந்துகிறோம்', kn: 'ನಾವಿಬ್ಬರೂ ಮದ್ಯಪಾನ ಮಾಡುತ್ತೇವೆ', ml: 'ഞങ്ങൾ രണ്ടുപേരും കഴിക്കാറുണ്ട്', bn: 'আমরা দুজনেই পান করি', mr: 'आम्ही दोघेही घेतो' } }
    ]
  },
  {
    id: 'caffeine_intake',
    section: 'lifestyle',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 12 & Checklist #4E: Caffeine intake linked to miscarriage and low birth weight',
    question: {
      en: "How many cups of coffee, strong tea, or caffeinated energy drinks do you drink each day?",
      hi: "आप रोज़ाना कितने कप चाय, कॉफी या कैफीनयुक्त ड्रिंक पीती हैं?",
      te: "మీరు రోజుకు ఎన్ని కప్పుల టీ లేదా కాఫీ తాగుతారు?",
      ta: "தினமும் எத்தனை கப் காபி அல்லது டீ குடிக்கிறீர்கள்?",
      kn: "ನೀವು ದಿನಕ್ಕೆ ಎಷ್ಟು ಕಪ್ ಚಹಾ ಅಥವಾ ಕಾಫಿ ಕುಡಿಯುತ್ತೀರಿ?",
      ml: "ദിവസവും എത്ര കപ്പ് കാപ്പിയോ ചായയോ കുടിക്കാറുണ്ട്?",
      bn: "আপনি দিনে কত কাপ চা বা কফি খান?",
      mr: "तुम्ही दिवसातून किती कप चहा किंवा कॉफी पिता?"
    },
    options: [
      { value: 'low_0_1', label: { en: '0 to 1 cup daily', hi: '0 से 1 कप प्रतिदिन', te: 'రోజుకు 0 నుండి 1 కప్పు', ta: '0 முதல் 1 கப் வரை', kn: 'ದಿನಕ್ಕೆ 0 ರಿಂದ 1 ಕಪ್', ml: '0 മുതൽ 1 കപ്പ് വരെ', bn: '০ থেকে ১ কাপ', mr: '० ते १ कप प्रतिदिन' } },
      { value: 'moderate_2_3', label: { en: '2 to 3 cups daily', hi: '2 से 3 कप प्रतिदिन', te: 'రోజుకు 2 నుండి 3 కప్పులు', ta: '2 முதல் 3 கப் வரை', kn: 'ದಿನಕ್ಕೆ 2 ರಿಂದ 3 ಕಪ್', ml: '2 മുതൽ 3 കപ്പ് വരെ', bn: '২ থেকে ৩ কাপ', mr: '२ ते ३ कप प्रतिदिन' } },
      { value: 'high_4_plus', label: { en: '4 or more cups daily', hi: '4 या अधिक कप प्रतिदिन', te: 'రోజుకు 4 లేదా అంతకంటే ఎక్కువ కప్పులు', ta: '4 அல்லது அதற்கு மேற்பட்ட கப்', kn: 'ದಿನಕ್ಕೆ 4 ಅಥವಾ ಹೆಚ್ಚು ಕಪ್', ml: '4 കപ്പിൽ കൂടുതൽ', bn: '৪ বা তার বেশি কাপ', mr: '४ किंवा अधिक कप प्रतिदिन' } }
    ]
  },
  {
    id: 'recreational_drugs',
    section: 'lifestyle',
    type: 'yes_no',
    source: 'FOGSI E-Booklet p. 12, 20 & Checklist #4E: Cannabis & recreational drugs linked to impaired fertility and FGR',
    question: {
      en: "Do you or your partner use cannabis, recreational substances, or non-medical drugs?",
      hi: "क्या आप या आपके साथी भांग, गांजा या अन्य नशीले पदार्थों का उपयोग करते हैं?",
      te: "మీరు లేదా మీ భాగస్వామి గంజాయి లేదా ఇతర మత్తు పదార్థాలను వాడుతున్నారా?",
      ta: "நீங்கள் அல்லது உங்கள் துணை கஞ்சா அல்லது போதைப் பொருட்களைப் பயன்படுத்துகிறீர்களா?",
      kn: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಗಾಂಜಾ ಅಥವಾ ಇತರ ಮಾದಕ ದ್ರವ್ಯಗಳನ್ನು ಬಳಸುತ್ತೀರಾ?",
      ml: "കഞ്ചാവ് പോലുള്ള ലഹരിവസ്തുക്കൾ ഉപയോഗിക്കാറുണ്ടോ?",
      bn: "আপনি বা আপনার সঙ্গী কি গাঁজা বা কোনো মাদকদ্রব্য ব্যবহার করেন?",
      mr: "तुम्ही किंवा तुमचे जोडीदार गांजा किंवा इतर अमली पदार्थांचे सेवन करता का?"
    }
  },

  // SECTION 9: MENTAL HEALTH & EMOTIONAL WELLBEING
  {
    id: 'mental_health_history',
    section: 'mental',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 26, 27 & Checklist #9: Universal screening; depression/anxiety history',
    question: {
      en: "Have you ever experienced or been treated for depression, severe anxiety, or another mental health condition?",
      hi: "क्या आपने कभी डिप्रेशन (अवसाद), गंभीर चिंता (Anxiety) या किसी मानसिक स्वास्थ्य समस्या का अनुभव किया है?",
      te: "మీరు ఎప్పుడైనా డిప్రెషన్ లేదా తీవ్రమైన ఆందోళన (Anxiety) సమస్యను ఎదుర్కొన్నారా?",
      ta: "நீங்கள் எப்போதாவது மனச்சோர்வு (Depression) அல்லது தீவிர பதட்டத்தை (Anxiety) அனுபவித்துள்ளீர்களா?",
      kn: "ನೀವು ಎಂದಾದರೂ ಖಿನ್ನತೆ (Depression) ಅಥವಾ ತೀವ್ರ ಆತಂಕವನ್ನು (Anxiety) ಅನುಭವಿಸಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾക്ക് എപ്പോഴെങ്കിലും വിഷാദരോഗമോ കഠിനമായ ഉത്കണ്ഠയോ ഉണ്ടായിട്ടുണ്ടോ?",
      bn: "আপনি কি কখনো ডিপ্রেশন বা অতিরিক্ত উদ্বেগের (Anxiety) সমস্যায় ভুগেছেন?",
      mr: "तुम्हाला कधी डिप्रेशन (उदासीनता) किंवा तीव्र चिंतेचा (Anxiety) त्रास झाला आहे का?"
    }
  },
  {
    id: 'perinatal_mental_history',
    section: 'mental',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 26, 28 & Checklist #9: Prior perinatal mood/psychotic episode is single strongest predictor of recurrence',
    question: {
      en: "In any past pregnancy or after giving birth, did you experience significant emotional distress or postpartum depression?",
      hi: "क्या पिछली किसी गर्भावस्था के दौरान या प्रसव के बाद आपको गंभीर उदासी या पोस्टपार्टम डिप्रेशन हुआ था?",
      te: "గత గర్భధారణ సమయంలో లేదా ప్రసవం తర్వాత తీవ్రమైన మానసిక ఆందోళన ఎదురైందా?",
      ta: "முந்தைய கர்ப்பத்திலோ அல்லது பிரசவத்திற்குப் பிறகோ தீவிர மன உளைச்சலை எதிர்கொண்டீர்களா?",
      kn: "ಹಿಂದಿನ ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಅಥವಾ ಹೆರಿಗೆಯ ನಂತರ ತೀವ್ರ ಮಾನಸಿಕ ಖಿನ್ನತೆ ಅನುಭವಿಸಿದ್ದೀರಾ?",
      ml: "മുൻ ഗർഭകാലത്തോ പ്രസവ ശേഷമോ കഠിനമായ വിഷാദം ഉണ്ടായിട്ടുണ്ടോ?",
      bn: "আগের কোনো গর্ভাবস্থায় বা প্রসবের পরে কি অতিরিক্ত মানসিক বিষণ্নতা হয়েছিল?",
      mr: "मागील गर्भधारणेदरम्यान किंवा प्रसूतीनंतर तीव्र नैराश्य आले होते का?"
    },
    options: [
      { value: 'yes_experienced', label: { en: 'Yes, experienced mood difficulties / depression', hi: 'हाँ, गंभीर उदासी या डिप्रेशन हुआ था', te: 'అవును, మానసిక ఇబ్బందులు కలిగాయి', ta: 'ஆம், மன அழுத்தம் ஏற்பட்டது', kn: 'ಹೌದು, ಮಾನಸಿಕ ಸಮಸ್ಯೆಗಳಾಗಿದ್ದವು', ml: 'അതെ, കഠിനമായ വിഷാദം ഉണ്ടായിരുന്നു', bn: 'হ্যাঁ, মানসিক সমস্যা হয়েছিল', mr: 'होय, नैराश्य आले होते' } },
      { value: 'no', label: { en: 'No, never had emotional complications', hi: 'नहीं, ऐसा कभी नहीं हुआ', te: 'లేదు, ఎప్పుడూ కలగలేదు', ta: 'இல்லை, அப்படி எதுவும் ஏற்படவில்லை', kn: 'ಇಲ್ಲ, ಯಾವುದೇ ಸಮಸ್ಯೆ ಆಗಿಲ್ಲ', ml: 'ഇല്ല, ഒരിക്കലും ഉണ്ടായിട്ടില്ല', bn: 'না, কখনো হয়নি', mr: 'नाही, असा त्रास झाला नाही' } },
      { value: 'first_pregnancy', label: { en: 'Not applicable (Never been pregnant before)', hi: 'लागू नहीं (पहली बार गर्भधारण की योजना है)', te: 'వర్తించదు (ఇది మొదటి గర్భధారణ)', ta: 'பொருந்தாது (முதல் முறை கர்ப்பம்)', kn: 'ಅನ್ವಯಿಸುವುದಿಲ್ಲ (ಮೊದಲ ಗರ್ಭಧಾರಣೆ)', ml: 'ബാധകമല്ല (ആദ്യ ഗർഭധാരണം)', bn: 'প্রযোজ্য নয় (প্রথমবার গর্ভধারণ)', mr: 'लागू नाही (पहिल्यांदाच गर्भधारणा)' } }
    ]
  },
  {
    id: 'psychiatric_medications',
    section: 'mental',
    type: 'yes_no',
    source: 'FOGSI E-Booklet p. 26, 27 & Checklist #9: Never stop psychotropic medication abruptly on positive pregnancy test; joint plan with psychiatry',
    question: {
      en: "Are you currently taking any medicines for mood, sleep, or anxiety?",
      hi: "क्या आप अभी मूड, नींद या चिंता के लिए कोई दवा ले रही हैं?",
      te: "మీరు ప్రస్తుతం నిద్ర, మూడ్ లేదా ఆందోళన కోసం మందులు వాడుతున్నారా?",
      ta: "மனநிலை, தூக்கம் அல்லது பதட்டத்திற்காக தற்போது மாத்திரைகள் சாப்பிடுகிறீர்களா?",
      kn: "ನೀವು ಪ್ರಸ್ತುತ ನಿದ್ರೆ ಅಥವಾ ಆತಂಕಕ್ಕೆ ಯಾವುದೇ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
      ml: "ഉറക്കത്തിനോ ഉത്കണ്ഠയ്ക്കോ ഇപ്പോൾ മരുന്നുകൾ കഴിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি এখন ঘুম বা উদ্বেগের জন্য কোনো ওষুধ খাচ্ছেন?",
      mr: "तुम्ही सध्या झोप किंवा चिंतेसाठी कोणतीही औषधे घेत आहात का?"
    }
  },
  {
    id: 'stress_safety',
    section: 'mental',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 9, 26, 27 & Checklist #1, #2: Psychosocial risk and IPV (Intimate Partner Violence) screening; safety planning',
    question: {
      en: "Do you feel safe and emotionally supported in your home and relationship?",
      hi: "क्या आप अपने घर और वैवाहिक रिश्ते में सुरक्षित और समर्थित महसूस करती हैं?",
      te: "మీ ఇంట్లో మరియు సంబంధంలో మీరు సురక్షితంగా మరియు మద్దతుగా ఉన్నట్లు భావిస్తున్నారా?",
      ta: "உங்கள் வீட்டிலும் உறவிலும் நீங்கள் பாதுகாப்பாக உணர்கிறீர்களா?",
      kn: "ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ಮತ್ತು ಸಂಬಂಧದಲ್ಲಿ ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಾ?",
      ml: "വീട്ടിലും ബന്ധങ്ങളിലും നിങ്ങൾ സുരക്ഷിതയാണെന്ന് കരുതുന്നുണ്ടോ?",
      bn: "আপনি কি আপনার বাড়িতে এবং সম্পর্কে নিরাপদ ও সুরক্ষিত বোধ করেন?",
      mr: "तुम्हाला तुमच्या घरी आणि नात्यात सुरक्षित आणि आधार वाटतो का?"
    },
    options: [
      { value: 'safe_supported', label: { en: 'Yes, I feel safe and well supported', hi: 'हाँ, मैं सुरक्षित महसूस करती हूँ', te: 'అవును, నేను సురక్షితంగా ఉన్నాను', ta: 'ஆம், நான் பாதுகாப்பாக உணர்கிறேன்', kn: 'ಹೌದು, ನಾನು ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ', ml: 'അതെ, സുരക്ഷിതയാണ്', bn: 'হ্যাঁ, আমি নিরাপদ বোধ করি', mr: 'होय, मला सुरक्षित वाटते' } },
      { value: 'experiencing_stress', label: { en: 'Facing significant relationship or family stress', hi: 'पारिवारिक या रिश्ते में तनाव का सामना कर रही हूँ', te: 'తీవ్రమైన ఒత్తిడిని ఎదుర్కొంటున్నాను', ta: 'குடும்பத்தில் அதிக மன அழுத்தம் உள்ளது', kn: 'ಕುಟುಂಬದಲ್ಲಿ ತೀವ್ರ ಒತ್ತಡವಿದೆ', ml: 'കുടുംബത്തിൽ മാനസിക സമ്മർദ്ദമുണ്ട്', bn: 'পারিবারিক মানসিক চাপের মধ্যে আছি', mr: 'कौटुंबिक ताणतणाव आहे' } },
      { value: 'prefer_private_doctor', label: { en: 'I prefer to discuss this privately with my doctor', hi: 'मैं इस बारे में डॉक्टर से अकेले में बात करना चाहूंगी', te: 'నేను వైద్యునితో వ్యక్తిగతంగా మాట్లాడాలనుకుంటున్నాను', ta: 'மருத்துவரிடம் தனியாகப் பேச விரும்புகிறேன்', kn: 'ವೈದ್ಯರೊಂದಿಗೆ ಖಾಸಗಿಯಾಗಿ ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ', ml: 'ഡോക്ടറോട് നേരിട്ട് സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നു', bn: 'ডাক্তারের সাথে গোপনে আলোচনা করতে চাই', mr: 'मला डॉक्टरांशी खाजगीत बोलायला आवडेल' } }
    ]
  },

  // SECTION 10: NUTRITION & DAILY WELLNESS
  {
    id: 'nutrition_diet',
    section: 'nutrition',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 11, 25 & Checklist #6: Healthy diet rich in fruits, nuts, multivitamin; avoid mercury fish & undercooked meat',
    question: {
      en: "What best describes your usual daily diet?",
      hi: "आपकी सामान्य दैनिक भोजन शैली कैसी है?",
      te: "మీ సాధారణ రోజువారీ ఆహార విధానం ఏమిటి?",
      ta: "உங்கள் வழக்கமான உணவு முறை என்ன?",
      kn: "ನಿಮ್ಮ ಸಾಮಾನ್ಯ ಆಹಾರ ಪದ್ಧತಿ ಯಾವುದು?",
      ml: "സാധാരണ ഭക്ഷണരീതി എങ്ങനെയാണ്?",
      bn: "আপনার দৈনন্দিন খাদ্যাভ্যাস কেমন?",
      mr: "तुमची सामान्य दैनंदिन आहार पद्धत कोणती आहे?"
    },
    options: [
      { value: 'vegetarian', label: { en: 'Vegetarian (Plant foods, dairy)', hi: 'शाकाहारी (सब्जियां, दालें, दूध)', te: 'శాకాహారం', ta: 'சைவ உணவு', kn: 'ಸಸ್ಯಾಹಾರಿ', ml: 'സസ്യാഹാരം', bn: 'নিরামিষাশী', mr: 'शाकाहारी' } },
      { value: 'non_vegetarian', label: { en: 'Non-vegetarian (Includes eggs, meat, fish)', hi: 'मांसाहारी (अंडे, मांस, मछली शामिल)', te: 'మాంసాహారం', ta: 'அசைவ உணவு', kn: 'ಮಾಂಸಾಹಾರಿ', ml: 'മാംസാഹാരം', bn: 'আমিষাশী', mr: 'मांसाहारी' } },
      { value: 'vegan', label: { en: 'Vegan (Strictly plant-based, no dairy)', hi: 'वीगन (केवल पौधे आधारित, कोई डेयरी नहीं)', te: 'వీగన్ (పాల పదార్థాలు ఉండవు)', ta: 'வீகன் உணவு', kn: 'ವೀಗನ್', ml: 'വീഗൻ', bn: 'সম্পূর্ণ উদ্ভিদভিত্তিক (ভেগান)', mr: 'व्हींगन (दुग्धजन्य पदार्थ नाही)' } }
    ]
  },
  {
    id: 'hydration_water',
    section: 'nutrition',
    type: 'yes_no',
    source: 'FOGSI E-Booklet p. 12 & Checklist #10: Hydration: at least 8–10 glasses of water a day',
    question: {
      en: "Do you regularly drink at least 8 to 10 glasses of clean water daily?",
      hi: "क्या आप रोज़ाना कम से कम 8 से 10 गिलास पानी पीती हैं?",
      te: "మీరు రోజూ కనీసం 8 నుండి 10 గ్లాసుల నీరు తాగుతారా?",
      ta: "தினமும் குறைந்தது 8 முதல் 10 டம்ளர் தண்ணீர் குடிக்கிறீர்களா?",
      kn: "ನೀವು ಪ್ರತಿದಿನ ಕನಿಷ್ಠ 8 ರಿಂದ 10 ಲೋಟ ನೀರು ಕುಡಿಯುತ್ತೀರಾ?",
      ml: "ദിവസവും കുറഞ്ഞത് 8 മുതൽ 10 ഗ്ലാസ് വെള്ളം കുടിക്കാറുണ്ടോ?",
      bn: "আপনি কি প্রতিদিন অন্তত ৮ থেকে ১০ গ্লাস জল পান করেন?",
      mr: "तुम्ही दररोज किमान ८ ते १० ग्लास पाणी पिता का?"
    }
  },
  {
    id: 'physical_exercise',
    section: 'nutrition',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 12 & Checklist #10: Moderate exercise >=30 min/day, 5 days/week',
    question: {
      en: "Do you engage in regular moderate physical activity (such as brisk walking or yoga for 30 minutes)?",
      hi: "क्या आप नियमित व्यायाम (जैसे 30 मिनट तेज चलना या योग) करती हैं?",
      te: "మీరు రోజూ కనీసం 30 నిమిషాలు వ్యాయామం లేదా నడక చేస్తారా?",
      ta: "வழக்கமான உடற்பயிற்சி (30 நிமிட நடைப்பயிற்சி/யோகா) செய்கிறீர்களா?",
      kn: "ನೀವು ನಿಯಮಿತವಾಗಿ ಕನಿಷ್ಠ 30 ನಿಮಿಷಗಳ ಕಾಲ ವ್ಯಾಯಾಮ ಅಥವಾ ನಡಿಗೆ ಮಾಡುತ್ತೀರಾ?",
      ml: "ദിവസവും 30 മിനിറ്റ് വ്യായാമം അല്ലെങ്കിൽ നടത്തം ചെയ്യാറുണ്ടോ?",
      bn: "আপনি কি নিয়মিত অন্তত ৩০ মিনিট ব্যায়াম বা হাঁটাচলা করেন?",
      mr: "तुम्ही नियमित व्यायाम (३० मिनिटे चालणे किंवा योगासने) करता का?"
    },
    options: [
      { value: 'regular_30m_5d', label: { en: 'Yes, at least 30 min, 4–5 days a week', hi: 'हाँ, हफ्ते में 4–5 दिन 30 मिनट', te: 'అవును, వారానికి 4-5 రోజులు', ta: 'ஆம், வாரத்தில் 4-5 நாட்கள்', kn: 'ಹೌದು, ವಾರಕ್ಕೆ 4-5 ದಿನಗಳು', ml: 'അതെ, ആഴ്ചയിൽ 4-5 ദിവസം', bn: 'হ্যাঁ, সপ্তাহে ৪-৫ দিন', mr: 'होय, आठवड्यातून ४-५ दिवस' } },
      { value: 'occasional', label: { en: 'Occasional / 1–2 days a week', hi: 'कभी-कभार / 1–2 दिन', te: 'అప్పుడప్పుడు / 1-2 రోజులు', ta: 'எப்போதாவது / 1-2 நாட்கள்', kn: 'ಸಾಂದರ್ಭಿಕವಾಗಿ / 1-2 ದಿನಗಳು', ml: 'വല്ലപ്പോഴും / 1-2 ദിവസം', bn: 'মাঝে মাঝে / ১-২ দিন', mr: 'कधीतरी / आठवड्यातून १-२ दिवस' } },
      { value: 'minimal_none', label: { en: 'Minimal or no regular exercise', hi: 'बहुत कम या बिल्कुल नहीं', te: 'చాలా తక్కువ / లేదు', ta: 'மிகக் குறைவு அல்லது இல்லை', kn: 'ತುಂಬಾ ಕಡಿಮೆ ಅಥವಾ ಇಲ್ಲ', ml: 'വളരെ കുറവ് അല്ലെങ്കിൽ ഇല്ല', bn: 'খুব কম বা করি না', mr: 'फार कमी किंवा अजिबात नाही' } }
    ]
  }
];

// Clinician review flag generator strictly aligned with FOGSI guidelines
// Flag levels:
// 'attention' (🔴 Red) -> Urgent / Critical clinician evaluation
// 'review' (🟡 Amber) -> Routine clinical counselling / pre-pregnancy review recommended
// 'ok' (🟢 Green) -> No issue reported / optimal status
export function generateClinicianFlags(answers) {
  const flags = [];

  // 1. Diabetes
  if (answers['medical_diabetes'] === 'yes') {
    const hba1c = answers['diabetes_hba1c'];
    const rx = answers['diabetes_treatment'];
    if (hba1c === 'over_6_5' || hba1c === 'unknown') {
      flags.push({
        id: 'flag_diabetes_uncontrolled',
        level: 'attention',
        category: 'Medical History',
        title: 'Pre-gestational Diabetes Mellitus (Glycaemic Control)',
        detail: `Reported diabetes. Latest HbA1c: ${hba1c === 'over_6_5' ? '>= 6.5% (Elevated)' : 'Unknown/Unchecked'}. Current Rx: ${rx || 'Not specified'}. Preconception target is HbA1c < 6.5% to prevent congenital heart anomalies and miscarriage. Microvascular assessment & insulin optimization recommended.`,
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 16, 21)'
      });
    } else {
      flags.push({
        id: 'flag_diabetes_controlled',
        level: 'review',
        category: 'Medical History',
        title: 'Pre-gestational Diabetes Mellitus (Optimized)',
        detail: 'Patient reports known diabetes with HbA1c < 6.5%. Maintain glycemic surveillance, diabetic retinal/renal microvascular screening, and pregnancy safety review of oral hypoglycaemics.',
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16, 21)'
      });
    }
  }

  // 2. Hypertension
  if (answers['medical_hypertension'] === 'yes') {
    const bp = answers['htn_latest_bp'];
    const meds = answers['htn_medications'];
    flags.push({
      id: 'flag_hypertension',
      level: bp === 'high_over_140_90' ? 'attention' : 'review',
      category: 'Medical History',
      title: 'Chronic Hypertension',
      detail: `Chronic high blood pressure reported (${meds === 'yes_taking' ? 'on daily medication' : 'not on daily medication'}, typical BP: ${bp === 'high_over_140_90' ? '>=140/90 mmHg' : 'Normal/Unknown'}). Review antihypertensive agents for teratogenicity (switch to safe drugs like labetalol; avoid ACE-i/ARBs). Discuss late first-trimester low-dose aspirin (ecosprin) for preeclampsia prophylaxis.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22)'
    });
  }

  // 3. Thyroid
  if (answers['medical_thyroid'] === 'yes') {
    const onMed = answers['thyroid_medication'];
    flags.push({
      id: 'flag_thyroid',
      level: 'review',
      category: 'Medical History',
      title: 'Thyroid Disorder',
      detail: `Patient reports thyroid disorder (${onMed === 'yes' ? 'taking daily thyroid medication' : 'not currently on medication'}). Check baseline TSH before conception to maintain euthyroid status for fetal neurological development and fertility.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22)'
    });
  }

  // 4. Epilepsy / Seizures
  if (answers['medical_epilepsy'] === 'yes') {
    const rx = answers['epilepsy_medication'];
    flags.push({
      id: 'flag_epilepsy',
      level: 'attention',
      category: 'Medical History',
      title: 'Epilepsy / Anti-Seizure Therapy',
      detail: `History of epilepsy reported. Current medications: ${rx || 'Unspecified'}. Rule: Use lowest effective monotherapy dose. Strictly avoid sodium valproate in reproductive age. Prescribe high-dose folic acid (4–5 mg/day) 1–3 months before conception.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16, 27) & Checklist #4A'
    });
  }

  // 5. Cardiac Condition
  if (answers['medical_cardiac'] === 'yes') {
    flags.push({
      id: 'flag_cardiac',
      level: 'attention',
      category: 'Medical History',
      title: 'Cardiac Disease / Valve Disorder',
      detail: 'Known heart/cardiac condition reported. Pre-pregnancy cardiology evaluation, echocardiogram, functional class assessment, and medication safety review required before attempting conception.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16) & Checklist #4A'
    });
  }

  // 6. Renal / Kidney Disease
  if (answers['medical_renal'] === 'yes') {
    flags.push({
      id: 'flag_renal',
      level: 'attention',
      category: 'Medical History',
      title: 'Renal / Kidney Disease',
      detail: 'Renal condition reported. Assess baseline serum creatinine, eGFR, and 24-hour urine protein / proteinuria prior to conception.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16) & Checklist #4A'
    });
  }

  // 7. Autoimmune Disease
  if (answers['medical_autoimmune'] === 'yes') {
    flags.push({
      id: 'flag_autoimmune',
      level: 'attention',
      category: 'Medical History',
      title: 'Autoimmune Disease (Lupus / RA)',
      detail: 'Autoimmune disorder reported. Ensure sustained clinical remission for at least 6 months prior to conception. Review teratogenic DMARDs/immunosuppressants.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16) & Checklist #4A'
    });
  }

  // 8. Thrombophilia
  if (answers['medical_thrombophilia'] === 'yes') {
    flags.push({
      id: 'flag_thrombophilia',
      level: 'review',
      category: 'Medical History',
      title: 'Thrombophilia / Venous Thromboembolism History',
      detail: 'Personal history of DVT/thrombophilia reported. Evaluate need for prophylactic low-molecular-weight heparin (LMWH) in antenatal period.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 15)'
    });
  }

  // 9. Periodontal Disease
  if (answers['medical_periodontal'] === 'yes') {
    flags.push({
      id: 'flag_periodontal',
      level: 'review',
      category: 'Medical History',
      title: 'Periodontal / Gum Disease',
      detail: 'Bleeding gums/periodontal disease reported. Periodontal infection is independently linked to preterm birth. Dental cleaning and evaluation recommended before pregnancy.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 23)'
    });
  }

  // 10. Inter-pregnancy interval
  if (answers['delivery_interval'] === 'less_6m') {
    flags.push({
      id: 'flag_short_interval',
      level: 'review',
      category: 'Pregnancy Spacing',
      title: 'Short Inter-pregnancy Interval (< 6 months)',
      detail: 'Last delivery was less than 6 months ago. FOGSI guidelines recommend an inter-pregnancy interval of at least 6 months (18 months ideal) to reduce risks of preterm birth, low birth weight, and maternal anemia.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 13) & Checklist #1'
    });
  }

  // 11. Bariatric Surgery interval
  if (answers['bariatric_interval'] === 'yes_recent') {
    flags.push({
      id: 'flag_bariatric_recent',
      level: 'review',
      category: 'Surgical History',
      title: 'Recent Bariatric Surgery (< 12–24 months)',
      detail: 'Bariatric surgery occurred within the past 12–24 months. FOGSI guidelines recommend waiting 12–24 months until rapid weight loss stabilizes to protect fetal growth and ensure micronutrient repletion.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 13) & Checklist #1'
    });
  }

  // 12. Obstetric complications
  if (answers['obstetric_complications'] === 'yes') {
    const list = answers['obstetric_details'] || [];
    flags.push({
      id: 'flag_obstetric_history',
      level: 'attention',
      category: 'Obstetric History',
      title: 'Prior Pregnancy Complications',
      detail: `History of previous complications: ${list.length > 0 ? list.join(', ') : 'Reported'}. Review recurrence risk and prophylactic interventions (e.g. early glucose screening, aspirin for preeclampsia prevention, cervical length monitoring).`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 13) & Checklist #1'
    });
  }

  // 13. Current Medications
  if (answers['taking_medications'] === 'yes') {
    const medList = answers['medication_names'] || 'Medications reported';
    flags.push({
      id: 'flag_medication_review',
      level: 'review',
      category: 'Medications',
      title: 'Medication Safety & Teratogenicity Review',
      detail: `Patient currently taking: "${medList}". Review for fetal safety, efficacy, and dosing adjustments. Discontinue/switch teratogenic drugs (e.g., statins, ACE inhibitors, valproate).`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 16, 22) & Checklist #2'
    });
  }

  // 14. Folic Acid Status
  if (answers['folic_acid_status'] === 'no' || answers['folic_acid_status'] === 'not_sure') {
    const hasHighRisk = answers['medical_diabetes'] === 'yes' || answers['medical_epilepsy'] === 'yes';
    flags.push({
      id: 'flag_folic_acid_missing',
      level: 'review',
      category: 'Folic Acid Supplementation',
      title: 'Folic Acid Supplementation Not Yet Started',
      detail: `Patient is not currently taking daily folic acid. Neural tube closes by day 28 post-conception. FOGSI guidelines recommend: Standard risk: 400–800 μg/day starting >= 1 month prior; High risk (diabetes, epilepsy, prior NTD): 4–5 mg/day starting 1–3 months prior.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 18, 21, 23, 25)'
    });
  }

  // 15. Genetic / Family History
  if (answers['family_genetic'] === 'yes') {
    const details = answers['genetic_condition_details'] || 'Family history reported';
    flags.push({
      id: 'flag_genetic_screening',
      level: 'attention',
      category: 'Family & Genetic History',
      title: 'Family History of Genetic Disorder / Thalassemia',
      detail: `Reported genetic history: "${details}". FOGSI highlights Thalassemia screening as of utmost importance. Offer carrier screening (CBC, Hb HPLC) and refer for genetic counselling.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 15) & Checklist #4C'
    });
  }

  // 16. Rubella immunity
  if (answers['tested_rubella'] === 'not_immune' || answers['tested_rubella'] === 'not_sure') {
    flags.push({
      id: 'flag_rubella_immunity',
      level: 'review',
      category: 'Immunization',
      title: 'Rubella (MMR) Immunity Uncertain or Absent',
      detail: 'Rubella immunity is non-confirmed. Screen Rubella IgG; if non-immune, administer MMR vaccine and advise strictly deferring conception for at least 4 weeks (28 days). (MMR is contraindicated during pregnancy).',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 17, 24) & Checklist #8'
    });
  }

  // 17. Varicella immunity
  if (answers['tested_varicella'] === 'never_had_or_vaccinated' || answers['tested_varicella'] === 'not_sure') {
    flags.push({
      id: 'flag_varicella_immunity',
      level: 'review',
      category: 'Immunization',
      title: 'Varicella Immunity Uncertain',
      detail: 'Never had chickenpox or vaccine uncertain. Live varicella vaccine requires 2-dose series started >= 2 months before conception, with 4-week pregnancy avoidance after each dose.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 17, 24) & Checklist #8'
    });
  }

  // 18. HIV / Hepatitis B
  if (answers['tested_hepb_hiv'] === 'known_positive') {
    flags.push({
      id: 'flag_viral_infection',
      level: 'attention',
      category: 'Infection Screening',
      title: 'Known HIV / Hepatitis B Infection',
      detail: 'Patient reports viral seropositivity. Verify sustained viral suppression on ART/antivirals before conception. Assess partner status; offer PrEP/vaccination as indicated.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22) & Checklist #4B'
    });
  } else if (answers['tested_hepb_hiv'] === 'never_tested' || answers['tested_hepb_hiv'] === 'not_sure') {
    flags.push({
      id: 'flag_viral_screening_due',
      level: 'review',
      category: 'Infection Screening',
      title: 'Routine Viral Screening Due (HIV, HBsAg, VDRL)',
      detail: 'Preconception serological screening for HIV, HBsAg, and Syphilis (VDRL) recommended per FOGSI routine checklist.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 15, 16) & Checklist #4B, #5'
    });
  }

  // 19. Environmental / Occupational Exposures
  if (answers['environmental_hazards'] === 'yes') {
    const hazards = answers['hazard_types'] || [];
    flags.push({
      id: 'flag_environmental_toxins',
      level: 'review',
      category: 'Environmental Exposures',
      title: 'Occupational / Environmental Toxin Exposure',
      detail: `Reported exposures: ${hazards.length > 0 ? hazards.join(', ') : 'Hazardous chemicals/radiation'}. FOGSI guidance advises risk-reduction: personal protective equipment (PPE/N95), hand hygiene, adequate ventilation, heat avoidance, or temporary reassignment.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 17, 19, 20) & Checklist #4D'
    });
  }

  // 20. Tobacco
  if (answers['tobacco_use'] && answers['tobacco_use'] !== 'neither') {
    flags.push({
      id: 'flag_tobacco_cessation',
      level: 'review',
      category: 'Lifestyle & Substances',
      title: 'Tobacco Use Reported (Patient and/or Partner)',
      detail: `Tobacco use reported (${answers['tobacco_use']}). Tobacco reduces fecundity, increases miscarriage and fetal growth restriction. Provide cessation counselling and support to both partners.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 20) & Checklist #4E'
    });
  }

  // 21. Alcohol
  if (answers['alcohol_use'] && answers['alcohol_use'] !== 'neither') {
    flags.push({
      id: 'flag_alcohol_abstinence',
      level: 'review',
      category: 'Lifestyle & Substances',
      title: 'Alcohol Consumption (Preconception Abstinence Counselling)',
      detail: 'Alcohol use reported. FOGSI guidelines emphasize that alcohol is a teratogen with no established safe threshold in pregnancy. Advise abstinence while actively attempting to conceive.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 20, 22) & Checklist #4E'
    });
  }

  // 22. Caffeine
  if (answers['caffeine_intake'] === 'high_4_plus') {
    flags.push({
      id: 'flag_high_caffeine',
      level: 'review',
      category: 'Lifestyle & Substances',
      title: 'High Caffeine Intake (>= 4 cups daily)',
      detail: 'High caffeine intake reported. FOGSI notes elevated caffeine intake is linked to higher risk of miscarriage and low birth weight. Advise reducing to <= 1–2 cups per day.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 22)'
    });
  }

  // 23. Mental health
  if (answers['mental_health_history'] === 'yes' || answers['perinatal_mental_history'] === 'yes_experienced' || answers['psychiatric_medications'] === 'yes') {
    flags.push({
      id: 'flag_mental_health',
      level: 'review',
      category: 'Mental Health',
      title: 'Mental Health History / Perinatal Mood Review',
      detail: `Mental health history identified (Medications: ${answers['psychiatric_medications'] === 'yes' ? 'Yes' : 'No'}, Prior perinatal episode: ${answers['perinatal_mental_history'] || 'None'}). Formulate a proactive, written relapse-prevention plan. Warning: psychotropic medications must NEVER be discontinued abruptly upon pregnancy confirmation.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 26, 27, 28) & Checklist #9'
    });
  }

  // 24. Psychosocial / Stress / Safety
  if (answers['stress_safety'] === 'experiencing_stress' || answers['stress_safety'] === 'prefer_private_doctor') {
    flags.push({
      id: 'flag_psychosocial_safety',
      level: 'attention',
      category: 'Psychosocial Support',
      title: 'Psychosocial Stress / Private Discussion Requested',
      detail: 'Patient indicated relationship stress or requested private discussion regarding emotional safety. Clinician should provide a confidential, supportive environment and screen for intimate partner safety.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 26, 27) & Checklist #1, #2'
    });
  }

  return flags;
}
