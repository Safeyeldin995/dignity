import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Dignity Store database...");

  // ── Admin user ────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@Dignity2024!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dignitystore.com" },
    update: {},
    create: {
      email: "admin@dignitystore.com",
      name: "Dignity Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ── Categories ────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "upper-body" },
      update: {},
      create: {
        slug: "upper-body",
        nameEn: "Upper Body",
        nameAr: "الجزء العلوي",
        descEn: "Shirts, tops, and blouses designed for comfort and ease of dressing",
        descAr: "قمصان وبلوزات مصممة للراحة وسهولة الارتداء",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "lower-body" },
      update: {},
      create: {
        slug: "lower-body",
        nameEn: "Lower Body",
        nameAr: "الجزء السفلي",
        descEn: "Trousers, skirts, and pants with adaptive features",
        descAr: "بناطيل وتنانير بمميزات تكيفية",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "full-body" },
      update: {},
      create: {
        slug: "full-body",
        nameEn: "Full Body",
        nameAr: "كامل الجسم",
        descEn: "Dresses, jumpsuits, and nightwear for complete comfort",
        descAr: "فساتين وبيجامات للراحة الكاملة",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "outerwear" },
      update: {},
      create: {
        slug: "outerwear",
        nameEn: "Outerwear",
        nameAr: "الملابس الخارجية",
        descEn: "Cardigans, jackets, and robes for warmth and mobility",
        descAr: "كارديجان وجاكيتات لمزيد من الدفء وحرية الحركة",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "sleepwear" },
      update: {},
      create: {
        slug: "sleepwear",
        nameEn: "Sleepwear",
        nameAr: "ملابس النوم",
        descEn: "Comfortable nightwear and loungewear",
        descAr: "ملابس نوم مريحة للراحة التامة",
        sortOrder: 5,
      },
    }),
  ]);
  console.log("✅ Categories seeded:", categories.length);

  // ── Tags ─────────────────────────────────────────────────
  const tagData = [
    { slug: "velcro", nameEn: "Velcro Closure", nameAr: "إغلاق فيلكرو" },
    { slug: "magnetic", nameEn: "Magnetic Buttons", nameAr: "أزرار مغناطيسية" },
    { slug: "open-back", nameEn: "Open Back", nameAr: "ظهر مفتوح" },
    { slug: "wide-leg", nameEn: "Wide Leg", nameAr: "رجل واسعة" },
    { slug: "elastic-waist", nameEn: "Elastic Waist", nameAr: "خصر مطاطي" },
    { slug: "cotton", nameEn: "100% Cotton", nameAr: "قطن ١٠٠٪" },
    { slug: "wheelchair-friendly", nameEn: "Wheelchair Friendly", nameAr: "مناسب لكرسي المتحرك" },
    { slug: "sensory-friendly", nameEn: "Sensory Friendly", nameAr: "مناسب للحساسية الجلدية" },
    { slug: "easy-care", nameEn: "Easy Care", nameAr: "سهل العناية" },
    { slug: "loose-fit", nameEn: "Loose Fit", nameAr: "قصة واسعة" },
  ];

  const tags = await Promise.all(
    tagData.map((t) =>
      prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t })
    )
  );
  console.log("✅ Tags seeded:", tags.length);

  // ── Products ──────────────────────────────────────────────
  const productsData = [
    {
      slug: "adaptive-cotton-shirt",
      nameEn: "Adaptive Open-Back Cotton Shirt",
      nameAr: "قميص قطني بظهر مفتوح تكيفي",
      descEn: `A thoughtfully designed shirt for individuals who need assistance dressing. Features a discreet open-back design with magnetic closures that look like traditional buttons. Made from 100% Egyptian cotton for breathability and soft comfort against sensitive skin. The generous cut allows for ease of movement and fits over medical devices or catheters without restriction.`,
      descAr: `قميص مصمم بعناية للأشخاص الذين يحتاجون مساعدة في الارتداء. يتميز بظهر مفتوح بأزرار مغناطيسية تشبه الأزرار العادية. مصنوع من القطن المصري ١٠٠٪ للتهوية والراحة مع البشرة الحساسة. القصة الواسعة تتيح حرية الحركة وتناسب الأجهزة الطبية.`,
      careEn: "Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Iron on low heat away from magnets.",
      careAr: "غسيل بالغسالة بالماء البارد، دورة لطيفة. لا تستخدم المبيضات. تجفيف بحرارة منخفضة. كوي على حرارة منخفضة بعيداً عن المغانط.",
      sizingNotesEn: "Runs true to size. For wheelchair users, we recommend sizing up for extra comfort when seated. Available in sizes XS-4XL.",
      sizingNotesAr: "المقاسات على حسب المعيار. لمستخدمي الكراسي المتحركة، ننصح بأخذ مقاس أكبر لمزيد من الراحة عند الجلوس. متاح من XS إلى 4XL.",
      price: 299,
      categoryId: categories[0].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "Open back design • Magnetic closures (look like buttons) • Fits over catheters • Wide arm openings",
      adaptiveFeaturesAr: "ظهر مفتوح • أزرار مغناطيسية • يناسب القسطرة • فتحات ذراع واسعة",
      isFeatured: true,
      stock: 50,
      fabricEn: "100% Egyptian Cotton",
      fabricAr: "قطن مصري ١٠٠٪",
      sku: "DIG-SHIRT-OB-001",
      images: [
        { url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800", altEn: "White adaptive shirt front view", altAr: "قميص تكيفي أبيض من الأمام", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800", altEn: "White adaptive shirt back view showing open-back design", altAr: "القميص من الخلف يظهر التصميم المفتوح" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
      colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Beige", hex: "#F5E6D3" }, { name: "Light Blue", hex: "#B3D4E8" }],
      tagSlugs: ["open-back", "magnetic", "cotton", "wheelchair-friendly", "sensory-friendly"],
    },
    {
      slug: "elastic-waist-trousers",
      nameEn: "Comfort Elastic Waist Wide-Leg Trousers",
      nameAr: "بنطلون بخصر مطاطي وساق واسعة",
      descEn: `Dignified, comfortable trousers designed for independence. The wide elastic waist allows easy dressing without assistance and accommodates medical equipment. The wide-leg cut provides unrestricted movement and is designed to look elegant whether standing or seated. No buttons, no zippers — just pure ease. Perfect for arthritis, limited mobility, or simply those who value effortless comfort.`,
      descAr: `بنطلون أنيق ومريح مصمم للاستقلالية. الخصر المطاطي الواسع يسهل الارتداء دون مساعدة ويناسب المعدات الطبية. القصة الواسعة تتيح حرية الحركة الكاملة وتبدو أنيقة سواء كنت واقفاً أو جالساً. بدون أزرار أو سحابات — راحة خالصة. مثالي لمرضى التهاب المفاصل وصعوبة الحركة.`,
      careEn: "Machine wash warm. Tumble dry medium. Do not iron pleats.",
      careAr: "غسيل بالغسالة بالماء الدافئ. تجفيف بحرارة متوسطة. لا تكوي الثنيات.",
      sizingNotesEn: "Relaxed fit. Inseam: 76cm (29\"). Available in Regular and Short lengths. Size chart available in Arabic and English.",
      sizingNotesAr: "قصة مريحة. الطول الداخلي: ٧٦ سم. متاح بطول عادي وقصير. جدول المقاسات متوفر بالعربي والإنجليزي.",
      price: 349,
      categoryId: categories[1].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "Full elastic waist • Wide-leg cut • Side pockets • No fastenings required • Seated comfort design",
      adaptiveFeaturesAr: "خصر مطاطي كامل • قصة واسعة • جيوب جانبية • لا يحتاج أزرار • مريح للجلوس",
      isFeatured: true,
      stock: 40,
      fabricEn: "65% Cotton, 35% Polyester blend — wrinkle resistant",
      fabricAr: "٦٥٪ قطن، ٣٥٪ بوليستر — مقاوم للتجعد",
      sku: "DIG-TRSR-EW-001",
      images: [
        { url: "https://images.unsplash.com/photo-1594938298603-c8148f4994f9?w=800", altEn: "Wide-leg trousers in navy", altAr: "بنطلون واسع باللون الكحلي", isPrimary: true },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
      colors: [{ name: "Navy", hex: "#1B2A4A" }, { name: "Black", hex: "#1A1A1A" }, { name: "Stone", hex: "#9C9082" }],
      tagSlugs: ["elastic-waist", "wide-leg", "wheelchair-friendly", "easy-care"],
    },
    {
      slug: "sensory-friendly-nightgown",
      nameEn: "Sensory-Friendly Cotton Nightgown",
      nameAr: "قميص نوم قطني للحساسية الجلدية",
      descEn: `Designed for those with sensitive skin, dementia, or sensory processing needs. No tags, no rough seams, no scratchy fabrics. The nightgown features flat-stitched seams on the outside, a gentle open neckline, and is made from the softest combed cotton. The simple slip-over design requires no fine motor skills and is dignified enough for hospital visits. Available in ankle and knee lengths.`,
      descAr: `مصمم لأصحاب البشرة الحساسة أو ضعف الحركة. بدون علامات خشنة أو خيوط مزعجة. يتميز بخياطة مسطحة من الخارج، وفتحة رقبة لطيفة، ومصنوع من أناعم القطن الممشط. التصميم البسيط لا يحتاج مهارات يدية دقيقة. متاح بطول الكاحل والركبة.`,
      careEn: "Machine wash gentle, cold water. Do not bleach. Lay flat to dry or tumble dry low.",
      careAr: "غسيل لطيف بالماء البارد. لا تستخدم المبيضات. بسطي على سطح مستوٍ للتجفيف أو جفف بحرارة منخفضة.",
      sizingNotesEn: "Generous fit recommended. One size fits L-4XL comfortably. Available in standard (ankle) and short (knee) length.",
      sizingNotesAr: "يُنصح بالمقاس الأكبر. مقاس واحد يناسب L حتى 4XL. متاح بالطول العادي (الكاحل) والقصير (الركبة).",
      price: 249,
      categoryId: categories[4].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "No tags • Flat outer seams • Tagless • Sensory-friendly fabric • Slip-on design",
      adaptiveFeaturesAr: "بدون علامات • خياطة مسطحة • قماش صديق للحساسية • تصميم سهل الارتداء",
      isFeatured: false,
      stock: 60,
      fabricEn: "100% Combed Egyptian Cotton — OEKO-TEX certified",
      fabricAr: "قطن مصري ممشط ١٠٠٪ — حاصل على شهادة OEKO-TEX",
      sku: "DIG-NIGHT-SF-001",
      images: [
        { url: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800", altEn: "Soft white nightgown on display", altAr: "قميص نوم أبيض ناعم", isPrimary: true },
      ],
      sizes: ["S/M", "L/XL", "2XL/3XL", "4XL+"],
      colors: [{ name: "White", hex: "#FAFAFA" }, { name: "Blush Pink", hex: "#F0C4B4" }, { name: "Sage Green", hex: "#A8C5B5" }],
      tagSlugs: ["sensory-friendly", "cotton", "easy-care", "loose-fit"],
    },
    {
      slug: "magnetic-wrap-cardigan",
      nameEn: "Magnetic Wrap Cardigan",
      nameAr: "كارديجان بأزرار مغناطيسية",
      descEn: `Elegant warmth meets total ease. This wrap-style cardigan uses hidden magnetic closures so it looks traditionally styled but requires only one hand to fasten. Perfect for arthritis sufferers, stroke survivors, or anyone who values independent dressing. The generous wrap design accommodates catheters, oxygen tubes, or other medical equipment discreetly. Made from a soft, non-itchy merino blend.`,
      descAr: `أناقة ودفء مع سهولة تامة. هذا الكارديجان يستخدم أزرار مغناطيسية مخفية تبدو تقليدية ولكنها تُغلق بيد واحدة. مثالي لمرضى التهاب المفاصل أو من يعانون من صعوبة في اليدين. التصميم الفضفاض يخفي القسطرة أو خراطيم الأكسجين بشكل أنيق. مصنوع من خليط الميرينو الناعم.`,
      careEn: "Hand wash or machine wash delicate cycle, cold. Lay flat to dry. Do not wring.",
      careAr: "غسيل يدوي أو بالغسالة على دورة الملابس الرقيقة بالماء البارد. بسطي للتجفيف. لا تعصري.",
      sizingNotesEn: "Oversized styling. Order your usual size for a relaxed fit or size down for a closer wrap. Available XS-4XL.",
      sizingNotesAr: "قصة فضفاضة. اطلب مقاسك العادي للوصول براحة أو مقاس أصغر لقصة أقرب. متاح من XS إلى 4XL.",
      price: 459,
      categoryId: categories[3].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "Hidden magnetic closures • One-hand fastening • Front pocket access • Tube-friendly design",
      adaptiveFeaturesAr: "أزرار مغناطيسية مخفية • إغلاق بيد واحدة • جيوب أمامية سهلة الوصول",
      isFeatured: true,
      stock: 30,
      fabricEn: "70% Merino Wool, 30% Acrylic blend — itch-free",
      fabricAr: "٧٠٪ صوف ميرينو، ٣٠٪ أكريليك — بدون حكة",
      sku: "DIG-CARD-MAG-001",
      images: [
        { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", altEn: "Grey wrap cardigan elegantly draped", altAr: "كارديجان رمادي أنيق", isPrimary: true },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
      colors: [{ name: "Charcoal Grey", hex: "#4A4A4A" }, { name: "Cream", hex: "#F5EDD9" }, { name: "Dusty Rose", hex: "#C9A0A0" }],
      tagSlugs: ["magnetic", "wheelchair-friendly", "easy-care"],
    },
    {
      slug: "adaptive-wrap-dress",
      nameEn: "Adaptive Side-Fastening Wrap Dress",
      nameAr: "فستان بإغلاق جانبي تكيفي",
      descEn: `Dignity without compromise. This wrap dress features velcro and snap closures along the side seam, allowing it to be put on and taken off without lifting arms overhead or stepping through. Designed after consultation with occupational therapists, it's ideal for assisted dressing, hospital settings, or maintaining independence at home. Beautifully draped fabric flows to midi length with an elegant silhouette.`,
      descAr: `كرامة بلا تنازل. هذا الفستان يتميز بإغلاق بالفيلكرو والضغاط على الخياطة الجانبية، يمكن ارتداؤه وخلعه دون رفع الذراعين أو التخطي. مصمم بالتشاور مع معالجين مهنيين، مثالي للمساعدة في الارتداء أو في المستشفيات. القماش الأنيق يتدفق بطول الميدي.`,
      careEn: "Machine wash warm. Hang to dry. Cool iron if needed. Do not dry clean.",
      careAr: "غسيل بالغسالة بالماء الدافئ. علقي للتجفيف. كوي بحرارة منخفضة إذا لزم. لا تغسلي كيميائياً.",
      sizingNotesEn: "Midi length (below knee). Fitted at waist with wrap drape. Available in Regular (155-165cm) and Tall (165-175cm) lengths.",
      sizingNotesAr: "طول الميدي (تحت الركبة). مضبوط عند الخصر. متاح بطول عادي (١٥٥-١٦٥ سم) وطويل (١٦٥-١٧٥ سم).",
      price: 529,
      comparePrice: 649,
      categoryId: categories[2].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "Side velcro closures • Snap fastenings • No overhead dressing needed • Occupational therapist approved",
      adaptiveFeaturesAr: "إغلاق جانبي بالفيلكرو • لا يحتاج رفع الذراعين • معتمد من المعالجين المهنيين",
      isFeatured: true,
      stock: 25,
      fabricEn: "95% Viscose, 5% Elastane — fluid drape, slight stretch",
      fabricAr: "٩٥٪ فيسكوز، ٥٪ إيلاستين — قماش سائل مع مرونة خفيفة",
      sku: "DIG-DRESS-WRP-001",
      images: [
        { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800", altEn: "Elegant wrap dress in navy blue", altAr: "فستان راب أنيق باللون الكحلي", isPrimary: true },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
      colors: [{ name: "Navy", hex: "#1B2A4A" }, { name: "Forest Green", hex: "#2D5044" }, { name: "Burgundy", hex: "#7B2D42" }],
      tagSlugs: ["velcro", "wheelchair-friendly", "easy-care"],
    },
    {
      slug: "open-side-top",
      nameEn: "Open-Side Adaptive Top",
      nameAr: "توب تكيفي بفتح جانبي",
      descEn: `Ideal for post-surgery recovery, lymphedema management, or those with limited arm mobility. The open-side design with gentle velcro closures allows for complete dressing assistance while maintaining a neat, dignified appearance. The soft jersey fabric is gentle against healing skin. Available in hospital-friendly white and home comfort colours.`,
      descAr: `مثالي للتعافي بعد العمليات أو علاج الوذمة اللمفية أو محدودية حركة الذراعين. التصميم المفتوح جانبياً بإغلاق الفيلكرو اللطيف يسمح بالمساعدة الكاملة في الارتداء مع الحفاظ على مظهر أنيق. قماش الجيرسيه ناعم على الجلد أثناء الشفاء.`,
      careEn: "Machine wash cold. Tumble dry low. Do not iron directly on velcro.",
      careAr: "غسيل بالغسالة بالماء البارد. تجفيف بحرارة منخفضة. لا تكوي على الفيلكرو مباشرة.",
      sizingNotesEn: "Boxy, relaxed fit. Suitable for arm slings and IV lines. Available XS-5XL.",
      sizingNotesAr: "قصة مربعة مريحة. مناسب للجبائر وخطوط الوريد. متاح من XS إلى 5XL.",
      price: 199,
      categoryId: categories[0].id,
      isAdaptive: true,
      adaptiveFeaturesEn: "Full open-side access • Gentle velcro • IV-line compatible • Post-surgery friendly",
      adaptiveFeaturesAr: "فتح جانبي كامل • فيلكرو لطيف • متوافق مع خطوط الوريد • مناسب لما بعد العمليات",
      isFeatured: false,
      stock: 75,
      fabricEn: "100% Cotton Jersey",
      fabricAr: "جيرسيه قطني ١٠٠٪",
      sku: "DIG-TOP-OS-001",
      images: [
        { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800", altEn: "White open-side adaptive top", altAr: "توب أبيض بفتح جانبي", isPrimary: true },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      colors: [{ name: "White", hex: "#FAFAFA" }, { name: "Soft Grey", hex: "#D1D1D1" }, { name: "Pale Blue", hex: "#C5DCE8" }],
      tagSlugs: ["velcro", "open-back", "sensory-friendly", "cotton"],
    },
  ];

  for (const productData of productsData) {
    const { images, sizes, colors, tagSlugs, ...data } = productData;

    // Find tags
    const productTags = await prisma.tag.findMany({
      where: { slug: { in: tagSlugs } },
    });

    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            altEn: img.altEn,
            altAr: img.altAr,
            sortOrder: i,
            isPrimary: img.isPrimary || i === 0,
          })),
        },
        variants: {
          create: sizes.flatMap((size) =>
            colors.map((color) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              stock: Math.floor(Math.random() * 15) + 5,
              sku: `${data.sku}-${size}-${color.name.substring(0, 3).toUpperCase()}`,
            }))
          ),
        },
        tags: {
          create: productTags.map((tag) => ({ tagId: tag.id })),
        },
      },
    });
    console.log("  ✅ Product:", product.nameEn);
  }

  // ── Settings ──────────────────────────────────────────────
  const settings = [
    { key: "site_name_en", value: "Dignity Store" },
    { key: "site_name_ar", value: "ديجنيتي ستور" },
    { key: "site_tagline_en", value: "Adaptive Clothing with Dignity" },
    { key: "site_tagline_ar", value: "ملابس تكيفية بكرامة" },
    { key: "currency", value: "EGP" },
    { key: "shipping_cost", value: "50" },
    { key: "free_shipping_threshold", value: "500" },
    { key: "support_phone", value: "+20 100 000 0000" },
    { key: "support_email", value: "support@dignitystore.com" },
    { key: "fawry_merchant_code", value: "YOUR_FAWRY_MERCHANT_CODE" },
    { key: "fawry_security_key", value: "YOUR_FAWRY_SECURITY_KEY" },
    { key: "fawry_mode", value: "test" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("\n✅ Database seeded successfully!");
  console.log("\n🔐 Admin Login:");
  console.log("   Email:    admin@dignitystore.com");
  console.log("   Password: Admin@Dignity2024!");
  console.log("\n📦 Products seeded:", productsData.length);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
