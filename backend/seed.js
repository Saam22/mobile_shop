const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Employee = require('./models/Employee');
const Expense = require('./models/Expense');
const Maintenance = require('./models/Maintenance');
const Wallet = require('./models/Wallet');
const Sale = require('./models/Sale');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop';

// ==================== CUSTOMERS ====================
const customersData = [
    { name: 'أحمد محمد علي', phone: '01012345678', address: 'القاهرة - المعادي - شارع 9', nationalId: '29001011234567', notes: 'عميل دائم', totalPurchases: 45000, totalDebt: 0 },
    { name: 'سارة عبد الرحمن', phone: '01098765432', address: 'الجيزة - الدقي - شارع التحرير', nationalId: '29205151234567', notes: '', totalPurchases: 28000, totalDebt: 3500 },
    { name: 'محمد حسين إبراهيم', phone: '01123456789', address: 'الإسكندرية - سيدي جابر', nationalId: '28803011234567', notes: 'يحب آبل', totalPurchases: 67000, totalDebt: 0 },
    { name: 'فاطمة حسن أحمد', phone: '01087654321', address: 'القاهرة - مدينة نصر - شارع مصطفى النحاس', nationalId: '29508201234567', notes: '', totalPurchases: 15000, totalDebt: 2000 },
    { name: 'عمر خالد محمود', phone: '01156789012', address: 'المنصورة - شارع الجيش', nationalId: '29102251234567', notes: 'يشتري بالقسط', totalPurchases: 32000, totalDebt: 8000 },
    { name: 'نورهان سعيد', phone: '01034567890', address: 'القاهرة - الزمالك - شارع 26 يوليو', nationalId: '29306301234567', notes: '', totalPurchases: 12000, totalDebt: 0 },
    { name: 'حسن مصطفى عبده', phone: '01198765432', address: 'طنطا - شارع سعيد', nationalId: '28707151234567', notes: 'عميل جملة', totalPurchases: 95000, totalDebt: 0 },
    { name: 'ياسمين أحمد فتحي', phone: '01065432109', address: 'الجيزة - الشيخ زايد -Monadouh', nationalId: '29404101234567', notes: '', totalPurchases: 22000, totalDebt: 1500 },
    { name: 'إبراهيم ناصر', phone: '01112345678', address: 'أسوان - شارع كورنيش النيل', nationalId: '28901121234567', notes: '', totalPurchases: 8000, totalDebt: 0 },
    { name: 'منى حسام الدين', phone: '01023456789', address: 'القاهرة - حلوان - شارع عبده', nationalId: '29602281234567', notes: 'تحب الألوان الزاهية', totalPurchases: 18000, totalDebt: 5000 },
    { name: 'كريم عبد الفتاح', phone: '01134567890', address: 'الإسكندرية - سيدي بشر', nationalId: '29005101234567', notes: '', totalPurchases: 41000, totalDebt: 0 },
    { name: 'هدى محمد جمال', phone: '01045678901', address: 'بني سويف - شارع الم第一名', nationalId: '29109011234567', notes: '', totalPurchases: 9500, totalDebt: 0 },
    { name: 'مصطفى عادل', phone: '01156789013', address: 'القاهرة - شبرا - شارع الهرم', nationalId: '28808151234567', notes: 'يحب الهواتف الصينية', totalPurchases: 25000, totalDebt: 0 },
    { name: 'رنا شريف', phone: '01067890123', address: 'القاهرة الجديدة - التجمع الخامس', nationalId: '29301251234567', notes: '', totalPurchases: 55000, totalDebt: 0 },
    { name: 'أحمد سمير', phone: '01178901234', address: 'القاهرة الجديدة - التجمع الخامس', nationalId: '29206151234567', notes: 'يفضل سامسونج', totalPurchases: 38000, totalDebt: 0 },
];

// ==================== PRODUCTS ====================
const productsData = [
    // --- موبايلات جديدة ---
    { name: 'iPhone 15 Pro Max 256GB', code: 'MOB-001', barcode: '1942536789012', category: 'mobile_new', supplier: 'أندلس للموبايلات', purchasePrice: 52000, sellingPrice: 58000, minSellingPrice: 55000, quantity: 5, alertQuantity: 2, brand: 'Apple', model: 'iPhone 15 Pro Max', color: 'تيتانيم بلّو', storage: '256GB', imei1: '353456789012345', imei2: '353456789012346', condition: 'new', purchaseDate: new Date('2025-12-15') },
    { name: 'iPhone 15 128GB', code: 'MOB-002', barcode: '1942536789013', category: 'mobile_new', supplier: 'أندلس للموبايلات', purchasePrice: 36000, sellingPrice: 40000, minSellingPrice: 38000, quantity: 8, alertQuantity: 2, brand: 'Apple', model: 'iPhone 15', color: 'أسود', storage: '128GB', imei1: '353456789012347', imei2: '353456789012348', condition: 'new', purchaseDate: new Date('2025-12-20') },
    { name: 'Samsung Galaxy S24 Ultra 512GB', code: 'MOB-003', barcode: '8806085432109', category: 'mobile_new', supplier: 'سمسونج مصر', purchasePrice: 48000, sellingPrice: 54000, minSellingPrice: 51000, quantity: 4, alertQuantity: 2, brand: 'Samsung', model: 'Galaxy S24 Ultra', color: 'titanium gray', storage: '512GB', imei1: '356789012345678', imei2: '356789012345679', condition: 'new', purchaseDate: new Date('2026-01-05') },
    { name: 'Samsung Galaxy A55 128GB', code: 'MOB-004', barcode: '8806085432110', category: 'mobile_new', supplier: 'سمسونج مصر', purchasePrice: 12000, sellingPrice: 14500, minSellingPrice: 13500, quantity: 12, alertQuantity: 3, brand: 'Samsung', model: 'Galaxy A55', color: 'أزرق', storage: '128GB', imei1: '356789012345680', imei2: '356789012345681', condition: 'new', purchaseDate: new Date('2026-01-10') },
    { name: 'Xiaomi Redmi Note 13 Pro 256GB', code: 'MOB-005', barcode: '6941812756340', category: 'mobile_new', supplier: 'شاومي مصر', purchasePrice: 8500, sellingPrice: 10500, minSellingPrice: 9800, quantity: 15, alertQuantity: 5, brand: 'Xiaomi', model: 'Redmi Note 13 Pro', color: 'أسود', storage: '256GB', imei1: '862345678901234', imei2: '862345678901235', condition: 'new', purchaseDate: new Date('2026-01-15') },
    { name: 'OPPO Reno 11 256GB', code: 'MOB-006', barcode: '6934567890123', category: 'mobile_new', supplier: 'oppo مصر', purchasePrice: 14000, sellingPrice: 16500, minSellingPrice: 15500, quantity: 6, alertQuantity: 2, brand: 'OPPO', model: 'Reno 11', color: 'أخضر', storage: '256GB', imei1: '868901234567890', imei2: '868901234567891', condition: 'new', purchaseDate: new Date('2026-02-01') },
    { name: 'Realme 12 Pro 256GB', code: 'MOB-007', barcode: '6935678901234', category: 'mobile_new', supplier: 'Realme مصر', purchasePrice: 11000, sellingPrice: 13000, minSellingPrice: 12000, quantity: 7, alertQuantity: 3, brand: 'Realme', model: '12 Pro', color: 'ذهبي', storage: '256GB', imei1: '865678901234567', imei2: '865678901234568', condition: 'new', purchaseDate: new Date('2026-02-05') },
    { name: 'iPhone 14 128GB', code: 'MOB-008', barcode: '1942536789014', category: 'mobile_new', supplier: 'أندلس للموبايلات', purchasePrice: 30000, sellingPrice: 34000, minSellingPrice: 32000, quantity: 10, alertQuantity: 3, brand: 'Apple', model: 'iPhone 14', color: 'أبيض', storage: '128GB', imei1: '353456789012349', imei2: '353456789012350', condition: 'new', purchaseDate: new Date('2026-01-25') },

    // --- موبايلات مستعملة ---
    { name: 'iPhone 13 Pro 128GB - مستعمل', code: 'MOB-U01', barcode: '1942536789015', category: 'mobile_used', supplier: 'استيراد شخصي', purchasePrice: 18000, sellingPrice: 23000, minSellingPrice: 21000, quantity: 3, alertQuantity: 1, brand: 'Apple', model: 'iPhone 13 Pro', color: 'جبلية خضراء', storage: '128GB', imei1: '353456789012351', imei2: '353456789012352', condition: 'used', purchaseDate: new Date('2026-01-20') },
    { name: 'Samsung Galaxy S23 256GB - مستعمل', code: 'MOB-U02', barcode: '8806085432111', category: 'mobile_used', supplier: 'استيراد شخصي', purchasePrice: 15000, sellingPrice: 19000, minSellingPrice: 17500, quantity: 4, alertQuantity: 1, brand: 'Samsung', model: 'Galaxy S23', color: 'أسود', storage: '256GB', imei1: '356789012345682', imei2: '356789012345683', condition: 'used', purchaseDate: new Date('2026-02-01') },
    { name: 'iPhone 12 64GB - مستعمل', code: 'MOB-U03', barcode: '1942536789016', category: 'mobile_used', supplier: 'استيراد شخصي', purchasePrice: 10000, sellingPrice: 14000, minSellingPrice: 12500, quantity: 6, alertQuantity: 2, brand: 'Apple', model: 'iPhone 12', color: 'أزرق', storage: '64GB', imei1: '353456789012353', imei2: '353456789012354', condition: 'used', purchaseDate: new Date('2026-02-10') },
    { name: 'Xiaomi Redmi Note 12 - مستعمل', code: 'MOB-U04', barcode: '6941812756341', category: 'mobile_used', supplier: 'استيراد شخصي', purchasePrice: 4000, sellingPrice: 6000, minSellingPrice: 5500, quantity: 5, alertQuantity: 2, brand: 'Xiaomi', model: 'Redmi Note 12', color: 'أسود', storage: '128GB', imei1: '862345678901236', imei2: '862345678901237', condition: 'used', purchaseDate: new Date('2026-02-15') },

    // --- شواحن ---
    { name: 'شاحن أبل 20W USB-C', code: 'ACC-001', barcode: '1940000000001', category: 'charger', supplier: 'الم输出 forييات', purchasePrice: 250, sellingPrice: 450, minSellingPrice: 350, quantity: 30, alertQuantity: 10 },
    { name: 'شاحن سامسونج 25W سوبري فاست', code: 'ACC-002', barcode: '1940000000002', category: 'charger', supplier: 'الم输出 forييات', purchasePrice: 300, sellingPrice: 500, minSellingPrice: 400, quantity: 25, alertQuantity: 10 },
    { name: 'شاحن لاسلكي MagSafe', code: 'ACC-003', barcode: '1940000000003', category: 'charger', supplier: 'علي أكسبريس', purchasePrice: 400, sellingPrice: 700, minSellingPrice: 600, quantity: 15, alertQuantity: 5 },
    { name: 'شاحن 3 في 1 MagSafe', code: 'ACC-004', barcode: '1940000000004', category: 'charger', supplier: 'علي أكسبريس', purchasePrice: 600, sellingPrice: 1000, minSellingPrice: 850, quantity: 10, alertQuantity: 3 },
    { name: 'شاحن باورבנק 10000mAh', code: 'ACC-005', barcode: '1940000000005', category: 'powerbank', supplier: 'علي أكسبريس', purchasePrice: 350, sellingPrice: 600, minSellingPrice: 500, quantity: 20, alertQuantity: 5 },

    // --- كابلات ---
    { name: 'كابل USB-C to Lightning', code: 'CAB-001', barcode: '1940000000010', category: 'cable', supplier: 'الم输出 forييات', purchasePrice: 80, sellingPrice: 150, minSellingPrice: 120, quantity: 50, alertQuantity: 15 },
    { name: 'كابل USB-C to USB-C 100W', code: 'CAB-002', barcode: '1940000000011', category: 'cable', supplier: 'الم输出 forييات', purchasePrice: 120, sellingPrice: 220, minSellingPrice: 180, quantity: 40, alertQuantity: 15 },
    { name: 'كابل Micro USB', code: 'CAB-003', barcode: '1940000000012', category: 'cable', supplier: 'الم输出 forييات', purchasePrice: 40, sellingPrice: 80, minSellingPrice: 60, quantity: 60, alertQuantity: 20 },
    { name: 'كابل Lightning معدني', code: 'CAB-004', barcode: '1940000000013', category: 'cable', supplier: 'علي أكسبريس', purchasePrice: 150, sellingPrice: 280, minSellingPrice: 220, quantity: 25, alertQuantity: 8 },

    // --- سماعات ---
    { name: 'AirPods Pro 2nd Gen', code: 'AUD-001', barcode: '1940000000020', category: 'headphone', supplier: 'أندلس للموبايلات', purchasePrice: 7500, sellingPrice: 9500, minSellingPrice: 8800, quantity: 6, alertQuantity: 2, brand: 'Apple' },
    { name: 'Samsung Galaxy Buds FE', code: 'AUD-002', barcode: '1940000000021', category: 'headphone', supplier: 'سمسونج مصر', purchasePrice: 2500, sellingPrice: 3500, minSellingPrice: 3000, quantity: 8, alertQuantity: 3, brand: 'Samsung' },
    { name: 'سماعات بلوتوث رأسية', code: 'AUD-003', barcode: '1940000000022', category: 'headphone', supplier: 'علي أكسبريس', purchasePrice: 800, sellingPrice: 1500, minSellingPrice: 1200, quantity: 12, alertQuantity: 5 },
    { name: 'AirPods 3rd Gen', code: 'AUD-004', barcode: '1940000000023', category: 'headphone', supplier: 'أندلس للموبايلات', purchasePrice: 5500, sellingPrice: 7000, minSellingPrice: 6500, quantity: 5, alertQuantity: 2, brand: 'Apple' },

    // --- أغطية موبايل ---
    { name: 'كفر iPhone 15 Pro Max سيليكون', code: 'CASE-001', barcode: '1940000000030', category: 'case', supplier: 'علي أكسبريس', purchasePrice: 50, sellingPrice: 150, minSellingPrice: 100, quantity: 40, alertQuantity: 10 },
    { name: 'كفر Samsung S24 Ultra جلد', code: 'CASE-002', barcode: '1940000000031', category: 'case', supplier: 'علي أكسبريس', purchasePrice: 80, sellingPrice: 200, minSellingPrice: 150, quantity: 30, alertQuantity: 10 },
    { name: 'كفر iPhone 14 شفاف', code: 'CASE-003', barcode: '1940000000032', category: 'case', supplier: 'علي أكسبريس', purchasePrice: 30, sellingPrice: 100, minSellingPrice: 70, quantity: 50, alertQuantity: 15 },
    { name: 'كفر حماية كامل + زجاج', code: 'CASE-004', barcode: '1940000000033', category: 'case', supplier: 'علي أكسبريس', purchasePrice: 100, sellingPrice: 250, minSellingPrice: 200, quantity: 20, alertQuantity: 8 },

    // --- حماية شاشة ---
    { name: 'زجاج حماية iPhone 15 Pro Max', code: 'SCR-001', barcode: '1940000000040', category: 'screen_protector', supplier: 'علي أكسبريس', purchasePrice: 30, sellingPrice: 100, minSellingPrice: 70, quantity: 45, alertQuantity: 15 },
    { name: 'زجاج حماية Samsung S24 Ultra', code: 'SCR-002', barcode: '1940000000041', category: 'screen_protector', supplier: 'علي أكسبريس', purchasePrice: 35, sellingPrice: 100, minSellingPrice: 70, quantity: 40, alertQuantity: 15 },
    { name: 'زجاج حماية خصوصية iPhone', code: 'SCR-003', barcode: '1940000000042', category: 'screen_protector', supplier: 'علي أكسبريس', purchasePrice: 60, sellingPrice: 150, minSellingPrice: 120, quantity: 30, alertQuantity: 10 },

    // --- كروت ميموري ---
    { name: 'كرت ميموري SanDisk 128GB', code: 'MEM-001', barcode: '1940000000050', category: 'memory_card', supplier: 'الم输出 forييات', purchasePrice: 200, sellingPrice: 350, minSellingPrice: 300, quantity: 25, alertQuantity: 8 },
    { name: 'كرت ميموري Samsung 256GB', code: 'MEM-002', barcode: '1940000000051', category: 'memory_card', supplier: 'سمسونج مصر', purchasePrice: 400, sellingPrice: 600, minSellingPrice: 500, quantity: 15, alertQuantity: 5 },

    // --- يو اس بي درايف ---
    { name: 'flash drive SanDisk 64GB', code: 'USB-001', barcode: '1940000000060', category: 'usb_drive', supplier: 'الم输出 forييات', purchasePrice: 100, sellingPrice: 180, minSellingPrice: 150, quantity: 20, alertQuantity: 8 },
    { name: 'flash drive Samsung 128GB', code: 'USB-002', barcode: '1940000000061', category: 'usb_drive', supplier: 'سمسونج مصر', purchasePrice: 200, sellingPrice: 350, minSellingPrice: 280, quantity: 15, alertQuantity: 5 },

    // --- أكسسوارات مختلفة ---
    { name: 'حامل موبايل سيارة', code: 'ACC-010', barcode: '1940000000070', category: 'accessory', supplier: 'علي أكسبريس', purchasePrice: 80, sellingPrice: 200, minSellingPrice: 150, quantity: 25, alertQuantity: 8 },
    { name: 'نظارة VR للmobيل', code: 'ACC-011', barcode: '1940000000071', category: 'accessory', supplier: 'علي أكسبريس', purchasePrice: 150, sellingPrice: 350, minSellingPrice: 280, quantity: 10, alertQuantity: 3 },
    { name: 'سماعة بلوتوث محمولة', code: 'ACC-012', barcode: '1940000000072', category: 'accessory', supplier: 'علي أكسبريس', purchasePrice: 300, sellingPrice: 600, minSellingPrice: 500, quantity: 15, alertQuantity: 5 },
    { name: 'كيبل data عالي السرعة', code: 'ACC-013', barcode: '1940000000073', category: 'accessory', supplier: 'الم输出 forييات', purchasePrice: 60, sellingPrice: 120, minSellingPrice: 100, quantity: 35, alertQuantity: 10 },
    { name: 'monitor حماية شاشة', code: 'ACC-014', barcode: '1940000000074', category: 'accessory', supplier: 'علي أكسبريس', purchasePrice: 200, sellingPrice: 400, minSellingPrice: 320, quantity: 8, alertQuantity: 3 },
];

// ==================== EMPLOYEES ====================
const employeesData = [
    { name: 'علي حسن محمد', phone: '01011112222', role: 'admin', salary: 15000, status: 'active', balance: 0 },
    { name: 'محمد عبدالعزيز', phone: '01022223333', role: 'sales', salary: 7000, status: 'active', balance: 0 },
    { name: 'خالد إبراهيم', phone: '01033334444', role: 'technician', salary: 8000, status: 'active', balance: 500 },
    { name: 'أحمد شوقي', phone: '01044445555', role: 'cashier', salary: 6000, status: 'active', balance: 0 },
    { name: 'ياسر محمود', phone: '01055556666', role: 'sales', salary: 6500, status: 'active', balance: -200 },
    { name: 'عمرو سعيد', phone: '01066667777', role: 'technician', salary: 7500, status: 'active', balance: 0 },
    { name: 'حسن علي', phone: '01077778888', role: 'sales', salary: 5500, status: 'inactive', balance: 1000 },
];

// ==================== EXPENSES ====================
const expensesData = [
    { category: 'rent', amount: 25000, date: new Date('2026-01-01'), notes: 'إيجار المحل - شهر يناير', employee: 'علي حسن محمد' },
    { category: 'electricity', amount: 3500, date: new Date('2026-01-05'), notes: 'فاتورة كهرباء - يناير' },
    { category: 'water', amount: 500, date: new Date('2026-01-05'), notes: 'فاتورة مياه - يناير' },
    { category: 'internet', amount: 800, date: new Date('2026-01-01'), notes: 'فيبر - شهرية' },
    { category: 'salaries', amount: 55500, date: new Date('2026-01-28'), notes: 'رواتب الموظفين - يناير', employee: 'علي حسن محمد' },
    { category: 'transport', amount: 2000, date: new Date('2026-01-15'), notes: 'مصاريف مواصلات التوصيل' },
    { category: 'shop_maintenance', amount: 1500, date: new Date('2026-01-20'), notes: 'إصلاح تكييف' },
    { category: 'cleaning', amount: 800, date: new Date('2026-01-25'), notes: 'تنظيف المحل - شهري' },

    { category: 'rent', amount: 25000, date: new Date('2026-02-01'), notes: 'إيجار المحل - شهر فبراير', employee: 'علي حسن محمد' },
    { category: 'electricity', amount: 4000, date: new Date('2026-02-05'), notes: 'فاتورة كهرباء - فبراير' },
    { category: 'water', amount: 450, date: new Date('2026-02-05'), notes: 'فاتورة مياه - فبراير' },
    { category: 'internet', amount: 800, date: new Date('2026-02-01'), notes: 'فيبر - شهرية' },
    { category: 'salaries', amount: 55500, date: new Date('2026-02-27'), notes: 'رواتب الموظفين - فبراير', employee: 'علي حسن محمد' },
    { category: 'transport', amount: 1800, date: new Date('2026-02-10'), notes: 'مصاريف مواصلات' },
    { category: 'taxes', amount: 12000, date: new Date('2026-02-15'), notes: 'ضريبة القيمة المضافة' },
    { category: 'cleaning', amount: 800, date: new Date('2026-02-25'), notes: 'تنظيف المحل - شهري' },

    { category: 'rent', amount: 25000, date: new Date('2026-03-01'), notes: 'إيجار المحل - شهر مارس', employee: 'علي حسن محمد' },
    { category: 'electricity', amount: 4500, date: new Date('2026-03-05'), notes: 'فاتورة كهرباء - مارس' },
    { category: 'water', amount: 600, date: new Date('2026-03-05'), notes: 'فاتورة مياه - مارس' },
    { category: 'internet', amount: 800, date: new Date('2026-03-01'), notes: 'فيبر - شهرية' },
    { category: 'salaries', amount: 55500, date: new Date('2026-03-28'), notes: 'رواتب الموظفين - مارس', employee: 'علي حسن محمد' },
    { category: 'transport', amount: 2200, date: new Date('2026-03-12'), notes: 'مصاريف شحن' },
    { category: 'shop_maintenance', amount: 3000, date: new Date('2026-03-18'), notes: 'إصلاح واجهة المحل' },
    { category: 'cleaning', amount: 800, date: new Date('2026-03-25'), notes: 'تنظيف المحل - شهري' },
];

// ==================== MAINTENANCE ====================
const maintenanceData = [
    {
        ticketNumber: 'MTN-10001',
        customerName: 'أحمد محمد علي',
        customerPhone: '01012345678',
        deviceType: 'mobile',
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        problem: 'الشاشة مكسورة - محتاجة تبديل',
        password: '1234',
        status: 'repaired',
        technician: 'خالد إبراهيم',
        cost: 3500,
        sellingPrice: 5000,
        receivedDate: new Date('2026-02-01'),
        deliveredDate: new Date('2026-02-05'),
        notes: 'تم تبديل الشاشة OLED'
    },
    {
        ticketNumber: 'MTN-10002',
        customerName: 'سارة عبد الرحمن',
        customerPhone: '01098765432',
        deviceType: 'mobile',
        brand: 'Samsung',
        model: 'Galaxy S23',
        problem: 'البطارية مش بتشحن كويس - internals swelling',
        password: '5678',
        status: 'delivered',
        technician: 'عمرو سعيد',
        cost: 800,
        sellingPrice: 1200,
        receivedDate: new Date('2026-02-10'),
        deliveredDate: new Date('2026-02-12'),
        notes: 'تم تبديل البطارية - بطارية أصلية'
    },
    {
        ticketNumber: 'MTN-10003',
        customerName: 'محمد حسين إبراهيم',
        customerPhone: '01123456789',
        deviceType: 'mobile',
        brand: 'Apple',
        model: 'iPhone 13',
        problem: 'الموبايل بينط.off كل شوية - مشكلة في اللوجك بورد',
        password: '0000',
        status: 'repairing',
        technician: 'خالد إبراهيم',
        cost: 0,
        sellingPrice: 2500,
        receivedDate: new Date('2026-03-01'),
        notes: 'في انتظار قطع غيار - لوحة مدار'
    },
    {
        ticketNumber: 'MTN-10004',
        customerName: 'عمر خالد محمود',
        customerPhone: '01156789012',
        deviceType: 'tablet',
        brand: 'Apple',
        model: 'iPad Air',
        problem: 'الشاشة متجمدة - مش راضية تفتح',
        password: '',
        status: 'checking',
        technician: 'خالد إبراهيم',
        cost: 0,
        sellingPrice: 0,
        receivedDate: new Date('2026-03-05'),
        notes: 'جاري الفحص'
    },
    {
        ticketNumber: 'MTN-10005',
        customerName: 'نورهان سعيد',
        customerPhone: '01034567890',
        deviceType: 'mobile',
        brand: 'Xiaomi',
        model: 'Redmi Note 12',
        problem: 'السماعة external مش شغالة',
        password: '4321',
        status: 'new',
        technician: '',
        cost: 0,
        sellingPrice: 0,
        receivedDate: new Date('2026-03-08'),
        notes: ''
    },
    {
        ticketNumber: 'MTN-10006',
        customerName: 'كريم عبد الفتاح',
        customerPhone: '01134567890',
        deviceType: 'mobile',
        brand: 'Samsung',
        model: 'Galaxy S24',
        problem: 'الكاميرا الأمامية مش واضحة - غبار تحت الزجاج',
        password: '7890',
        status: 'waiting_parts',
        technician: 'عمرو سعيد',
        cost: 300,
        sellingPrice: 600,
        receivedDate: new Date('2026-03-03'),
        notes: 'في انتظار كاميرا بديلة من السمسونج'
    },
];

// ==================== WALLETS ====================
const walletsData = [
    {
        name: 'محفظة فودافون كاش',
        type: 'vodafone_cash',
        number: '01012345678',
        balance: 45000,
        transactions: [
            { type: 'deposit', amount: 50000, fee: 0, date: new Date('2026-01-02'), notes: 'إيداع أولي' },
            { type: 'receive', amount: 15000, fee: 0, date: new Date('2026-01-10'), notes: 'دفع عميل أحمد محمد' },
            { type: 'withdraw', amount: 20000, fee: 15, date: new Date('2026-01-15'), notes: 'سحب للبنك' },
            { type: 'receive', amount: 8000, fee: 0, date: new Date('2026-02-01'), notes: 'دفع عميل سارة' },
            { type: 'withdraw', amount: 3000, fee: 10, date: new Date('2026-02-10'), notes: 'مصاريف' },
            { type: 'receive', amount: 12000, fee: 0, date: new Date('2026-03-01'), notes: 'مدفوعات متنوعة' },
        ]
    },
    {
        name: 'محفظة_etisalat كاش',
        type: 'etisalat_cash',
        number: '01123456789',
        balance: 12000,
        transactions: [
            { type: 'deposit', amount: 15000, fee: 0, date: new Date('2026-01-05'), notes: 'إيداع' },
            { type: 'receive', amount: 7000, fee: 0, date: new Date('2026-01-20'), notes: 'دفع عميل محمد' },
            { type: 'withdraw', amount: 10000, fee: 10, date: new Date('2026-02-15'), notes: 'تحويل لبنك' },
        ]
    },
    {
        name: 'حساب بنكي - CIB',
        type: 'bank',
        number: '1234567890123456',
        iban: 'EG1234567890123456789012345',
        balance: 120000,
        transactions: [
            { type: 'deposit', amount: 200000, fee: 0, date: new Date('2026-01-01'), notes: 'إيداع رأس المال' },
            { type: 'withdraw', amount: 80000, fee: 0, date: new Date('2026-01-10'), notes: 'شراء بضاعة' },
            { type: 'deposit', amount: 50000, fee: 0, date: new Date('2026-02-01'), notes: 'إيداع مبيعات يناير' },
            { type: 'withdraw', amount: 30000, fee: 0, date: new Date('2026-02-15'), notes: 'شراء بضاعة' },
            { type: 'deposit', amount: 40000, fee: 0, date: new Date('2026-03-01'), notes: 'إيداع مبيعات فبراير' },
            { type: 'withdraw', amount: 60000, fee: 0, date: new Date('2026-03-05'), notes: 'شراء موبايلات جديدة' },
        ]
    },
    {
        name: 'محفظة we Pay',
        type: 'we_pay',
        number: '01512345678',
        balance: 8500,
        transactions: [
            { type: 'deposit', amount: 10000, fee: 0, date: new Date('2026-02-01'), notes: 'إيداع' },
            { type: 'receive', amount: 3500, fee: 0, date: new Date('2026-02-20'), notes: 'دفع عميل' },
            { type: 'withdraw', amount: 5000, fee: 5, date: new Date('2026-03-01'), notes: 'تحويل' },
        ]
    },
    {
        name: 'محفظة InstaPay',
        type: 'instapay',
        number: '01065432109',
        balance: 25000,
        transactions: [
            { type: 'deposit', amount: 30000, fee: 0, date: new Date('2026-01-01'), notes: 'إيداع' },
            { type: 'withdraw', amount: 10000, fee: 0, date: new Date('2026-01-20'), notes: 'سداد فواتير' },
            { type: 'receive', amount: 5000, fee: 0, date: new Date('2026-02-10'), notes: 'مدفوعات' },
        ]
    },
];

// ==================== SEED FUNCTION ====================
async function seed() {
    try {
        console.log('🔌 جاري الاتصال بقاعدة البيانات...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

        // حذف الداتا القديمة
        console.log('🗑️  جاري حذف الداتا القديمة...');
        await Promise.all([
            Product.deleteMany({}),
            Customer.deleteMany({}),
            Employee.deleteMany({}),
            Expense.deleteMany({}),
            Maintenance.deleteMany({}),
            Wallet.deleteMany({}),
            Sale.deleteMany({}),
        ]);
        console.log('✅ تم حذف الداتا القديمة');

        // إضافة العملاء
        console.log('👥 جاري إضافة العملاء...');
        const customers = await Customer.insertMany(customersData);
        console.log(`✅ تم إضافة ${customers.length} عميل`);

        // إضافة الموظفين
        console.log('👔 جاري إضافة الموظفين...');
        const employees = await Employee.insertMany(employeesData);
        console.log(`✅ تم إضافة ${employees.length} موظف`);

        // إضافة المنتجات
        console.log('📦 جاري إضافة المنتجات...');
        const products = await Product.insertMany(productsData);
        console.log(`✅ تم إضافة ${products.length} منتج`);

        // إضافة المصروفات
        console.log('💰 جاري إضافة المصروفات...');
        const expenses = await Expense.insertMany(expensesData);
        console.log(`✅ تم إضافة ${expenses.length} مصروف`);

        // إضافة تذاكر الصيانة
        console.log('🔧 جاري إضافة تذاكر الصيانة...');
        const maintenances = await Maintenance.insertMany(maintenanceData);
        console.log(`✅ تم إضافة ${maintenances.length} تذكرة صيانة`);

        // إضافة المحافظ
        console.log('💳 جاري إضافة المحافظ المالية...');
        const wallets = await Wallet.insertMany(walletsData);
        console.log(`✅ تم إضافة ${wallets.length} محفظة`);

        // إضافة مبيعات واقعية
        console.log('🛒 جاري إضافة المبيعات...');
        const salesData = [
            {
                invoiceNumber: 'INV-10001',
                customer: customers[0]._id,
                customerName: customers[0].name,
                customerPhone: customers[0].phone,
                items: [
                    { product: products[0]._id, name: products[0].name, quantity: 1, unitPrice: 58000, purchasePrice: 52000, subtotal: 58000 },
                    { product: products[24]._id, name: products[24].name, quantity: 1, unitPrice: 450, purchasePrice: 250, subtotal: 450 },
                ],
                subtotal: 58450,
                discount: 0,
                tax: 0,
                total: 58450,
                paymentMethod: 'cash',
                paid: 58450,
                remaining: 0,
                employee: employees[1]._id,
                date: new Date('2026-01-10'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10002',
                customer: customers[1]._id,
                customerName: customers[1].name,
                customerPhone: customers[1].phone,
                items: [
                    { product: products[3]._id, name: products[3].name, quantity: 1, unitPrice: 14500, purchasePrice: 12000, subtotal: 14500 },
                    { product: products[28]._id, name: products[28].name, quantity: 1, unitPrice: 150, purchasePrice: 80, subtotal: 150 },
                ],
                subtotal: 14650,
                discount: 500,
                tax: 0,
                total: 14150,
                paymentMethod: 'vodafone_cash',
                paid: 10650,
                remaining: 3500,
                isInstallment: true,
                installments: [
                    { dueDate: new Date('2026-02-15'), amount: 3500, paid: false },
                ],
                employee: employees[1]._id,
                date: new Date('2026-01-15'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10003',
                customer: customers[2]._id,
                customerName: customers[2].name,
                customerPhone: customers[2].phone,
                items: [
                    { product: products[2]._id, name: products[2].name, quantity: 1, unitPrice: 54000, purchasePrice: 48000, subtotal: 54000 },
                    { product: products[33]._id, name: products[33].name, quantity: 1, unitPrice: 9500, purchasePrice: 7500, subtotal: 9500 },
                ],
                subtotal: 63500,
                discount: 1000,
                tax: 0,
                total: 62500,
                paymentMethod: 'instapay',
                paid: 62500,
                remaining: 0,
                employee: employees[4]._id,
                date: new Date('2026-01-20'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10004',
                customer: customers[3]._id,
                customerName: customers[3].name,
                customerPhone: customers[3].phone,
                items: [
                    { product: products[4]._id, name: products[4].name, quantity: 1, unitPrice: 10500, purchasePrice: 8500, subtotal: 10500 },
                    { product: products[25]._id, name: products[25].name, quantity: 2, unitPrice: 150, purchasePrice: 50, subtotal: 300 },
                ],
                subtotal: 10800,
                discount: 0,
                tax: 0,
                total: 10800,
                paymentMethod: 'cash',
                paid: 8800,
                remaining: 2000,
                isInstallment: true,
                installments: [
                    { dueDate: new Date('2026-02-01'), amount: 2000, paid: false },
                ],
                employee: employees[1]._id,
                date: new Date('2026-01-25'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10005',
                customer: customers[4]._id,
                customerName: customers[4].name,
                customerPhone: customers[4].phone,
                items: [
                    { product: products[8]._id, name: products[8].name, quantity: 1, unitPrice: 23000, purchasePrice: 18000, subtotal: 23000 },
                    { product: products[26]._id, name: products[26].name, quantity: 1, unitPrice: 200, purchasePrice: 80, subtotal: 200 },
                ],
                subtotal: 23200,
                discount: 0,
                tax: 0,
                total: 23200,
                paymentMethod: 'cash',
                paid: 15200,
                remaining: 8000,
                isInstallment: true,
                installments: [
                    { dueDate: new Date('2026-02-15'), amount: 4000, paid: false },
                    { dueDate: new Date('2026-03-15'), amount: 4000, paid: false },
                ],
                employee: employees[4]._id,
                date: new Date('2026-02-01'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10006',
                customer: customers[5]._id,
                customerName: customers[5].name,
                customerPhone: customers[5].phone,
                items: [
                    { product: products[1]._id, name: products[1].name, quantity: 1, unitPrice: 40000, purchasePrice: 36000, subtotal: 40000 },
                ],
                subtotal: 40000,
                discount: 500,
                tax: 0,
                total: 39500,
                paymentMethod: 'bank_transfer',
                paid: 39500,
                remaining: 0,
                employee: employees[1]._id,
                date: new Date('2026-02-05'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10007',
                customer: customers[6]._id,
                customerName: customers[6].name,
                customerPhone: customers[6].phone,
                items: [
                    { product: products[0]._id, name: products[0].name, quantity: 2, unitPrice: 58000, purchasePrice: 52000, subtotal: 116000 },
                    { product: products[24]._id, name: products[24].name, quantity: 2, unitPrice: 450, purchasePrice: 250, subtotal: 900 },
                ],
                subtotal: 116900,
                discount: 2000,
                tax: 0,
                total: 114900,
                paymentMethod: 'bank_transfer',
                paid: 114900,
                remaining: 0,
                employee: employees[1]._id,
                date: new Date('2026-02-10'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10008',
                customer: customers[7]._id,
                customerName: customers[7].name,
                customerPhone: customers[7].phone,
                items: [
                    { product: products[5]._id, name: products[5].name, quantity: 1, unitPrice: 16500, purchasePrice: 14000, subtotal: 16500 },
                ],
                subtotal: 16500,
                discount: 0,
                tax: 0,
                total: 16500,
                paymentMethod: 'vodafone_cash',
                paid: 15000,
                remaining: 1500,
                isInstallment: true,
                installments: [
                    { dueDate: new Date('2026-03-01'), amount: 1500, paid: false },
                ],
                employee: employees[4]._id,
                date: new Date('2026-02-15'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10009',
                customer: customers[0]._id,
                customerName: customers[0].name,
                customerPhone: customers[0].phone,
                items: [
                    { product: products[6]._id, name: products[6].name, quantity: 1, unitPrice: 13000, purchasePrice: 11000, subtotal: 13000 },
                    { product: products[34]._id, name: products[34].name, quantity: 1, unitPrice: 600, purchasePrice: 300, subtotal: 600 },
                ],
                subtotal: 13600,
                discount: 0,
                tax: 0,
                total: 13600,
                paymentMethod: 'cash',
                paid: 13600,
                remaining: 0,
                employee: employees[1]._id,
                date: new Date('2026-03-01'),
                status: 'completed'
            },
            {
                invoiceNumber: 'INV-10010',
                customer: customers[9]._id,
                customerName: customers[9].name,
                customerPhone: customers[9].phone,
                items: [
                    { product: products[10]._id, name: products[10].name, quantity: 1, unitPrice: 19000, purchasePrice: 15000, subtotal: 19000 },
                    { product: products[27]._id, name: products[27].name, quantity: 1, unitPrice: 250, purchasePrice: 100, subtotal: 250 },
                ],
                subtotal: 19250,
                discount: 0,
                tax: 0,
                total: 19250,
                paymentMethod: 'etisalat_cash',
                paid: 14250,
                remaining: 5000,
                isInstallment: true,
                installments: [
                    { dueDate: new Date('2026-04-01'), amount: 5000, paid: false },
                ],
                employee: employees[4]._id,
                date: new Date('2026-03-05'),
                status: 'completed'
            },
        ];

        const sales = await Sale.insertMany(salesData);
        console.log(`✅ تم إضافة ${sales.length} فاتورة مبيعات`);

        console.log('\n========================================');
        console.log('🎉 تم Seed الداتا بنجاح!');
        console.log('========================================');
        console.log(`👥 العملاء: ${customers.length}`);
        console.log(`👔 الموظفين: ${employees.length}`);
        console.log(`📦 المنتجات: ${products.length}`);
        console.log(`💰 المصروفات: ${expenses.length}`);
        console.log(`🔧 تذاكر الصيانة: ${maintenances.length}`);
        console.log(`💳 المحافظ: ${wallets.length}`);
        console.log(`🛒 المبيعات: ${sales.length}`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ خطأ أثناء الـ seed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    }
}

seed();
