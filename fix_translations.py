import re

with open('Index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add data-i18n to Bread items
bread_names = [
    ("Butter Croissant", "bread1Name", "bread1Desc"),
    ("Almond Croissant", "bread2Name", "bread2Desc"),
    ("Pain au Chocolat", "bread3Name", "bread3Desc"),
    ("Cinnamon Roll", "bread4Name", "bread4Desc"),
    ("Classic Bagel", "bread5Name", "bread5Desc"),
    ("Sourdough Toast", "bread6Name", "bread6Desc"),
]

for name, name_tag, desc_tag in bread_names:
    # Replace name
    content = re.sub(
        f'<span class="food-item-name">{name}</span>',
        f'<span class="food-item-name" data-i18n="{name_tag}">{name}</span>',
        content
    )
    # The desc needs to be found by finding the p tag immediately after
    # But wait, we can just replace the specific description text!

bread_descs = [
    ("Classic flaky, buttery, and authentic French croissant.", "bread1Desc"),
    ("Twice-baked croissant filled with sweet almond frangipane.", "bread2Desc"),
    ("Buttery dough wrapped around rich, dark chocolate centers.", "bread3Desc"),
    ("Soft, fluffy dough baked with cinnamon and topped with cream cheese glaze.", "bread4Desc"),
    ("Toasted bagel served with your choice of plain or herb cream cheese.", "bread5Desc"),
    ("Thick-cut sourdough bread served with artisanal butter and fruit jam.", "bread6Desc"),
]
for desc, desc_tag in bread_descs:
    content = re.sub(
        f'<p class="food-item-desc">{re.escape(desc)}</p>',
        f'<p class="food-item-desc" data-i18n="{desc_tag}">{desc}</p>',
        content
    )


# 2. Add data-i18n to Dessert items
dessert_names = [
    ("Chocolate Waffle", "des1Name"),
    ("Strawberry Waffle", "des2Name"),
    ("Chocolate Cake", "des3Name"),
    ("Gelato Ice Cream", "des4Name"),
    ("Chocolate Pudding", "des5Name"),
    ("Strawberry Pudding", "des6Name"),
]
for name, tag in dessert_names:
    content = re.sub(
        f'<span class="food-item-name">{name}</span>',
        f'<span class="food-item-name" data-i18n="{tag}">{name}</span>',
        content
    )

dessert_descs = [
    ("Warm Belgian waffle drizzled with melted dark chocolate.", "des1Desc"),
    ("Belgian waffle topped with fresh strawberries and whipped cream.", "des2Desc"),
    ("Decadent three-layer chocolate cake with fudge frosting.", "des3Desc"),
    ("Vanilla / Chocolate / Strawberry / Green Tea / Coffee", "des4Desc"),
    ("Silky smooth chocolate pudding topped with cream.", "des5Desc"),
    ("Light and refreshing strawberry pudding with fresh fruit chunks.", "des6Desc"),
]
for desc, tag in dessert_descs:
    content = re.sub(
        f'<p class="food-item-desc">{re.escape(desc)}</p>',
        f'<p class="food-item-desc" data-i18n="{tag}">{desc}</p>',
        content
    )

# Also fix the section titles
content = re.sub(r'<h2 class="menu-section-title">Bread</h2>', r'<h2 class="menu-section-title" data-i18n="menuBread">Bread</h2>', content)


# 3. Add to ID translations
id_translations = """        menuBread: "Roti & Pastri",
        bread1Name: "Butter Croissant",
        bread1Desc: "Croissant Prancis klasik yang renyah, berlapis, dan kaya rasa mentega.",
        bread2Name: "Almond Croissant",
        bread2Desc: "Croissant panggang ganda dengan isian frangipane almond manis.",
        bread3Name: "Pain au Chocolat",
        bread3Desc: "Adonan berlapis mentega yang membungkus lelehan cokelat hitam pekat.",
        bread4Name: "Cinnamon Roll",
        bread4Desc: "Adonan lembut beraroma kayu manis dengan topping krim keju.",
        bread5Name: "Classic Bagel",
        bread5Desc: "Bagel panggang disajikan dengan pilihan krim keju plain atau herb.",
        bread6Name: "Sourdough Toast",
        bread6Desc: "Roti sourdough panggang tebal disajikan dengan mentega artisanal dan selai buah.",
        des1Name: "Chocolate Waffle",
        des1Desc: "Wafel Belgia hangat dengan lumuran cokelat hitam leleh.",
        des2Name: "Strawberry Waffle",
        des2Desc: "Wafel Belgia dengan topping stroberi segar dan krim kocok.",
        des3Name: "Chocolate Cake",
        des3Desc: "Kue cokelat dekaden tiga lapis dengan frosting fudge pekat.",
        des4Name: "Es Krim Gelato",
        des4Desc: "Vanila / Cokelat / Stroberi / Teh Hijau / Kopi",
        des5Name: "Chocolate Pudding",
        des5Desc: "Puding cokelat lembut yang disajikan dengan krim.",
        des6Name: "Strawberry Pudding",
        des6Desc: "Puding stroberi yang menyegarkan dengan potongan buah asli.","""

content = re.sub(
    r'(navHome:\s*"Home",)',
    r'\1\n' + id_translations,
    content,
    count=1
)

# 4. Add to EN translations
en_translations = """        menuBread: "Bread & Pastries",
        bread1Name: "Butter Croissant",
        bread1Desc: "Classic flaky, buttery, and authentic French croissant.",
        bread2Name: "Almond Croissant",
        bread2Desc: "Twice-baked croissant filled with sweet almond frangipane.",
        bread3Name: "Pain au Chocolat",
        bread3Desc: "Buttery dough wrapped around rich, dark chocolate centers.",
        bread4Name: "Cinnamon Roll",
        bread4Desc: "Soft, fluffy dough baked with cinnamon and topped with cream cheese glaze.",
        bread5Name: "Classic Bagel",
        bread5Desc: "Toasted bagel served with your choice of plain or herb cream cheese.",
        bread6Name: "Sourdough Toast",
        bread6Desc: "Thick-cut sourdough bread served with artisanal butter and fruit jam.",
        des1Name: "Chocolate Waffle",
        des1Desc: "Warm Belgian waffle drizzled with melted dark chocolate.",
        des2Name: "Strawberry Waffle",
        des2Desc: "Belgian waffle topped with fresh strawberries and whipped cream.",
        des3Name: "Chocolate Cake",
        des3Desc: "Decadent three-layer chocolate cake with fudge frosting.",
        des4Name: "Gelato Ice Cream",
        des4Desc: "Vanilla / Chocolate / Strawberry / Green Tea / Coffee",
        des5Name: "Chocolate Pudding",
        des5Desc: "Silky smooth chocolate pudding topped with cream.",
        des6Name: "Strawberry Pudding",
        des6Desc: "Light and refreshing strawberry pudding with fresh fruit chunks.","""

content = re.sub(
    r'(navHome:\s*"Home",)',
    r'\1\n' + en_translations,
    content
)

with open('Index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translation fixed!")
