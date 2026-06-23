export type LanguageCode = "en" | "ta" | "hi" | "ar";

export interface TranslationSet {
  machine_catalog: string;
  customizer_studio: string;
  lease_rate_calculator: string;
  dispenser_sandbox: string;
  ar_preview: string;
  ai_recommendation: string;
  success_stories: string;
  reviews_ratings: string;
  video_demos: string;
  wishlist: string;
  inquire_quote: string;
  recommendation_title: string;
  recommendation_desc: string;
  ar_title: string;
  ar_desc: string;
  stories_title: string;
  stories_desc: string;
  reviews_title: string;
  reviews_desc: string;
  demos_title: string;
  demos_desc: string;
  wishlist_title: string;
  wishlist_desc: string;
  business_type: string;
  foot_traffic: string;
  primary_goals: string;
  submit_recommend: string;
  add_to_wishlist: string;
  remove_from_wishlist: string;
  ar_camera_toggle: string;
  ar_preset_bg: string;
  ar_overlay_instructions: string;
  b2b_rating: string;
  share_wishlist: string;
  recommendation_results: string;
  recommended_model: string;
  match_rate: string;
  expert_rationale: string;
  space_tip: string;
  est_profit: string;
  view_details: string;
  configure_now: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationSet> = {
  en: {
    machine_catalog: "Machine Catalog",
    customizer_studio: "Customizer Studio",
    lease_rate_calculator: "Lease Rate Calculator",
    dispenser_sandbox: "Dispenser Sandbox",
    ar_preview: "AR Space Preview",
    ai_recommendation: "AI Smart Recommendation",
    success_stories: "B2B Case Studies",
    reviews_ratings: "Client Reviews",
    video_demos: "Video Tours",
    wishlist: "My Wishlist",
    inquire_quote: "Get B2B Quote",
    recommendation_title: "AI-Powered Vending Advisor",
    recommendation_desc: "Answer a few questions about your facilities and traffic density. Our intelligent forecaster will recommend the perfect smart node from our catalog.",
    ar_title: "Interactive AR Environment Visualizer",
    ar_desc: "Configure and place your selected robotic vending kiosk in a real-time layout snapshot or a simulated workspace. Scale, rotate, and ensure a perfect architectural fit.",
    stories_title: "Sector-Specific Success Stories",
    stories_desc: "Discover how leading corporate headquarters, fitness clubs, transport junctions, and schools revolutionized their hospitality with Aura Smart IoT Nodes.",
    reviews_title: "B2B Operators Feedback & Reviews",
    reviews_desc: "Verified performance logs and customer stars from certified facility managers across the region.",
    demos_title: "Telemetry & Hardware Video Walkthroughs",
    demos_desc: "Simulate automated physical features: active grinding, soft-drop belts, thermal curtains, and dynamic UPI QR billing integrations.",
    wishlist_title: "Shareable B2B Procurement Wishlist",
    wishlist_desc: "Save multiple machinery configurations, aggregate initial lease budgets, and generate a secure procurement share link for corporate stakeholders.",
    business_type: "Facility / Sector Type",
    foot_traffic: "Estimated Daily Foot Traffic",
    primary_goals: "Operational Priority Goal",
    submit_recommend: "Analyze Requirements via Gemini AI",
    add_to_wishlist: "Add to Wishlist",
    remove_from_wishlist: "Remove from Wishlist",
    ar_camera_toggle: "Request Camera / AR Activation",
    ar_preset_bg: "Select Preset Business Area Picture",
    ar_overlay_instructions: "Drag, scale or rotate the vending machine overlays to estimate physical clearance.",
    b2b_rating: "Quality and Reliability Rating",
    share_wishlist: "Copy Stakeholder Link",
    recommendation_results: "Gemini Intelligence Report",
    recommended_model: "Optimal Model Pick",
    match_rate: "System Compatibility Match",
    expert_rationale: "Strategic Heuristic Rationale",
    space_tip: "Ergonomics / Spacing Advice",
    est_profit: "Projected Net Margin Contribution",
    view_details: "Preview UnitSpecs",
    configure_now: "Customize Color Aesthetics"
  },
  ta: {
    machine_catalog: "இயந்திர அட்டவணை",
    customizer_studio: "வடிவமைப்பு ஸ்டுடியோ",
    lease_rate_calculator: "வாடகை கணக்கீடு",
    dispenser_sandbox: "விநியோக சாண்ட்பாக்ஸ்",
    ar_preview: "AR சுற்றுப்புற முன்னோட்டம்",
    ai_recommendation: "அதிநவீன AI பரிந்துரை",
    success_stories: "வெற்றி சாதனைகள்",
    reviews_ratings: "வாடிக்கையாளர் மதிப்புரைகள்",
    video_demos: "வீடியோ செயல்விளக்கம்",
    wishlist: "விருப்பப் பட்டியல்",
    inquire_quote: "B2B கட்டண விவரம்",
    recommendation_title: "செயற்கை நுண்ணறிவு கொண்ட ஆலோசனையாளர்",
    recommendation_desc: "உங்கள் பணியிடம் மற்றும் வருகை தரும் மக்களின் எண்ணிக்கை குறித்த விவரங்களை வழங்குக. உங்களுக்கான மிகச்சரியான தானியங்கி இயந்திரத்தை கண்டறிந்து எமது கணினி பரிந்துரைக்கும்.",
    ar_title: "இணைந்த AR சூழல் காட்சிப்படுத்தும் கருவி",
    ar_desc: "தேர்ந்தெடுக்கப்பட்ட இயந்திரத்தை உங்கள் அலுவலகத்தில் அல்லது கடையில் எப்படி இருக்கும் என்று நேரலையாகப் பொருத்திப் பாருங்கள். அளவு மற்றும் கோணத்தை எளிதாக மாற்றித் திட்டமிடுக.",
    stories_title: "துறை வாரியான வெற்றிச் சரித்திரங்கள்",
    stories_desc: "முன்னணி நிறுவனங்கள், கல்விக்கூடங்கள் மற்றும் மருத்துவமனைகள் எவ்வாறு எமது ஸ்மார்ட் IoT இயந்திரங்கள் மூலம் தங்களது சேவைகளை மேம்படுத்தின என்று ஆராய்க.",
    reviews_title: "அங்கீகரிக்கப்பட்ட மேலாளர்களின் கருத்துக்கள்",
    reviews_desc: "அங்கீகரிக்கப்பட்ட உள்கட்டமைப்பு மேலாளர்களிடமிருந்து பெறப்பட்ட சரிபார்க்கப்பட்ட செயல்பாட்டு பதிவுகள் மற்றும் நட்சத்திர மதிப்பீடுகள்.",
    demos_title: "இயந்திர அம்சங்கள் வீடியோ செயல்விளக்கம்",
    demos_desc: "தானியங்கி அரைக்கும் தொழில்நுட்பம், மென்மையான விநியோக பெல்ட் செயல்பாடுகள் மற்றும் UPI கட்டண முறைகளின் நேரடி விளக்கங்களை பார்வையிடுக.",
    wishlist_title: "நிறுவனங்களுக்கான பகிர்வு விருப்ப பட்டியல்",
    wishlist_desc: "பல இயந்திர வடிவமைப்புகளைச் சேமித்து, ஆரம்ப வாடகை வரவுசெலவை மதிப்பிட்டு, உங்கள் குழுவினருடன் பகிர்ந்து கொள்ள பாதுகாப்பான இணைப்பை உருவாக்குக.",
    business_type: "நிறுவனம் / வணிகத் துறை",
    foot_traffic: "மதிப்பிடப்பட்ட தினசரி மக்கள் வருகை",
    primary_goals: "முதன்மை செயல்பாட்டு இலக்கு",
    submit_recommend: "ஜெமினி AI மூலம் தேவைகளை பகுப்பாய்வு செய்க",
    add_to_wishlist: "விருப்பப் பட்டியலில் சேர்",
    remove_from_wishlist: "விருப்பப் பட்டியலிலிருந்து நீக்கு",
    ar_camera_toggle: "கேமரா / AR செயலாக்கம் கோருக",
    ar_preset_bg: "வணிகப் பகுதி மாதிரிப் பக்கப் படத்தை தேர்வு செய்க",
    ar_overlay_instructions: "பொருத்தத்தை மதிப்பிடுவதற்கு இயந்திரத்தின் மீது விரலால் இழுக்கவும், அளவை மாற்றவும் அல்லது சுழற்றவும்.",
    b2b_rating: "தரம் மற்றும் நம்பகத்தன்மை மதிப்பீடு",
    share_wishlist: "பகிர்வு இணைப்பை நகலெடுக்கவும்",
    recommendation_results: "ஜெமினி AI புலனாய்வு அறிக்கை",
    recommended_model: "உகந்த பரிந்துரைக்கப்பட்ட மாதிரி",
    match_rate: "செயல்பாட்டு பொருத்தம்",
    expert_rationale: "உத்தி சார்ந்த பகுத்தறிவு விளக்கம்",
    space_tip: "தள மேலாண்மை மற்றும் இடைவெளி ஆலோசனை",
    est_profit: "மதிப்பிடப்பட்ட மாதாந்திர நிகர லாபம்",
    view_details: "விபரக்குறிப்பை காண்க",
    configure_now: "வண்ணங்களை தனிப்பயனாக்குக"
  },
  hi: {
    machine_catalog: "मशीन कैटलॉग",
    customizer_studio: "कस्टमाइज़र स्टूडियो",
    lease_rate_calculator: "किराया कैलकुलेटर",
    dispenser_sandbox: "सैंडबॉक्स सिम्युलेटर",
    ar_preview: "AR स्पेस व्यू",
    ai_recommendation: "AI स्मार्ट अनुशंसा",
    success_stories: "सफलता की कहानियाँ",
    reviews_ratings: "ग्राहक समीक्षाएं",
    video_demos: "वीडियो डेमो",
    wishlist: "मेरी विशलिस्ट",
    inquire_quote: "B2B कोट प्राप्त करें",
    recommendation_title: "AI-संचालित वेंडिंग सलाहकार",
    recommendation_desc: "अपनी स्थापनाओं और ग्राहकों की आगमन संख्या के बारे में कुछ सरल प्रश्नों के उत्तर दें। हमारा सिस्टम आपके लिए सही मशीन मॉडल की अनुशंसा करेगा।",
    ar_title: "परस्पर संवादात्मक AR वातावरण विज़ुअलाइज़र",
    ar_desc: "अपनी चुनी हुई वेंडिंग मशीन को लाइव वर्कस्पेस बैकग्राउंड पर रख कर देखें। इसकी चौड़ाई, ऊंचाई और समावेशन कोणों को अनुकूलित करें।",
    stories_title: "उद्योग-आधारित केस स्टडीज",
    stories_desc: "जानें कि कैसे देश के प्रमुख कार्यालयों, व्यायामशालाओं, अस्पतालों और उच्च शिक्षण संस्थानों ने औरा स्मार्ट वेंडिंग नोड्स के माध्यम से सेवा में सुधार किया।",
    reviews_title: "प्रमाणित प्रबंधकों की व्यावसायिक समीक्षाएं",
    reviews_desc: "क्षेत्र के प्रमाणित सुविधा प्रबंधकों से विश्वसनीय प्रदर्शन लॉग और सत्यापित रेटिंग प्राप्त करें।",
    demos_title: "हार्डवेयर एवं सेंसर वीडियो प्रस्तुतियाँ",
    demos_desc: "सेंसर आधारित डिलीवरी, सक्रिय ग्राइंडिंग विधि और UPI भुगतान एकीकरण की वास्तविक समय की वीडियो प्रस्तुतियां देखें।",
    wishlist_title: "कॉर्पोरेट शेयर करने योग्य विशलिस्ट",
    wishlist_desc: "अपनी पसंदीदा मशीनों के कॉन्फ़िगरेशन सहेजें, कुल बजट का आकलन करें और अन्य अधिकारियों के विचारार्थ सुरक्षित साझाकरण लिंक तैयार करें।",
    business_type: "व्यावसायिक परिसर / क्षेत्र श्रेणी",
    foot_traffic: "अनुमानित दैनिक आगमन आबादी",
    primary_goals: "मुख्य परिचालन प्राथमिकता",
    submit_recommend: "जेमिनी AI द्वारा आवश्यकताओं की जांच करें",
    add_to_wishlist: "विशलिस्ट में जोड़ें",
    remove_from_wishlist: "विशलिस्ट से हटाएं",
    ar_camera_toggle: "कैमरा / AR सक्रियता का अनुरोध करें",
    ar_preset_bg: "परिसर का डमी चित्र चुनें",
    ar_overlay_instructions: "उपयुक्त स्थान निकासी जांचने के लिए वेंडिंग मशीन को ड्रैग करें, आकार बदलें या घुमाएँ।",
    b2b_rating: "गुणवत्ता और विश्वसनीयता रेटिंग",
    share_wishlist: "ताजा साझाकरण लिंक कॉपी करें",
    recommendation_results: "जेमिनी इंटेलिजेंस रिपोर्ट",
    recommended_model: "प्रशस्त अनुशंसित मॉडल",
    match_rate: "प्रणाली अनुकूलता मिलान",
    expert_rationale: "रणनीतिक व्यावसायिक आधार",
    space_tip: "स्थान प्रबंधन और सुरक्षा परामर्श",
    est_profit: "अनुमानित मासिक शुद्ध मुनाफा",
    view_details: "विशेष विवरण देखें",
    configure_now: "रंग और थीम बदलें"
  },
  ar: {
    machine_catalog: "كتالوج الآلات",
    customizer_studio: "استوديو التخصيص",
    lease_rate_calculator: "حاسبة قيمة الإيجار",
    dispenser_sandbox: "محاكاة التوزيع اليدوي",
    ar_preview: "معاينة الفضاء بالواقع المعزز",
    ai_recommendation: "توصية ذكية بالذكاء الاصطناعي",
    success_stories: "دراسات الحالة والنجاح",
    reviews_ratings: "تقييمات العملاء",
    video_demos: "العروض المرئية",
    wishlist: "قائمة رغباتي",
    inquire_quote: "طلب عرض أسعار B2B",
    recommendation_title: "مستشار البيع الذكي الذاتي",
    recommendation_desc: "أجب عن بعض الأسئلة البسيطة حول منشآتك وحجم الحركة اليومية. وسيوصي نظامنا الفوري بالآلة الذكية الأكثر ملاءمة لأعمالك.",
    ar_title: "معاين تفاعلي للواقع المعزز",
    ar_desc: "قم بمعاينة تموضع منفذ البيع الآلي داخل مكتبك أو صالة الألعاب أو منشأتك الصحية بشكل مباشر. اضبط الحجم والزاوية بكل سهولة للتكيف المعماري المتناسق.",
    stories_title: "قصص النجاح المتميزة بالقطاع",
    stories_desc: "اكتشف كيف نجحت كبرى المقرات الإدارية والجامعات والمستشفيات في إحداث ثورة في مستوى الراحة والضيافة الذاتية بفضل حلولنا الذكية.",
    reviews_title: "ملاحظات وتقييمات المشغلين والشركاء",
    reviews_desc: "سجلات أداء موثوقة وتقييمات حقيقية من مديري المرافق المعتمدين في كافة أرجاء المنطقة.",
    demos_title: "جولات ميزات التشغيل والبرمجية بالفيديو",
    demos_desc: "محاكاة مرئية للأنظمة اللوجستية الفريدة: الطحن المباشر للحبوب، وأشرطة التوزيع المانعة للاهتزاز، وبوابات الدفع الفوري عبر UPI.",
    wishlist_title: "قائمة رغبات الشراء المشتركة للشركات",
    wishlist_desc: "احفظ ميزات الآلات المفضلة لديك، وراجع إحصاءات تقديرات الميزانية، ثم استخرج رابط تواصل آمن للمشاركة مع مجلس الإدارة.",
    business_type: "نوع المنشأة / تصنيف القطاع",
    foot_traffic: "حجم حركة المرور اليومية المقدر",
    primary_goals: "الهدف التشغيلي الأهم",
    submit_recommend: "حلل المتطلبات عبر ذكاء جيمي",
    add_to_wishlist: "إضافة إلى قائمة الرغبات",
    remove_from_wishlist: "إزالة من قائمة الرغبات",
    ar_camera_toggle: "طلب تشغيل الكاميرا والواقع المعزز",
    ar_preset_bg: "اختر صورة خلفية نموذجية للمنشأة",
    ar_overlay_instructions: "اسحب صورة الآلة، كبر حجمها أو أدر الزاوية لمعرفة ملاءمة الأبعاد الأرضية الفعلي.",
    b2b_rating: "معدل موثوقية وجودة الآلات",
    share_wishlist: "نسخ رابط المشاركة للمسؤولين",
    recommendation_results: "تقرير ذكاء جيمي الفوري",
    recommended_model: "الموديل التقديري الأنسب",
    match_rate: "معدل ملائمة متكافئ للتشغيل",
    expert_rationale: "التحليل الإستراتيجي الموصى به",
    space_tip: "نصائح تنظيم المساحة وفتحات التخليص",
    est_profit: "العائد الشهري الصافي المتوقع",
    view_details: "عرض تفاصيل المواصفات",
    configure_now: "تخصيص الهوية واللون"
  }
};
