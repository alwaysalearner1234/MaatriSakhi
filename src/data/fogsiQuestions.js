// Complete FOGSI-based Preconception Care Question Schema — Enhanced for Phase 2
// Primary Sources:
// 1. FOGSI Safe Motherhood Committee - Preconception Care E-Booklet, Book 1
// 2. FOGSI Preconception Care - Complete Clinician Checklist

export const SECTION_TITLES = {
  intention: 'Pregnancy Intention & Spacing',
  marital: 'Marital History & Consanguinity',
  obstetric: 'Obstetric History',
  medical: 'Chronic Medical History',
  surgical: 'Surgical History',
  medications: 'Current Medications & Folic Acid',
  family: 'Family & Genetic History',
  infections: 'Infection Screening & Immunity',
  environment: 'Occupational & Environmental Exposures',
  lifestyle: 'Lifestyle & Substance Use (Both Partners)',
  mental: 'Mental Health & Emotional Wellbeing',
  nutrition: 'Nutrition & Daily Wellness'
};

export const SECTIONS_META = [
  { id: 'intention', titleKey: 'intention', title: { en: 'Pregnancy Intention & Spacing' }, icon: 'HeartHandshake' },
  { id: 'marital', titleKey: 'marital', title: { en: 'Marital History & Consanguinity' }, icon: 'Heart' },
  { id: 'obstetric', titleKey: 'obstetric', title: { en: 'Obstetric History' }, icon: 'Baby' },
  { id: 'medical', titleKey: 'medical', title: { en: 'Chronic Medical History' }, icon: 'Activity' },
  { id: 'surgical', titleKey: 'surgical', title: { en: 'Surgical History' }, icon: 'Scissors' },
  { id: 'medications', titleKey: 'medications', title: { en: 'Current Medications & Folic Acid' }, icon: 'Pill' },
  { id: 'family', titleKey: 'family', title: { en: 'Family & Genetic History' }, icon: 'Dna' },
  { id: 'infections', titleKey: 'infections', title: { en: 'Infection Screening & Immunity' }, icon: 'ShieldCheck' },
  { id: 'environment', titleKey: 'environment', title: { en: 'Occupational & Environmental Exposures' }, icon: 'Trees' },
  { id: 'lifestyle', titleKey: 'lifestyle', title: { en: 'Lifestyle & Substance Use (Both Partners)' }, icon: 'Coffee' },
  { id: 'mental', titleKey: 'mental', title: { en: 'Mental Health & Emotional Wellbeing' }, icon: 'Smile' },
  { id: 'nutrition', titleKey: 'nutrition', title: { en: 'Nutrition & Daily Wellness' }, icon: 'Apple' }
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
    id: 'menstrual_regularity',
    section: 'intention',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 13: Fertile Window (days 6–21 carry >=10% chance)',
    question: {
      en: "Are your menstrual periods generally regular (occurring every 24 to 35 days)?",
      hi: "क्या आपका मासिक धर्म आमतौर पर नियमित है (हर 24 से 35 दिनों में आता है)?",
      te: "మీ నెలసరి పీరియడ్స్ సాధారణంగా క్రమబద్ధంగా ఉంటాయా (ప్రతి 24 నుండి 35 రోజులకు)?",
      ta: "உங்கள் மாதவிடாய் பொதுவாக சீரானதாக உள்ளதா (24 முதல் 35 நாட்களுக்கு ஒருமுறை)?",
      kn: "ನಿಮ್ಮ ಮುಟ್ಟಿನ ಅವಧಿ ನಿಯಮಿತವಾಗಿದೆಯೇ (ಪ್ರತಿ 24 ರಿಂದ 35 ದಿನಗಳಿಗೊಮ್ಮೆ)?",
      ml: "നിങ്ങളുടെ ആർത്തവം സാധാരണയായി കൃത്യമാണോ (24 മുതൽ 35 ദിവസത്തിനുള്ളിൽ)?",
      bn: "আপনার মাসিক কি সাধারণত নিয়মিত (প্রতি ২৪ থেকে ৩৫ দিন পর পর হয়)?",
      mr: "तुमची मासिक पाळी साधारणपणे नियमित आहे का (दर २४ ते ३५ दिवसांनी येते)?"
    }
  },
  {
    id: 'cervical_screening',
    section: 'intention',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 13 & Checklist #1: Routine Pap smear / cervical screening up-to-date',
    question: {
      en: "Have you had a routine cervical screening (Pap smear) in the past 3 years?",
      hi: "क्या आपने पिछले 3 वर्षों में नियमित सर्वाइकल स्क्रीनिंग (पैप स्मीयर) कराई है?",
      te: "మీరు గత 3 సంవత్సరాలలో పాప్ స్మియర్ (Pap smear) పరీక్ష చేయించుకున్నారా?",
      ta: "கடந்த 3 ஆண்டுகளில் பேப் ஸ்மியர் (Pap smear) பரிசோதனை செய்துள்ளீர்களா?",
      kn: "ಕಳೆದ 3 ವರ್ಷಗಳಲ್ಲಿ ಪ್ಯಾಪ್ ಸ್ಮೀಯರ್ (Pap smear) ಪರೀಕ್ಷೆ ಮಾಡಿಸಿದ್ದೀರಾ?",
      ml: "കഴിഞ്ഞ 3 വർഷത്തിനിടെ പാപ് സ്മിയർ (Pap smear) പരിശോധന നടത്തിയിട്ടുണ്ടോ?",
      bn: "গত ৩ বছরের মধ্যে আপনি কি কোনো প্যাপ স্মিয়ার (Pap smear) পরীক্ষা করিয়েছেন?",
      mr: "तुम्ही मागील ३ वर्षांत नियमित पॅप स्मीअर (Pap smear) तपासणी केली आहे का?"
    }
  },

  // SECTION 2: MARITAL HISTORY & CONSANGUINITY
  {
    id: 'marital_previous_marriage',
    section: 'marital',
    type: 'yes_no',
    source: 'FOGSI Preconception Care Guidelines — Marital & Reproductive Background',
    question: {
      en: "Have you or your partner been married before?",
      hi: "क्या आपकी या आपके साथी की पहले शादी हुई थी?",
      te: "మీకు లేదా మీ భాగస్వామికి గతంలో వివాహం జరిగిందా?",
      ta: "உங்களுக்கு அல்லது உங்கள் துணைக்கு முன்பு திருமணம் நடந்துள்ளதா?",
      kn: "ನಿಮಗೆ ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿಗೆ ಈ ಹಿಂದೆ ಮದುವೆಯಾಗಿದೆಯೇ?",
      ml: "നിങ്ങൾക്കോ പങ്കാളിക്കോ മുൻപ് വിവാഹം കഴിഞ്ഞിട്ടുണ്ടോ?",
      bn: "আপনার বা আপনার সঙ্গীর কি আগে কোনো বিবাহ হয়েছিল?",
      mr: "तुमचा किंवा तुमच्या जोडीदाराचा आधी विवाह झाला होता का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'prev_partner_children',
        section: 'marital',
        type: 'yes_no',
        source: 'FOGSI Preconception Guidelines — Confidential reproductive history',
        question: {
          en: "Did you have any children or pregnancies from a previous partner?",
          hi: "क्या पूर्व साथी से कोई बच्चे या गर्भावस्था का इतिहास रहा है?",
          te: "మునుపటి భాగస్వామితో పిల్లలు లేదా గర్భధారణ జరిగిందా?",
          ta: "முந்தைய துணையுடன் குழந்தைகள் அல்லது கர்ப்பம் ஏதேனும் இருந்ததா?",
          kn: "ಹಿಂದಿನ ಸಂಗಾತಿಯಿಂದ ಮಕ್ಕಳು ಅಥವಾ ಗರ್ಭಧಾರಣೆ ಆಗಿತ್ತೇ?",
          ml: "മുൻ പങ്കാളിയിൽ കുട്ടികളോ ഗർഭധാരണമോ ഉണ്ടായിട്ടുണ്ടോ?",
          bn: "পূর্বের সঙ্গীর সাথে কি কোনো সন্তান বা গর্ভাবস্থা ছিল?",
          mr: "मागील जोडीदारापासून मुले किंवा गर्भधारणा झाली होती का?"
        },
        followUpIf: 'yes',
        followUps: [
          {
            id: 'prev_partner_counts',
            section: 'marital',
            type: 'text_input',
            source: 'FOGSI Preconception Guidelines — Reproductive confidential record',
            question: {
              en: "Please share the number of children or pregnancies from the previous partner:",
              hi: "कृपया पूर्व साथी से बच्चों या गर्भावस्था की संख्या बताएं:",
              te: "దయచేసి మునుపటి భాగస్వామి ద్వారా పిల్లలు లేదా గర్భధారణల సంఖ్యను తెలపండి:",
              ta: "முந்தைய துணையின் மூலமான குழந்தைகள் அல்லது கர்ப்பங்களின் எண்ணிக்கையைப் பகிரவும்:",
              kn: "ಹಿಂದಿನ ಸಂಗಾತಿಯಿಂದ ಮಕ್ಕಳ ಅಥವಾ ಗರ್ಭಧಾರಣೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ತಿಳಿಸಿ:",
              ml: "മുൻ പങ്കാളിയിലുള്ള കുട്ടികളുടെയോ ഗർഭധാരണങ്ങളുടെയോ എണ്ണം പങ്കിടുക:",
              bn: "পূর্বের সঙ্গীর সাথে সন্তান বা গর্ভাবস্থার সংখ্যা উল্লেখ করুন:",
              mr: "कृपया मागील जोडीदारापासून झालेल्या मुलांची किंवा गर्भधारणेची संख्या सांगा:"
            }
          }
        ]
      }
    ]
  },
  {
    id: 'consanguineous_marriage',
    section: 'marital',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 15 & Checklist #4C: Consanguinity increases autosomal recessive genetic risks',
    question: {
      en: "Are you and your partner related by blood (for example, cousins or family relations)?",
      hi: "क्या आप और आपके साथी के बीच कोई ख़ून का रिश्ता (जैसे चचेरे/ममेरे भाई-बहन या रिश्तेदार) है?",
      te: "మీరు మరియు మీ భాగస్వామి రక్తసంబంధీకులా (మేనరికం లేదా బంధువులు)?",
      ta: "நீங்களும் உங்கள் துணையும் ரத்த சம்பந்த உறவினர்களா (சொந்த அத்தை/மாமன் முறை)?",
      kn: "ನೀವು ಮತ್ತು ನಿಮ್ಮ ಸಂಗಾತಿ ರಕ್ತಸಂಬಂಧಿಗಳೇ (ಸೋದರ ಸಂಬಂಧಿಕರು)?",
      ml: "നിങ്ങളും പങ്കാളിയും തമ്മിൽ എന്തെങ്കിലും രക്തബന്ധമുണ്ടോ (കുടുംബക്കാർ)?",
      bn: "আপনি এবং আপনার সঙ্গী কি রক্তের সম্পর্কে সম্পর্কিত (যেমন আত্মীয় বা ভাই-বোন)?",
      mr: "तुम्ही आणि तुमचे जोडीदार यांच्यात रक्ताचे नाते आहे का (उदा. नात्यातील लग्न)?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'consanguinity_relationship',
        section: 'marital',
        type: 'text_input',
        source: 'FOGSI Checklist #4C: Record degree of consanguinity for genetic counselling review',
        question: {
          en: "What is the relationship, if you know? (You can type or speak)",
          hi: "यदि आप जानती हैं, तो यह क्या रिश्ता है? (आप बोलकर या लिखकर बता सकती हैं)",
          te: "మీ సంబంధం ఏమిటో తెలుసా? (టైప్ చేయవచ్చు లేదా మాట్లాడవచ్చు)",
          ta: "உங்களுக்குத் தெரிந்தால் என்ன உறவுமுறை? (டைப் செய்யலாம் அல்லது பேசலாம்)",
          kn: "ನಿಮಗೆ ತಿಳಿದಿದ್ದರೆ ಸಂಬಂಧ ಏನು ಎಂದು ತಿಳಿಸಿ (ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ):",
          ml: "എന്ത് ബന്ധമാണെന്ന് അറിയാമെങ്കിൽ വ്യക്തമാക്കുക (ടൈപ്പ് ചെയ്യുകയോ സംസാരിക്കുകയോ ചെയ്യാം):",
          bn: "জানা থাকলে কী সম্পর্ক উল্লেখ করুন (টাইপ বা মুখে বলতে পারেন):",
          mr: "माहित असल्यास नेमके काय नाते आहे ते सांगा (टाइप करा किंवा बोला):"
        }
      }
    ]
  },

  // SECTION 3: SMART OBSTETRIC HISTORY
  {
    id: 'previous_pregnancy',
    section: 'obstetric',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 9, 13 & Checklist #1: Primary Obstetric Branching Root',
    question: {
      en: "Have you been pregnant before?",
      hi: "क्या आप पहले कभी गर्भवती हुई हैं?",
      te: "మీరు ఇంతకు ముందు ఎప్పుడైనా గర్భం దాల్చారా?",
      ta: "நீங்கள் இதற்கு முன் கர்ப்பம் அடைந்துள்ளீர்களா?",
      kn: "ನೀವು ಈ ಹಿಂದೆ ಎಂದಾದರೂ ಗರ್ಭಿಣಿಯಾಗಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ ഇതിനുമുമ്പ് എപ്പോഴെങ്കിലും ഗർഭം ധരിച്ചിട്ടുണ്ടോ?",
      bn: "আপনি কি এর আগে কখনও গর্ভবতী হয়েছেন?",
      mr: "तुम्ही याआधी कधी गरोदर राहिला आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'number_of_pregnancies',
        section: 'obstetric',
        type: 'choice',
        source: 'FOGSI Checklist #1: Gravidity determination',
        question: {
          en: "How many times have you been pregnant in total?",
          hi: "आप कुल कितनी बार गर्भवती हुई हैं?",
          te: "మీరు మొత్తం ఎన్నిసార్లు గర్భం దాల్చారు?",
          ta: "மொத்தம் எத்தனை முறை கர்ப்பம் அடைந்துள்ளீர்கள்?",
          kn: "ನೀವು ಒಟ್ಟು ಎಷ್ಟು ಬಾರಿ ಗರ್ಭಿಣಿಯಾಗಿದ್ದೀರಿ?",
          ml: "ആകെ എത്ര തവണ ഗർഭം ധരിച്ചിട്ടുണ്ട്?",
          bn: "আপনি মোট কতবার গর্ভবতী হয়েছেন?",
          mr: "तुम्ही एकूण किती वेळा गरोदर राहिला आहात?"
        },
        options: [
          { value: '1', label: { en: '1 pregnancy', hi: '1 बार', te: '1 సారి', ta: '1 முறை', kn: '1 ಬಾರಿ', ml: '1 തവണ', bn: '১ বার', mr: '१ वेळा' } },
          { value: '2', label: { en: '2 pregnancies', hi: '2 बार', te: '2 సార్లు', ta: '2 முறை', kn: '2 ಬಾರಿ', ml: '2 തവണ', bn: '২ বার', mr: '२ वेळा' } },
          { value: '3', label: { en: '3 pregnancies', hi: '3 बार', te: '3 సార్లు', ta: '3 முறை', kn: '3 ಬಾರಿ', ml: '3 തവണ', bn: '৩ বার', mr: '३ वेळा' } },
          { value: '4_plus', label: { en: '4 or more pregnancies', hi: '4 या अधिक बार', te: '4 లేదా అంతకంటే ఎక్కువ', ta: '4 அல்லது அதற்கு மேல்', kn: '4 ಅಥವಾ ಹೆಚ್ಚು', ml: '4 അതിൽ കൂടുതൽ', bn: '৪ বা ততোধিক', mr: '४ किंवा अधिक' } }
        ]
      },
      {
        id: 'history_miscarriages',
        section: 'obstetric',
        type: 'yes_no',
        source: 'FOGSI E-Booklet p. 11, 13 & Checklist #1: Miscarriage history and complications',
        question: {
          en: "Have you ever had a miscarriage or pregnancy loss?",
          hi: "क्या कभी गर्भपात (Miscarriage) या बच्चा नष्ट होने का अनुभव हुआ है?",
          te: "మీకు ఎప్పుడైనా గర్భస్రావం (Miscarriage) జరిగిందా?",
          ta: "உங்களுக்கு எப்போதாவது கருச்சிதைவு (Miscarriage) ஏற்பட்டுள்ளதா?",
          kn: "ನಿಮಗೆ ಎಂದಾದರೂ ಗರ್ಭಪಾತ (Miscarriage) ಆಗಿದೆಯೇ?",
          ml: "എപ്പോഴെങ്കിലും ഗർഭം അലസിപ്പോവുകയോ (Miscarriage) നഷ്ടപ്പെടുകയോ ചെയ്തിട്ടുണ്ടോ?",
          bn: "আপনার কি কখনও গর্ভপাত (Miscarriage) হয়েছে?",
          mr: "कधी गर्भपात (Miscarriage) झाला आहे का?"
        },
        followUpIf: 'yes',
        followUps: [
          {
            id: 'miscarriage_type',
            section: 'obstetric',
            type: 'choice',
            source: 'FOGSI Checklist #1: Early vs late pregnancy loss investigation',
            question: {
              en: "Was the miscarriage early (under 12 weeks) or late (12 to 20 weeks)?",
              hi: "गर्भपात शुरुआती (12 सप्ताह से पहले) था या बाद में (12 से 20 सप्ताह के बीच)?",
              te: "గర్భస్రావం ప్రారంభంలోనా (12 వారాల లోపు) లేక తర్వాతనా (12 నుండి 20 వారాలు)?",
              ta: "கருச்சிதைவு ஆரம்பத்திலா (12 வாரத்திற்குள்) அல்லது பின்னரா (12-20 வாரங்கள்)?",
              kn: "ಗರ್ಭಪಾತವು ಆರಂಭಿಕ ಹಂತದ್ದಾಗಿದ್ದಿತೇ (12 ವಾರಗಳ ಒಳಗೆ) ಅಥವಾ ನಂತರದ್ದೇ?",
              ml: "ഗർഭം അലസിയത് ആദ്യ മാസങ്ങളിലോ (12 ആഴ്ചയ്ക്കുള്ളിൽ) അതോ ശേഷമോ?",
              bn: "গর্ভপাত কি শুরুর দিকে (১২ সপ্তাহের নিচে) না দেরিতে (১২–২০ সপ্তাহ) হয়েছিল?",
              mr: "गर्भपात सुरुवातीचा (१२ आठवड्यांपूर्वी) होता की उशिराचा (१२ ते २० आठवडे)?"
            },
            options: [
              { value: 'early_miscarriage', label: { en: 'Early miscarriage (under 12 weeks)', hi: 'शुरुआती गर्भपात (12 सप्ताह से पहले)', te: 'ప్రారంభ గర్భస్రావం (< 12 వారాలు)', ta: 'ஆரம்ப கருச்சிதைவு (< 12 வாரங்கள்)', kn: 'ಆರಂಭಿಕ ಗರ್ಭಪಾತ (< 12 ವಾರ)', ml: 'ആദ്യകാല അലസൽ (< 12 ആഴ്ച)', bn: 'শুরুর দিকের গর্ভপাত (< ১২ সপ্তাহ)', mr: 'सुरुवातीचा गर्भपात (< १२ आठवडे)' } },
              { value: 'late_miscarriage', label: { en: 'Late miscarriage (12 to 20 weeks)', hi: 'बाद का गर्भपात (12 से 20 सप्ताह)', te: 'తర్వాతి గర్భస్రావం (12–20 వారాలు)', ta: 'பிந்தைய கருச்சிதைவு (12–20 வாரங்கள்)', kn: 'ನಂತರದ ಗರ್ಭಪಾತ (12–20 ವಾರ)', ml: 'ശേഷമുള്ള അലസൽ (12–20 ആഴ്ച)', bn: 'পরবর্তী গর্ভপাত (১২–২০ সপ্তাহ)', mr: 'उशिराचा गर्भपात (१२ ते २० आठवडे)' } },
              { value: 'both', label: { en: 'Both early and late losses occurred', hi: 'दोनों प्रकार के गर्भपात हुए हैं', te: 'రెండూ జరిగాయి', ta: 'இரண்டுமே நிகழ்ந்துள்ளன', kn: 'ಎರಡೂ ಸಂಭವಿಸಿವೆ', ml: 'രണ്ടും സംഭവിച്ചിട്ടുണ്ട്', bn: 'উভয়ই ঘটেছে', mr: 'दोन्ही प्रकारचे झाले आहेत' } }
            ]
          },
          {
            id: 'miscarriage_complications',
            section: 'obstetric',
            type: 'multi_select',
            source: 'FOGSI Checklist #1: D&C, retained products, post-abortal infection review',
            question: {
              en: "Did you experience any of these complications during the miscarriage? (Select all that apply)",
              hi: "क्या गर्भपात के दौरान इनमें से कोई जटिलता हुई थी? (सभी लागू विकल्प चुनें)",
              te: "గర్భస్రావ సమయంలో ఈ సమస్యలేవైనా ఎదురయ్యాయా?",
              ta: "கருச்சிதைவின் போது இதில் ஏதேனும் சிக்கல்கள் ஏற்பட்டதா?",
              kn: "ಗರ್ಭಪಾತದ ಸಮಯದಲ್ಲಿ ಈ ಸಮಸ್ಯೆಗಳು ಎದುರಾಗಿದ್ದವೇ?",
              ml: "ഗർഭം അലസിയ സമയത്ത് ഇവയിൽ എന്തെങ്കിലും സങ്കീർണ്ണതകൾ ഉണ്ടായോ?",
              bn: "গর্ভপাতের সময় কি এগুলির মধ্যে কোনো সমস্যা হয়েছিল?",
              mr: "गर्भपातादरम्यान खालीलपैकी काही त्रास झाला होता का? (लागू असलेले सर्व निवडा)"
            },
            options: [
              { value: 'dc_done', label: { en: 'D&C (Cleaning / curettage performed)', hi: 'डी एंड सी (सफाई / D&C करानी पड़ी)', te: 'డి అండ్ సి (D&C శస్త్రచికిత్స)', ta: 'டி அண்ட் சி (D&C சிகிச்சை)', kn: 'ಡಿ & ಸಿ (D&C ಮಾಡಿಸಲಾಯಿತು)', ml: 'ഡി & സി (D&C ചെയ്യേണ്ടി വന്നു)', bn: 'ডি অ্যান্ড সি (D&C করানো হয়েছিল)', mr: 'डी अँड सी (D&C शस्त्रक्रिया झाली)' } },
              { value: 'retained_products', label: { en: 'Retained products of conception', hi: 'अंश रह जाना (Retained products)', te: 'గర్భాశయంలో అవశేషాలు మిగలడం', ta: 'கர்ப்பப்பை எச்சங்கள் தங்குதல்', kn: 'ಗರ್ಭಕೋಶದಲ್ಲಿ ಉಳિકೆಗಳು ಉಳಿದುಕೊಳ್ಳುವುದು', ml: 'ഗർഭാവശിഷ്ടങ്ങൾ ശേഷിക്കുക', bn: 'গর্ভের অবশিষ্টাংশ থেকে যাওয়া', mr: 'गर्भाशयात अवशेष राहणे' } },
              { value: 'post_abortal_infection', label: { en: 'Post-abortal fever or infection', hi: 'गर्भपात के बाद बुखार या इन्फेक्शन', te: 'గర్భస్రావం తర్వాత జ్వరం లేదా ఇన్ఫెక్షన్', ta: 'கருச்சிதைவுக்குப் பின் காய்ச்சல் அல்லது தொற்று', kn: 'ಗರ್ಭಪಾತದ ನಂತರ ಜ್ವರ ಅಥವಾ ಸೋಂಕು', ml: 'അണുബാധ അല്ലെങ്കിൽ പനി', bn: 'গর্ভপাতের পর জ্বর বা ইনফেকশন', mr: 'गर्भपातानंतर ताप किंवा संसर्ग' } },
              { value: 'threatened_abortion', label: { en: 'Threatened abortion with heavy bleeding', hi: 'अत्यधिक रक्तस्राव (Heavy bleeding)', te: 'తీవ్ర రక్తస్రావం', ta: 'அதிக ரத்தப்போக்கு', kn: 'ತೀವ್ರ ರಕ್ತಸ್ರಾವ', ml: 'അമിത രക്തസ്രാവം', bn: 'অতিরিক্ত রক্তক্ষরণ', mr: 'जास्त रक्तस्त्राव' } },
              { value: 'none', label: { en: 'None / Routine recovery without complication', hi: 'कोई जटिलता नहीं / सामान्य सुधार हुआ', te: 'ఎలాంటి సమస్యలు లేవు', ta: 'எந்த சிக்கலும் இல்லை', kn: 'ಯಾವುದೇ ಸಮಸ್ಯೆ ಇರಲಿಲ್ಲ', ml: 'സങ്കീർണ്ണതകൾ ഒന്നുമില്ലായിരുന്നു', bn: 'কোনো জটিলতা হয়নি', mr: 'कोणताही त्रास झाला नाही' } }
            ]
          }
        ]
      },
      {
        id: 'history_ectopic',
        section: 'obstetric',
        type: 'yes_no',
        source: 'FOGSI E-Booklet p. 11, 13 & Checklist #1: Ectopic pregnancy history carries 10% recurrence risk',
        question: {
          en: "Have you ever had an ectopic pregnancy (pregnancy outside the uterus, e.g. in the fallopian tube)?",
          hi: "क्या कभी एक्टोपिक प्रेगनेंसी (बच्चेदानी के बाहर, नली में गर्भ ठहरना) हुई है?",
          te: "మీకు ఎప్పుడైనా గర్భాశయం బయట (ట్యూబ్‌లో) గర్భం (Ectopic pregnancy) వచ్చిందా?",
          ta: "உங்களுக்கு எப்போதாவது எக்டோபிக் கர்ப்பம் (கருப்பைக்கு வெளியே உருவான கர்ப்பம்) ஏற்பட்டதா?",
          kn: "ನಿಮಗೆ ಎಂದಾದರೂ ಗರ್ಭಾಶಯದ ಹೊರಗೆ (ಟ್ಯೂಬ್‌ನಲ್ಲಿ) ಗರ್ಭಧಾರಣೆ (Ectopic pregnancy) ಆಗಿತ್ತೇ?",
          ml: "ഗർഭപാത്രത്തിന് പുറത്ത് (ട്യൂബിൽ) ഗർഭം (Ectopic pregnancy) ഉണ്ടായ ചരിത്രമുണ്ടോ?",
          bn: "আপনার কি কখনও একটোপিক প্রেগন্যান্সি (জরায়ুর বাইরে টিউবে গর্ভধারণ) হয়েছিল?",
          mr: "कधी एक्टोपिक गर्भधारणा (गर्भाशयाबाहेर नळीत गर्भ राहणे) झाली होती का?"
        },
        followUpIf: 'yes',
        followUps: [
          {
            id: 'ectopic_details',
            section: 'obstetric',
            type: 'text_input',
            source: 'FOGSI Checklist #1: Ectopic treatment history (laparoscopy vs methotrexate)',
            question: {
              en: "Please share details of the ectopic pregnancy (which side, surgery or injection treatment):",
              hi: "कृपया एक्टोपिक प्रेगनेंसी का विवरण साझा करें (किस तरफ, सर्जरी या इंजेक्शन द्वारा इलाज):",
              te: "ఎక్టోపిక్ ప్రెగ్నెన్సీ వివరాలు తెలపండి (ఏ వైపు, సర్జరీ లేదా ఇంజెక్షన్):",
              ta: "எக்டோபிக் கர்ப்பத்தின் விவரங்களைப் பகிரவும் (எந்தப் பக்கம், அறுவை சிகிச்சை அல்லது மருந்து):",
              kn: "ಎಕ್ಟೋಪಿಕ್ ಗರ್ಭಧಾರಣೆಯ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ (ಯಾವ ಬದಿ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಅಥವಾ ಇಂಜೆಕ್ಷನ್):",
              ml: "എക്ടോപിക് ഗർഭധാരണത്തിന്റെ വിവരങ്ങൾ പങ്കിടുക (ശസ്ത്രക്രിയയോ മരുന്നോ):",
              bn: "একটোপিক প্রেগন্যান্সির বিবরণ লিখুন (কোন দিকে, অস্ত্রোপচার না ইঞ্জেকশন):",
              mr: "कृपया एक्टोपिक गर्भधारणेची माहिती द्या (कोणत्या बाजूला, शस्त्रक्रिया किंवा औषधोपचार):"
            }
          }
        ]
      },
      {
        id: 'history_premature_labour',
        section: 'obstetric',
        type: 'yes_no',
        source: 'FOGSI E-Booklet Book 1, p. 13 & Checklist #1: Preterm labour predictor',
        question: {
          en: "Have you ever experienced premature labour or delivered a baby before 37 weeks?",
          hi: "क्या कभी समय से पहले प्रसव (37 सप्ताह से पूर्व प्रीमैच्योर डिलीवरी) हुई है?",
          te: "నెలలు నిండకముందే (37 వారాల కంటే ముందు) ప్రసవించిన అనుభవం ఉందా?",
          ta: "37 வாரங்களுக்கு முன்பே குறைப்பிரசவம் ஏற்பட்ட அனுபவம் உள்ளதா?",
          kn: "37 ವಾರಗಳಿಗಿಂತ ಮುಂಚಿತವಾಗಿ ಅವಧಿಗೆ ಮುನ್ನ ಹೆರಿಗೆಯಾದ ಅನುಭವವಿದೆಯೇ?",
          ml: "37 ആഴ്ചയ്ക്ക് മുൻപ് മാസം തികയാതെയുള്ള പ്രസവം നടന്നിട്ടുണ്ടോ?",
          bn: "আপনার কি কখনও ৩৭ সপ্তাহের পূর্বে অকাল প্রসব (Preterm delivery) হয়েছিল?",
          mr: "३७ आठवड्यांपूर्वी वेळेआधी प्रसूती (मुदतपूर्व प्रसूती) झाली आहे का?"
        }
      },
      {
        id: 'history_birth_defects',
        section: 'obstetric',
        type: 'yes_no',
        source: 'FOGSI E-Booklet p. 11, 15 & Checklist #4C: Structural / neural tube defect history',
        question: {
          en: "Have you had any previous pregnancy or child with a birth defect or congenital condition?",
          hi: "क्या पिछली किसी गर्भावस्था में शिशु में कोई जन्मजात विकार या विकृति (Birth defect) पाई गई थी?",
          te: "గత గర్భధారణలో శిశువుకు ఏవైనా పుట్టుకతో వచ్చే లోపాలు (Birth defects) ఉన్నాయా?",
          ta: "முந்தைய கர்ப்பத்தில் குழந்தைக்கு ஏதேனும் பிறவிக்குறைபாடு இருந்ததா?",
          kn: "ಹಿಂದಿನ ಗರ್ಭಧಾರಣೆಯಲ್ಲಿ ಮಗುವಿಗೆ ಜನ್ಮಜಾತ ದೋಷಗಳಿದ್ದವೇ?",
          ml: "മുൻ ഗർഭത്തിൽ കുഞ്ഞിന് എന്തെങ്കിലും ജന്മവൈകല്യങ്ങൾ (Birth defects) ഉണ്ടായിരുന്നോ?",
          bn: "পূর্বের কোনো গর্ভাবস্থায় কি সন্তানের কোনো জন্মগত ত্রুটি (Birth defect) ছিল?",
          mr: "मागील कोणत्याही गर्भधारणेत बाळाला काही जन्मजात दोष किंवा व्यंग आढळले होते का?"
        },
        followUpIf: 'yes',
        followUps: [
          {
            id: 'birth_defect_details',
            section: 'obstetric',
            type: 'text_input',
            source: 'FOGSI Checklist #4C: Anomaly details for targeted genetics and high-dose folate',
            question: {
              en: "What do you know about the birth defect? (You can type or use voice)",
              hi: "जन्मजात विकार के बारे में आप क्या जानती हैं? (लिखकर या बोलकर बताएं):",
              te: "పుట్టుకతో వచ్చిన ఆ లోపం గురించి మీకు తెలిసిన వివరాలు తెలపండి:",
              ta: "அந்த பிறவிக்குறைபாடு பற்றி உங்களுக்கு என்ன தெரியும்? (டைப் செய்யவும் அல்லது பேசவும்):",
              kn: "ಆ ಜನ್ಮಜಾತ ದೋಷದ ಬಗ್ಗೆ ನಿಮಗೆ ತಿಳಿದಿರುವ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ:",
              ml: "ആ വൈകല്യത്തെക്കുറിച്ച് അറിയാവുന്ന വിവരങ്ങൾ പങ്കിടുക:",
              bn: "সেই জন্মগত ত্রুটি সম্পর্কে আপনি কী জানেন লিখুন বা বলুন:",
              mr: "त्या जन्मजात दोषाबद्दल तुम्हाला काय माहिती आहे ते सांगा (टाइप करा किंवा आवाजाने बोला):"
            }
          }
        ]
      },
      {
        id: 'prior_deliveries',
        section: 'obstetric',
        type: 'yes_no',
        source: 'FOGSI Checklist Item #1 & E-Booklet Book 1, p. 13 (Pregnancy Spacing)',
        question: {
          en: "Have you had any full-term deliveries (babies delivered after 37 weeks)?",
          hi: "क्या आपकी पूरी अवधि (37 सप्ताह के बाद) की कोई डिलीवरी हुई है?",
          te: "మీకు పూర్తి నెలలు నిండిన ప్రసవాలు (37 వారాల తర్వాత) జరిగాయా?",
          ta: "உங்களுக்கு முழு மாதப் பிரசவங்கள் (37 வாரங்களுக்குப் பின்) நடந்துள்ளனவா?",
          kn: "ಪೂರ್ಣಾವಧಿ ಹೆರಿಗೆಗಳು (37 ವಾರಗಳ ನಂತರ) ಆಗಿವೆಯೇ?",
          ml: "പൂർണ്ണ വളർച്ചയെത്തിയ പ്രസവം (37 ആഴ്ചകൾക്ക് ശേഷം) നടന്നിട്ടുണ്ടോ?",
          bn: "আপনার কি কোনো পূর্ণ মেয়াদের প্রসব (৩৭ সপ্তাহের পর) হয়েছে?",
          mr: "तुमची पूर्ण मुदतीची (३७ आठवड्यांनंतर) प्रसूती झाली आहे का?"
        },
        followUpIf: 'yes',
        followUps: [
          {
            id: 'delivery_interval',
            section: 'obstetric',
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
          },
          {
            id: 'delivery_complications',
            section: 'obstetric',
            type: 'multi_select',
            source: 'FOGSI Checklist #1: Prior complications (PIH, APH, GDM, manual placenta, prolonged labour, cerclage)',
            question: {
              en: "Did you experience any of these complications in previous pregnancies/deliveries? (Select all that apply)",
              hi: "क्या पिछली डिलीवरी या गर्भावस्था में इनमें से कोई समस्या हुई थी? (सभी लागू विकल्प चुनें)",
              te: "గత డెలివరీలలో వీటిలో ఏవైనా సమస్యలు ఎదురయ్యాయా?",
              ta: "முந்தைய பிரசவங்களில் இதில் ஏதேனும் சிக்கல்கள் ஏற்பட்டதா?",
              kn: "ಹಿಂದಿನ ಹೆರಿಗೆಗಳಲ್ಲಿ ಈ ಸಮಸ್ಯೆಗಳು ಎದುರಾಗಿದ್ದವೇ?",
              ml: "മുൻ പ്രസവങ്ങളിൽ ഇവയിൽ എന്തെങ്കിലും സങ്കീർണ്ണതകൾ ഉണ്ടായോ?",
              bn: "পূর্বের প্রসবের সময় এগুলির মধ্যে কোনো জটিলতা হয়েছিল?",
              mr: "मागील प्रसूतीदरम्यान खालीलपैकी काही त्रास झाला होता का? (लागू असलेले सर्व निवडा)"
            },
            options: [
              { value: 'preeclampsia', label: { en: 'High BP in pregnancy / Pre-eclampsia (PIH)', hi: 'गर्भावस्था में हाई बीपी / प्री-एक्लेम्पसिया (PIH)', te: 'గర్భధారణలో అధిక బీపీ (PIH)', ta: 'கர்ப்பகால உயர் ரத்த அழுத்தம் (PIH)', kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ', ml: 'ഉയർന്ന പ്രഷർ (PIH)', bn: 'গর্ভাবস্থায় উচ্চ রক্তচাপ (PIH)', mr: 'गर्भधारणेतील उच्च रक्तदाब (PIH)' } },
              { value: 'gdm', label: { en: 'Gestational Diabetes Mellitus (Sugar during pregnancy)', hi: 'गर्भावस्था में शुगर / डायबिटीज (GDM)', te: 'గర్భధారణ మధుమేహం (GDM)', ta: 'கர்ப்பகால சர்க்கரை நோய் (GDM)', kn: 'ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹ (GDM)', ml: 'ഗർഭകാലത്തെ പ്രമേഹം (GDM)', bn: 'গর্ভকালীন ডায়াবেটিস (GDM)', mr: 'गर्भधारणेतील मधुमेह (GDM)' } },
              { value: 'cesarean', label: { en: 'Caesarean section delivery (C-Section)', hi: 'सिजेरियन डिलीवरी (C-Section)', te: 'సిజేరియన్ డెలివరీ (C-Section)', ta: 'சிசேரியன் பிரசவம் (C-Section)', kn: 'ಸಿಜೇರಿಯನ್ ಹೆರಿಗೆ (C-Section)', ml: 'സിസേറിയൻ പ്രസവം (C-Section)', bn: 'সিজারিয়ান ডেলিভারি (C-Section)', mr: 'सिझेरियन प्रसूती (C-Section)' } },
              { value: 'aph', label: { en: 'Antepartum Hemorrhage (Bleeding before birth / APH)', hi: 'प्रसव से पहले रक्तस्राव (APH)', te: 'ప్రసవానికి ముందు రక్తస్రావం (APH)', ta: 'பிரசவத்திற்கு முந்தைய ரத்தப்போக்கு (APH)', kn: 'ಹೆರಿಗೆಗೆ ಮುನ್ನ ರಕ್ತಸ್ರಾವ (APH)', ml: 'പ്രസവത്തിന് മുൻപുള്ള രക്തസ്രാവം (APH)', bn: 'প্রসবের পূর্বে রক্তপাত (APH)', mr: 'प्रसूतीपूर्वी रक्तस्त्राव (APH)' } },
              { value: 'manual_placenta', label: { en: 'Manual removal of placenta / Retained placenta', hi: 'प्लेसेंटा (नाल) निकालने में जटिलता', te: 'మావి చేతితో తొలగించాల్సి రావడం', ta: 'நஞ்சுக்கொடி அகற்றுவதில் சிக்கல்', kn: 'ಮಾಸು ಕೈಯಿಂದ ತೆಗೆಯಬೇಕಾದ ಪರಿಸ್ಥಿತಿ', ml: 'മറുപിള്ള കൈകൊണ്ട് നീക്കം ചെയ്യേണ്ടി വന്നു', bn: 'প্লাসেন্টা হাত দিয়ে বের করতে হয়েছিল', mr: 'वार (नाळ) हाताने काढावी लागणे' } },
              { value: 'cerclage', label: { en: 'Cervical stitch (Cerclage) for weak cervix', hi: 'बच्चेदानी के मुंह पर टांका (Cerclage)', te: 'గర్భాశయ కుట్టు (Cerclage)', ta: 'கர்ப்பப்பை வாய் தையல் (Cerclage)', kn: 'ಗರ್ಭಕಂಠದ ಹೊಲಿಗೆ (Cerclage)', ml: 'സെർവിക്കൽ തുന്നൽ (Cerclage)', bn: 'জরায়ুর মুখে সেলাই (Cerclage)', mr: 'गर्भाशयाच्या तोंडावर टाके (Cerclage)' } },
              { value: 'prolonged_labour', label: { en: 'Prolonged or obstructed labour', hi: 'बहुत लंबा व कठिन प्रसव (Prolonged labour)', te: 'చాలా ఎక్కువ సమయం పట్టిన కష్టమైన ప్రసవం', ta: 'நீண்ட அல்லது கடினமான பிரசவம்', kn: 'ದೀರ್ಘಕಾಲದ ಕಷ್ಟಕರ ಹೆರಿಗೆ', ml: 'വളരെ നീണ്ട പ്രസവവേദന', bn: 'দীর্ঘস্থায়ী প্রসববেদনা', mr: 'खूप वेळ चाललेली कठीण प्रसूती' } },
              { value: 'none', label: { en: 'None / Normal uncomplicated delivery', hi: 'कोई समस्या नहीं / सामान्य डिलीवरी', te: 'ఎలాంటి సమస్యలు లేవు', ta: 'எந்த சிக்கலும் இல்லை', kn: 'ಯಾವುದೇ ಸಮಸ್ಯೆ ಇರಲಿಲ್ಲ', ml: 'പ്രശ്നങ്ങളൊന്നുമില്ലായിരുന്നു', bn: 'কোনো সমস্যা হয়নি', mr: 'कोणताही त्रास झाला नाही' } }
            ]
          }
        ]
      }
    ]
  },

  // SECTION 4: MEDICAL DISORDERS SCREENING (Single-Question Branching)
  {
    id: 'medical_diabetes',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 11, 16, 21 & Checklist #4A: Pre-gestational Diabetes target HbA1c < 6.5%',
    question: {
      en: "Do you have diabetes or high blood sugar?",
      hi: "क्या आपको डायबिटीज (मधुमेह) या हाई ब्लड शुगर की समस्या है?",
      te: "మీకు మధుమేహం (షుగర్ వ్యాధి) లేదా అధిక బ్లడ్ షుగర్ ఉందా?",
      ta: "உங்களுக்கு சர்க்கரை நோய் (நீரிழிவு) அல்லது அதிக ரத்த சர்க்கரை அளவு உள்ளதா?",
      kn: "ನಿಮಗೆ ಮಧುಮೇಹ (ಸಕ್ಕರೆ ಕಾಯಿಲೆ) ಇದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് പ്രമേഹമോ (ഷുഗർ) ഉയർന്ന രക്തത്തിലെ പഞ്ചസാരയുടെ അളവോ ഉണ്ടോ?",
      bn: "আপনার কি ডায়াবেটিস বা উচ্চ রক্তে শর্করার সমস্যা আছে?",
      mr: "तुम्हाला मधुमेह (डायबिटीज) किंवा रक्तातील साखरेची समस्या आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'diabetes_duration',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 16: Duration predicts microvascular risk',
        question: {
          en: "How long have you had diabetes?",
          hi: "आपको कितने समय से डायबिटीज है?",
          te: "మీకు మధుమేహం వచ్చి ఎంత కాలమైంది?",
          ta: "உங்களுக்கு சர்க்கரை நோய் வந்து எவ்வளவு காலம் ஆகிறது?",
          kn: "ನಿಮಗೆ ಮಧುಮೇಹ ಎಷ್ಟು ವರ್ಷಗಳಿಂದ ಇದೆ?",
          ml: "പ്രമേഹം തുടങ്ങിയിട്ട് എത്ര കാലമായി?",
          bn: "আপনার কতদিন ধরে ডায়াবেটিস আছে?",
          mr: "तुम्हाला किती काळापासून मधुमेह आहे?"
        },
        options: [
          { value: 'less_1y', label: { en: 'Less than 1 year', hi: '1 वर्ष से कम', te: '1 సంవత్సరం కంటే తక్కువ', ta: '1 வருடத்திற்கு குறைவாக', kn: '1 ವರ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ', ml: '1 വർഷത്തിൽ താഴെ', bn: '১ বছরের কম', mr: '१ वर्षापेक्षा कमी' } },
          { value: '1_to_5y', label: { en: '1 to 5 years', hi: '1 से 5 वर्ष', te: '1 నుండి 5 సంవత్సరాలు', ta: '1 முதல் 5 ஆண்டுகள்', kn: '1 ರಿಂದ 5 ವರ್ಷಗಳು', ml: '1 മുതൽ 5 വർഷം', bn: '১ থেকে ৫ বছর', mr: '१ ते ५ वर्षे' } },
          { value: 'more_5y', label: { en: 'More than 5 years', hi: '5 वर्ष से अधिक', te: '5 సంవత్సరాల కంటే ఎక్కువ', ta: '5 ஆண்டுகளுக்கு மேல்', kn: '5 ವರ್ಷಗಳಿಗಿಂತ ಹೆಚ್ಚು', ml: '5 വർഷത്തിൽ കൂടുതൽ', bn: '৫ বছরের বেশি', mr: '५ वर्षांपेक्षा जास्त' } }
        ]
      },
      {
        id: 'diabetes_treatment',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 16: Insulin is safest in pregnancy; review oral agents',
        question: {
          en: "What treatment are you currently using for diabetes?",
          hi: "आप वर्तमान में डायबिटीज के लिए क्या उपचार ले रही हैं?",
          te: "ప్రస్తుతం మధుమేహానికి ఏ చికిత్స తీసుకుంటున్నారు?",
          ta: "தற்போது சர்க்கரை நோய்க்கு என்ன சிகிச்சை எடுத்துக்கொள்கிறீர்கள்?",
          kn: "ಪ್ರಸ್ತುತ ಮಧುಮೇಹಕ್ಕೆ ಯಾವ ಚಿಕಿತ್ಸೆ ಪಡೆಯುತ್ತಿದ್ದೀರಿ?",
          ml: "നിലവിൽ പ്രമേഹത്തിന് എന്ത് ചികിത്സയാണ് എടുക്കുന്നത്?",
          bn: "বর্তমানে ডায়াবেটিসের জন্য কী চিকিৎসা নিচ্ছেন?",
          mr: "सध्या तुम्ही मधुमेहासाठी काय उपचार घेत आहात?"
        },
        options: [
          { value: 'tablets', label: { en: 'Oral tablets (e.g. Metformin)', hi: 'गोलियां (जैसे मेटफॉर्मिन)', te: 'మాత్రలు (ఉదా. మెట్‌ఫార్మిన్)', ta: 'மாத்திரைகள் (மெட்ஃபோர்மின் போன்றவை)', kn: 'ಮಾತ್ರೆಗಳು (ಮೆಟ್‌ಫಾರ್ಮಿನ್)', ml: 'ഗുളികകൾ (മെറ്റ്ഫോർമിൻ)', bn: 'ট্যাবলেট (যেমন মেটফর্মিন)', mr: 'गोळ्या (उदा. मेटफॉर्मिन)' } },
          { value: 'insulin', label: { en: 'Insulin injections daily', hi: 'दैनिक इंसुलिन इंजेक्शन', te: 'రోజువారీ ఇన్సులిన్ ఇంజెక్షన్', ta: 'தினசரி இன்சுலின் ஊசி', kn: 'ಇನ್ಸುಲಿನ್ ಇಂಜೆಕ್ಷನ್', ml: 'ഇൻസുലിൻ കുത്തിവയ്പ്പ്', bn: 'নিয়মিত ইনসুলিন ইঞ্জেকশন', mr: 'इन्सुलिन इंजेक्शन' } },
          { value: 'diet_lifestyle', label: { en: 'Diet and lifestyle changes only', hi: 'केवल खान-पान व व्यायाम से नियंत्रण', te: 'ఆహార నియమాలు మరియు వ్యాయామం మాత్రమే', ta: 'உணவுக்கட்டுப்பாடு மற்றும் உடற்பயிற்சி மட்டும்', kn: 'ಆಹಾರ ಮತ್ತು ಜೀವನಶೈಲಿ ನಿಯಂತ್ರಣ ಮಾತ್ರ', ml: 'ഭക്ഷണ ക്രമീകരണവും വ്യായാമവും മാത്രം', bn: 'শুধুমাত্র খাদ্যতালিকা ও ব্যায়াম', mr: 'फक्त आहार व व्यायाम' } }
        ]
      },
      {
        id: 'diabetes_hba1c',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16, 21: Target HbA1c < 6.5% preconception to reduce malformation rate from 10% to baseline 2-3%',
        question: {
          en: "What was your latest HbA1c level, if known?",
          hi: "यदि ज्ञात हो, तो आपका नवीनतम HbA1c स्तर क्या था?",
          te: "మీ ఇటీవలి HbA1c స్థాయి ఎంత?",
          ta: "உங்கள் சமீபத்திய HbA1c அளவு என்ன?",
          kn: "ನಿಮ್ಮ ಇತ್ತೀಚಿನ HbA1c ಮಟ್ಟ ಎಷ್ಟು?",
          ml: "ഏറ്റവും പുതിയ HbA1c അളവ് എത്രയായിരുന്നു?",
          bn: "আপনার সাম্প্রতিক HbA1c স্তর কত ছিল?",
          mr: "तुमची अलीकडील HbA1c पातळी काय होती?"
        },
        options: [
          { value: 'under_6_5', label: { en: 'Less than 6.5% (Good pre-pregnancy control)', hi: '6.5% से कम (उत्कृष्ट नियंत्रण)', te: '6.5% కంటే తక్కువ (మంచి నియంత్రణ)', ta: '6.5% க்கும் குறைவு (நல்ல கட்டுப்பாடு)', kn: '6.5% ಗಿಂತ ಕಡಿಮೆ', ml: '6.5% ൽ താഴെ (നല്ല നിയന്ത്രണം)', bn: '৬.৫% এর কম (ভালো নিয়ন্ত্রণ)', mr: '६.५% पेक्षा कमी (उत्कृष्ट नियंत्रण)' } },
          { value: 'over_6_5', label: { en: '6.5% or higher (Needs clinician adjustment)', hi: '6.5% या अधिक (डॉक्टर की सलाह आवश्यक)', te: '6.5% లేదా అంతకంటే ఎక్కువ', ta: '6.5% அல்லது அதற்கு மேல்', kn: '6.5% ಅಥವಾ ಹೆಚ್ಚು', ml: '6.5% അല്ലെങ്കിൽ കൂടുതൽ', bn: '৬.৫% বা তার বেশি', mr: '६.५% किंवा अधिक' } },
          { value: 'unknown', label: { en: 'Not checked recently / Unknown', hi: 'हाल ही में जांच नहीं कराई / मालूम नहीं', te: 'ఇటీవల పరీక్షించలేదు / తెలియదు', ta: 'சமீபத்தில் பரிசோதிக்கவில்லை / தெரியவில்லை', kn: 'ಇತ್ತೀಚೆಗೆ ಪರೀಕ್ಷಿಸಿಲ್ಲ / ಗೊತ್ತಿಲ್ಲ', ml: 'അടുത്തിടെ പരിശോധിച്ചിട്ടില്ല / അറിയില്ല', bn: 'সম্প্রতি পরীক্ষা করা হয়নি / জানা নেই', mr: 'अलीकडे तपासली नाही / माहिती नाही' } }
        ]
      }
    ]
  },
  {
    id: 'medical_hypertension',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 16, 22 & Checklist #4A: Review ACE-inhibitors/ARBs for teratogenicity',
    question: {
      en: "Do you have high blood pressure (hypertension)?",
      hi: "क्या आपको हाई ब्लड प्रेशर (हाई बीपी) की समस्या है?",
      te: "మీకు అధిక రక్తపోటు (హై బీపీ) ఉందా?",
      ta: "உங்களுக்கு உயர் ரத்த அழுத்தம் (BP) உள்ளதா?",
      kn: "ನಿಮಗೆ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ (ಹೈ ಬಿಪಿ) ಇದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് ഉയർന്ന രക്തസമ്മർദ്ദം (ഹൈ ബിപി) ഉണ്ടോ?",
      bn: "আপনার কি উচ্চ রক্তচাপ (হাই বিপি) আছে?",
      mr: "तुम्हाला उच्च रक्तदाब (हाय बीपी) चा त्रास आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'htn_medications',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 22: Switch ACEI/ARB to Labetalol/Methyldopa/Nifedipine',
        question: {
          en: "Are you currently taking daily blood pressure medication?",
          hi: "क्या आप वर्तमान में बीपी की दैनिक दवा ले रही हैं?",
          te: "మీరు ప్రస్తుతం ప్రతిరోజూ బీపీ మందులు వాడుతున్నారా?",
          ta: "நீங்கள் தற்போது தினமும் ரத்த அழுத்த மாத்திரை சாப்பிடுகிறீர்களா?",
          kn: "ನೀವು ಪ್ರಸ್ತುತ ಪ್ರತಿದಿನ ಬಿಪಿ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
          ml: "നിലവിൽ ദിവസവും പ്രഷറിന്റെ മരുന്ന് കഴിക്കുന്നുണ്ടോ?",
          bn: "আপনি কি বর্তমানে রক্তচাপের ওষুধ খাচ্ছেন?",
          mr: "तुम्ही सध्या दररोज बीपीचे औषध घेत आहात का?"
        },
        options: [
          { value: 'yes_taking', label: { en: 'Yes, taking regular BP medication', hi: 'हाँ, नियमित बीपी की दवा ले रही हूँ', te: 'అవును, క్రమం తప్పకుండా వాడుతున్నాను', ta: 'ஆம், தொடர்ந்து மாத்திரை சாப்பிடுகிறேன்', kn: 'ಹೌದು, ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ', ml: 'അതെ, പതിവായി കഴിക്കാറുണ്ട്', bn: 'হ্যাঁ, নিয়মিত ওষুধ খাই', mr: 'होय, नियमित बीपीचे औषध घेत आहे' } },
          { value: 'not_taking', label: { en: 'No, not taking medication currently', hi: 'नहीं, अभी दवा नहीं ले रही हूँ', te: 'లేదు, ప్రస్తుతం వాడటం లేదు', ta: 'இல்லை, தற்போது மாத்திரை எடுப்பதில்லை', kn: 'ಇಲ್ಲ, ಪ್ರಸ್ತುತ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿಲ್ಲ', ml: 'അല്ല, നിലവിൽ മരുന്ന് കഴിക്കുന്നില്ല', bn: 'না, বর্তমানে ওষুধ খাচ্ছি না', mr: 'नाही, सध्या औषध घेत नाही' } }
        ]
      },
      {
        id: 'htn_latest_bp',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 16: Target BP < 140/90; late 1st trimester aspirin for pre-eclampsia prevention',
        question: {
          en: "What is your typical blood pressure reading?",
          hi: "आमतौर पर आपका ब्लड प्रेशर कितना रहता है?",
          te: "సాధారణంగా మీ రక్తపోటు ఎంత ఉంటుంది?",
          ta: "வழக்கமாக உங்கள் ரத்த அழுத்தம் எவ்வளவு இருக்கும்?",
          kn: "ಸಾಮಾನ್ಯವಾಗಿ ನಿಮ್ಮ ಬಿಪಿ ಎಷ್ಟು ಇರುತ್ತದೆ?",
          ml: "സാധാരണയായി നിങ്ങളുടെ പ്രഷർ എത്രയാണ്?",
          bn: "সাধারণত আপনার রক্তচাপ কত থাকে?",
          mr: "साधारणपणे तुमचा रक्तदाब किती असतो?"
        },
        options: [
          { value: 'normal_under_130_80', label: { en: 'Normal (< 130/80 mmHg)', hi: 'सामान्य (130/80 से कम)', te: 'సాధారణం (< 130/80)', ta: 'சாதாரணமானது (< 130/80)', kn: 'ಸಾಮಾನ್ಯ (< 130/80)', ml: 'സാധാരണ നില (< 130/80)', bn: 'স্বাভাবিক (< ১৩০/৮০)', mr: 'सामान्य (< १३०/८०)' } },
          { value: 'borderline_130_139', label: { en: 'Borderline (130–139 / 80–89 mmHg)', hi: 'मध्यम (130–139 / 80–89)', te: 'కొద్దిగా ఎక్కువ (130–139/80–89)', ta: 'சற்று அதிகம் (130–139/80–89)', kn: 'ಸ್ವಲ್ಪ ಹೆಚ್ಚು (130–139/80–89)', ml: 'അല്പം ഉയർന്നത് (130–139/80–89)', bn: 'সীমান্তবর্তী (১৩০–১৩৯/৮০–৮৯)', mr: 'मध्यम (१३०–१३९ / ८०–८९)' } },
          { value: 'high_over_140_90', label: { en: 'High (≥ 140/90 mmHg)', hi: 'उच्च (140/90 या अधिक)', te: 'ఎక్కువ (≥ 140/90)', ta: 'அதிகம் (≥ 140/90)', kn: 'ಹೆಚ್ಚು (≥ 140/90)', ml: 'കൂടുതൽ (≥ 140/90)', bn: 'উচ্চ (≥ ১৪০/৯০)', mr: 'जास्त (≥ १४०/९०)' } },
          { value: 'unknown', label: { en: 'Not sure / Not checked recently', hi: 'मालूम नहीं / हाल में नहीं नापा', te: 'తెలియదు / ఇటీవల చూడలేదు', ta: 'தெரியவில்லை / சமீபத்தில் அளக்கவில்லை', kn: 'ಗೊತ್ತಿಲ್ಲ / ಇತ್ತೀಚೆಗೆ ಪರೀಕ್ಷಿಸಿಲ್ಲ', ml: 'അറിയില്ല / അടുത്തിടെ അളന്നിട്ടില്ല', bn: 'জানা নেই / সম্প্রতি মাপা হয়নি', mr: 'माहित नाही / अलीकडे तपासले नाही' } }
        ]
      }
    ]
  },
  {
    id: 'medical_thyroid',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 16, 22 & Checklist #4A: Preconception TSH screening',
    question: {
      en: "Do you have a thyroid disorder (hypothyroidism or hyperthyroidism)?",
      hi: "क्या आपको थायराइड की समस्या है (Hypo या Hyper)?",
      te: "మీకు థైరాయిడ్ సమస్య (హైపో లేదా హైపర్ థైరాయిడ్) ఉందా?",
      ta: "உங்களுக்கு தைராய்டு பிரச்சனை உள்ளதா?",
      kn: "ನಿಮಗೆ ಥೈರಾಯ್ಡ್ ಸಮಸ್ಯೆ (ಹೈಪೋ ಅಥವಾ ಹೈಪರ್) ಇದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് തൈറോയ്ഡ് തകരാറുണ്ടോ?",
      bn: "আপনার কি থাইরয়েডের কোনো সমস্যা আছে?",
      mr: "तुम्हाला थायरॉईडची समस्या (Hypo किंवा Hyper) आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'thyroid_type',
        section: 'medical',
        type: 'choice',
        source: 'FOGSI E-Booklet p. 16: Hypothyroidism needs dose adjustment; hyperthyroidism needs antithyroid switch',
        question: {
          en: "What type of thyroid condition do you have?",
          hi: "आपको किस प्रकार की थायराइड स्थिति है?",
          te: "మీది ఏ రకమైన థైరాయిడ్ సమస్య?",
          ta: "உங்களுக்கு என்ன வகையான தைராய்டு பிரச்சனை?",
          kn: "ನಿಮ್ಮದು ಯಾವ ರೀತಿಯ ಥೈರಾಯ್ಡ್ ಸಮಸ್ಯೆ?",
          ml: "ഏതുതരം തൈറോയ്ഡ് പ്രശ്നമാണ്?",
          bn: "এটি কী ধরনের থাইরয়েড সমস্যা?",
          mr: "कोणत्या प्रकारचा थायरॉईड आहे?"
        },
        options: [
          { value: 'hypothyroid', label: { en: 'Hypothyroidism (Underactive / high TSH)', hi: 'हाइपोथायरायडिज्म (कम काम करना / High TSH)', te: 'హైపోథైరాయిడిజం (అండర్ యాక్టివ్)', ta: 'ஹைப்போதைராய்டிசம்', kn: 'ಹೈಪೋಥೈರಾಯ್ಡಿಸಮ್', ml: 'ഹൈപ്പോതൈറോയിഡിസം', bn: 'হাইপোথাইরয়েডিজম', mr: 'हायपोथायरॉईड (Hypothyroid)' } },
          { value: 'hyperthyroid', label: { en: 'Hyperthyroidism (Overactive / low TSH)', hi: 'हाइपरथायरायडिज्म (ज्यादा काम करना)', te: 'హైపర్‌థైరాయిడిజం (ఓవర్ యాక్టివ్)', ta: 'ஹைப்பர்தைராய்டிசம்', kn: 'ಹೈಪರ್ಥೈರಾಯ್ಡಿಸಮ್', ml: 'ഹൈപ്പർതൈറോയിഡിസം', bn: 'হাইপারথাইরয়েডিজম', mr: 'हायपरथायरॉईड (Hyperthyroid)' } },
          { value: 'unknown', label: { en: 'Not sure of the exact type', hi: 'सटीक प्रकार मालूम नहीं', te: 'ఖచ్చితమైన రకం తెలియదు', ta: 'சரியான வகை தெரியவில்லை', kn: 'ಖಚಿತವಾಗಿ ಗೊತ್ತಿಲ್ಲ', ml: 'ഏതുതരമെന്ന് കൃത്യമായി അറിയില്ല', bn: 'নির্দিষ্ট ধরন জানা নেই', mr: 'नेमका प्रकार माहिती नाही' } }
        ]
      },
      {
        id: 'thyroid_medication',
        section: 'medical',
        type: 'yes_no',
        source: 'FOGSI E-Booklet p. 22: Levothyroxine dose typically increases 20-30% in early pregnancy',
        question: {
          en: "Are you currently taking daily thyroid medication (such as Thyronorm or Eltroxin)?",
          hi: "क्या आप रोजाना थायराइड की गोली (जैसे थायरोनॉर्म या एल्ट्रॉक्सिन) लेती हैं?",
          te: "మీరు ప్రతిరోజూ థైరాయిడ్ టాబ్లెట్ (Thyronorm మొదలైనవి) వేసుకుంటున్నారా?",
          ta: "நீங்கள் தினமும் தைராய்டு மாத்திரை (Thyronorm போன்றவை) சாப்பிடுகிறீர்களா?",
          kn: "ನೀವು ಪ್ರತಿದಿನ ಥೈರಾಯ್ಡ್ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
          ml: "ദിവസവും തൈറോയ്ഡ് ഗുളിക കഴിക്കുന്നുണ്ടോ?",
          bn: "আপনি কি প্রতিদিন থাইরয়েডের ওষুধ খান?",
          mr: "तुम्ही रोज थायरॉईडची गोळी (उदा. थायरॉनॉर्म) घेता का?"
        }
      }
    ]
  },
  {
    id: 'medical_epilepsy',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 16, 27 & Checklist #4A: Monotherapy rule; avoid valproate; 5mg folic acid',
    question: {
      en: "Have you ever had epilepsy, seizures, or fits?",
      hi: "क्या आपको कभी मिर्गी, दौरे (seizures या fits) का इतिहास रहा है?",
      te: "మీకు ఎప్పుడైనా ఫిట్స్ లేదా మూర్ఛ వ్యాధి (Epilepsy) వచ్చిందా?",
      ta: "உங்களுக்கு வலிப்பு நோய் (Seizures / Fits) ஏதேனும் உள்ளதா?",
      kn: "ನಿಮಗೆ ಎಂದಾದರೂ ಅಪಸ್ಮಾರ ಅಥವಾ ಫಿಟ್ಸ್ (Seizures) ಬಂದಿದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് അപസ്മാരമോ (ഫിറ്റ്സ്) ഉണ്ടായ ചരിത്രമുണ്ടോ?",
      bn: "আপনার কি কখনও মৃগীরোগ বা খিঁচুনি (Seizures) হয়েছে?",
      mr: "तुम्हाला कधी फेफरे, आकडी किंवा मिरगी (Epilepsy/Fits) चा त्रास झाला आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'epilepsy_medication',
        section: 'medical',
        type: 'text_input',
        source: 'FOGSI Checklist #4A: Antiepileptic teratogenicity review; switch valproate',
        question: {
          en: "Please share which anti-seizure medication you are currently taking (or type None):",
          hi: "कृपया बताएं कि आप वर्तमान में कौन सी मिर्गी की दवा ले रही हैं (या None लिखें):",
          te: "మీరు ప్రస్తుతం వాడుతున్న మూర్ఛ మందుల పేర్లను తెలపండి:",
          ta: "நீங்கள் தற்போது சாப்பிடும் வலிப்பு மாத்திரைகளின் பெயரைப் பகிரவும்:",
          kn: "ಪ್ರಸ್ತುತ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿರುವ ಔಷಧಿಗಳ ಹೆಸರನ್ನು ತಿಳಿಸಿ:",
          ml: "നിലവിൽ കഴിക്കുന്ന മരുന്നുകളുടെ പേര് വ്യക്തമാക്കുക:",
          bn: "বর্তমানে কী ওষুধ খাচ্ছেন লিখুন:",
          mr: "सध्या तुम्ही कोणते औषध घेत आहात त्याचे नाव सांगा:"
        }
      }
    ]
  },
  {
    id: 'medical_cardiac',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI Checklist #4A & E-Booklet p. 16: Cardiac evaluation, NYHA class, echocardiogram',
    question: {
      en: "Do you have any heart condition, rheumatic heart disease, murmur, or valve disease?",
      hi: "क्या आपको दिल की कोई बीमारी, वाल्व की समस्या या दिल की धड़कन का विकार है?",
      te: "మీకు గుండె జబ్బులు, వాల్వ్ సమస్య లేదా రుమాటిక్ గుండె సమస్య ఉందా?",
      ta: "உங்களுக்கு இதய நோய், வால்வு பிரச்சனை ஏதேனும் உள்ளதா?",
      kn: "ನಿಮಗೆ ಹೃದಯ ಸಂಬಂಧಿ ಕಾಯಿಲೆ ಅಥವಾ ಕವಾಟದ ಸಮಸ್ಯೆ ಇದೆಯೇ?",
      ml: "നിങ്ങൾക്ക് ഹൃദ്രോഗമോ വാൽവ് തകരാറുകളോ ഉണ്ടോ?",
      bn: "আপনার কি কোনো হৃদরোগ বা হার্টের সমস্যা আছে?",
      mr: "तुम्हाला हृदयाचा आजार, झडपेचा त्रास (Valve disease) किंवा काही समस्या आहे का?"
    }
  },
  {
    id: 'medical_renal',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI Checklist #4A & E-Booklet p. 16: Check baseline creatinine, eGFR, 24h urine protein',
    question: {
      en: "Do you have chronic kidney / renal disease or history of frequent kidney infections?",
      hi: "क्या आपको किडनी (गुर्दे) की बीमारी या बार-बार संक्रमण की शिकायत है?",
      te: "మీకు కిడ్నీ వ్యాధి లేదా తరచూ ఇన్ఫెక్షన్లు వచ్చే సమస్య ఉందా?",
      ta: "உங்களுக்கு சிறுநீரக நோய் அல்லது அடிக்கடி சிறுநீர் தொற்று ஏற்படுகிறதா?",
      kn: "ನಿಮಗೆ ಮೂತ್ರಪಿಂಡದ (ಕಿಡ್ನಿ) ಕಾಯಿಲೆ ಅಥವಾ ಆಗಾಗ ಸೋಂಕು ಉಂಟಾಗುತ್ತದೆಯೇ?",
      ml: "വൃക്കരോഗമോ കൂടെക്കൂടെ മൂത്രാശയ അണുബാധയോ ഉണ്ടാകാറുണ്ടോ?",
      bn: "আপনার কি কিডনির রোগ বা বারবার ইনফেকশনের সমস্যা আছে?",
      mr: "तुम्हाला मूत्रपिंडाचा (किडनीचा) आजार किंवा वारंवार संसर्ग होतो का?"
    }
  },
  {
    id: 'medical_autoimmune',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI Checklist #4A & E-Booklet p. 16: SLE, Rheumatoid arthritis remission >= 6m',
    question: {
      en: "Do you have an autoimmune condition like Lupus (SLE) or Rheumatoid Arthritis?",
      hi: "क्या आपको ल्यूपस (SLE) या रूमेटाइड आर्थराइटिस (गठिया) जैसी ऑटोइम्यून बीमारी है?",
      te: "మీకు లూపస్ (SLE) లేదా రుమటాయిడ్ ఆర్థరైటిస్ వంటి ఆటో ఇమ్యూన్ వ్యాధి ఉందా?",
      ta: "உங்களுக்கு லூபஸ் (SLE) அல்லது முடக்கு வாதம் (Arthritis) போன்ற நோய் உள்ளதா?",
      kn: "ನಿಮಗೆ ಲ್ಯೂಪಸ್ (SLE) ಅಥವಾ ರುಮಟಾಯ್ಡ್ ಸಂಧಿವಾತದಂತಹ ಸಮಸ್ಯೆ ಇದೆಯೇ?",
      ml: "ലൂപ്പസ് (SLE) അല്ലെങ്കിൽ റൂമറ്റോയ്ഡ് ആർത്രൈറ്റിസ് പോലുള്ള രോഗങ്ങളുണ്ടോ?",
      bn: "আপনার কি লুপাস (SLE) বা রিউমাটয়েড আর্থ্রাইটিসের মতো অটোইমিউন রোগ আছে?",
      mr: "तुम्हाला ल्यूपस (SLE) किंवा संधिवात (Rheumatoid Arthritis) सारखा ऑटोइम्यून आजार आहे का?"
    }
  },
  {
    id: 'medical_periodontal',
    section: 'medical',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 23: Periodontal disease linked to preterm birth',
    question: {
      en: "Do you have bleeding gums, loose teeth, or frequent gum infections?",
      hi: "क्या आपके मसूड़ों से खून आता है, दांत ढीले हैं, या मसूड़ों में सूजन/इन्फेक्शन रहता है?",
      te: "మీ చిగుళ్ళ నుండి రక్తం కారడం లేదా పంటి సమస్యలు ఉన్నాయా?",
      ta: "ஈறுகளில் ரத்தக்கசிவு அல்லது பல் பிரச்சனைகள் உள்ளதா?",
      kn: "ನಿಮ್ಮ ಒಸಡುಗಳಿಂದ ರಕ್ತಸ್ರಾವವಾಗುವುದು ಅಥವಾ ಹಲ್ಲಿನ ತೊಂದರೆಗಳಿವೆಯೇ?",
      ml: "മോണയിൽ നിന്ന് രക്തം വരികയോ പല്ലിന് അസുഖങ്ങളോ ഉണ്ടോ?",
      bn: "দাঁতের মাড়ি থেকে রক্ত পড়া বা কোনো ইনফেকশন আছে কি?",
      mr: "हिरड्यांमधून रक्त येणे किंवा दातांचे विकार आहेत का?"
    }
  },

  // SECTION 5: SURGICAL HISTORY
  {
    id: 'bariatric_surgery',
    section: 'surgical',
    type: 'yes_no',
    source: 'FOGSI E-Booklet Book 1, p. 13 & Checklist #1: Post-bariatric wait 12–24 months',
    question: {
      en: "Have you ever had weight-loss (bariatric) surgery?",
      hi: "क्या आपकी कभी वजन घटाने की (Bariatric) सर्जरी हुई है?",
      te: "మీకు బరువు తగ్గే (బేరియాట్రిక్) శస్త్రచికిత్స జరిగిందా?",
      ta: "நீங்கள் உடல் எடையைக் குறைக்கும் பேரியாட்ரிக் அறுவை சிகிச்சை செய்துள்ளீர்களா?",
      kn: "ನೀವು ತೂಕ ಇಳಿಸುವ (ಬೇರಿಯಾಟ್ರಿಕ್) ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗೆ ಒಳಗಾಗಿದ್ದೀರಾ?",
      ml: "ശരീരഭാരം കുറയ്ക്കാനുള്ള ബാരിയാട്രിക് ശസ്ത്രക്രിയ ചെയ്തിട്ടുണ്ടോ?",
      bn: "আপনার কি ওজন কমানোর (ব্যারিয়াট্রিক) অস্ত্রোপচার হয়েছে?",
      mr: "तुमची कधी वजन कमी करण्याची (Bariatric) शस्त्रक्रिया झाली आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'bariatric_interval',
        section: 'surgical',
        type: 'choice',
        source: 'FOGSI E-Booklet Book 1, p. 13: Wait 12–24 months until weight stabilizes',
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
    id: 'prior_surgeries',
    section: 'surgical',
    type: 'yes_no',
    source: 'FOGSI Checklist Item #2: Surgical history',
    question: {
      en: "Have you had any other major surgeries (such as pelvic, uterine, appendix, or gallbladder)?",
      hi: "क्या आपकी कोई अन्य बड़ी सर्जरी (जैसे पेट, बच्चेदानी, अपेंडिक्स, या पित्ताशय) हुई है?",
      te: "మీకు ఇతర పెద్ద ఆపరేషన్లు (గర్భాశయ, అపెండిక్స్, పిత్తాశయం మొదలైనవి) జరిగాయా?",
      ta: "உங்களுக்கு வேறு ஏதேனும் பெரிய அறுவை சிகிச்சை (கர்ப்பப்பை, குடல்வால் போன்றவை) நடந்துள்ளதா?",
      kn: "ನಿಮಗೆ ಬೇರೆ ಪ್ರಮುಖ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು (ಗರ್ಭಾಶಯ, ಅಪೆಂಡಿಕ್ಸ್ ಇತ್ಯಾದಿ) ಆಗಿವೆಯೇ?",
      ml: "മറ്റ് വലിയ ശസ്ത്രക്രിയകൾ (ഗർഭപാത്രം, അപ്പെൻഡിക്സ്) ചെയ്തിട്ടുണ്ടോ?",
      bn: "আপনার কি অন্য কোনো বড় অস্ত্রোপচার (যেমন জরায়ু, অ্যাপেন্ডিক্স) হয়েছে?",
      mr: "तुमची इतर कोणती मोठी शस्त्रक्रिया (जसे पोट, गर्भाशय, अपेंडिक्स किंवा पित्ताशय) झाली आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'surgery_details',
        section: 'surgical',
        type: 'text_input',
        source: 'FOGSI Checklist #2: Document prior pelvic/abdominal scars',
        question: {
          en: "Please share surgery type, approximate year, or complications (if known):",
          hi: "कृपया सर्जरी का प्रकार, अनुमानित वर्ष या कोई जटिलता बताएं:",
          te: "శస్త్రచికిత్స రకం, సంవత్సరం లేదా సమస్యల వివరాలు తెలపండి:",
          ta: "அறுவை சிகிச்சையின் வகை மற்றும் தோராயமான ஆண்டைப் பகிரவும்:",
          kn: "ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಪ್ರಕಾರ ಮತ್ತು ವರ್ಷವನ್ನು ತಿಳಿಸಿ:",
          ml: "ശസ്ത്രക്രിയ ഏതാണെന്നും നടന്ന വർഷവും വ്യക്തമാക്കുക:",
          bn: "অস্ত্রোপচারের ধরন ও সাল উল্লেখ করুন:",
          mr: "कृपया शस्त्रक्रियेचा प्रकार, अंदाजे वर्ष किंवा काही त्रास झाला असल्यास सांगा:"
        }
      }
    ]
  },

  // SECTION 6: MEDICATIONS & PRECONCEPTION SUPPLEMENTATION
  {
    id: 'taking_medications',
    section: 'medications',
    type: 'yes_no',
    source: 'FOGSI Checklist #2, #6 & E-Booklet p. 18, 23: Medication teratogenicity screening',
    question: {
      en: "Are you currently taking any prescription medications, Ayurvedic remedies, or daily supplements?",
      hi: "क्या आप वर्तमान में कोई डॉक्टरी दवा, आयुर्वेदिक दवाई या दैनिक सप्लीमेंट ले रही हैं?",
      te: "మీరు ప్రస్తుతం ఏవైనా ప్రిస్క్రిప్షన్ మందులు లేదా ఆయుర్వేద మందులు వాడుతున్నారా?",
      ta: "நீங்கள் தற்போது ஏதேனும் மாத்திரைகள், மருந்துகள் அல்லது மூலிகை மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
      kn: "ನೀವು ಪ್ರಸ್ತುತ ಯಾವುದೇ ಔಷಧಿಗಳು ಅಥವಾ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸೆ ಪಡೆಯುತ್ತಿದ್ದೀರಾ?",
      ml: "നിലവിൽ എന്തെങ്കിലും മരുന്നുകളോ ആയുർവേദ ചികിത്സയോ കഴിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি বর্তমানে কোনো প্রেসক্রিপশন বা আয়ুর্বেদিক ওষুধ খাচ্ছেন?",
      mr: "तुम्ही सध्या कोणतीही डॉक्टरी औषधे, आयुर्वेदिक औषधे किंवा नियमित सप्लिमेंट्स घेत आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'medication_names',
        section: 'medications',
        type: 'text_input',
        source: 'FOGSI Checklist #2: Review medication safety in pregnancy',
        question: {
          en: "Please list the names, dose, and reasons for taking these medications:",
          hi: "कृपया इन दवाओं के नाम, खुराक और लेने का कारण लिखें:",
          te: "దయచేసి ఆ మందుల పేర్లు, మోతాదు మరియు కారణాన్ని తెలపండి:",
          ta: "அந்த மருந்துகளின் பெயர்கள், அளவு மற்றும் காரணத்தைக் குறிப்பிடவும்:",
          kn: "ದಯವಿಟ್ಟು ಆ ಔಷಧಿಗಳ ಹೆಸರುಗಳು, ಡೋಸ್ ಮತ್ತು ಕಾರಣವನ್ನು ತಿಳಿಸಿ:",
          ml: "ആ മരുന്നുകളുടെ പേരും കഴിക്കുന്നതിന്റെ കാരണവും വ്യക്തമാക്കുക:",
          bn: "অনুগ্রহ করে ওষুধের নাম ও কারণ লিখুন:",
          mr: "कृपया या औषधांची नावे, डोस आणि घेण्याचे कारण लिहा:"
        }
      }
    ]
  },
  {
    id: 'folic_acid_status',
    section: 'medications',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 11, 18, 23, 25 & Checklist #6: Folic Acid 400-800 mcg for all, 5mg for high risk',
    question: {
      en: "Are you currently taking daily folic acid tablets?",
      hi: "क्या आप वर्तमान में रोजाना फोलिक एसिड (Folic Acid) की गोली ले रही हैं?",
      te: "మీరు ప్రస్తుతం ప్రతిరోజూ ఫోలిక్ యాసిడ్ (Folic acid) మాత్రలు తీసుకుంటున్నారా?",
      ta: "நீங்கள் தற்போது தினமும் ஃபோலிக் அமில (Folic acid) மாத்திரை சாப்பிடுகிறீர்களா?",
      kn: "ನೀವು ಪ್ರಸ್ತುತ ಪ್ರತಿದಿನ ಫೋಲಿಕ್ ಆಮ್ಲ (Folic acid) ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ ഇപ്പോൾ ദിവസവും ഫോളിക് ആസിഡ് ഗുളിക കഴിക്കുന്നുണ്ടോ?",
      bn: "আপনি কি বর্তমানে প্রতিদিন ফলিক অ্যাসিড (Folic acid) ট্যাবলেট খাচ্ছেন?",
      mr: "तुम्ही सध्या दररोज फॉलिक ॲसिडची (Folic acid) गोळी घेत आहात का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'folic_acid_dose',
        section: 'medications',
        type: 'choice',
        source: 'FOGSI Checklist #6: Dose differentiation (Standard 400-800 mcg vs High-dose 5mg)',
        question: {
          en: "What dose of folic acid are you taking?",
          hi: "आप फोलिक एसिड की कितनी खुराक ले रही हैं?",
          te: "మీరు తీసుకుంటున్న ఫోలిక్ యాసిడ్ మోతాదు ఎంత?",
          ta: "நீங்கள் எடுக்கும் ஃபோலிக் அமிலத்தின் அளவு என்ன?",
          kn: "ನೀವು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿರುವ ಫೋಲಿಕ್ ಆಮ್ಲದ ಡೋಸ್ ಎಷ್ಟು?",
          ml: "എത്ര അളവിലാണ് ഫോളിക് ആസിഡ് കഴിക്കുന്നത്?",
          bn: "ফলিক অ্যাসিডের মাত্রা কত?",
          mr: "तुम्ही फॉलिक ॲसिडचा किती डोस घेत आहात?"
        },
        options: [
          { value: 'standard_400_800', label: { en: 'Standard dose (400 to 800 micrograms / 0.5 mg daily)', hi: 'सामान्य खुराक (400 से 800 माइक्रोग्राम)', te: 'సాధారణ మోతాదు (400–800 మైక్రోగ్రాములు)', ta: 'வழக்கமான அளவு (400–800 மைக்ரோகிராம்)', kn: 'ಸಾಮಾನ್ಯ ಡೋಸ್ (400–800 ಮೈಕ್ರೋಗ್ರಾಂ)', ml: 'സാധാരണ അളവ് (400–800 മൈക്രോ ഗ്രാം)', bn: 'স্বাভাবিক মাত্রা (৪০০–৮০০ মাইক্রোগ্রাম)', mr: 'सामान्य डोस (४०० ते ८०० मायक्रोग्रॅम)' } },
          { value: 'high_5mg', label: { en: 'High dose (5 milligrams daily — for diabetes/epilepsy/prior NTD)', hi: 'उच्च खुराक (5 मिलीग्राम — हाई रिस्क के लिए)', te: 'ఎక్కువ మోతాదు (5 మిల్లీగ్రాములు)', ta: 'அதிக அளவு (5 மில்லிகிராம்)', kn: 'ಹೆಚ್ಚಿನ ಡೋಸ್ (5 ಮಿಲಿಗ್ರಾಂ)', ml: 'ഉയർന്ന അളവ് (5 മില്ലിഗ്രാം)', bn: 'উচ্চ মাত্রা (৫ মিলিগ্রাম)', mr: 'उच्च डोस (५ मिग्रॅ - हाय रिस्कसाठी)' } },
          { value: 'unknown', label: { en: 'Not sure of the exact dosage', hi: 'सटीक खुराक मालूम नहीं', te: 'ఖచ్చితమైన మోతాదు తెలియదు', ta: 'சரியான அளவு தெரியவில்லை', kn: 'ಖಚಿತವಾಗಿ ಗೊತ್ತಿಲ್ಲ', ml: 'കൃത്യമായ അളവ് അറിയില്ല', bn: 'নির্দিষ্ট মাত্রা জানা নেই', mr: 'नेमका डोस माहित नाही' } }
        ]
      }
    ]
  },

  // SECTION 7: FAMILY & GENETIC HISTORY
  {
    id: 'family_genetic',
    section: 'family',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 9, 15 & Checklist #4C: Thalassemia screening (Hb HPLC) is of utmost importance',
    question: {
      en: "Does anyone in your or your partner's family have Thalassemia, Sickle Cell Disease, Haemophilia, or other genetic conditions?",
      hi: "क्या आपके या आपके साथी के परिवार में थैलेसीमिया, सिकल सेल, हीमोफीलिया या कोई आनुवंशिक बीमारी है?",
      te: "మీ లేదా మీ భాగస్వామి కుటుంబంలో థలసేమియా, సికిల్ సెల్ వంటి జన్యుపరమైన వ్యాధులు ఉన్నాయా?",
      ta: "உங்கள் குடும்பத்தில் தலசீமியா, அரிவாள் செல் அனீமியா போன்ற மரபணு குறைபாடுகள் உள்ளதா?",
      kn: "ನಿಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ ಥಲಸ್ಸೆಮಿಯಾ, ಕುಡಗೋಲು ಕಣ ರಕ್ತಹೀನತೆಯಂತಹ ತಳಿ ದೋಷಗಳಿವೆಯೇ?",
      ml: "കുടുംബത്തിൽ തലസീമിയ, സിക്കിൾ സെൽ പോലുള്ള പാരമ്പര്യ രോഗങ്ങളുണ്ടോ?",
      bn: "আপনার পরিবারে কি থ্যালাসেমিয়া বা কোনো জিনগত রোগের ইতিহাস রয়েছে?",
      mr: "तुमच्या किंवा जोडीदाराच्या कुटुंबात थॅलेसेमिया, सिकलसेल किंवा अनुवांशिक आजार आहे का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'genetic_condition_details',
        section: 'family',
        type: 'text_input',
        source: 'FOGSI Checklist #4C: Genetic carrier screening referral',
        question: {
          en: "Please specify which condition and which family member is affected:",
          hi: "कृपया बताएं कि कौन सी बीमारी है और परिवार के किस सदस्य को है:",
          te: "దయచేసి ఏ వ్యాధి మరియు కుటుంబంలో ఎవరికి ఉందో తెలపండి:",
          ta: "எந்த நோய் மற்றும் குடும்பத்தில் யாருக்கு உள்ளது என்பதைக் குறிப்பிடவும்:",
          kn: "ಯಾವ ಕಾಯಿಲೆ ಮತ್ತು ಕುಟುಂಬದ ಯಾರಿಗೆ ಇದೆ ಎಂದು ತಿಳಿಸಿ:",
          ml: "ഏത് രോഗമാണെന്നും കുടുംബത്തിൽ ആർക്കാണെന്നും വ്യക്തമാക്കുക:",
          bn: "কোন রোগ এবং পরিবারের কার আছে তা উল্লেখ করুন:",
          mr: "कृपया कोणता आजार आहे आणि कुटुंबातील कोणाला आहे ते सांगा:"
        }
      }
    ]
  },

  // SECTION 8: IMMUNIZATION & INFECTIONS
  {
    id: 'tested_rubella',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 17, 24 & Checklist #8: Check Rubella IgG; defer conception 4 weeks post-MMR',
    question: {
      en: "Have you received the Rubella (German Measles / MMR) vaccine, or tested immune to Rubella?",
      hi: "क्या आपको रूबेला (जर्मन खसरा / MMR) का टीका लगा है या आपकी जांच में इम्यूनिटी पाई गई है?",
      te: "మీరు రుబెల్లా (MMR) టీకా తీసుకున్నారా?",
      ta: "நீங்கள் ரூபெல்லா (MMR) தடுப்பூசி போட்டுள்ளீர்களா?",
      kn: "ನೀವು ರುಬೆಲ್ಲಾ (MMR) ಲಸಿಕೆ ಪಡೆದಿದ್ದೀರಾ?",
      ml: "നിങ്ങൾ റുബെല്ല (MMR) വാക്സിൻ എടുത്തിട്ടുണ്ടോ?",
      bn: "আপনি কি রুবেলা (MMR) টিকা নিয়েছেন?",
      mr: "तुम्ही रुबेला (MMR) लस घेतली आहे का किंवा तपासणीत प्रतिकारशक्ती आढळली आहे का?"
    },
    options: [
      { value: 'immune_vaccinated', label: { en: 'Yes, vaccinated or tested immune', hi: 'हाँ, टीका लगा है / जांच में इम्यून हूँ', te: 'అవును, టీకా తీసుకున్నాను', ta: 'ஆம், தடுப்பூசி போட்டுள்ளேன்', kn: 'ಹೌದು, ಲಸಿಕೆ ಪಡೆದಿದ್ದೇನೆ', ml: 'അതെ, വാക്സിൻ എടുത്തിട്ടുണ്ട്', bn: 'হ্যাঁ, টিকা নেওয়া আছে', mr: 'होय, लस घेतली आहे' } },
      { value: 'not_immune', label: { en: 'No, never vaccinated or tested not immune', hi: 'नहीं, कभी टीका नहीं लगा / इम्युनिटी नहीं है', te: 'లేదు, టీకా తీసుకోలేదు', ta: 'இல்லை, போடவில்லை', kn: 'ಇಲ್ಲ, ಲಸಿಕೆ ಪಡೆದಿಲ್ಲ', ml: 'ഇല്ല, വാക്സിൻ എടുത്തിട്ടില്ല', bn: 'না, টিকা নেওয়া নেই', mr: 'नाही, लस घेतलेली नाही' } },
      { value: 'not_sure', label: { en: 'Not sure / Need to check records', hi: 'निश्चित नहीं / रिकॉर्ड देखना पड़ेगा', te: 'ఖచ్చితంగా తెలియదు', ta: 'உறுதியாகத் தெரியவில்லை', kn: 'ಖಚಿತವಾಗಿ ಗೊತ್ತಿಲ್ಲ', ml: 'വ്യക്തമല്ല', bn: 'নিশ্চিত নই', mr: 'माहित नाही / तपासावे लागेल' } }
    ]
  },
  {
    id: 'tested_varicella',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 17, 24 & Checklist #8: Live varicella vaccine requires 28 days wait before pregnancy',
    question: {
      en: "Have you had Chickenpox (Varicella) disease in childhood, or received the Chickenpox vaccine?",
      hi: "क्या आपको बचपन में चेचक/माता (चिकनपॉक्स) निकला था, या चिकनपॉक्स का टीका लगा है?",
      te: "మీకు చిన్నప్పుడు ఆటలమ్మ (చికెన్ పాక్స్) వచ్చిందా లేదా టీకా తీసుకున్నారా?",
      ta: "உங்களுக்கு சின்னம்மை (Chickenpox) வந்திருக்கிறதா அல்லது தடுப்பூசி போட்டிருக்கிறீர்களா?",
      kn: "ನಿಮಗೆ ಚಿಕ್ಕಂದಿನಲ್ಲಿ ಚಿಕನ್ ಪಾಕ್ಸ್ ಬಂದಿತ್ತೇ ಅಥವಾ ಲಸಿಕೆ ಹಾಕಿಸಿಕೊಂಡಿದ್ದೀರಾ?",
      ml: "ചിക്കൻപോക്സ് വന്നിട്ടുണ്ടോ അതോ വാക്സിൻ എടുത്തിട്ടുണ്ടോ?",
      bn: "আপনার কি চিকেনপক্স হয়েছিল বা টিকা নিয়েছেন?",
      mr: "तुम्हाला लहानपणी कांजण्या (चिकनपॉक्स) आल्या होत्या का किंवा लस घेतली आहे का?"
    },
    options: [
      { value: 'had_disease_or_vaccine', label: { en: 'Yes, had chickenpox or vaccine', hi: 'हाँ, चिकनपॉक्स हुआ था या टीका लगा है', te: 'అవును, వచ్చింది లేదా టీకా తీసుకున్నాను', ta: 'ஆம், வந்துள்ளது அல்லது தடுப்பூசி போட்டேன்', kn: 'ಹೌದು, ಬಂದಿತ್ತು ಅಥವಾ ಲಸಿಕೆ ಪಡೆದಿದ್ದೇನೆ', ml: 'അതെ, വന്നിട്ടുണ്ട് അല്ലെങ്കിൽ വാക്സിൻ എടുത്തു', bn: 'হ্যাঁ, হয়েছিল বা টিকা আছে', mr: 'होय, कांजण्या आल्या होत्या किंवा लस घेतली आहे' } },
      { value: 'never_had_or_vaccinated', label: { en: 'Never had chickenpox and never vaccinated', hi: 'कभी नहीं हुआ और न ही टीका लगा', te: 'ఎప్పుడూ రాలేదు మరియు టీకా తీసుకోలేదు', ta: 'வரவும் இல்லை, தடுப்பூசியும் போடவில்லை', kn: 'ಎಂದಿಗೂ ಬಂದಿಲ್ಲ ಮತ್ತು ಲಸಿಕೆ ಪಡೆದಿಲ್ಲ', ml: 'ഒരിക്കലും വന്നിട്ടില്ല, വാക്സിനും എടുത്തിട്ടില്ല', bn: 'কখনও হয়নি বা টিকা নেই', mr: 'कधीही आल्या नाहीत व लस घेतली नाही' } },
      { value: 'not_sure', label: { en: 'Not sure', hi: 'मालूम नहीं', te: 'తెలియదు', ta: 'தெரியவில்லை', kn: 'ಗೊತ್ತಿಲ್ಲ', ml: 'അറിയില്ല', bn: 'জানা নেই', mr: 'माहित नाही' } }
    ]
  },
  {
    id: 'tested_hepb_hiv',
    section: 'infections',
    type: 'choice',
    source: 'FOGSI Checklist #4B, #5: Screen HIV, HBsAg, Syphilis in all couples',
    question: {
      en: "Have you or your partner ever been tested for Hepatitis B, HIV, or Syphilis?",
      hi: "क्या आपकी या आपके साथी की कभी हेपेटाइटिस बी, एचआईवी या सिफलिस की जांच हुई है?",
      te: "మీకు హెపటైటిస్ బి లేదా హెచ్‌ఐవి పరీక్షలు జరిగాయా?",
      ta: "ஹெபடைటిஸ் பி அல்லது எச்.ஐ.வி பரிசோதனை செய்துள்ளீர்களா?",
      kn: "ಹೆಪಟೈಟಿಸ್ ಬಿ ಅಥವಾ ಎಚ್ಐವಿ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿದ್ದೀರಾ?",
      ml: "ഹെപ്പറ്റൈറ്റിസ് ബി, എച്ച്ഐവി പരിശോധനകൾ നടത്തിയിട്ടുണ്ടോ?",
      bn: "হেপাটাইটিস বি বা এইচআইভি পরীক্ষা করিয়েছেন?",
      mr: "हिपॅटायटीस बी, एचआयव्ही किंवा सिफिलीसची तपासणी झाली आहे का?"
    },
    options: [
      { value: 'tested_negative', label: { en: 'Yes, tested negative (Clear)', hi: 'हाँ, जांच में नेगेटिव (सामान्य) थे', te: 'అవును, నెగెటివ్ వచ్చింది', ta: 'ஆம், நெகட்டிவ் என வந்துள்ளது', kn: 'ಹೌದು, ನೆಗೆಟಿವ್ ಬಂದಿದೆ', ml: 'അതെ, നെഗറ്റീവ് ആയിരുന്നു', bn: 'হ্যাঁ, নেগেটিভ রিপোর্ট ছিল', mr: 'होय, तपासणी निगेटिव्ह (सामान्य) आली' } },
      { value: 'never_tested', label: { en: 'Never tested / Due for preconception screening', hi: 'कभी जांच नहीं कराई / जांच करानी है', te: 'ఎప్పుడూ పరీక్షించలేదు', ta: 'பரிசோதிக்கவில்லை', kn: 'ಪರೀಕ್ಷಿಸಿಲ್ಲ', ml: 'ഇതുവരെ പരിശോധിച്ചിട്ടില്ല', bn: 'কখনও পরীক্ষা করা হয়নি', mr: 'कधीही तपासणी केली नाही / तपासणी करायची आहे' } },
      { value: 'known_positive', label: { en: 'Known positive for Hepatitis B or HIV', hi: 'पॉजिटिव रिपोर्ट का इतिहास रहा है', te: 'పాజిటివ్ చరిత్ర ఉంది', ta: 'பாசிட்டிவ் வரலாறு உள்ளது', kn: 'ಪಾಸಿಟಿವ್ ಇತಿಹಾಸವಿದೆ', ml: 'പോസിറ്റീവ് റിപ്പോർട്ട് ഉണ്ടായിരുന്നു', bn: 'পজিটিভ রিপোর্ট ছিল', mr: 'पॉझिटिव्ह रिपोर्टचा इतिहास आहे' } }
    ]
  },
  {
    id: 'history_tuberculosis',
    section: 'infections',
    type: 'yes_no_unknown',
    source: 'FOGSI Checklist #4B & E-Booklet p. 17: Screen TB history (pulmonary and genital)',
    question: {
      en: "Have you ever been treated for Tuberculosis (TB) in the past?",
      hi: "क्या आपको पहले कभी टीबी (क्षयरोग) का इलाज हुआ है?",
      te: "గతంలో మీకు ఎప్పుడైనా క్షయవ్యాధి (టీబీ) చికిత్స జరిగిందా?",
      ta: "உங்களுக்கு காசநோய் (TB) சிகிச்சை எடுக்கப்பட்ட வரலாறு உள்ளதா?",
      kn: "ನಿಮಗೆ ಕ್ಷಯರೋಗಕ್ಕೆ (ಟಿಬಿ) ಚಿಕಿತ್ಸೆ ನೀಡಲಾಗಿದ್ದಿತೇ?",
      ml: "ക്ഷയരോഗത്തിന് (ടിബി) ചികിത്സ എടുത്തിട്ടുണ്ടോ?",
      bn: "আপনার কি কখনও যক্ষ্মা (টিবি) চিকিৎসা হয়েছে?",
      mr: "तुम्हाला पूर्वी कधी टीबीचा (क्षयरोगाचा) उपचार झाला आहे का?"
    }
  },

  // SECTION 9: ENVIRONMENTAL EXPOSURES
  {
    id: 'environmental_hazards',
    section: 'environment',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 17, 19, 20 & Checklist #4D: Screen lead, pesticides, radiation, heat',
    question: {
      en: "Does your work or home environment involve pesticides, industrial solvents, radiation, or extreme heat?",
      hi: "क्या आपके काम या घर में कीटनाशक, केमिकल, रेडिएशन या बहुत तेज गर्मी का संपर्क होता है?",
      te: "మీ పని లేదా ఇంట్లో పురుగుమందులు, రసాయనాలు లేదా తీవ్రమైన వేడికి గురవుతున్నారా?",
      ta: "வேலை அல்லது வீட்டில் பூச்சிக்கொல்லிகள், ரசாயனங்கள் அல்லது அதிக வெப்பம் உள்ளதா?",
      kn: "ಕೆಲಸ ಅಥವಾ ಮನೆಯಲ್ಲಿ ಕೀಟನಾಶಕಗಳು, ರಾಸಾಯನಿಕಗಳು ಅಥವಾ ಅತಿಯಾದ ಶಾಖದ ಸಂಪರ್ಕವಿದೆಯೇ?",
      ml: "ജോലിസ്ഥലത്തോ വീട്ടിലോ കീടനാശിനികൾ, രാസവസ്തുക്കൾ എന്നിവ ഏൽക്കാറുണ്ടോ?",
      bn: "কর্মক্ষেত্র বা বাড়িতে কি কীটনাশক, রাসায়নিক বা অতিরিক্ত তাপের সংস্পর্শ রয়েছে?",
      mr: "तुमच्या कामाच्या ठिकाणी किंवा घरी कीटकनाशके, रसायने, रेडिएशन किंवा अतिउष्णतेचा संपर्क येतो का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'hazard_types',
        section: 'environment',
        type: 'multi_select',
        source: 'FOGSI E-Booklet p. 19-20',
        question: {
          en: "What specific environmental exposures are present? (Select all that apply)",
          hi: "इनमें से कौन से जोखिम मौजूद हैं? (सभी लागू विकल्प चुनें)",
          te: "వీటిలో ఏ అంశాలు మీకు ఎదురవుతున్నాయి?",
          ta: "குறிப்பிட்ட பாதிப்புகள் எவை? (பொருந்துபவற்றைத் தேர்ந்தெடுக்கவும்)",
          kn: "ಯಾವ ನಿರ್ದಿಷ್ಟ ಅಪಾಯಗಳು ಕಂಡುಬರುತ್ತವೆ?",
          ml: "ഇതിൽ ഏതൊക്കെയാണ് നിങ്ങളുടെ ചുറ്റുപാടിലുള്ളത്?",
          bn: "কোন কোন পরিবেশগত ঝুঁকি উপস্থিত রয়েছে?",
          mr: "यापैकी नेमका कशाचा संपर्क येतो? (लागू असलेले सर्व निवडा)"
        },
        options: [
          { value: 'pesticides', label: { en: 'Agricultural pesticides / chemicals', hi: 'खेती के कीटनाशक / रासायनिक खाद', te: 'పురుగుమందులు / రసాయన ఎరువులు', ta: 'விவசாய பூச்சிக்கொல்லிகள்', kn: 'ಕೃಷಿ ಕೀಟನಾಶಕಗಳು', ml: 'കീടനാശിനികൾ', bn: 'কীটনাশক বা রাসায়নিক', mr: 'शेतीची कीटकनाशके / खते' } },
          { value: 'solvents_metals', label: { en: 'Industrial solvents, paints, heavy metals (lead, mercury)', hi: 'पेंट्स, सॉल्वैंट्स, लेड (सीसा) या भारी धातुएं', te: 'పారిశ్రామిక రసాయనాలు / పెయింట్లు / లోహాలు', ta: 'தொழில்துறை கரைப்பான்கள், வண்ணப்பூச்சுகள்', kn: 'ಕೈಗಾರಿಕಾ ದ್ರಾವಕಗಳು, ಬಣ್ಣಗಳು', ml: 'പെയിന്റുകൾ, രാസലായനികൾ, ലെഡ്', bn: 'শিল্প রাসায়নিক, রং বা ভারী ধাতু', mr: 'इंडस्ट्रियल सॉल्व्हेंट्स, पेंट्स, शिसे' } },
          { value: 'radiation', label: { en: 'Medical X-rays, ionising radiation', hi: 'एक्स-रे या रेडिएशन का संपर्क', te: 'ఎక్స్-రే లేదా రేడియేషన్', ta: 'எக்ஸ்-ரே அல்லது கதிர்வீச்சு', kn: 'ಎಕ್ಸ್-ರೇ ಅಥವಾ ವಿಕಿರಣ', ml: 'എക്സ്-റേ അല്ലെങ്കിൽ റേഡിയേഷൻ', bn: 'এক্স-রে বা রেডিয়েশন', mr: 'एक्स-रे किंवा रेडिएशन' } },
          { value: 'biomass_smoke', label: { en: 'Indoor biomass fuel smoke (wood/chulha smoke)', hi: 'चूल्हे / लकड़ी का धुआं (Indoor smoke)', te: 'కట్టెల పొయ్యి పొగ', ta: 'விறகு அடுப்பு புகை', kn: 'ಒಲೆಯ ಹೊಗೆ / ಕಟ್ಟಿಗೆಯ ಹೊಗೆ', ml: 'വിറകടുപ്പിലെ പുക', bn: 'উনুনের বা কাঠের ধোঁয়া', mr: 'चुलीचा / लाकडाचा धूर' } },
          { value: 'extreme_heat', label: { en: 'Extreme outdoor heatwaves / occupational heat exposure', hi: 'अत्यधिक गर्मी / लू में काम करना', te: 'తీవ్రమైన ఎండ లేదా వేడి', ta: 'கடும் வெயில் மற்றும் வெப்பம்', kn: 'ಅತಿಯಾದ ಬಿಸಿಲು / ಶಾಖ', ml: 'കഠിനമായ ചൂട് / വെയിൽ', bn: 'প্রচণ্ড গরম বা রোদে কাজ', mr: 'अतिउष्णता / उन्हात काम' } }
        ]
      }
    ]
  },

  // SECTION 10: LIFESTYLE & SUBSTANCES (Both Partners)
  {
    id: 'tobacco_use',
    section: 'lifestyle',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 12, 20 & Checklist #4E: Tobacco screen BOTH partners',
    question: {
      en: "Do you or your partner currently smoke bidis/cigarettes, vape, or chew tobacco (gutkha, khaini)?",
      hi: "क्या आप या आपके साथी बीड़ी, सिगरेट, हुक्का, या तंबाकू (गुटखा, खैनी) का सेवन करते हैं?",
      te: "మీరు లేదా మీ భాగస్వామి సిగరెట్, బీడీ, గుట్కా లేదా పొగాకు వాడుతున్నారా?",
      ta: "நீங்கள் அல்லது உங்கள் துணை புகைபிடித்தல், குட்கா அல்லது புகையிலை பயன்படுத்துகிறீர்களா?",
      kn: "ನೀವು ಅಥವಾ ನಿಮ್ಮ ಸಂಗಾತಿ ಸಿಗರೇಟ್, ಬೀಡಿ, ಗುಟ್ಕಾ ಅಥವಾ ತಂಬಾಕು ಬಳಸುತ್ತೀರಾ?",
      ml: "നിങ്ങളോ പങ്കാളിയോ പുകവലിക്കുകയോ പുകയില ഉൽപ്പന്നങ്ങൾ ഉപയോഗിക്കുകയോ ചെയ്യുന്നുണ്ടോ?",
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
    source: 'FOGSI E-Booklet p. 12, 20 & Checklist #4E: Alcohol is a teratogen, advise abstinence',
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
      { value: 'both', label: { en: 'Both of us consume alcohol', hi: 'हम दोनों शराब पीते हैं', te: 'మేమిద్దరం తాగుతాము', ta: 'இருவரும் அருந்துகிறோம்', kn: 'ನಾವಿಬ್ಬರೂ ಮದ್ಯಪಾನ ಮಾಡುತ್ತೇವೆ', ml: 'ഞങ്ങൾ രണ്ടുപേരും കഴിക്കാറുണ്ട്', bn: 'আমরা দুजনেই পান করি', mr: 'आम्ही दोघेही घेतो' } }
    ]
  },
  {
    id: 'caffeine_intake',
    section: 'lifestyle',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 12, 22: High caffeine linked to miscarriage',
    question: {
      en: "How many cups of coffee, tea, or cola drinks do you typically consume per day?",
      hi: "आप आमतौर पर रोजाना कितनी कप चाय, कॉफी या कोला ड्रिंक पीती हैं?",
      te: "మీరు రోజుకు ఎన్ని కప్పుల టీ లేదా కాఫీ తాగుతారు?",
      ta: "ஒரு நாளைக்கு எத்தனை கப் டீ அல்லது காபி குடிக்கிறீர்கள்?",
      kn: "ದಿನಕ್ಕೆ ಎಷ್ಟು ಕಪ್ ಕಾಫಿ ಅಥವಾ ಟೀ ಕುಡಿಯುತ್ತೀರಿ?",
      ml: "ഒരു ദിവസം എത്ര കപ്പ് ചായയോ കാപ്പിയോ കുടിക്കാറുണ്ട്?",
      bn: "প্রতিদিন কত কাপ চা বা কফি পান করেন?",
      mr: "दररोज चहा किंवा कॉफीचे किती कप घेता?"
    },
    options: [
      { value: 'low_0_1', label: { en: '0 to 1 cup per day (Safe)', hi: '0 से 1 कप (सुरक्षित)', te: '0 నుండి 1 కప్పు (సురక్షితం)', ta: '0 முதல் 1 கப் (பாதுகாப்பானது)', kn: '0 ರಿಂದ 1 ಕಪ್', ml: '0 മുതൽ 1 കപ്പ്', bn: '০ থেকে ১ কাপ', mr: '० ते १ कप (सुरक्षित)' } },
      { value: 'moderate_2_3', label: { en: '2 to 3 cups per day', hi: '2 से 3 कप प्रतिदिन', te: '2 నుండి 3 కప్పులు', ta: '2 முதல் 3 கப்', kn: '2 ರಿಂದ 3 ಕಪ್', ml: '2 മുതൽ 3 കപ്പ്', bn: '২ থেকে ৩ কাপ', mr: '२ ते ३ कप' } },
      { value: 'high_4_plus', label: { en: '4 or more cups daily (Elevated caffeine)', hi: '4 या अधिक कप (उच्च कैफीन)', te: '4 లేదా ఎక్కువ కప్పులు', ta: '4 அல்லது அதற்கு மேல்', kn: '4 ಅಥವಾ ಹೆಚ್ಚು ಕಪ್', ml: '4 അല്ലെങ്കിൽ കൂടുതൽ', bn: '৪ বা ততোধিক কাপ', mr: '४ किंवा अधिक कप' } }
    ]
  },

  // SECTION 11: MENTAL HEALTH & PSYCHOSOCIAL SAFETY
  {
    id: 'mental_health_history',
    section: 'mental',
    type: 'yes_no_unknown',
    source: 'FOGSI E-Booklet Book 1, p. 12, 26, 27 & Checklist #9: Proactive relapse prevention plan',
    question: {
      en: "Have you ever been treated for depression, anxiety, or another mental health condition?",
      hi: "क्या आपका कभी डिप्रेशन, चिंता (एंजायटी) या अन्य मानसिक स्वास्थ्य स्थिति का इलाज हुआ है?",
      te: "గతంలో డిప్రెషన్ లేదా ఆందోళన (Anxiety) కోసం చికిత్స తీసుకున్నారా?",
      ta: "மனச்சோர்வு அல்லது பதற்றத்திற்கு சிகிச்சை எடுத்திருக்கிறீர்களா?",
      kn: "ಖಿನ್ನತೆ ಅಥವಾ ಆತಂಕಕ್ಕೆ ಚಿಕಿತ್ಸೆ ಪಡೆದಿದ್ದೀರಾ?",
      ml: "വിഷാദത്തിനോ ഉത്കണ്ഠയ്ക്കോ ചികിത്സ എടുത്തിട്ടുണ്ടോ?",
      bn: "ডিপ্রেশন বা উদ্বেগের জন্য চিকিৎসা নিয়েছেন?",
      mr: "कधी डिप्रेशन, चिंता किंवा मानसिक आरोग्यासाठी उपचार झाले आहेत का?"
    },
    followUpIf: 'yes',
    followUps: [
      {
        id: 'psychiatric_medications',
        section: 'mental',
        type: 'yes_no',
        source: 'FOGSI E-Booklet p. 27: Do not abruptly stop psychotropics upon pregnancy confirmation',
        question: {
          en: "Are you currently taking any psychiatric medications or antidepressants?",
          hi: "क्या आप वर्तमान में कोई मानसिक स्वास्थ्य या डिप्रेशन की दवा ले रही हैं?",
          te: "ప్రస్తుతం ఏవైనా డిప్రెషన్ మందులు వాడుతున్నారా?",
          ta: "தற்போது மனநல மாத்திரைகள் சாப்பிடுகிறீர்களா?",
          kn: "ಪ್ರಸ್ತುತ ಖಿನ್ನತೆಯ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?",
          ml: "നിലവിൽ മാനസികാരോഗ്യ മരുന്നുകൾ കഴിക്കുന്നുണ്ടോ?",
          bn: "বর্তমানে কোনো ডিপ্রেশনের ওষুধ খাচ্ছেন?",
          mr: "सध्या तुम्ही डिप्रेशन किंवा मानसिक आरोग्याची कोणतीही औषधे घेत आहात का?"
        }
      }
    ]
  },
  {
    id: 'perinatal_mental_history',
    section: 'mental',
    type: 'choice',
    source: 'FOGSI E-Booklet p. 27: Prior perinatal episode is strongest predictor of postpartum depression',
    question: {
      en: "Did you experience severe anxiety or depression during or after a previous pregnancy?",
      hi: "क्या पिछली किसी गर्भावस्था के दौरान या प्रसव के बाद गंभीर चिंता या अवसाद हुआ था?",
      te: "గత గర్భధారణ సమయంలో లేదా డెలివరీ తర్వాత తీవ్రమైన డిప్రెషన్ వచ్చిందా?",
      ta: "முந்தைய பிரசவத்திற்குப் பின் தீவிர மனச்சோர்வு ஏற்பட்டதா?",
      kn: "ಹಿಂದಿನ ಗರ್ಭಧಾರಣೆಯ ನಂತರ ತೀವ್ರ ಖಿನ್ನತೆ ಅನುಭವಿಸಿದ್ದೀರಾ?",
      ml: "മുൻ പ്രസവത്തിന് ശേഷം കഠിനമായ വിഷാദം അനുഭവപ്പെട്ടിട്ടുണ്ടോ?",
      bn: "পূর্বের প্রসবের পর কি কোনো বিষণ্নতা হয়েছিল?",
      mr: "मागील गर्भधारणेदरम्यान किंवा प्रसूतीनंतर तीव्र नैराश्य किंवा चिंता जाणवली होती का?"
    },
    options: [
      { value: 'first_pregnancy', label: { en: 'This will be my first pregnancy', hi: 'यह मेरी पहली गर्भावस्था होगी', te: 'ఇది నా మొదటి గర్భధారణ', ta: 'இது எனது முதல் கர்ப்பம்', kn: 'ಇದು ನನ್ನ ಮೊದಲ ಗರ್ಭಧಾರಣೆ', ml: 'ഇത് എന്റെ ആദ്യ ഗർഭധാരണമാണ്', bn: 'এটি আমার প্রথম গর্ভাবস্থা', mr: 'ही माझी पहिलीच गर्भधारणा असेल' } },
      { value: 'no', label: { en: 'No, felt well emotionally in prior pregnancies', hi: 'नहीं, पिछली बार भावनाएं सामान्य थीं', te: 'లేదు, గతంలో బాగానే ఉన్నాను', ta: 'இல்லை, நலமாக இருந்தேன்', kn: 'ಇಲ್ಲ, ಚೆನ್ನಾಗಿದ್ದೆ', ml: 'ഇല്ല, പ്രശ്നങ്ങളൊന്നും ഉണ്ടായിരുന്നില്ല', bn: 'না, ঠিক ছিলাম', mr: 'नाही, मागील वेळी मानसिक आरोग्य चांगले होते' } },
      { value: 'yes_experienced', label: { en: 'Yes, experienced perinatal depression or anxiety', hi: 'हाँ, प्रसव के बाद अवसाद का अनुभव हुआ था', te: 'అవును, ప్రసవానంతర డిప్రెషన్ వచ్చింది', ta: 'ஆம், மனச்சோர்வு ஏற்பட்டது', kn: 'ಹೌದು, ಖಿನ್ನತೆ ಅನುಭವಿಸಿದ್ದೆ', ml: 'അതെ, വിഷാദം ഉണ്ടായിരുന്നു', bn: 'হ্যাঁ, বিষণ্নতা হয়েছিল', mr: 'होय, प्रसूतीनंतर डिप्रेशन जाणवले होते' } }
    ]
  },
  {
    id: 'stress_safety',
    section: 'mental',
    type: 'choice',
    source: 'FOGSI Checklist #1, #9 & E-Booklet p. 26: Intimate partner violence and relationship safety screening',
    question: {
      en: "Do you feel emotionally supported and safe in your current relationship and home?",
      hi: "क्या आप अपने वर्तमान रिश्ते और घर में सुरक्षित और भावनात्मक रूप से समर्थित महसूस करती हैं?",
      te: "మీ ప్రస్తుత సంబంధంలో మరియు ఇంట్లో సురక్షితంగా ఉన్నారా?",
      ta: "உங்கள் தற்போதைய வீட்டில் பாதுகாப்பாக உணர்கிறீர்களா?",
      kn: "ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ನೀವು ಸುರಕ್ಷಿತವಾಗಿ ಭಾವಿಸುತ್ತೀರಾ?",
      ml: "വീട്ടിൽ സുരക്ഷിതത്വവും പിന്തുണയും അനുഭവപ്പെടുന്നുണ്ടോ?",
      bn: "আপনি কি আপনার বর্তমান ঘরে নিরাপদ বোধ করেন?",
      mr: "तुम्हाला तुमच्या सध्याच्या नात्यात आणि घरात सुरक्षित वाटते का?"
    },
    options: [
      { value: 'safe_supported', label: { en: 'Yes, fully supported and safe', hi: 'हाँ, पूरी तरह सुरक्षित और समर्थित महसूस करती हूँ', te: 'అవును, పూర్తి రక్షణ మరియు మద్దతు ఉంది', ta: 'ஆம், முற்றிலும் பாதுகாப்பாக உள்ளேன்', kn: 'ಹೌದು, ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ', ml: 'അതെ, പൂർണ്ണ സുരക്ഷിതയാണ്', bn: 'হ্যাঁ, সম্পূর্ণ নিরাপদ', mr: 'होय, पूर्णपणे सुरक्षित वाटते' } },
      { value: 'experiencing_stress', label: { en: 'Experiencing significant relationship stress', hi: 'रिश्ते में काफी तनाव महसूस कर रही हूँ', te: 'సంబంధంలో చాలా ఒత్తిడిని ఎదుర్కొంటున్నాను', ta: 'குடும்பத்தில் அதிக மன அழுத்தம் உள்ளது', kn: 'ಸಂಬಂಧದಲ್ಲಿ ಸಾಕಷ್ಟು ಒತ್ತಡವಿದೆ', ml: 'ബന്ധത്തിൽ കടുത്ത മാനസിക സമ്മർദ്ദമുണ്ട്', bn: 'সম্পর্কে মানসিক চাপে আছি', mr: 'नात्यात बराच तणाव जाणवतो आहे' } },
      { value: 'prefer_private_doctor', label: { en: 'Prefer to discuss privately with the doctor', hi: 'इस बारे में डॉक्टर से अकेले में बात करना चाहती हूँ', te: 'డాక్టర్‌తో వ్యక్తిగతంగా మాట్లాడాలనుకుంటున్నాను', ta: 'மருத்துவரிடம் தனியாகப் பேச விரும்புகிறேன்', kn: 'ವೈದ್ಯರೊಂದಿಗೆ ಖಾಸಗಿಯಾಗಿ ಮಾತನಾಡಲು ಬಯಸುತ್ತೇನೆ', ml: 'ഡോക്ടറോട് തനിയെ സംസാരിക്കാൻ ആഗ്രഹിക്കുന്നു', bn: 'ডাক্তারের সাথে একান্তে কথা বলতে চাই', mr: 'याबद्दल डॉक्टरांशी एकांतात बोलायचे आहे' } }
    ]
  },

  // SECTION 12: NUTRITION & PHYSICAL WELLNESS
  {
    id: 'nutrition_diet',
    section: 'nutrition',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 11, 23 & Checklist #7: Dietary adequacy, vegetarian vitamin B12',
    question: {
      en: "What is your typical dietary pattern?",
      hi: "आपका सामान्य आहार (खान-पान) किस प्रकार का है?",
      te: "మీ ఆహారపు అలవాటు ఎలాంటిది?",
      ta: "உங்கள் உணவு முறை என்ன?",
      kn: "ನಿಮ್ಮ ಆಹಾರ ಪದ್ಧತಿ ಹೇಗಿದೆ?",
      ml: "നിങ്ങളുടെ ഭക്ഷണരീതി എങ്ങനെയാണ്?",
      bn: "আপনার খাদ্যাভ্যাস কেমন?",
      mr: "तुमचा नियमित आहार कसा आहे?"
    },
    options: [
      { value: 'vegetarian', label: { en: 'Vegetarian (Requires B12 check)', hi: 'शाकाहारी (Vegetarian)', te: 'శాకాహారం', ta: 'சைவம் (Vegetarian)', kn: 'ಸಸ್ಯಾಹಾರಿ', ml: 'സസ്യാഹാരം', bn: 'নিরামিষাশী', mr: 'शाकाहारी' } },
      { value: 'non_vegetarian', label: { en: 'Non-vegetarian (includes egg, fish, or meat)', hi: 'मांसाहारी (अंडा, मछली या मांस सहित)', te: 'మాంసాహారం', ta: 'அசைவம்', kn: 'ಮಾಂಸಾಹಾರಿ', ml: 'മാംಸಾഹാരം', bn: 'আমিষাশী', mr: 'मांसाहारी' } },
      { value: 'vegan', label: { en: 'Vegan (Strictly plant-based)', hi: 'वीगन (केवल वनस्पति आधारित)', te: 'వీగన్', ta: 'வீகன்', kn: 'ಸಂಪೂರ್ಣ ಸಸ್ಯಜನ್ಯ (Vegan)', ml: 'വീഗൻ', bn: 'ভেগান', mr: 'व्हीगन (Vegan)' } }
    ]
  },
  {
    id: 'hydration_water',
    section: 'nutrition',
    type: 'yes_no',
    source: 'FOGSI E-Booklet Book 1, p. 23: Hydration minimum 2-3 litres daily',
    question: {
      en: "Do you drink at least 8 to 10 glasses (2 to 2.5 litres) of water daily?",
      hi: "क्या आप रोजाना कम से कम 8 से 10 गिलास (2 से 2.5 लीटर) पानी पीती हैं?",
      te: "మీరు రోజూ కనీసం 8 నుండి 10 గ్లాసుల (2–2.5 లీటర్లు) నీరు తాగుతారా?",
      ta: "தினமும் குறைந்தது 8 முதல் 10 டம்ளர் (2–2.5 லிட்டர்) தண்ணீர் குடிக்கிறீர்களா?",
      kn: "ದಿನಕ್ಕೆ ಕನಿಷ್ಠ 8 ರಿಂದ 10 ಲೋಟ (2-2.5 ಲೀಟರ್) ನೀರು ಕುಡಿಯುತ್ತೀರಾ?",
      ml: "ദിവസവും കുറഞ്ഞത് 8–10 ഗ്ലാസ് വെള്ളം കുടിക്കാറുണ്ടോ?",
      bn: "প্রতিদিন কি অন্তত ৮–১০ গ্লাস জল পান করেন?",
      mr: "तुम्ही दररोज किमान ८ ते १० ग्लास (२ ते २.५ लिटर) पाणी पिता का?"
    }
  },
  {
    id: 'physical_exercise',
    section: 'nutrition',
    type: 'choice',
    source: 'FOGSI E-Booklet Book 1, p. 22 & Checklist #4E: 150 min/week moderate activity target',
    question: {
      en: "How often do you engage in moderate physical exercise (such as brisk walking or yoga)?",
      hi: "आप कितनी बार मध्यम व्यायाम (जैसे तेज चलना या योग) करती हैं?",
      te: "మీరు వ్యాయామం లేదా నడక ఎంత తరచుగా చేస్తారు?",
      ta: "உடற்பயிற்சி அல்லது நடைப்பயிற்சி எவ்வளவு அடிக்கடி செய்கிறீர்கள்?",
      kn: "ವ್ಯಾಯಾಮ ಅಥವಾ ನಡಿಗೆಯನ್ನು ಎಷ್ಟು ಬಾರಿ ಮಾಡುತ್ತೀರಿ?",
      ml: "വ്യായാമമോ നടത്തമോ എത്രത്തോളം ചെയ്യാറുണ്ട്?",
      bn: "ব্যায়াম বা হাঁটাচলা কত ঘন ঘন করেন?",
      mr: "तुम्ही किती वेळा मध्यम व्यायाम (उदा. वेगाने चालणे किंवा योगासने) करता?"
    },
    options: [
      { value: 'regular_30m_5d', label: { en: 'Regular (≥ 30 mins, 4–5 days a week)', hi: 'नियमित (हफ्ते में 4–5 दिन, 30 मिनट)', te: 'క్రమం తప్పకుండా (వారానికి 4–5 రోజులు)', ta: 'வழக்கமாக (வாரத்தில் 4–5 நாட்கள்)', kn: 'ನಿಯಮಿತವಾಗಿ (ವಾರಕ್ಕೆ 4–5 ದಿನ)', ml: 'പതിവായി (ആഴ്ചയിൽ 4–5 ദിവസം)', bn: 'নিয়মিত (সপ্তাহে ৪–৫ দিন)', mr: 'नियमित (आठवड्यातून ४-५ दिवस, ३० मिनिटे)' } },
      { value: 'moderate_1_2d', label: { en: 'Occasional (1–2 days a week)', hi: 'कभी-कभार (हफ्ते में 1–2 दिन)', te: 'అప్పుడప్పుడు (వారానికి 1–2 రోజులు)', ta: 'எப்போதாவது (வாரத்தில் 1–2 நாட்கள்)', kn: 'ಸಾಂದರ್ಭಿಕವಾಗಿ', ml: 'വല്ലപ്പോഴും', bn: 'মাঝে মাঝে', mr: 'कधीतरी (आठवड्यातून १-२ दिवस)' } },
      { value: 'minimal_none', label: { en: 'Minimal / Sedentary routine', hi: 'बहुत कम / कोई व्यायाम नहीं', te: 'చాలా తక్కువ / వ్యాయామం లేదు', ta: 'மிகக்குறைவு / உடற்பயிற்சி இல்லை', kn: 'ಬಹಳ ಕಡಿಮೆ / ಇಲ್ಲ', ml: 'വളരെ കുറവ്', bn: 'খুব কম বা নেই', mr: 'फार कमी / कोणताही व्यायाम नाही' } }
    ]
  }
];

/**
 * Standardized FOGSI Clinician Flags Generator
 * Rule: NO fake numerical risk score.
 * Levels:
 *   - 'attention' (🔴 Red) -> Important clinician attention
 *   - 'review' (🟡 Amber) -> Clinician review
 *   - 'ok' (🟢 Green) -> Optimal status / no issue reported
 * Note: A positive finding is a reminder for doctor discussion, NOT an automated diagnosis.
 */
export function generateClinicianFlags(answers = {}) {
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
        detail: `Reported diabetes. Latest HbA1c: ${hba1c === 'over_6_5' ? '≥ 6.5% (Elevated)' : 'Unknown / Unchecked'}. Current Rx: ${rx || 'Not specified'}. Preconception target is HbA1c < 6.5% to prevent congenital heart anomalies and miscarriage. Microvascular assessment & insulin optimization recommended.`,
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
      detail: `Chronic high blood pressure reported (${meds === 'yes_taking' ? 'on daily medication' : 'not on daily medication'}, typical BP: ${bp === 'high_over_140_90' ? '≥ 140/90 mmHg' : 'Normal / Unknown'}). Review antihypertensive agents for teratogenicity (switch to safe drugs like labetalol; avoid ACE-i/ARBs). Discuss late first-trimester low-dose aspirin for preeclampsia prophylaxis.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22)'
    });
  }

  // 3. Thyroid (YELLOW FLAG - NOT AUTOMATICALLY HIGH RISK)
  if (answers['medical_thyroid'] === 'yes') {
    const onMed = answers['thyroid_medication'];
    const type = answers['thyroid_type'];
    flags.push({
      id: 'flag_thyroid',
      level: 'review',
      category: 'Medical History',
      title: 'Thyroid Disorder Reported — Clinician Review',
      detail: `Patient reports thyroid disorder (${type || 'Thyroid condition'}, ${onMed === 'yes' ? 'taking daily thyroid medication' : 'not on daily medication'}). Check baseline TSH before conception to maintain euthyroid status for fetal neurological development and fertility.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22)'
    });
  }

  // 4. Epilepsy
  if (answers['medical_epilepsy'] === 'yes') {
    const rx = answers['epilepsy_medication'];
    flags.push({
      id: 'flag_epilepsy',
      level: 'attention',
      category: 'Medical History',
      title: 'Epilepsy / Anti-Seizure Therapy',
      detail: `History of epilepsy reported. Current medications: ${rx || 'Unspecified'}. Rule: Use lowest effective monotherapy dose. Strictly avoid sodium valproate in reproductive age. Prescribe high-dose folic acid (5 mg/day) 1–3 months before conception.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16, 27) & Checklist #4A'
    });
  }

  // 5. Consanguinity
  if (answers['consanguineous_marriage'] === 'yes') {
    const relation = answers['consanguinity_relationship'] || 'Blood relation reported';
    flags.push({
      id: 'flag_consanguinity',
      level: 'review',
      category: 'Marital & Genetic History',
      title: 'Consanguinity Reported — Clinician Review',
      detail: `Consanguineous union reported ("${relation}"). Increased risk for autosomal recessive conditions. Detailed three-generation pedigree and carrier screening (including Thalassemia HPLC) recommended.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 15) & Checklist #4C'
    });
  }

  // 6. Obstetric Complications & Miscarriages
  if (answers['previous_pregnancy'] === 'yes') {
    // Birth defects
    if (answers['history_birth_defects'] === 'yes') {
      const defect = answers['birth_defect_details'] || 'Birth defect reported';
      flags.push({
        id: 'flag_birth_defects',
        level: 'attention',
        category: 'Obstetric History',
        title: 'Prior Birth Defect / Anomaly Reported',
        detail: `Previous pregnancy affected by congenital anomaly: "${defect}". Prescribe high-dose folic acid (5 mg/day), obtain previous records/autopsy/karyotype, and offer pre-pregnancy genetic counselling.`,
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 15) & Checklist #4C'
      });
    }

    // Miscarriages
    if (answers['history_miscarriages'] === 'yes') {
      const type = answers['miscarriage_type'];
      const comp = answers['miscarriage_complications'];
      flags.push({
        id: 'flag_miscarriage_history',
        level: 'review',
        category: 'Obstetric History',
        title: 'Previous Pregnancy Loss / Miscarriage',
        detail: `History of miscarriage reported (${type === 'late_miscarriage' ? 'Late loss 12–20w' : (type === 'both' ? 'Recurrent early/late' : 'Early loss')}${comp && Array.isArray(comp) && comp.length > 0 ? `, complications: ${comp.join(', ')}` : ''}). Screen for antiphospholipid antibodies, thyroid status, parental karyotypes if recurrent.`,
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 13) & Checklist #1'
      });
    }

    // Ectopic
    if (answers['history_ectopic'] === 'yes') {
      flags.push({
        id: 'flag_ectopic_history',
        level: 'review',
        category: 'Obstetric History',
        title: 'Prior Ectopic Pregnancy',
        detail: `Previous ectopic pregnancy reported (${answers['ectopic_details'] || 'Details pending'}). 10% recurrence risk. Advise immediate early transvaginal ultrasound (5–6 weeks) upon positive home pregnancy test to confirm intrauterine location.`,
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 13) & Checklist #1'
      });
    }

    // Premature labour
    if (answers['history_premature_labour'] === 'yes') {
      flags.push({
        id: 'flag_preterm_labour',
        level: 'review',
        category: 'Obstetric History',
        title: 'Prior Preterm Delivery (< 37 weeks)',
        detail: 'History of spontaneous preterm labour. Plan mid-trimester transvaginal cervical length surveillance (16–24 weeks) and consider prophylactic progesterone.',
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 13) & Checklist #1'
      });
    }

    // Delivery complications
    if (answers['delivery_complications'] && Array.isArray(answers['delivery_complications']) && answers['delivery_complications'].length > 0 && !answers['delivery_complications'].includes('none')) {
      const comps = answers['delivery_complications'];
      flags.push({
        id: 'flag_delivery_complications',
        level: comps.includes('preeclampsia') || comps.includes('gdm') ? 'attention' : 'review',
        category: 'Obstetric History',
        title: 'Prior Pregnancy / Delivery Complications',
        detail: `Complications in prior delivery: ${comps.join(', ')}. Review recurrence risk and prophylactic measures (e.g. low-dose aspirin 150 mg from 12 weeks for prior preeclampsia).`,
        source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 13) & Checklist #1'
      });
    }

    // Inter-pregnancy interval
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
  }

  // 7. Cardiac, Renal, Autoimmune
  if (answers['medical_cardiac'] === 'yes') {
    flags.push({
      id: 'flag_cardiac',
      level: 'attention',
      category: 'Medical History',
      title: 'Cardiac Disease / Valve Disorder',
      detail: 'Known heart condition reported. Pre-pregnancy cardiology evaluation, echocardiogram, functional class assessment, and medication safety review required before attempting conception.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 16) & Checklist #4A'
    });
  }

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

  // 8. Periodontal
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

  // 9. Medications (GENERAL MEDS - NOT FOLIC ACID)
  if (answers['taking_medications'] === 'yes') {
    const medList = answers['medication_names'] || 'Prescription medications reported';
    flags.push({
      id: 'flag_medication_review',
      level: 'review',
      category: 'Medications',
      title: 'Medication Safety & Teratogenicity Review',
      detail: `Patient currently taking: "${medList}". Review for fetal safety, efficacy, and preconception switch (e.g. discontinue statins, ACE-inhibitors, ARBs, valproate).`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 9, 16, 22) & Checklist #2'
    });
  }

  // 10. Folic Acid Status (STANDALONE PRECONCEPTION SUPPLEMENTATION - NEVER MARKED TERATOGENIC)
  if (answers['folic_acid_status'] === 'yes') {
    const dose = answers['folic_acid_dose'];
    flags.push({
      id: 'flag_folic_acid_active',
      level: 'ok',
      category: 'Folic Acid / Preconception Supplementation',
      title: 'Folic Acid Supplementation Active',
      detail: `Folic acid reported — dose: ${dose === 'high_5mg' ? 'High dose (5 mg daily)' : 'Standard dose (400–800 μg daily)'}. Continue daily until at least the end of the first trimester.`,
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 18, 23)'
    });
  } else if (answers['folic_acid_status'] === 'no' || answers['folic_acid_status'] === 'not_sure') {
    flags.push({
      id: 'flag_folic_acid_missing',
      level: 'review',
      category: 'Folic Acid / Preconception Supplementation',
      title: 'Not Currently Taking Folic Acid — Clinician Discussion',
      detail: 'Patient is not currently taking daily folic acid. Neural tube closes by day 28 post-conception. Standard recommendation: 400–800 μg/day starting ≥ 1 month prior; High risk (diabetes, epilepsy, prior NTD): 5 mg/day starting 1–3 months prior.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 11, 18, 21, 23, 25)'
    });
  }

  // 11. Family & Genetic History
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

  // 12. Rubella
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

  // 13. Varicella
  if (answers['tested_varicella'] === 'never_had_or_vaccinated' || answers['tested_varicella'] === 'not_sure') {
    flags.push({
      id: 'flag_varicella_immunity',
      level: 'review',
      category: 'Immunization',
      title: 'Varicella Immunity Uncertain',
      detail: 'Never had chickenpox or vaccine uncertain. Live varicella vaccine requires 2-dose series started ≥ 2 months before conception, with 4-week pregnancy avoidance after each dose.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 17, 24) & Checklist #8'
    });
  }

  // 14. Infections: HIV, Hep B
  if (answers['tested_hepb_hiv'] === 'known_positive') {
    flags.push({
      id: 'flag_viral_infection',
      level: 'attention',
      category: 'Infection Screening',
      title: 'Known HIV / Hepatitis B Infection',
      detail: 'Patient reports viral seropositivity. Verify sustained viral suppression on ART/antivirals before conception. Assess partner status; offer PrEP/vaccination as indicated.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 16, 22) & Checklist #4B'
    });
  } else if (answers['tested_hepb_hiv'] === 'never_tested') {
    flags.push({
      id: 'flag_viral_screening_due',
      level: 'review',
      category: 'Infection Screening',
      title: 'Routine Viral Screening Due (HIV, HBsAg, VDRL)',
      detail: 'Preconception serological screening for HIV, HBsAg, and Syphilis (VDRL) recommended per FOGSI routine checklist.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 15, 16) & Checklist #4B, #5'
    });
  }

  // 15. Environmental
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

  // 16. Tobacco
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

  // 17. Alcohol
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

  // 18. Caffeine
  if (answers['caffeine_intake'] === 'high_4_plus') {
    flags.push({
      id: 'flag_high_caffeine',
      level: 'review',
      category: 'Lifestyle & Substances',
      title: 'High Caffeine Intake (≥ 4 cups daily)',
      detail: 'High caffeine intake reported. FOGSI notes elevated caffeine intake is linked to higher risk of miscarriage and low birth weight. Advise reducing to ≤ 1–2 cups per day.',
      source: 'FOGSI Preconception Care E-Booklet, Book 1 (p. 12, 22)'
    });
  }

  // 19. Mental Health
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

  // 20. Psychosocial / Stress / Safety
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
