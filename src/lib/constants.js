"use client";

import React from 'react';
import { Package, Droplets, Leaf, Zap, Globe, ShieldCheck, ShoppingBag, TreePine, Recycle, Wind } from 'lucide-react';

export const wasteCategories = [
  { id: 'plastic', ar: 'بلاستيك', en: 'Plastic', icon: <Package className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700', impact: { ar: { title: 'حماية المحيطات', text: 'رائع! إعادة تدوير البلاستيك ينقذ الكائنات البحرية.' }, en: { title: 'Protect Oceans', text: 'Awesome! Recycling plastic saves marine life.' } }, iconBig: <Droplets className="w-12 h-12 text-blue-500" /> },
  { id: 'paper', ar: 'ورق وكرتون', en: 'Paper', icon: <Package className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-700', impact: { ar: { title: 'إنقاذ الأشجار', text: 'عمل ممتاز! مساهمتك تساعد في الحفاظ على الغابات.' }, en: { title: 'Save Trees', text: 'Great job! You are preserving forests.' } }, iconBig: <Leaf className="w-12 h-12 text-green-500" /> },
  { id: 'glass', ar: 'زجاج', en: 'Glass', icon: <Package className="w-5 h-5" />, color: 'bg-teal-100 text-teal-700', impact: { ar: { title: 'توفير الطاقة', text: 'إعادة تدوير الزجاج يوفر طاقة هائلة.' }, en: { title: 'Save Energy', text: 'Recycling glass saves huge energy.' } }, iconBig: <Zap className="w-12 h-12 text-yellow-400" /> },
  { id: 'metals', ar: 'معادن', en: 'Metals', icon: <Package className="w-5 h-5" />, color: 'bg-gray-200 text-gray-700', impact: { ar: { title: 'الحفاظ على الموارد', text: 'إعادة تدوير المعادن يوفر حتى 95% من الطاقة.' }, en: { title: 'Preserve Resources', text: 'Recycling metals saves 95% energy.' } }, iconBig: <Globe className="w-12 h-12 text-slate-500" /> },
  { id: 'electronics', ar: 'إلكترونيات', en: 'Electronics', icon: <Package className="w-5 h-5" />, color: 'bg-red-100 text-red-700', impact: { ar: { title: 'منع السموم', text: 'لقد منعت تسرب المواد السامة للتربة.' }, en: { title: 'Prevent Toxins', text: 'You prevented toxic leaks into soil.' } }, iconBig: <ShieldCheck className="w-12 h-12 text-red-500" /> },
  { id: 'organic', ar: 'مواد عضوية', en: 'Organic', icon: <Leaf className="w-5 h-5" />, color: 'bg-green-100 text-green-700', impact: { ar: { title: 'صناعة السماد', text: 'سيتم تحويل هذه المواد إلى سماد طبيعي.' }, en: { title: 'Composting', text: 'These will be turned into compost.' } }, iconBig: <Leaf className="w-12 h-12 text-green-600" /> },
];

export const tipsData = [
  {
    id: 1,
    icon: <TreePine className="w-6 h-6 text-green-600" />,
    tag: { ar: '🇯🇴 الأردن', en: '🇯🇴 Jordan' },
    date: 'May 2025',
    ar: {
      title: 'التنوع البيولوجي يتعافى في الأردن بعد موسم مطري جيد',
      summary: 'تشهد غابات الأردن ومراعيه تعافياً ملحوظاً بعد موسم أمطار إيجابي في 2025-2026، وفق مسؤولين في وزارة الزراعة. وتعمل الوزارة على استخدام الذكاء الاصطناعي والاستشعار عن بعد للكشف المبكر عن الحرائق.',
    },
    en: {
      title: 'Biodiversity Rebounds in Jordan as Rainfall Boosts Forests',
      summary: 'Jordan\'s forests and rangelands are showing strong signs of recovery following a positive 2025-2026 rainy season. The Ministry of Agriculture is also deploying AI and satellite imaging for early fire detection.',
    },
    url: 'https://jordantimes.com/news/local/biodiversity-rebounds-in-jordan-as-rainfall-boosts-forests-rangelands-officials',
  },
  {
    id: 2,
    icon: <Wind className="w-6 h-6 text-blue-500" />,
    tag: { ar: '🇯🇴 الأردن', en: '🇯🇴 Jordan' },
    date: 'Sep 2025',
    ar: {
      title: 'الأردن يحمي طبقة الأوزون بالتحول إلى الصناعات الخضراء',
      summary: 'بدعم من البنك الدولي، أتمّ الأردن مشروع التخلص التدريجي من مواد استنزاف الأوزون (HCFCs)، مما أسهم في رفع كفاءة 48 شركة محلية وتحويلها إلى تقنيات صديقة للبيئة.',
    },
    en: {
      title: 'Jordan\'s Green Industrial Shift Helps Protect the Ozone Layer',
      summary: 'With World Bank support, Jordan completed its HCFC Phase-Out Project, helping 48 local businesses transition to eco-friendly technologies while boosting productivity and earning green energy certifications.',
    },
    url: 'https://www.worldbank.org/en/news/feature/2025/09/14/jordan-s-green-industrial-shift-will-help-protect-the-ozone-layer',
  },
  {
    id: 3,
    icon: <Droplets className="w-6 h-6 text-cyan-500" />,
    tag: { ar: '🇯🇴 الأردن', en: '🇯🇴 Jordan' },
    date: 'Feb 2026',
    ar: {
      title: 'مشروع ناقل المياه الوطني: أكبر مشروع بنية تحتية في تاريخ الأردن',
      summary: 'يجري العمل على مشروع تحلية المياه من العقبة إلى عمّان عبر خط أنابيب بطول 450 كم، ومن المتوقع أن يوفر 40% من احتياجات الأردن من مياه الشرب فور اكتماله عام 2030.',
    },
    en: {
      title: 'Jordan\'s National Water Conveyance: A 450km Pipeline to Solve Water Scarcity',
      summary: 'Jordan\'s largest-ever infrastructure project is underway — a desalination and conveyance pipeline from Aqaba to Amman that will deliver 300 million cubic meters of drinking water annually by 2030.',
    },
    url: 'https://www.trade.gov/country-commercial-guides/jordan-environment-and-water-sector',
  },
  {
    id: 4,
    icon: <Recycle className="w-6 h-6 text-orange-500" />,
    tag: { ar: '🇯🇴 الأردن', en: '🇯🇴 Jordan' },
    date: 'Jan 2026',
    ar: {
      title: 'نحو اقتصاد دائري في الأردن: واقع النفايات والحلول المقترحة',
      summary: 'تكشف دراسة حديثة أن أكثر من 90% من نفايات الأردن تنتهي في مكبّات. وتدرس الحكومة ثلاثة سيناريوهات لرفع معدلات إعادة التدوير إلى 75% بحلول 2034 مما سيوفر 44% من انبعاثات الغازات الدفيئة.',
    },
    en: {
      title: 'Towards a Circular Economy in Jordan: The Recycling Challenge',
      summary: 'A recent study finds that over 90% of Jordan\'s waste ends up in landfills. Researchers evaluated three recycling scenarios, showing that achieving 75% recovery by 2034 could cut greenhouse gas emissions by 44%.',
    },
    url: 'https://www.mdpi.com/2071-1050/18/3/1230',
  },
  {
    id: 5,
    icon: <Globe className="w-6 h-6 text-purple-500" />,
    tag: { ar: '🌍 عالمي', en: '🌍 Global' },
    date: 'Sep 2025',
    ar: {
      title: 'الأردن يُطلق مسيرته نحو الحياد الكربوني بحلول 2050',
      summary: 'أعلن الأردن عن مساهمته الوطنية المحددة الثالثة (NDC) في سبتمبر 2025، متضمنةً استراتيجية متكاملة لبلوغ الحياد الكربوني بحلول 2050 عبر الهيدروجين الأخضر وتحسين كفاءة الطاقة وتعزيز الزراعة المقاومة للمناخ.',
    },
    en: {
      title: 'Jordan Sets 2050 Net-Zero Trajectory in New Climate Pledge',
      summary: 'Jordan submitted its third NDC in September 2025, marking the start of a net-zero journey by 2050. The plan focuses on green hydrogen, energy storage, urban heat mitigation, and integrating climate action across all sectors.',
    },
    url: 'https://climatepromise.undp.org/what-we-do/where-we-work/jordan',
  },
  {
    id: 6,
    icon: <Leaf className="w-6 h-6 text-green-500" />,
    tag: { ar: '🌍 عالمي', en: '🌍 Global' },
    date: 'Oct 2025',
    ar: {
      title: 'تقرير عالمي: ثلث الأنواع الحية لا تزال بلا حماية كافية',
      summary: 'يكشف تقرير حماية الأنواع لعام 2025 أن 92 ألف نوع حيواني ونباتي تم تقييمها، ويدعو إلى تسريع تحقيق هدف "30×30"، أي حماية 30% من مساحة الأرض والبحار بحلول 2030.',
    },
    en: {
      title: 'Global Report: Major Gaps Remain in Species Protection',
      summary: 'The 2025 Species Protection Report assessed 92,000 species and warned that the 2030 deadline for the 30x30 global biodiversity target — protecting 30% of Earth\'s land and oceans — requires urgent action.',
    },
    url: 'https://www.jordanenvironmentnews.com/article/862613112-latest-global-report-reveals-major-successes-and-gaps-in-species-protection',
  },
];

export const recyclingCenters = [
  {
    id: 1,
    lat: 31.9506,
    lng: 35.8606,
    mapUrl: 'https://maps.google.com/?q=Cozmo+Recycling+Center+Amman',
    ar: {
      name: 'Cozmo Recycling Center / go green By BE',
      address: 'الدوار السابع، شارع عيسى الناعوري، عمّان',
      accepts: ['بلاستيك', 'ورق', 'كرتون', 'زجاج', 'ملابس', 'معادن خفيفة', 'ألعاب']
    },
    en: {
      name: 'Cozmo Recycling Center / go green By BE',
      address: '7th Circle, Issa Al-Naouri St, Amman',
      accepts: ['Plastic', 'Paper', 'Cardboard', 'Glass', 'Clothes', 'Light Metals', 'Toys']
    }
  },

  {
    id: 2,
    lat: 31.9632,
    lng: 35.8895,
    mapUrl: 'https://maps.google.com/?q=Green+Spot+Recycling+Amman',
    ar: {
      name: 'Recycling in Amman - Green Spot',
      address: 'شارع نمر العدوان، بناية 14، عمّان',
      accepts: ['ورق', 'كرتون', 'بلاستيك', 'أقمشة', 'مواد منزلية']
    },
    en: {
      name: 'Recycling in Amman - Green Spot',
      address: 'Nimr Al-Adwan St, Building 14, Amman',
      accepts: ['Paper', 'Cardboard', 'Plastic', 'Clothes', 'Household Materials']
    }
  },

  {
    id: 3,
    lat: 31.9804,
    lng: 35.8372,
    mapUrl: 'https://maps.google.com/?q=City+Mall+Green+Centre+Amman',
    ar: {
      name: 'City Mall Green Centre',
      address: 'سيتي مول، شارع الملك عبدالله الثاني، عمّان',
      accepts: ['بلاستيك', 'ورق', 'عبوات', 'مواد منزلية']
    },
    en: {
      name: 'City Mall Green Centre',
      address: 'City Mall, King Abdullah II St, Amman',
      accepts: ['Plastic', 'Paper', 'Containers', 'Household Materials']
    }
  },

  {
    id: 4,
    lat: 31.955,
    lng: 35.9105,
    mapUrl: 'https://maps.google.com/?q=T+bottle+Amman',
    ar: {
      name: 'T bottle',
      address: 'شارع ضرار بن الأزور 22، عمّان',
      accepts: ['عبوات زجاجية', 'قوارير زجاج']
    },
    en: {
      name: 'T bottle',
      address: 'Dirar Bin Al Azwar St 22, Amman',
      accepts: ['Glass Bottles', 'Glass Containers']
    }
  },

  {
    id: 5,
    lat: 31.945,
    lng: 35.928,
    mapUrl: 'https://maps.google.com/?q=Green+Oasis+for+Plastic+Recycling+Amman',
    ar: {
      name: 'Green Oasis for Plastic Recycling',
      address: 'عمّان',
      accepts: ['مخلفات البلاستيك', 'مواد بلاستيكية']
    },
    en: {
      name: 'Green Oasis for Plastic Recycling',
      address: 'Amman',
      accepts: ['Plastic Waste', 'Plastic Materials']
    }
  },

  {
    id: 6,
    lat: 31.731,
    lng: 35.983,
    mapUrl: 'https://maps.google.com/?q=Al+Jowaida+Plastics+Recycling+Factory+Amman',
    ar: {
      name: 'Al Jowaida Plastics Recycling Factory',
      address: 'وادي أم، شارع العروب 8، الجيزة - عمّان',
      accepts: ['البلاستيك الصناعي', 'مواد بلاستيكية']
    },
    en: {
      name: 'Al Jowaida Plastics Recycling Factory',
      address: 'Al-Aroub St 8, Al Jizah, Amman',
      accepts: ['Industrial Plastic', 'Plastic Materials']
    }
  },

  {
    id: 7,
    lat: 31.96,
    lng: 35.91,
    mapUrl: 'https://maps.google.com/?q=Good+Environment+Plastic+Recycling+Foundation+Amman',
    ar: {
      name: 'Good Environment Plastic Recycling Foundation',
      address: 'عمّان',
      accepts: ['عبوات بلاستيكية', 'مخلفات بلاستيكية']
    },
    en: {
      name: 'Good Environment Plastic Recycling Foundation',
      address: 'Amman',
      accepts: ['Plastic Bottles', 'Plastic Waste']
    }
  },

  {
    id: 8,
    lat: 32.0727,
    lng: 36.0879,
    mapUrl: 'https://maps.google.com/?q=Bamboo+for+Recycling+paper+Zarqa',
    ar: {
      name: 'Bamboo for Recycling paper',
      address: 'شارع الصناعة 2، الزرقاء',
      accepts: ['ورق', 'كرتون', 'مخلفات ورقية']
    },
    en: {
      name: 'Bamboo for Recycling paper',
      address: 'Industrial St 2, Zarqa',
      accepts: ['Paper', 'Cardboard', 'Paper Waste']
    }
  },

  {
    id: 9,
    lat: 31.9495,
    lng: 35.923,
    mapUrl: 'https://maps.google.com/?q=Green+Line+Recycling+Center+Amman',
    ar: {
      name: 'Green Line Recycling Center',
      address: 'شارع عباد بن بشر 11، رأس العين، عمّان',
      accepts: ['ورق', 'كرتون', 'بلاستيك']
    },
    en: {
      name: 'Green Line Recycling Center',
      address: 'Abbad Bin Bishr St 11, Ras Al Ain, Amman',
      accepts: ['Paper', 'Cardboard', 'Plastic']
    }
  },

  {
    id: 10,
    lat: 31.977,
    lng: 35.95,
    mapUrl: 'https://maps.google.com/?q=POIL+Jordan+Amman',
    ar: {
      name: 'POIL Jordan',
      address: 'شارع الفرات بن حبان، عمّان 11183',
      accepts: ['زيوت مستخدمة', 'مواد صناعية']
    },
    en: {
      name: 'POIL Jordan',
      address: 'Al Furat Bin Haban St, Amman 11183',
      accepts: ['Used Oils', 'Industrial Materials']
    }
  }
];

export const rewardsData = [
  { id: 'r1', cost: 150, icon: <Zap className="w-10 h-10 text-yellow-500" />, ar: { title: 'خصم فاتورة الكهرباء', desc: 'خصم 5 دنانير يضاف كرصيد في فاتورة الكهرباء القادمة.' }, en: { title: 'Electricity Bill Discount', desc: '5 JOD discount applied to your next electricity bill.' } },
  { id: 'r2', cost: 80, icon: <ShoppingBag className="w-10 h-10 text-teal-500" />, ar: { title: 'حقائب تسوق صديقة للبيئة', desc: 'مجموعة من 3 حقائب قماشية متينة تصل لباب منزلك مجاناً.' }, en: { title: 'Eco-friendly Shopping Bags', desc: 'Set of 3 durable fabric bags delivered to your door.' } },
  { id: 'r3', cost: 250, icon: <Leaf className="w-10 h-10 text-green-500" />, ar: { title: 'زراعة شجرة باسمك', desc: 'سيتم زراعة شجرة في إحدى غابات الأردن وستحصل على شهادة بذلك.' }, en: { title: 'Plant a Tree in Your Name', desc: 'A tree will be planted in Jordan and you will receive a certificate.' } },
];