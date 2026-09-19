/**
 * ==========================================================================
 * KOPI SENJA - E-COMMERCE FULL ENGINE (Google Apps Script Backend)
 * ==========================================================================
 * Database: Google Sheets
 * Communication: google.script.run
 */

// Global Sheet Names
var SHEETS = {
  PRODUCTS: 'Products',
  CATEGORIES: 'Categories',
  ORDERS: 'Orders',
  ORDER_ITEMS: 'OrderItems',
  CUSTOMERS: 'Customers',
  REVIEWS: 'Reviews',
  LOCATIONS: 'Locations',
  SETTINGS: 'Settings'
};

/**
 * Web App Entry Point
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('KOPI SENJA | Temukan momen terbaik dalam setiap tegukan')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper to get active spreadsheet instance
 */
function getDb() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Helper to get sheet by name safely
 */
function getSheet(name) {
  var ss = getDb();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * ==========================================================================
 * 1. DATABASE SETUP & SEEDING
 * ==========================================================================
 */
function setupDatabase() {
  var ss = getDb();

  var schemas = [
    {
      name: SHEETS.PRODUCTS,
      headers: ['id', 'name', 'slug', 'description', 'category', 'price', 'image', 'stock', 'featured', 'active', 'created_at']
    },
    {
      name: SHEETS.CATEGORIES,
      headers: ['id', 'name', 'slug', 'image', 'active']
    },
    {
      name: SHEETS.ORDERS,
      headers: ['id', 'customer_id', 'customer_name', 'phone', 'email', 'address', 'notes', 'items_json', 'subtotal', 'delivery_fee', 'total', 'payment_method', 'status', 'created_at']
    },
    {
      name: SHEETS.ORDER_ITEMS,
      headers: ['id', 'order_id', 'product_id', 'product_name', 'quantity', 'price', 'subtotal']
    },
    {
      name: SHEETS.CUSTOMERS,
      headers: ['id', 'name', 'phone', 'email', 'address', 'created_at']
    },
    {
      name: SHEETS.REVIEWS,
      headers: ['id', 'product_id', 'customer_name', 'rating', 'review', 'created_at']
    },
    {
      name: SHEETS.LOCATIONS,
      headers: ['id', 'name', 'address', 'opening_hours', 'phone', 'maps_url', 'active']
    },
    {
      name: SHEETS.SETTINGS,
      headers: ['key', 'value']
    }
  ];

  schemas.forEach(function(s) {
    var sheet = ss.getSheetByName(s.name);
    if (!sheet) {
      sheet = ss.insertSheet(s.name);
      sheet.appendRow(s.headers);
      sheet.getRange(1, 1, 1, s.headers.length).setFontWeight('bold').setBackground('#F6F1E8');
      sheet.setFrozenRows(1);
    } else {
      // Ensure header exists if empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(s.headers);
        sheet.getRange(1, 1, 1, s.headers.length).setFontWeight('bold').setBackground('#F6F1E8');
        sheet.setFrozenRows(1);
      }
    }
  });

  return { success: true, message: 'Database setup berhasil diselesaikan.' };
}

function seedCategories() {
  var sheet = getSheet(SHEETS.CATEGORIES);
  if (sheet.getLastRow() > 1) {
    return { success: true, message: 'Kategori sudah memiliki data.' };
  }

  var categories = [
    ['CAT01', 'Coffee', 'coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80', true],
    ['CAT02', 'Non Coffee', 'non-coffee', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80', true],
    ['CAT03', 'Pastry', 'pastry', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80', true],
    ['CAT04', 'Beans', 'beans', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80', true],
    ['CAT05', 'Merchandise', 'merchandise', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', true]
  ];

  categories.forEach(function(row) {
    sheet.appendRow(row);
  });

  return { success: true, message: 'Seed Categories berhasil.' };
}

function seedProducts() {
  var sheet = getSheet(SHEETS.PRODUCTS);
  if (sheet.getLastRow() > 1) {
    return { success: true, message: 'Produk sudah memiliki data.' };
  }

  var now = new Date().toISOString();
  var products = [
    ['P001', 'Espresso', 'espresso', 'Kopi hitam murni diekstraksi sempurna dengan crema tebal keemasan dan profil rasa seimbang.', 'Coffee', 18000, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80', 45, true, true, now],
    ['P002', 'Americano', 'americano', 'Double shot espresso dipadukan dengan air mineral panas, menghadirkan aroma kaya tanpa rasa pahit berlebih.', 'Coffee', 22000, 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop&q=80', 50, false, true, now],
    ['P003', 'Cafe Latte', 'cafe-latte', 'Perpaduan lembut espresso artisanal dengan steamed milk creamy dan microfoam sutra yang memanjakan.', 'Coffee', 28000, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80', 40, true, true, now],
    ['P004', 'Cappuccino', 'cappuccino', 'Keseimbangan harmonis antara espresso tegas, susu segar, dan lapisan foam tebal dengan taburan bubuk kakao.', 'Coffee', 28000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80', 35, true, true, now],
    ['P005', 'Caramel Latte', 'caramel-latte', 'Espresso lembut berpadu susu velvety dan sentuhan sirup karamel bakar khas Kopi Senja.', 'Coffee', 32000, 'https://images.unsplash.com/photo-1529892485617-25f63cd7317a?w=600&auto=format&fit=crop&q=80', 30, true, true, now],
    ['P006', 'Matcha Latte', 'matcha-latte', 'Pure Ceremonial Uji Matcha berpadu susu segar dan madu bunga liar untuk ketenangan di setiap tegukan.', 'Non Coffee', 30000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80', 25, true, true, now],
    ['P007', 'Chocolate', 'chocolate', 'Cokelat artisanal Bali 70% dilelehkan bersama susu segar hangat dengan sentuhan rasa vanila bourbon.', 'Non Coffee', 28000, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80', 30, false, true, now],
    ['P008', 'Butter Croissant', 'butter-croissant', 'Croissant berlapis renyah keemasan yang dipanggang segar dengan butter premium Prancis.', 'Pastry', 24000, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80', 20, true, true, now],
    ['P009', 'Chocolate Croissant', 'chocolate-croissant', 'Pain au chocolat dengan isian cokelat couverture ganda di dalam lapisan pastry renyah gurih.', 'Pastry', 27000, 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&auto=format&fit=crop&q=80', 18, true, true, now],
    ['P010', 'House Blend Beans', 'house-blend-beans', 'Biji kopi pilihan Gayo dan Flores 250g. Tasting notes: Dark Chocolate, Brown Sugar, and Sweet Orange.', 'Beans', 85000, 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&auto=format&fit=crop&q=80', 15, true, true, now],
    ['P011', 'Single Origin Beans', 'single-origin-beans', 'Biji kopi mikrolot Kerinci Natural 200g. Tasting notes: Floral, Jasmine, Black Tea, Peach acidity.', 'Beans', 98000, 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&auto=format&fit=crop&q=80', 12, false, true, now],
    ['P012', 'Kopi Senja Mug', 'kopi-senja-mug', 'Keramik stoneware edisi terbatas 320ml dengan sentuhan glaze matte cokelat hangat dan logo terukir halus.', 'Merchandise', 75000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80', 20, false, true, now]
  ];

  products.forEach(function(p) {
    sheet.appendRow(p);
  });

  return { success: true, message: 'Seed Products berhasil.' };
}

function seedSettings() {
  var sheet = getSheet(SHEETS.SETTINGS);
  if (sheet.getLastRow() > 1) {
    return { success: true, message: 'Settings sudah memiliki data.' };
  }

  var settings = [
    ['store_name', 'KOPI SENJA'],
    ['tagline', 'Temukan momen terbaik dalam setiap tegukan.'],
    ['delivery_fee', '10000'],
    ['whatsapp', '6281234567890'],
    ['instagram', '@kopisenja.id'],
    ['address_summary', 'Jl. Senja Melati No. 42, Kebayoran Baru, Jakarta Selatan'],
    ['admin_passkey', 'senja2026'] // Default admin secret (changeable via settings)
  ];

  settings.forEach(function(s) {
    sheet.appendRow(s);
  });

  // Seed default locations if empty
  var locSheet = getSheet(SHEETS.LOCATIONS);
  if (locSheet.getLastRow() <= 1) {
    var locs = [
      ['LOC01', 'Kopi Senja - Senopati Sanctuary', 'Jl. Senopati Dalam No. 18, Kebayoran Baru, Jakarta Selatan', '07:00 - 22:00 WIB', '021-5550192', 'https://maps.google.com', true],
      ['LOC02', 'Kopi Senja - Menteng Atelier', 'Jl. Teuku Cik Ditiro No. 24, Menteng, Jakarta Pusat', '08:00 - 21:00 WIB', '021-5550384', 'https://maps.google.com', true],
      ['LOC03', 'Kopi Senja - Bandung Heritage', 'Jl. Progo No. 9, Riau, Kota Bandung', '08:00 - 22:00 WIB', '022-7201928', 'https://maps.google.com', true]
    ];
    locs.forEach(function(l) { locSheet.appendRow(l); });
  }

  // Seed sample reviews if empty
  var revSheet = getSheet(SHEETS.REVIEWS);
  if (revSheet.getLastRow() <= 1) {
    var now = new Date().toISOString();
    var revs = [
      ['REV01', 'P001', 'Bima Satria', 5, 'Crema espresso sangat kaya, acidity pas, aroma hazelnut manis terasa jelas.', now],
      ['REV02', 'P003', 'Rara Sekar', 5, 'Latte terenak untuk menemani sore kerja. Susunya tidak enek dan kopinya tetap terasa kuat.', now],
      ['REV03', 'P008', 'Dian Paramita', 5, 'Butter croissant sangat flaky di luar dan lembut di dalam. Wajib dipadukan dengan cappuccino.', now]
    ];
    revs.forEach(function(r) { revSheet.appendRow(r); });
  }

  return { success: true, message: 'Seed Settings & Relasi berhasil.' };
}

/**
 * ==========================================================================
 * 2. DATA UTILITIES & NORMALIZERS
 * ==========================================================================
 */
function getSheetData(sheetName) {
  var sheet = getSheet(sheetName);
  var values = sheet.getDataRange().getValues();
  if (!values || values.length <= 1) {
    return [];
  }
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

/**
 * ==========================================================================
 * 3. PUBLIC READ APIS
 * ==========================================================================
 */
function getSettings() {
  var rows = getSheetData(SHEETS.SETTINGS);
  var map = {};
  rows.forEach(function(r) {
    if (r.key && r.key !== 'admin_passkey') { // Never expose passkey
      map[r.key] = r.value;
    }
  });
  return map;
}

function getCategories() {
  var rows = getSheetData(SHEETS.CATEGORIES);
  return rows.filter(function(c) {
    return c.active === true || c.active === 'TRUE' || c.active === 1;
  });
}

function getProducts() {
  var rows = getSheetData(SHEETS.PRODUCTS);
  return rows.filter(function(p) {
    return p.active === true || p.active === 'TRUE' || p.active === 1;
  }).map(function(p) {
    p.price = Number(p.price) || 0;
    p.stock = Number(p.stock) || 0;
    p.featured = (p.featured === true || p.featured === 'TRUE' || p.featured === 1);
    return p;
  });
}

function getFeaturedProducts() {
  var products = getProducts();
  return products.filter(function(p) {
    return p.featured === true;
  });
}

function getProductById(id) {
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (String(products[i].id) === String(id)) {
      return products[i];
    }
  }
  return null;
}

function getProductsByCategory(category) {
  var products = getProducts();
  if (!category || category === 'All') return products;
  return products.filter(function(p) {
    return String(p.category).toLowerCase() === String(category).toLowerCase();
  });
}

function searchProducts(query) {
  if (!query) return getProducts();
  var q = String(query).toLowerCase().trim();
  var products = getProducts();
  return products.filter(function(p) {
    var name = String(p.name || '').toLowerCase();
    var desc = String(p.description || '').toLowerCase();
    var cat = String(p.category || '').toLowerCase();
    return name.indexOf(q) !== -1 || desc.indexOf(q) !== -1 || cat.indexOf(q) !== -1;
  });
}

function getLocations() {
  var rows = getSheetData(SHEETS.LOCATIONS);
  return rows.filter(function(l) {
    return l.active === true || l.active === 'TRUE' || l.active === 1;
  });
}

function getReviews(productId) {
  var rows = getSheetData(SHEETS.REVIEWS);
  if (!productId) return rows;
  return rows.filter(function(r) {
    return String(r.product_id) === String(productId);
  });
}

/**
 * ==========================================================================
 * 4. ORDER CREATION WITH SERVER-SIDE RE-VALIDATION & STOCK DEDUCTION
 * ==========================================================================
 */
function createOrder(orderData) {
  try {
    if (!orderData || !orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('Keranjang belanja kosong.');
    }

    if (!orderData.customer_name || !orderData.phone || !orderData.address || !orderData.payment_method) {
      throw new Error('Data pengiriman dan pembayaran belum lengkap.');
    }

    var lock = LockService.getScriptLock();
    // Wait for up to 20 seconds for other order transactions
    lock.waitLock(20000);

    var prodSheet = getSheet(SHEETS.PRODUCTS);
    var prodValues = prodSheet.getDataRange().getValues();
    if (prodValues.length <= 1) {
      throw new Error('Katalog produk tidak tersedia.');
    }

    var prodHeaders = prodValues[0];
    var idIdx = prodHeaders.indexOf('id');
    var nameIdx = prodHeaders.indexOf('name');
    var priceIdx = prodHeaders.indexOf('price');
    var stockIdx = prodHeaders.indexOf('stock');
    var activeIdx = prodHeaders.indexOf('active');

    // Build lookup
    var dbProducts = {};
    for (var r = 1; r < prodValues.length; r++) {
      var rowId = String(prodValues[r][idIdx]);
      dbProducts[rowId] = {
        rowIndex: r + 1, // 1-based row index for updating
        name: prodValues[r][nameIdx],
        price: Number(prodValues[r][priceIdx]) || 0,
        stock: Number(prodValues[r][stockIdx]) || 0,
        active: (prodValues[r][activeIdx] === true || prodValues[r][activeIdx] === 'TRUE' || prodValues[r][activeIdx] === 1)
      };
    }

    // Recalculate Subtotal & Verify Stock
    var validatedItems = [];
    var calculatedSubtotal = 0;

    for (var i = 0; i < orderData.items.length; i++) {
      var item = orderData.items[i];
      var pid = String(item.product_id);
      var qty = parseInt(item.quantity, 10);

      if (isNaN(qty) || qty <= 0) {
        throw new Error('Kuantitas produk tidak valid.');
      }

      var dbItem = dbProducts[pid];
      if (!dbItem) {
        throw new Error('Produk dengan ID ' + pid + ' tidak ditemukan.');
      }

      if (!dbItem.active) {
        throw new Error('Produk ' + dbItem.name + ' sedang tidak aktif.');
      }

      if (dbItem.stock < qty) {
        throw new Error('Stok untuk ' + dbItem.name + ' tidak mencukupi (tersisa: ' + dbItem.stock + ').');
      }

      var itemSubtotal = dbItem.price * qty;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        product_id: pid,
        product_name: dbItem.name,
        quantity: qty,
        price: dbItem.price,
        subtotal: itemSubtotal,
        rowIndex: dbItem.rowIndex,
        newStock: dbItem.stock - qty
      });
    }

    // Get delivery fee from Settings
    var settings = getSettings();
    var deliveryFee = Number(settings.delivery_fee) || 10000;
    var grandTotal = calculatedSubtotal + deliveryFee;

    // Generate Order ID format: KS-YYYYMMDD-XXXX
    var now = new Date();
    var yyyy = now.getFullYear();
    var mm = ('0' + (now.getMonth() + 1)).slice(-2);
    var dd = ('0' + now.getDate()).slice(-2);
    var randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    var orderId = 'KS-' + yyyy + mm + dd + '-' + randCode;
    var createdAt = now.toISOString();

    // Deduct stock in Google Sheets
    validatedItems.forEach(function(vi) {
      prodSheet.getRange(vi.rowIndex, stockIdx + 1).setValue(vi.newStock);
    });

    // Save Customer if not exists
    var custSheet = getSheet(SHEETS.CUSTOMERS);
    var custData = getSheetData(SHEETS.CUSTOMERS);
    var customerId = 'CUST-' + String(orderData.phone).replace(/\D/g, '').slice(-6);
    var existingCust = custData.find(function(c) { return String(c.phone) === String(orderData.phone); });

    if (!existingCust) {
      custSheet.appendRow([
        customerId,
        orderData.customer_name,
        orderData.phone,
        orderData.email || '-',
        orderData.address,
        createdAt
      ]);
    } else {
      customerId = existingCust.id;
    }

    // Save Order
    var orderSheet = getSheet(SHEETS.ORDERS);
    var orderItemsClean = validatedItems.map(function(vi) {
      return {
        product_id: vi.product_id,
        product_name: vi.product_name,
        quantity: vi.quantity,
        price: vi.price,
        subtotal: vi.subtotal
      };
    });

    orderSheet.appendRow([
      orderId,
      customerId,
      orderData.customer_name,
      orderData.phone,
      orderData.email || '-',
      orderData.address,
      orderData.notes || '-',
      JSON.stringify(orderItemsClean),
      calculatedSubtotal,
      deliveryFee,
      grandTotal,
      orderData.payment_method,
      'Pending',
      createdAt
    ]);

    // Save OrderItems relational sheet
    var itemSheet = getSheet(SHEETS.ORDER_ITEMS);
    orderItemsClean.forEach(function(vi, idx) {
      var itemId = 'OI-' + orderId + '-' + (idx + 1);
      itemSheet.appendRow([
        itemId,
        orderId,
        vi.product_id,
        vi.product_name,
        vi.quantity,
        vi.price,
        vi.subtotal
      ]);
    });

    lock.releaseLock();

    return {
      success: true,
      orderId: orderId,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total: grandTotal,
      status: 'Pending',
      payment_method: orderData.payment_method,
      created_at: createdAt
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || 'Gagal memproses pesanan.'
    };
  }
}

/**
 * Track Order by OrderId and Phone Number
 */
function trackOrder(orderId, phone) {
  if (!orderId || !phone) {
    return { success: false, message: 'Order ID dan Nomor WhatsApp wajib diisi.' };
  }

  var cleanPhone = String(phone).replace(/\D/g, '');
  var orders = getSheetData(SHEETS.ORDERS);

  var matched = null;
  for (var i = 0; i < orders.length; i++) {
    var ord = orders[i];
    var ordPhoneClean = String(ord.phone).replace(/\D/g, '');
    if (String(ord.id).trim().toUpperCase() === String(orderId).trim().toUpperCase() &&
        ordPhoneClean.indexOf(cleanPhone) !== -1) {
      matched = ord;
      break;
    }
  }

  if (!matched) {
    return { success: false, message: 'Pesanan tidak ditemukan. Periksa kembali Order ID dan nomor WhatsApp.' };
  }

  var items = [];
  try {
    items = JSON.parse(matched.items_json);
  } catch(e) {
    items = [];
  }

  return {
    success: true,
    order: {
      id: matched.id,
      customer_name: matched.customer_name,
      phone: matched.phone,
      address: matched.address,
      notes: matched.notes,
      subtotal: Number(matched.subtotal) || 0,
      delivery_fee: Number(matched.delivery_fee) || 0,
      total: Number(matched.total) || 0,
      payment_method: matched.payment_method,
      status: matched.status,
      created_at: matched.created_at,
      items: items
    }
  };
}

function getOrderById(orderId) {
  var orders = getSheetData(SHEETS.ORDERS);
  for (var i = 0; i < orders.length; i++) {
    if (String(orders[i].id).trim() === String(orderId).trim()) {
      var ord = orders[i];
      try {
        ord.items = JSON.parse(ord.items_json);
      } catch(e) {
        ord.items = [];
      }
      return ord;
    }
  }
  return null;
}

/**
 * Review Submission with Order Verification
 */
function addReview(reviewData) {
  try {
    if (!reviewData || !reviewData.product_id || !reviewData.order_id || !reviewData.customer_name || !reviewData.review) {
      throw new Error('Semua data ulasan wajib diisi.');
    }

    var rating = parseInt(reviewData.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating harus antara 1 sampai 5 bintang.');
    }

    // Verify Order ID exists and is Completed / Valid
    var order = getOrderById(reviewData.order_id);
    if (!order) {
      throw new Error('Order ID tidak ditemukan dalam database.');
    }

    // Ensure the product was in that order
    var foundInOrder = false;
    if (order.items && Array.isArray(order.items)) {
      foundInOrder = order.items.some(function(it) {
        return String(it.product_id) === String(reviewData.product_id);
      });
    }

    if (!foundInOrder) {
      throw new Error('Produk ini tidak tercantum dalam pesanan ' + reviewData.order_id + '.');
    }

    var revSheet = getSheet(SHEETS.REVIEWS);
    var now = new Date().toISOString();
    var revId = 'REV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    revSheet.appendRow([
      revId,
      reviewData.product_id,
      reviewData.customer_name,
      rating,
      reviewData.review,
      now
    ]);

    return { success: true, message: 'Ulasan berhasil diterbitkan. Terima kasih!' };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal menambahkan ulasan.' };
  }
}

/**
 * ==========================================================================
 * 5. ADMIN AUTHENTICATION & SECURE MANAGEMENT
 * ==========================================================================
 */
function verifyAdminSession(token) {
  if (!token) return false;
  var userProps = PropertiesService.getScriptProperties();
  var storedToken = userProps.getProperty('ADMIN_SESSION_TOKEN');
  var tokenExpiry = userProps.getProperty('ADMIN_SESSION_EXPIRY');

  if (!storedToken || !tokenExpiry) return false;

  var now = new Date().getTime();
  if (storedToken === token && now < Number(tokenExpiry)) {
    return true;
  }
  return false;
}

function adminLogin(passkey) {
  if (!passkey) {
    return { success: false, message: 'Kata sandi diperlukan.' };
  }

  // Retrieve passkey from Settings sheet or ScriptProperties
  var settingsRows = getSheetData(SHEETS.SETTINGS);
  var passRow = settingsRows.find(function(s) { return s.key === 'admin_passkey'; });
  var validKey = passRow ? String(passRow.value).trim() : 'senja2026';

  if (String(passkey).trim() === validKey) {
    var sessionToken = 'AST-' + Utilities.getUuid();
    var expiry = new Date().getTime() + (8 * 60 * 60 * 1000); // 8 hours session

    var props = PropertiesService.getScriptProperties();
    props.setProperty('ADMIN_SESSION_TOKEN', sessionToken);
    props.setProperty('ADMIN_SESSION_EXPIRY', String(expiry));

    return { success: true, token: sessionToken, message: 'Autentikasi admin berhasil.' };
  }

  return { success: false, message: 'Kunci sandi admin tidak valid.' };
}

function getDashboardStats(token) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Sesi admin tidak valid atau telah kedaluwarsa.' };
  }

  var orders = getSheetData(SHEETS.ORDERS);
  var products = getSheetData(SHEETS.PRODUCTS);

  var totalRevenue = 0;
  var pendingOrders = 0;
  var completedOrders = 0;

  orders.forEach(function(o) {
    var tot = Number(o.total) || 0;
    if (o.status !== 'Cancelled') {
      totalRevenue += tot;
    }
    if (o.status === 'Pending') pendingOrders++;
    if (o.status === 'Completed') completedOrders++;
  });

  var activeProducts = 0;
  var outOfStock = 0;

  products.forEach(function(p) {
    var isActive = (p.active === true || p.active === 'TRUE' || p.active === 1);
    var stock = Number(p.stock) || 0;
    if (isActive) activeProducts++;
    if (stock <= 0) outOfStock++;
  });

  return {
    success: true,
    stats: {
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      pendingOrders: pendingOrders,
      completedOrders: completedOrders,
      activeProducts: activeProducts,
      outOfStock: outOfStock
    }
  };
}

function getOrders(token) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Akses ditolak.' };
  }
  var orders = getSheetData(SHEETS.ORDERS);
  // Sort latest first
  orders.reverse();
  return { success: true, orders: orders };
}

function updateOrderStatus(token, orderId, status) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Akses ditolak.' };
  }

  var sheet = getSheet(SHEETS.ORDERS);
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return { success: false, message: 'Tidak ada data pesanan.' };

  var headers = values[0];
  var idIdx = headers.indexOf('id');
  var statusIdx = headers.indexOf('status');

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idIdx]).trim() === String(orderId).trim()) {
      sheet.getRange(r + 1, statusIdx + 1).setValue(status);
      return { success: true, message: 'Status pesanan ' + orderId + ' diperbarui menjadi ' + status };
    }
  }

  return { success: false, message: 'Pesanan tidak ditemukan.' };
}

function addProduct(token, productData) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Akses ditolak.' };
  }

  if (!productData || !productData.name || !productData.category) {
    return { success: false, message: 'Nama dan Kategori produk wajib diisi.' };
  }

  var sheet = getSheet(SHEETS.PRODUCTS);
  var newId = 'P' + ('000' + (sheet.getLastRow())).slice(-3);
  var slug = String(productData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  var now = new Date().toISOString();

  sheet.appendRow([
    newId,
    productData.name,
    slug,
    productData.description || '',
    productData.category,
    Number(productData.price) || 0,
    productData.image || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
    Number(productData.stock) || 0,
    (productData.featured === true || productData.featured === 'true'),
    (productData.active === true || productData.active === 'true'),
    now
  ]);

  return { success: true, message: 'Produk berhasil ditambahkan.' };
}

function updateProduct(token, productData) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Akses ditolak.' };
  }

  if (!productData || !productData.id) {
    return { success: false, message: 'ID produk tidak ditemukan.' };
  }

  var sheet = getSheet(SHEETS.PRODUCTS);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];

  var idCol = headers.indexOf('id');
  var nameCol = headers.indexOf('name');
  var descCol = headers.indexOf('description');
  var catCol = headers.indexOf('category');
  var priceCol = headers.indexOf('price');
  var imgCol = headers.indexOf('image');
  var stockCol = headers.indexOf('stock');
  var featCol = headers.indexOf('featured');
  var actCol = headers.indexOf('active');

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(productData.id)) {
      var row = r + 1;
      if (productData.name !== undefined) sheet.getRange(row, nameCol + 1).setValue(productData.name);
      if (productData.description !== undefined) sheet.getRange(row, descCol + 1).setValue(productData.description);
      if (productData.category !== undefined) sheet.getRange(row, catCol + 1).setValue(productData.category);
      if (productData.price !== undefined) sheet.getRange(row, priceCol + 1).setValue(Number(productData.price));
      if (productData.image !== undefined) sheet.getRange(row, imgCol + 1).setValue(productData.image);
      if (productData.stock !== undefined) sheet.getRange(row, stockCol + 1).setValue(Number(productData.stock));
      if (productData.featured !== undefined) sheet.getRange(row, featCol + 1).setValue(productData.featured);
      if (productData.active !== undefined) sheet.getRange(row, actCol + 1).setValue(productData.active);

      return { success: true, message: 'Produk ' + productData.id + ' berhasil diperbarui.' };
    }
  }

  return { success: false, message: 'Produk tidak ditemukan.' };
}

function deleteProduct(token, productId) {
  if (!verifyAdminSession(token)) {
    return { success: false, message: 'Akses ditolak.' };
  }

  var sheet = getSheet(SHEETS.PRODUCTS);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf('id');

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(productId)) {
      sheet.deleteRow(r + 1);
      return { success: true, message: 'Produk berhasil dihapus permanen.' };
    }
  }

  return { success: false, message: 'Produk tidak ditemukan.' };
}

/**
 * ==========================================================================
 * 6. CUSTOMER AUTHENTICATION (Register & Login)
 * ==========================================================================
 */
function registerCustomer(userData) {
  try {
    if (!userData || !userData.name || !userData.phone || !userData.email || !userData.password) {
      return { success: false, message: 'Semua bidang wajib diisi.' };
    }

    var sheet = getSheet(SHEETS.CUSTOMERS);
    var customers = getSheetData(SHEETS.CUSTOMERS);
    var cleanPhone = String(userData.phone).replace(/\D/g, '');
    var email = String(userData.email).trim().toLowerCase();

    // Check if phone or email already registered
    var exists = customers.find(function(c) {
      var cPhone = String(c.phone).replace(/\D/g, '');
      var cEmail = String(c.email || '').trim().toLowerCase();
      return cPhone === cleanPhone || cEmail === email;
    });

    if (exists) {
      return { success: false, message: 'Nomor WhatsApp atau Email sudah terdaftar. Silakan login.' };
    }

    var customerId = 'CUST-' + ('00000' + (customers.length + 1)).slice(-5);
    var now = new Date().toISOString();

    sheet.appendRow([
      customerId,
      userData.name,
      userData.phone,
      userData.email,
      userData.address || '-',
      now,
      userData.password // stored in Customer sheet
    ]);

    return {
      success: true,
      message: 'Pendaftaran berhasil! Selamat datang di Kopi Senja.',
      customer: {
        id: customerId,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        address: userData.address || ''
      }
    };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal mendaftarkan akun.' };
  }
}

function loginCustomer(credentials) {
  try {
    if (!credentials || !credentials.identifier || !credentials.password) {
      return { success: false, message: 'Email/WhatsApp dan Kata Sandi wajib diisi.' };
    }

    var iden = String(credentials.identifier).trim().toLowerCase();
    var idenPhone = iden.replace(/\D/g, '');
    var pass = String(credentials.password);

    var customers = getSheetData(SHEETS.CUSTOMERS);
    var user = null;

    for (var i = 0; i < customers.length; i++) {
      var c = customers[i];
      var cEmail = String(c.email || '').trim().toLowerCase();
      var cPhone = String(c.phone || '').replace(/\D/g, '');
      var cPass = String(c.password || '');

      if ((cEmail === iden || (idenPhone && cPhone === idenPhone)) && cPass === pass) {
        user = c;
        break;
      }
    }

    if (!user) {
      return { success: false, message: 'Email/WhatsApp atau kata sandi tidak cocok.' };
    }

    return {
      success: true,
      message: 'Login berhasil. Selamat datang kembali!',
      customer: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        address: user.address || ''
      }
    };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal memproses login.' };
  }
}

