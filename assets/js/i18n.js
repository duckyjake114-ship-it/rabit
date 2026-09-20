/* ===========================================================
   Nam Việt Bình Dương Plastic — i18n
   Client-side language switching (EN / VI / ZH) driven by
   data-i18n / data-i18n-html / data-i18n-placeholder attributes.
   No build step, no reload: text is swapped in place and the
   choice is remembered in localStorage.
   =========================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "nvbd-lang";
  var DEFAULT_LANG = "en";

  var I18N = {
    en: {
      nav: { home: "Home", about: "About Us", products: "Products", contact: "Contact", quote: "Request a Quote" },
      brand: { name: "Nam Việt Bình Dương Plastic", sub: "Plastic Manufacturing & Export" },
      draft: { banner: "Draft preview — text, photos, and figures below are placeholders pending final review." },

      footer: {
        tagline: "Factory-direct plastic manufacturer in Bình Dương, Vietnam, exporting to partners across China, Taiwan, and Asia.",
        quickLinks: "Quick Links",
        ourProducts: "Our Products",
        contactUs: "Contact",
        address: "[Factory address — Bình Dương Province, Vietnam]",
        hoursValue: "Mon–Sat, 8:00–17:30 (GMT+7)",
        rights: "© 2026 Nam Việt Bình Dương Plastic Co., Ltd. All rights reserved."
      },

      markets: { cn: "China", tw: "Taiwan", vn: "Vietnam", kr: "South Korea", jp: "Japan", sg: "Singapore", my: "Malaysia", global: "Worldwide" },

      products_nav: {
        bags: "Packaging Bags & Films",
        injection: "Injection-Molded Products",
        recycled: "Recycled Granules & Pellets",
        oem: "OEM / ODM Manufacturing"
      },

      home: {
        meta: { title: "Nam Việt Bình Dương Plastic — Vietnam Plastic Manufacturer & Exporter", desc: "Factory-direct plastic packaging, injection-molded products, and recycled granules from Bình Dương, Vietnam. OEM/ODM export to China, Taiwan & Asia." },
        hero: {
          eyebrow: "Factory-Direct Plastic Manufacturer · Bình Dương, Vietnam",
          title: "Reliable plastic manufacturing,<br>delivered from Vietnam to the world.",
          subtitle: "We produce and export plastic packaging, injection-molded products, and recycled granules directly from our own factory in Bình Dương — with a bilingual sales team experienced in serving partners across China and Taiwan.",
          ctaQuote: "Request a Quote",
          ctaProducts: "View Our Products",
          badge1: "Quality-Controlled Production",
          badge2: "OEM / ODM Available",
          panelHeading: "What We Produce",
          tile1: "Packaging Bags", tile2: "Plastic Film", tile3: "Molded Parts",
          tile4: "Recycled Pellets", tile5: "Custom OEM", tile6: "Export Ready",
          chip1: "Quality Checked", chip2: "Global Export"
        },
        stats: { years: "Years in Operation", factory: "Factory Area", capacity: "Monthly Capacity", countries: "Export Markets" },
        products: {
          heading: "What We Manufacture",
          subheading: "Four core product lines, all made in-house at our Bình Dương factory.",
          card1Title: "Packaging Bags & Films", card1Desc: "PE / PP / HDPE / LDPE bags, rolls, and industrial packaging film in custom sizes and thicknesses.",
          card2Title: "Injection-Molded Products", card2Desc: "Household and industrial plastic parts, crates, containers, and components to your specification.",
          card3Title: "Recycled Granules & Pellets", card3Desc: "Reclaimed and compounded PE / PP / ABS resin, processed to consistent quality standards.",
          card4Title: "OEM / ODM Manufacturing", card4Desc: "Custom molds, formulations, and private-label packaging built around your brand and market.",
          learnMore: "Learn more"
        },
        why: {
          heading: "Why Partners Choose Us",
          subheading: "Built for buyers who need dependable supply, not just a quote.",
          item1Title: "Factory-Direct Pricing", item1Desc: "No middlemen — you buy straight from the production line, at production-line cost.",
          item2Title: "Strict Quality Control", item2Desc: "Incoming material checks, in-line inspection, and pre-shipment QC on every order.",
          item3Title: "Flexible MOQ & Customization", item3Desc: "From trial orders to full-container volumes, with custom colors, sizes, and printing.",
          item4Title: "China & Taiwan Export Experience", item4Desc: "A bilingual sales and logistics team that already knows how you like to work."
        },
        cert: {
          heading: "Quality You Can Trust",
          subheading: "[Replace with your factory's actual certifications and audit reports]",
          item1: "ISO 9001:2015", item1Note: "Quality Management System",
          item2: "ISO 14001", item2Note: "Environmental Management System",
          item3: "REACH / RoHS", item3Note: "Compliant for EU & export markets",
          item4: "Factory Audit Ready", item4Note: "Available for client & third-party inspection"
        },
        marketsSection: {
          heading: "Trusted Across Asia",
          subheading: "Currently exporting to partners in these markets — [update with your real client countries]."
        },
        cta: {
          heading: "Looking for a Reliable Plastic Supplier?",
          subheading: "Tell us what you need — our team replies with pricing and lead time within 1–2 business days.",
          button: "Contact Our Sales Team"
        }
      },

      about: {
        meta: { title: "About Us — Nam Việt Bình Dương Plastic", desc: "Learn about Nam Việt Bình Dương Plastic's factory, mission, and the team behind our plastic manufacturing and export business." },
        hero: { eyebrow: "Our Company", title: "About Nam Việt Bình Dương Plastic", subtitle: "A Vietnam-based plastic manufacturer built on factory-direct pricing and dependable service for partners near and far." },
        story: {
          heading: "Our Story",
          p1: "[Replace with your company's real founding story.] Founded in Bình Dương Province — the heart of Vietnam's manufacturing region — Nam Việt Bình Dương Plastic grew from a small production workshop into a factory serving plastic packaging and product buyers across Asia.",
          p2: "Today, our team manufactures and exports directly from our own facility, with staff experienced in supporting Chinese- and Taiwanese-speaking clients from first inquiry through shipment."
        },
        mission: { title: "Our Mission", text: "To manufacture dependable, competitively priced plastic products to international standards, backed by responsive service for every order, large or small." },
        vision: { title: "Our Vision", text: "To become a long-term manufacturing partner of choice for buyers across China, Taiwan, and the wider Asia-Pacific region." },
        values: {
          heading: "What Guides Us", subheading: "The standards we hold ourselves to on every order.",
          value1Title: "Quality First", value1Desc: "Every batch is checked against agreed specifications before it leaves the factory.",
          value2Title: "Reliable Partnership", value2Desc: "Clear communication, honest lead times, and consistent supply — order after order.",
          value3Title: "Sustainable Production", value3Desc: "Responsible material sourcing and growing use of recycled inputs across our lines."
        },
        stats: { years: "Years in Operation", factory: "Factory Area", capacity: "Monthly Capacity", countries: "Export Markets" },
        team: { heading: "Our People", text: "Our production, quality-control, and export sales teams work side by side at our Bình Dương facility — [add team photos/bios here if you'd like to introduce them]." }
      },

      products: {
        meta: { title: "Products — Nam Việt Bình Dương Plastic", desc: "Explore our plastic packaging, injection-molded products, recycled granules, and OEM/ODM manufacturing services." },
        hero: { eyebrow: "Our Products", title: "Manufactured In-House, Built To Your Spec", subtitle: "Four product lines produced at our Bình Dương factory, each customizable for size, material, color, and packaging." },
        cat1: {
          title: "Packaging Bags & Films", desc: "PE, PP, HDPE, and LDPE bags and rolled film for retail, industrial, and agricultural packaging.",
          spec1: "Material: PE / PP / HDPE / LDPE", spec2: "Thickness: customizable on request", spec3: "Sizes & printing: made to order", spec4: "Packing: bulk or retail-ready"
        },
        cat2: {
          title: "Injection-Molded Products", desc: "Household and industrial plastic components, crates, containers, and parts molded to your drawings.",
          spec1: "Material: PP / PE / ABS / PS and more", spec2: "Custom mold development available", spec3: "Color matching on request", spec4: "Suitable for retail & industrial use"
        },
        cat3: {
          title: "Recycled Granules & Pellets", desc: "Reclaimed and compounded plastic resin, processed for consistent quality in downstream manufacturing.",
          spec1: "Types: PE / PP / ABS regrind & pellets", spec2: "Sorted, washed, and compounded", spec3: "Consistent melt-flow index per batch", spec4: "Bulk bag or container loading"
        },
        cat4: {
          title: "OEM / ODM Manufacturing", desc: "Private-label products, custom molds, and tailored formulations built around your brand and market.",
          spec1: "Custom mold & tooling development", spec2: "Private-label printing & packaging", spec3: "Formulation adjustments on request", spec4: "Trial orders before mass production"
        },
        requestSpecs: "Request Specifications",
        process: {
          heading: "How OEM / ODM Orders Work", subheading: "A straightforward path from inquiry to shipment.",
          step1Title: "Share Requirements", step1Desc: "Send us your specs, drawings, or a sample — in English, Vietnamese, or Chinese.",
          step2Title: "Samples & Quotation", step2Desc: "We confirm feasibility, provide samples, and quote pricing and lead time.",
          step3Title: "Mass Production", step3Desc: "Once confirmed, your order enters our production line with scheduled milestones.",
          step4Title: "QC & Shipping", step4Desc: "Every order passes pre-shipment inspection before export documentation and shipping."
        },
        cta: { heading: "Have a Product in Mind?", subheading: "Send us your specifications and we'll come back with pricing and lead time.", button: "Get a Quote" }
      },

      contact: {
        meta: { title: "Contact Us — Nam Việt Bình Dương Plastic", desc: "Get in touch with Nam Việt Bình Dương Plastic for pricing, samples, and OEM/ODM inquiries." },
        hero: { eyebrow: "Get In Touch", title: "Contact Our Team", subtitle: "Send your requirements and our bilingual sales team will reply with pricing and lead time." },
        info: {
          heading: "Contact Information",
          addressLabel: "Factory Address", addressValue: "[Factory address — Bình Dương Province, Vietnam]",
          phoneLabel: "Phone / Hotline", phoneValue: "[+84 xxx xxx xxx]",
          emailLabel: "Email", emailValue: "[sales@namvietbinhduongplastic.com]",
          hoursLabel: "Working Hours", hoursValue: "Mon–Sat, 8:00–17:30 (GMT+7)",
          wechatLabel: "WeChat", wechatValue: "[Add WeChat ID for Chinese/Taiwanese clients]",
          zaloLabel: "Zalo / WhatsApp", zaloValue: "[Add Zalo or WhatsApp number]"
        },
        form: {
          heading: "Send an Inquiry", subheading: "Fields marked * are required.",
          nameLabel: "Full Name *", namePlaceholder: "Your name",
          companyLabel: "Company Name", companyPlaceholder: "Your company",
          emailLabel: "Email *", emailPlaceholder: "you@company.com",
          phoneLabel: "Phone / WhatsApp", phonePlaceholder: "+xx xxx xxx xxx",
          countryLabel: "Country", countryPlaceholder: "e.g., China, Taiwan",
          productLabel: "Product of Interest",
          productOptionDefault: "Select a product line",
          messageLabel: "Message *", messagePlaceholder: "Tell us what you need: product type, quantity, target price, timeline...",
          submit: "Send Message",
          success: "Thank you! Your inquiry has been noted. (Connect this form to your email or CRM to receive real messages.)",
          requiredFeedback: "Please fill in this field."
        },
        map: { note: "Map placeholder — insert a Google Maps embed with your factory's real address here." }
      }
    },

    vi: {
      nav: { home: "Trang chủ", about: "Về chúng tôi", products: "Sản phẩm", contact: "Liên hệ", quote: "Yêu cầu báo giá" },
      brand: { name: "Nam Việt Bình Dương Plastic", sub: "Sản xuất & Xuất khẩu Nhựa" },
      draft: { banner: "Bản dựng thử — nội dung, hình ảnh và số liệu bên dưới chỉ là tạm, chờ hoàn thiện." },

      footer: {
        tagline: "Nhà sản xuất nhựa tại Bình Dương, Việt Nam, xuất khẩu trực tiếp cho khách hàng tại Trung Quốc, Đài Loan và châu Á.",
        quickLinks: "Liên kết nhanh",
        ourProducts: "Sản phẩm",
        contactUs: "Liên hệ",
        address: "[Địa chỉ nhà máy — Tỉnh Bình Dương, Việt Nam]",
        hoursValue: "Thứ 2–Thứ 7, 8:00–17:30 (GMT+7)",
        rights: "© 2026 Công ty TNHH Nam Việt Bình Dương Plastic. Bảo lưu mọi quyền."
      },

      markets: { cn: "Trung Quốc", tw: "Đài Loan", vn: "Việt Nam", kr: "Hàn Quốc", jp: "Nhật Bản", sg: "Singapore", my: "Malaysia", global: "Toàn cầu" },

      products_nav: {
        bags: "Túi & Màng bao bì",
        injection: "Sản phẩm nhựa ép phun",
        recycled: "Hạt nhựa tái sinh",
        oem: "Gia công OEM / ODM"
      },

      home: {
        meta: { title: "Nam Việt Bình Dương Plastic — Nhà sản xuất & xuất khẩu nhựa Việt Nam", desc: "Bao bì nhựa, sản phẩm ép phun và hạt nhựa tái sinh sản xuất trực tiếp tại nhà máy Bình Dương. Nhận gia công OEM/ODM xuất khẩu sang Trung Quốc, Đài Loan & châu Á." },
        hero: {
          eyebrow: "Nhà sản xuất nhựa trực tiếp từ nhà máy · Bình Dương, Việt Nam",
          title: "Sản xuất nhựa đáng tin cậy,<br>xuất khẩu từ Việt Nam ra thế giới.",
          subtitle: "Chúng tôi sản xuất và xuất khẩu bao bì nhựa, sản phẩm ép phun và hạt nhựa tái sinh trực tiếp từ nhà máy tại Bình Dương — cùng đội ngũ kinh doanh song ngữ giàu kinh nghiệm phục vụ khách hàng Trung Quốc và Đài Loan.",
          ctaQuote: "Yêu cầu báo giá",
          ctaProducts: "Xem sản phẩm",
          badge1: "Sản xuất kiểm soát chất lượng",
          badge2: "Nhận gia công OEM / ODM",
          panelHeading: "Sản phẩm của chúng tôi",
          tile1: "Túi bao bì", tile2: "Màng nhựa", tile3: "Linh kiện ép phun",
          tile4: "Hạt tái sinh", tile5: "OEM theo yêu cầu", tile6: "Sẵn sàng xuất khẩu",
          chip1: "Đã kiểm định chất lượng", chip2: "Xuất khẩu toàn cầu"
        },
        stats: { years: "Năm hoạt động", factory: "Diện tích nhà máy", capacity: "Sản lượng mỗi tháng", countries: "Thị trường xuất khẩu" },
        products: {
          heading: "Chúng tôi sản xuất gì",
          subheading: "Bốn dòng sản phẩm chính, tất cả sản xuất tại nhà máy Bình Dương.",
          card1Title: "Túi & Màng bao bì", card1Desc: "Túi và màng cuộn PE / PP / HDPE / LDPE với kích thước, độ dày theo yêu cầu.",
          card2Title: "Sản phẩm nhựa ép phun", card2Desc: "Linh kiện, sóng nhựa, thùng chứa cho dân dụng và công nghiệp theo bản vẽ khách hàng.",
          card3Title: "Hạt nhựa tái sinh", card3Desc: "Nhựa PE / PP / ABS thu hồi và phối trộn, xử lý theo tiêu chuẩn chất lượng ổn định.",
          card4Title: "Gia công OEM / ODM", card4Desc: "Khuôn mẫu riêng, công thức riêng và bao bì mang thương hiệu của bạn.",
          learnMore: "Xem thêm"
        },
        why: {
          heading: "Vì sao khách hàng chọn chúng tôi",
          subheading: "Dành cho khách hàng cần nguồn cung ổn định, không chỉ là một bản báo giá.",
          item1Title: "Giá trực tiếp từ nhà máy", item1Desc: "Không qua trung gian — mua trực tiếp từ dây chuyền sản xuất với giá gốc.",
          item2Title: "Kiểm soát chất lượng nghiêm ngặt", item2Desc: "Kiểm tra nguyên liệu đầu vào, giám sát trong dây chuyền và QC trước khi giao hàng.",
          item3Title: "MOQ linh hoạt & tùy chỉnh", item3Desc: "Từ đơn hàng thử đến cả container, với màu sắc, kích thước và in ấn theo yêu cầu.",
          item4Title: "Kinh nghiệm xuất khẩu sang Trung Quốc & Đài Loan", item4Desc: "Đội ngũ kinh doanh và logistics song ngữ hiểu cách làm việc của bạn."
        },
        cert: {
          heading: "Chất lượng đáng tin cậy",
          subheading: "[Thay bằng các chứng nhận và báo cáo kiểm định thực tế của nhà máy]",
          item1: "ISO 9001:2015", item1Note: "Hệ thống quản lý chất lượng",
          item2: "ISO 14001", item2Note: "Hệ thống quản lý môi trường",
          item3: "REACH / RoHS", item3Note: "Đạt chuẩn cho thị trường EU & xuất khẩu",
          item4: "Sẵn sàng kiểm tra nhà máy", item4Note: "Hỗ trợ khách hàng & bên thứ ba đến kiểm tra"
        },
        marketsSection: {
          heading: "Được tin dùng khắp châu Á",
          subheading: "Hiện đang xuất khẩu đến các thị trường sau — [cập nhật theo danh sách khách hàng thực tế]."
        },
        cta: {
          heading: "Đang tìm nhà cung cấp nhựa đáng tin cậy?",
          subheading: "Cho chúng tôi biết nhu cầu của bạn — đội ngũ sẽ phản hồi giá và thời gian giao hàng trong 1–2 ngày làm việc.",
          button: "Liên hệ đội kinh doanh"
        }
      },

      about: {
        meta: { title: "Về chúng tôi — Nam Việt Bình Dương Plastic", desc: "Tìm hiểu về nhà máy, sứ mệnh và đội ngũ của Nam Việt Bình Dương Plastic." },
        hero: { eyebrow: "Về công ty", title: "Về Nam Việt Bình Dương Plastic", subtitle: "Nhà sản xuất nhựa tại Việt Nam, xây dựng trên nền tảng giá trực tiếp từ nhà máy và dịch vụ đáng tin cậy." },
        story: {
          heading: "Câu chuyện của chúng tôi",
          p1: "[Thay bằng câu chuyện thành lập thực tế của công ty.] Được thành lập tại tỉnh Bình Dương — trung tâm sản xuất công nghiệp của Việt Nam — Nam Việt Bình Dương Plastic phát triển từ một cơ sở sản xuất nhỏ thành nhà máy phục vụ khách hàng bao bì và sản phẩm nhựa trên khắp châu Á.",
          p2: "Ngày nay, chúng tôi sản xuất và xuất khẩu trực tiếp từ nhà máy của mình, với đội ngũ có kinh nghiệm hỗ trợ khách hàng nói tiếng Trung và tiếng Đài Loan từ khâu hỏi hàng đến khi giao hàng."
        },
        mission: { title: "Sứ mệnh", text: "Sản xuất các sản phẩm nhựa đáng tin cậy, giá cả cạnh tranh theo tiêu chuẩn quốc tế, cùng dịch vụ phản hồi nhanh cho mọi đơn hàng." },
        vision: { title: "Tầm nhìn", text: "Trở thành đối tác sản xuất lâu dài được tin chọn bởi khách hàng tại Trung Quốc, Đài Loan và khu vực châu Á - Thái Bình Dương." },
        values: {
          heading: "Giá trị cốt lõi", subheading: "Tiêu chuẩn chúng tôi tự đặt ra cho mỗi đơn hàng.",
          value1Title: "Chất lượng hàng đầu", value1Desc: "Mỗi lô hàng được kiểm tra theo đúng thông số trước khi rời nhà máy.",
          value2Title: "Đối tác đáng tin cậy", value2Desc: "Trao đổi rõ ràng, thời gian giao hàng trung thực và nguồn cung ổn định qua từng đơn hàng.",
          value3Title: "Sản xuất bền vững", value3Desc: "Thu mua nguyên liệu có trách nhiệm và tăng dần tỷ lệ sử dụng nguyên liệu tái sinh."
        },
        stats: { years: "Năm hoạt động", factory: "Diện tích nhà máy", capacity: "Sản lượng mỗi tháng", countries: "Thị trường xuất khẩu" },
        team: { heading: "Con người của chúng tôi", text: "Đội ngũ sản xuất, kiểm soát chất lượng và kinh doanh xuất khẩu cùng làm việc tại nhà máy Bình Dương — [thêm ảnh/giới thiệu đội ngũ tại đây nếu muốn]." }
      },

      products: {
        meta: { title: "Sản phẩm — Nam Việt Bình Dương Plastic", desc: "Khám phá bao bì nhựa, sản phẩm ép phun, hạt nhựa tái sinh và dịch vụ gia công OEM/ODM." },
        hero: { eyebrow: "Sản phẩm", title: "Sản xuất tại nhà máy, theo đúng yêu cầu của bạn", subtitle: "Bốn dòng sản phẩm sản xuất tại nhà máy Bình Dương, có thể tùy chỉnh kích thước, chất liệu, màu sắc và đóng gói." },
        cat1: {
          title: "Túi & Màng bao bì", desc: "Túi và màng cuộn PE, PP, HDPE, LDPE dùng cho bao bì bán lẻ, công nghiệp và nông nghiệp.",
          spec1: "Chất liệu: PE / PP / HDPE / LDPE", spec2: "Độ dày: tùy chỉnh theo yêu cầu", spec3: "Kích thước & in ấn: theo đơn hàng", spec4: "Đóng gói: dạng thùng lớn hoặc bán lẻ"
        },
        cat2: {
          title: "Sản phẩm nhựa ép phun", desc: "Linh kiện, sóng nhựa, thùng chứa cho dân dụng và công nghiệp, đúc theo bản vẽ của bạn.",
          spec1: "Chất liệu: PP / PE / ABS / PS và nhiều loại khác", spec2: "Hỗ trợ phát triển khuôn riêng", spec3: "Pha màu theo yêu cầu", spec4: "Phù hợp cho bán lẻ & công nghiệp"
        },
        cat3: {
          title: "Hạt nhựa tái sinh", desc: "Nhựa PE / PP / ABS thu hồi và phối trộn, xử lý để đạt chất lượng ổn định cho sản xuất tiếp theo.",
          spec1: "Loại: hạt & nghiền tái sinh PE / PP / ABS", spec2: "Phân loại, làm sạch và phối trộn", spec3: "Chỉ số chảy ổn định theo từng lô", spec4: "Đóng bao lớn hoặc theo container"
        },
        cat4: {
          title: "Gia công OEM / ODM", desc: "Sản phẩm mang thương hiệu riêng, khuôn mẫu và công thức tùy chỉnh theo thương hiệu và thị trường của bạn.",
          spec1: "Phát triển khuôn & công cụ riêng", spec2: "In ấn & đóng gói theo thương hiệu riêng", spec3: "Điều chỉnh công thức theo yêu cầu", spec4: "Đơn hàng thử trước khi sản xuất đại trà"
        },
        requestSpecs: "Yêu cầu thông số kỹ thuật",
        process: {
          heading: "Quy trình gia công OEM / ODM", subheading: "Một lộ trình rõ ràng từ hỏi hàng đến giao hàng.",
          step1Title: "Chia sẻ yêu cầu", step1Desc: "Gửi thông số, bản vẽ hoặc mẫu — bằng tiếng Anh, tiếng Việt hoặc tiếng Trung.",
          step2Title: "Mẫu & báo giá", step2Desc: "Chúng tôi xác nhận khả năng sản xuất, gửi mẫu và báo giá cùng thời gian giao hàng.",
          step3Title: "Sản xuất đại trà", step3Desc: "Sau khi xác nhận, đơn hàng vào dây chuyền sản xuất theo tiến độ đã thống nhất.",
          step4Title: "Kiểm tra chất lượng & giao hàng", step4Desc: "Mọi đơn hàng đều được kiểm tra trước khi hoàn tất chứng từ và giao hàng."
        },
        cta: { heading: "Đã có sản phẩm cần sản xuất?", subheading: "Gửi thông số kỹ thuật cho chúng tôi để nhận báo giá và thời gian giao hàng.", button: "Nhận báo giá" }
      },

      contact: {
        meta: { title: "Liên hệ — Nam Việt Bình Dương Plastic", desc: "Liên hệ Nam Việt Bình Dương Plastic để được báo giá, gửi mẫu và tư vấn gia công OEM/ODM." },
        hero: { eyebrow: "Liên hệ", title: "Liên hệ đội ngũ của chúng tôi", subtitle: "Gửi yêu cầu của bạn, đội kinh doanh song ngữ sẽ phản hồi giá và thời gian giao hàng." },
        info: {
          heading: "Thông tin liên hệ",
          addressLabel: "Địa chỉ nhà máy", addressValue: "[Địa chỉ nhà máy — Tỉnh Bình Dương, Việt Nam]",
          phoneLabel: "Điện thoại / Hotline", phoneValue: "[+84 xxx xxx xxx]",
          emailLabel: "Email", emailValue: "[sales@namvietbinhduongplastic.com]",
          hoursLabel: "Giờ làm việc", hoursValue: "Thứ 2–Thứ 7, 8:00–17:30 (GMT+7)",
          wechatLabel: "WeChat", wechatValue: "[Thêm WeChat ID cho khách Trung Quốc/Đài Loan]",
          zaloLabel: "Zalo / WhatsApp", zaloValue: "[Thêm số Zalo hoặc WhatsApp]"
        },
        form: {
          heading: "Gửi yêu cầu", subheading: "Các mục có * là bắt buộc.",
          nameLabel: "Họ và tên *", namePlaceholder: "Tên của bạn",
          companyLabel: "Tên công ty", companyPlaceholder: "Công ty của bạn",
          emailLabel: "Email *", emailPlaceholder: "you@company.com",
          phoneLabel: "Điện thoại / WhatsApp", phonePlaceholder: "+xx xxx xxx xxx",
          countryLabel: "Quốc gia", countryPlaceholder: "VD: Trung Quốc, Đài Loan",
          productLabel: "Sản phẩm quan tâm",
          productOptionDefault: "Chọn dòng sản phẩm",
          messageLabel: "Nội dung *", messagePlaceholder: "Cho chúng tôi biết bạn cần gì: loại sản phẩm, số lượng, giá mục tiêu, thời gian...",
          submit: "Gửi liên hệ",
          success: "Cảm ơn bạn! Yêu cầu đã được ghi nhận. (Kết nối form này với email hoặc CRM để nhận tin nhắn thật.)",
          requiredFeedback: "Vui lòng điền vào mục này."
        },
        map: { note: "Vị trí bản đồ — chèn Google Maps với địa chỉ thật của nhà máy tại đây." }
      }
    },

    zh: {
      nav: { home: "首页", about: "关于我们", products: "产品", contact: "联系我们", quote: "获取报价" },
      brand: { name: "Nam Việt Bình Dương Plastic", sub: "塑料生产与出口" },
      draft: { banner: "网站草稿预览——以下文字、图片及数据均为占位内容，待最终确认后更新。" },

      footer: {
        tagline: "总部位于越南平阳省的塑料直营生产厂，产品出口至中国、台湾及亚洲各地客户。",
        quickLinks: "快速链接",
        ourProducts: "我们的产品",
        contactUs: "联系我们",
        address: "【工厂地址 — 越南平阳省】",
        hoursValue: "周一至周六 8:00–17:30（GMT+7）",
        rights: "© 2026 Nam Việt Bình Dương Plastic 有限公司。保留所有权利。"
      },

      markets: { cn: "中国", tw: "台湾", vn: "越南", kr: "韩国", jp: "日本", sg: "新加坡", my: "马来西亚", global: "全球" },

      products_nav: {
        bags: "包装袋与薄膜",
        injection: "注塑成型产品",
        recycled: "再生塑料粒子",
        oem: "OEM / ODM 代工"
      },

      home: {
        meta: { title: "Nam Việt Bình Dương Plastic — 越南塑料生产与出口厂商", desc: "越南平阳工厂直营生产塑料包装袋、注塑产品及再生塑料粒子，支持 OEM/ODM 代工，产品出口中国、台湾及亚洲各地。" },
        hero: {
          eyebrow: "工厂直营塑料生产商 · 越南平阳省",
          title: "可靠的塑料生产，<br>从越南直达全球。",
          subtitle: "我们在平阳自有工厂直接生产并出口塑料包装、注塑产品和再生塑料粒子，销售团队具备服务中国及台湾客户的双语沟通经验。",
          ctaQuote: "获取报价",
          ctaProducts: "查看产品",
          badge1: "质量受控生产",
          badge2: "支持 OEM / ODM 代工",
          panelHeading: "我们的产品线",
          tile1: "包装袋", tile2: "塑料薄膜", tile3: "注塑件",
          tile4: "再生粒子", tile5: "定制代工", tile6: "随时可出口",
          chip1: "已通过质检", chip2: "全球出口"
        },
        stats: { years: "运营年限", factory: "工厂面积", capacity: "月生产能力", countries: "出口市场" },
        products: {
          heading: "我们生产什么",
          subheading: "四大核心产品线，均在平阳工厂自主生产。",
          card1Title: "包装袋与薄膜", card1Desc: "PE / PP / HDPE / LDPE 包装袋及卷膜，尺寸与厚度可定制。",
          card2Title: "注塑成型产品", card2Desc: "按客户图纸生产的家用及工业塑料零件、周转箱与容器。",
          card3Title: "再生塑料粒子", card3Desc: "回收并复配的 PE / PP / ABS 塑料原料，品质稳定统一。",
          card4Title: "OEM / ODM 代工", card4Desc: "根据您的品牌与市场定制模具、配方及自有品牌包装。",
          learnMore: "了解更多"
        },
        why: {
          heading: "客户选择我们的理由",
          subheading: "为需要稳定供应而不仅是一份报价的采购商而生。",
          item1Title: "工厂直营价格", item1Desc: "无中间商，直接从生产线以出厂价采购。",
          item2Title: "严格质量管控", item2Desc: "原料进厂检验、生产线巡检，每批订单出货前均经品检。",
          item3Title: "灵活起订量与定制", item3Desc: "从小批量试单到整柜订单，颜色、尺寸、印刷均可定制。",
          item4Title: "熟悉中国与台湾出口业务", item4Desc: "双语销售与物流团队，了解您的合作习惯。"
        },
        cert: {
          heading: "值得信赖的品质",
          subheading: "【请替换为工厂真实的认证证书及审核报告】",
          item1: "ISO 9001:2015", item1Note: "质量管理体系",
          item2: "ISO 14001", item2Note: "环境管理体系",
          item3: "REACH / RoHS", item3Note: "符合欧盟及出口市场标准",
          item4: "支持工厂验厂", item4Note: "接受客户及第三方实地审核"
        },
        marketsSection: {
          heading: "深受亚洲客户信赖",
          subheading: "目前已出口至以下市场——【请更新为实际客户所在国家】。"
        },
        cta: {
          heading: "正在寻找可靠的塑料供应商？",
          subheading: "告诉我们您的需求，我们的团队将在 1–2 个工作日内回复报价及交期。",
          button: "联系销售团队"
        }
      },

      about: {
        meta: { title: "关于我们 — Nam Việt Bình Dương Plastic", desc: "了解 Nam Việt Bình Dương Plastic 的工厂、使命及背后的团队。" },
        hero: { eyebrow: "公司简介", title: "关于 Nam Việt Bình Dương Plastic", subtitle: "立足越南的塑料生产厂商，以工厂直营价格与稳定服务为客户提供保障。" },
        story: {
          heading: "我们的故事",
          p1: "【请替换为公司真实的创立故事。】公司创立于越南制造业核心地区——平阳省，从一个小型生产作坊逐步发展成为服务全亚洲塑料包装及产品采购商的生产工厂。",
          p2: "如今，我们的团队直接在自有工厂生产并出口，员工具备从询价到交货全程支持中文及台湾客户的经验。"
        },
        mission: { title: "使命", text: "以符合国际标准的可靠品质与有竞争力的价格生产塑料产品，为每一份订单提供及时响应的服务。" },
        vision: { title: "愿景", text: "成为中国、台湾及亚太地区客户长期信赖的生产合作伙伴。" },
        values: {
          heading: "我们坚持的原则", subheading: "我们对每一笔订单坚守的标准。",
          value1Title: "品质第一", value1Desc: "每批产品出厂前均按约定规格检验合格。",
          value2Title: "可靠的合作伙伴", value2Desc: "沟通清晰、交期诚实，每一笔订单都保持稳定供应。",
          value3Title: "可持续生产", value3Desc: "负责任地采购原料，并逐步提高再生原料的使用比例。"
        },
        stats: { years: "运营年限", factory: "工厂面积", capacity: "月生产能力", countries: "出口市场" },
        team: { heading: "我们的团队", text: "生产、品控与出口业务团队在平阳工厂并肩工作——【如需介绍团队，可在此添加照片或简介】。" }
      },

      products: {
        meta: { title: "产品 — Nam Việt Bình Dương Plastic", desc: "了解我们的塑料包装、注塑产品、再生塑料粒子及 OEM/ODM 代工服务。" },
        hero: { eyebrow: "我们的产品", title: "自主生产，按需定制", subtitle: "四大产品线均在平阳工厂生产，尺寸、材质、颜色及包装均可定制。" },
        cat1: {
          title: "包装袋与薄膜", desc: "适用于零售、工业及农业包装的 PE、PP、HDPE、LDPE 包装袋及卷膜。",
          spec1: "材质：PE / PP / HDPE / LDPE", spec2: "厚度：可按需定制", spec3: "尺寸与印刷：按订单定制", spec4: "包装：散装或零售包装"
        },
        cat2: {
          title: "注塑成型产品", desc: "按客户图纸生产的家用及工业塑料零件、周转箱与容器。",
          spec1: "材质：PP / PE / ABS / PS 等多种材料", spec2: "支持定制模具开发", spec3: "可按需调色", spec4: "适用于零售与工业场景"
        },
        cat3: {
          title: "再生塑料粒子", desc: "回收并复配的 PE / PP / ABS 原料，经处理后品质稳定，可用于后续生产。",
          spec1: "类型：PE / PP / ABS 再生粒子及粉料", spec2: "经分类、清洗及复配处理", spec3: "每批次熔融指数稳定", spec4: "支持散装袋或整柜装运"
        },
        cat4: {
          title: "OEM / ODM 代工", desc: "根据您的品牌与市场定制模具、配方及自有品牌包装的产品。",
          spec1: "定制模具与工具开发", spec2: "自有品牌印刷与包装", spec3: "可按需调整配方", spec4: "量产前可先行试产"
        },
        requestSpecs: "索取技术规格",
        process: {
          heading: "OEM / ODM 代工流程", subheading: "从询价到交货，流程清晰透明。",
          step1Title: "提交需求", step1Desc: "以中文、英文或越南语发送规格、图纸或样品。",
          step2Title: "样品与报价", step2Desc: "我们确认可行性，提供样品并给出报价与交期。",
          step3Title: "批量生产", step3Desc: "确认后订单进入生产线，按既定进度排产。",
          step4Title: "质检与发货", step4Desc: "每笔订单出货前均经检验，随后完成出口单据与发货。"
        },
        cta: { heading: "已有产品需求？", subheading: "发送您的技术规格，我们将回复报价及交期。", button: "获取报价" }
      },

      contact: {
        meta: { title: "联系我们 — Nam Việt Bình Dương Plastic", desc: "联系 Nam Việt Bình Dương Plastic，获取报价、样品及 OEM/ODM 代工咨询。" },
        hero: { eyebrow: "联系我们", title: "联系我们的团队", subtitle: "发送您的需求，双语销售团队将回复报价及交期。" },
        info: {
          heading: "联系方式",
          addressLabel: "工厂地址", addressValue: "【工厂地址 — 越南平阳省】",
          phoneLabel: "电话 / 热线", phoneValue: "【+84 xxx xxx xxx】",
          emailLabel: "邮箱", emailValue: "【sales@namvietbinhduongplastic.com】",
          hoursLabel: "工作时间", hoursValue: "周一至周六 8:00–17:30（GMT+7）",
          wechatLabel: "微信", wechatValue: "【请添加微信号，方便中国/台湾客户联系】",
          zaloLabel: "Zalo / WhatsApp", zaloValue: "【请添加 Zalo 或 WhatsApp 号码】"
        },
        form: {
          heading: "发送询盘", subheading: "标有 * 的为必填项。",
          nameLabel: "姓名 *", namePlaceholder: "您的姓名",
          companyLabel: "公司名称", companyPlaceholder: "您的公司",
          emailLabel: "邮箱 *", emailPlaceholder: "you@company.com",
          phoneLabel: "电话 / WhatsApp", phonePlaceholder: "+xx xxx xxx xxx",
          countryLabel: "国家", countryPlaceholder: "例如：中国、台湾",
          productLabel: "感兴趣的产品",
          productOptionDefault: "请选择产品线",
          messageLabel: "留言内容 *", messagePlaceholder: "请告诉我们您的需求：产品类型、数量、目标价格、交期等",
          submit: "发送信息",
          success: "感谢您的留言！我们已收到您的询盘。（请将此表单连接至邮箱或 CRM 以接收真实留言。）",
          requiredFeedback: "请填写此字段。"
        },
        map: { note: "地图占位——请在此处嵌入包含工厂真实地址的 Google 地图。" }
      }
    }
  };

  window.NVBD_I18N = I18N;

  function getPath(obj, path) {
    return path.split(".").reduce(function (acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  }

  function getLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && I18N[saved]) return saved;
    } catch (e) { /* localStorage unavailable */ }
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    applyLang(lang);
  }

  function applyLang(lang) {
    var dict = I18N[lang] || I18N[DEFAULT_LANG];
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = getPath(dict, el.getAttribute("data-i18n"));
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var value = getPath(dict, el.getAttribute("data-i18n-html"));
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var value = getPath(dict, el.getAttribute("data-i18n-placeholder"));
      if (value !== undefined) el.setAttribute("placeholder", value);
    });

    var titleKey = document.body.getAttribute("data-meta-title");
    var descKey = document.body.getAttribute("data-meta-desc");
    if (titleKey) {
      var titleValue = getPath(dict, titleKey);
      if (titleValue !== undefined) document.title = titleValue;
    }
    if (descKey) {
      var descValue = getPath(dict, descKey);
      var metaTag = document.querySelector('meta[name="description"]');
      if (descValue !== undefined && metaTag) metaTag.setAttribute("content", descValue);
    }

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setupLangSwitch() {
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupLangSwitch();
    applyLang(getLang());
  });
})();
