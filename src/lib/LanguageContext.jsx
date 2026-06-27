import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_KEY = "damulink-language";

export const LANGUAGES = [
  {
    value: "en",
    label: "English",
    nativeLabel: "English",
    description: "Use English across DamuLink",
  },
  {
    value: "sw",
    label: "Swahili",
    nativeLabel: "Kiswahili",
    description: "Tumia Kiswahili kwenye DamuLink",
  },
];

const translations = {
  en: {
    "access.open": "Open accessibility settings",
    "access.dialog": "Accessibility settings",
    "access.display": "Display",
    "access.language": "Language",
    "access.colorMode": "Color mode",
    "access.languageMode": "Site language",
    "access.default.label": "Default",
    "access.default.description": "Original warm DamuLink colors",
    "access.dark.label": "Dark",
    "access.dark.description": "Lower glare with preserved ruby accents",
    "access.contrast.label": "High contrast",
    "access.contrast.description": "Sharper edges and stronger color separation",
    "access.english.description": "Use English across DamuLink",
    "access.swahili.description": "Tumia Kiswahili kwenye DamuLink",

    "common.brand": "DamuLink",
    "common.loading": "Loading...",
    "common.logIn": "Log in",
    "common.logout": "Log out",
    "common.becomeDonor": "Become a donor",
    "common.registerDonor": "Register as a donor",
    "common.haveAccount": "I have an account",
    "common.continue": "Continue",
    "common.saving": "Saving...",
    "common.creatingAccount": "Creating account...",
    "common.verifying": "Verifying...",
    "common.backDashboard": "Back to dashboard",

    "landing.eyebrow": "Kenya's donor network",
    "landing.title.line1": "One drop",
    "landing.title.line2": "reaches",
    "landing.title.accent": "far",
    "landing.body":
      "DamuLink connects verified blood and organ donors with hospitals across the country - so when someone needs help, the right person isn't far away.",
    "landing.stat.types.value": "8",
    "landing.stat.types.label": "Blood types matched",
    "landing.stat.alerts.value": "24/7",
    "landing.stat.alerts.label": "Urgent request alerts",
    "landing.stat.ussd.value": "USSD",
    "landing.stat.ussd.label": "Works without internet",

    "auth.login.eyebrow": "Welcome back",
    "auth.login.sideHeading": "Your blood type is needed somewhere, right now.",
    "auth.login.sideBody": "Log in to check your credits, badges, and the donations that got you here.",
    "auth.login.title": "Log in",
    "auth.login.body": "Enter the phone number and password you registered with.",
    "auth.login.error": "Couldn't log you in. Check your details and try again.",
    "auth.login.submitting": "Logging in...",
    "auth.login.new": "New to DamuLink?",
    "auth.login.register": "Register as a donor",

    "auth.signup.step0.eyebrow": "Two minutes, start to finish",
    "auth.signup.step0.heading": "Your details stay yours until you say go.",
    "auth.signup.step0.body":
      "Full contact details are only shared with a hospital after you personally accept a request.",
    "auth.signup.step1.eyebrow": "Almost there",
    "auth.signup.step1.heading": "One code, sent straight to your phone.",
    "auth.signup.step1.body": "This confirms the number hospitals will reach you on when it matters.",
    "auth.signup.step2.eyebrow": "Welcome",
    "auth.signup.step2.heading": "You're part of the network now.",
    "auth.signup.step2.body": "Next, your blood type and location - that's what makes the match.",
    "auth.signup.title": "Create your account",
    "auth.signup.body": "You'll verify your phone number next.",
    "auth.signup.error": "Registration failed. Please try again.",
    "auth.signup.already": "Already have an account?",
    "auth.signup.verifyTitle": "Verify your phone",
    "auth.signup.verifyBody": "We sent a code to {phone}. Enter it below.",
    "auth.signup.verifyFallback": "your phone",
    "auth.signup.verifyError": "That code didn't work. Check it and try again.",
    "auth.signup.resendError": "Couldn't resend the code. Try again shortly.",
    "auth.signup.verifyAction": "Verify and continue",
    "auth.signup.resend": "Resend code",
    "auth.signup.doneTitle": "You're verified",
    "auth.signup.doneBody":
      "Log in with the password you just set, then we'll get your blood type and location so hospitals near you can find a match.",
    "auth.signup.doneAction": "Log in to continue",

    "field.fullName": "Full legal name",
    "field.phone": "Phone number",
    "field.emailOptional": "Email (optional)",
    "field.nationalId": "National ID number",
    "field.birthDate": "Date of birth",
    "field.password": "Password",
    "field.verificationCode": "Verification code",

    "profile.lastStep": "Last step",
    "profile.title": "Your donor profile",
    "profile.body":
      "This is what hospitals see when they search for a match. Your exact location and full contact details stay private until you say yes.",
    "profile.error": "Couldn't save your profile. Please try again.",
    "profile.bloodType": "Blood type",
    "profile.donorQuestion": "What would you like to donate?",
    "profile.organsQuestion": "Which organs would you pledge?",
    "profile.location": "Where to find you",
    "profile.county": "County",
    "profile.town": "Town",
    "profile.contactPreference": "Preferred contact method",
    "profile.insurance": "Insurance provider (optional)",
    "profile.insurancePlaceholder": "e.g. SHA, Jubilee Health, AAR",
    "profile.save": "Save profile and continue",
    "profile.donor.blood": "Blood only",
    "profile.donor.organ": "Organ only",
    "profile.donor.both": "Both",
    "profile.organ.kidney": "kidney",
    "profile.organ.liver": "liver",
    "profile.organ.cornea": "cornea",
    "profile.organ.heart": "heart",
    "profile.organ.bone marrow": "bone marrow",
    "profile.contact.call": "Call",
    "profile.contact.sms": "SMS",
    "profile.contact.whatsapp": "WhatsApp",

    "dashboard.loadError": "Couldn't load everything just now. Pull to refresh in a bit.",
    "dashboard.welcomeNamed": "Welcome back, {name}",
    "dashboard.welcome": "Welcome back",
    "dashboard.bloodTypeCopy": "Your blood type{bloodType} could be exactly what someone needs today.",
    "dashboard.bloodTypeValue": " - {bloodType}",
    "dashboard.oneRequest": "A hospital is waiting on your response",
    "dashboard.manyRequests": "{count} hospitals are waiting on your response",
    "dashboard.reviewRequest": "Review the request before it expires",
    "dashboard.view": "View ->",
    "dashboard.credits": "Credit balance",
    "dashboard.redeemable": "Redeemable at any partnered hospital",
    "dashboard.availability": "Availability",
    "dashboard.available": "Hospitals can find and contact you",
    "dashboard.hidden": "You're hidden from new requests",
    "dashboard.badgesEarned": "Badges earned",
    "dashboard.latestBadge": "Latest: {badge}",
    "dashboard.firstBadge": "Donate to earn your first",
    "dashboard.badgesTitle": "Your badges",
    "dashboard.noBadgesTitle": "No badges yet",
    "dashboard.noBadgesBody": "Your first donation unlocks Rookie Lifesaver. It's closer than you think.",
    "dashboard.historyTitle": "Donation history",
    "dashboard.noHistoryTitle": "No donations recorded yet",
    "dashboard.noHistoryBody":
      "Once a hospital confirms your donation, it shows up here with the credits you earned.",
    "dashboard.earned": "Earned {date}",

    "requests.title": "Hospital requests",
    "requests.body":
      "When a verified hospital wants to reach you, it shows up here first. Nothing is shared until you say yes.",
    "requests.loadError": "Couldn't load your requests right now.",
    "requests.actionError": "That didn't go through. Please try again.",
    "requests.loading": "Loading...",
    "requests.needsResponse": "Needs your response",
    "requests.past": "Past requests",
    "requests.accept": "Accept and share contact",
    "requests.busy": "...",
    "requests.decline": "Decline",
    "requests.emptyTitle": "No requests yet",
    "requests.emptyBody":
      "When a hospital near you needs your blood type, you'll see it here before anything else happens.",
    "requests.status.pending": "Awaiting your response",
    "requests.status.accepted": "Accepted",
    "requests.status.declined": "Declined",
    "requests.status.expired": "Expired",
  },
  sw: {
    "access.open": "Fungua mipangilio ya ufikikaji",
    "access.dialog": "Mipangilio ya ufikikaji",
    "access.display": "Mwonekano",
    "access.language": "Lugha",
    "access.colorMode": "Mtindo wa rangi",
    "access.languageMode": "Lugha ya tovuti",
    "access.default.label": "Chaguo msingi",
    "access.default.description": "Rangi asili za joto za DamuLink",
    "access.dark.label": "Hali ya giza",
    "access.dark.description": "Mwanga mdogo mkali huku rangi nyekundu zikibaki",
    "access.contrast.label": "Utofautishaji mkubwa",
    "access.contrast.description": "Mipaka iliyo wazi na rangi zinazotofautiana zaidi",
    "access.english.description": "Tumia Kiingereza kwenye DamuLink",
    "access.swahili.description": "Tumia Kiswahili kwenye DamuLink",

    "common.brand": "DamuLink",
    "common.loading": "Inapakia...",
    "common.logIn": "Ingia",
    "common.logout": "Toka",
    "common.becomeDonor": "Kuwa mfadhili",
    "common.registerDonor": "Jisajili kama mfadhili",
    "common.haveAccount": "Tayari nina akaunti",
    "common.continue": "Endelea",
    "common.saving": "Inahifadhi...",
    "common.creatingAccount": "Inaunda akaunti...",
    "common.verifying": "Inathibitisha...",
    "common.backDashboard": "Rudi kwenye dashibodi",

    "landing.eyebrow": "Mtandao wa wafadhili Kenya",
    "landing.title.line1": "Tone moja",
    "landing.title.line2": "hufika",
    "landing.title.accent": "mbali",
    "landing.body":
      "DamuLink huwaunganisha wafadhili wa damu na viungo waliothibitishwa na hospitali nchini kote - ili mtu anapohitaji msaada, mfadhili anayefaa asiwe mbali.",
    "landing.stat.types.value": "8",
    "landing.stat.types.label": "Aina za damu zinazolinganishwa",
    "landing.stat.alerts.value": "24/7",
    "landing.stat.alerts.label": "Arifa za dharura za maombi",
    "landing.stat.ussd.value": "USSD",
    "landing.stat.ussd.label": "Hufanya kazi bila intaneti",

    "auth.login.eyebrow": "Karibu tena",
    "auth.login.sideHeading": "Aina yako ya damu inahitajika mahali fulani sasa hivi.",
    "auth.login.sideBody": "Ingia kuona salio lako, beji zako, na michango iliyokufikisha hapa.",
    "auth.login.title": "Ingia",
    "auth.login.body": "Weka nambari ya simu na nenosiri ulilotumia kujisajili.",
    "auth.login.error": "Imeshindikana kukuingiza. Kagua maelezo yako kisha ujaribu tena.",
    "auth.login.submitting": "Inaingia...",
    "auth.login.new": "Mgeni kwenye DamuLink?",
    "auth.login.register": "Jisajili kama mfadhili",

    "auth.signup.step0.eyebrow": "Dakika mbili, mwanzo hadi mwisho",
    "auth.signup.step0.heading": "Maelezo yako yanabaki yako mpaka utoe ruhusa.",
    "auth.signup.step0.body":
      "Maelezo kamili ya mawasiliano hushirikiwa na hospitali tu baada ya wewe kukubali ombi.",
    "auth.signup.step1.eyebrow": "Uko karibu kumaliza",
    "auth.signup.step1.heading": "Msimbo mmoja, umetumwa moja kwa moja kwenye simu yako.",
    "auth.signup.step1.body": "Hii huthibitisha nambari ambayo hospitali zitakutumia zikiwa na uhitaji.",
    "auth.signup.step2.eyebrow": "Karibu",
    "auth.signup.step2.heading": "Sasa wewe ni sehemu ya mtandao huu.",
    "auth.signup.step2.body": "Kinachofuata ni aina yako ya damu na eneo lako - hivyo ndivyo ulinganishaji hufanyika.",
    "auth.signup.title": "Fungua akaunti yako",
    "auth.signup.body": "Utathibitisha nambari yako ya simu hatua inayofuata.",
    "auth.signup.error": "Usajili umeshindikana. Tafadhali jaribu tena.",
    "auth.signup.already": "Tayari una akaunti?",
    "auth.signup.verifyTitle": "Thibitisha simu yako",
    "auth.signup.verifyBody": "Tumetuma msimbo kwa {phone}. Uweke hapa chini.",
    "auth.signup.verifyFallback": "simu yako",
    "auth.signup.verifyError": "Msimbo huo haujafanya kazi. Ukague kisha ujaribu tena.",
    "auth.signup.resendError": "Imeshindikana kutuma msimbo tena. Jaribu tena baada ya muda mfupi.",
    "auth.signup.verifyAction": "Thibitisha na uendelee",
    "auth.signup.resend": "Tuma msimbo tena",
    "auth.signup.doneTitle": "Umethibitishwa",
    "auth.signup.doneBody":
      "Ingia kwa nenosiri uliloweka, kisha tutachukua aina yako ya damu na eneo lako ili hospitali zilizo karibu zikupate zikihitaji ulinganishaji.",
    "auth.signup.doneAction": "Ingia ili uendelee",

    "field.fullName": "Jina kamili la kisheria",
    "field.phone": "Nambari ya simu",
    "field.emailOptional": "Barua pepe (si lazima)",
    "field.nationalId": "Nambari ya kitambulisho",
    "field.birthDate": "Tarehe ya kuzaliwa",
    "field.password": "Nenosiri",
    "field.verificationCode": "Msimbo wa uthibitishaji",

    "profile.lastStep": "Hatua ya mwisho",
    "profile.title": "Wasifu wako wa ufadhili",
    "profile.body":
      "Haya ndiyo hospitali huona zinapotafuta ulinganishaji. Eneo lako halisi na maelezo kamili ya mawasiliano hubaki binafsi hadi useme ndiyo.",
    "profile.error": "Imeshindikana kuhifadhi wasifu wako. Tafadhali jaribu tena.",
    "profile.bloodType": "Aina ya damu",
    "profile.donorQuestion": "Ungependa kuchangia nini?",
    "profile.organsQuestion": "Ni viungo gani ungeahidi kuchangia?",
    "profile.location": "Mahali unapopatikana",
    "profile.county": "Kaunti",
    "profile.town": "Mji",
    "profile.contactPreference": "Njia unayopendelea ya mawasiliano",
    "profile.insurance": "Mtoa bima (si lazima)",
    "profile.insurancePlaceholder": "mf. SHA, Jubilee Health, AAR",
    "profile.save": "Hifadhi wasifu na uendelee",
    "profile.donor.blood": "Damu pekee",
    "profile.donor.organ": "Viungo pekee",
    "profile.donor.both": "Vyote",
    "profile.organ.kidney": "figo",
    "profile.organ.liver": "ini",
    "profile.organ.cornea": "konea",
    "profile.organ.heart": "moyo",
    "profile.organ.bone marrow": "uboho",
    "profile.contact.call": "Piga simu",
    "profile.contact.sms": "SMS",
    "profile.contact.whatsapp": "WhatsApp",

    "dashboard.loadError": "Imeshindikana kupakia kila kitu kwa sasa. Jaribu kuonyesha upya baada ya muda.",
    "dashboard.welcomeNamed": "Karibu tena, {name}",
    "dashboard.welcome": "Karibu tena",
    "dashboard.bloodTypeCopy": "Aina yako ya damu{bloodType} inaweza kuwa kile mtu anahitaji leo.",
    "dashboard.bloodTypeValue": " - {bloodType}",
    "dashboard.oneRequest": "Hospitali inasubiri jibu lako",
    "dashboard.manyRequests": "Hospitali {count} zinasubiri jibu lako",
    "dashboard.reviewRequest": "Kagua ombi kabla muda wake haujaisha",
    "dashboard.view": "Tazama ->",
    "dashboard.credits": "Salio la pointi",
    "dashboard.redeemable": "Zinaweza kutumika katika hospitali yoyote mshirika",
    "dashboard.availability": "Upatikanaji",
    "dashboard.available": "Hospitali zinaweza kukupata na kuwasiliana nawe",
    "dashboard.hidden": "Umefichwa dhidi ya maombi mapya",
    "dashboard.badgesEarned": "Beji ulizopata",
    "dashboard.latestBadge": "Ya hivi karibuni: {badge}",
    "dashboard.firstBadge": "Changia ili upate beji yako ya kwanza",
    "dashboard.badgesTitle": "Beji zako",
    "dashboard.noBadgesTitle": "Bado hakuna beji",
    "dashboard.noBadgesBody": "Mchango wako wa kwanza hufungua beji ya Rookie Lifesaver. Uko karibu kuliko unavyodhani.",
    "dashboard.historyTitle": "Historia ya michango",
    "dashboard.noHistoryTitle": "Bado hakuna michango iliyorekodiwa",
    "dashboard.noHistoryBody":
      "Hospitali ikithibitisha mchango wako, utaonekana hapa pamoja na pointi ulizopata.",
    "dashboard.earned": "Ilipatikana {date}",

    "requests.title": "Maombi ya hospitali",
    "requests.body":
      "Hospitali iliyothibitishwa ikitaka kuwasiliana nawe, itaonekana hapa kwanza. Hakuna kinachoshirikiwa hadi useme ndiyo.",
    "requests.loadError": "Imeshindikana kupakia maombi yako kwa sasa.",
    "requests.actionError": "Hatua hiyo haijakamilika. Tafadhali jaribu tena.",
    "requests.loading": "Inapakia...",
    "requests.needsResponse": "Yanahitaji jibu lako",
    "requests.past": "Maombi yaliyopita",
    "requests.accept": "Kubali na ushiriki mawasiliano",
    "requests.busy": "...",
    "requests.decline": "Kataa",
    "requests.emptyTitle": "Bado hakuna maombi",
    "requests.emptyBody":
      "Hospitali iliyo karibu ikihitaji aina yako ya damu, utaiona hapa kabla jambo lingine lolote halijafanyika.",
    "requests.status.pending": "Inasubiri jibu lako",
    "requests.status.accepted": "Imekubaliwa",
    "requests.status.declined": "Imekataliwa",
    "requests.status.expired": "Muda umeisha",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(LANGUAGE_KEY) || "en";
  });

  useEffect(() => {
    const normalized = translations[language] ? language : "en";
    document.documentElement.lang = normalized === "sw" ? "sw" : "en";
    localStorage.setItem(LANGUAGE_KEY, normalized);
  }, [language]);

  const value = useMemo(() => {
    function setLanguage(nextLanguage) {
      setLanguageState(translations[nextLanguage] ? nextLanguage : "en");
    }

    function t(key, params = {}) {
      const template = translations[language]?.[key] ?? translations.en[key] ?? key;
      return Object.entries(params).reduce(
        (text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement ?? ""),
        template
      );
    }

    return { language, setLanguage, t, languages: LANGUAGES };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}