import csv, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

EMP_PATH = r'c:\Users\Lenovo\Desktop\page\cleaned_data\hr_employee_cleaned.csv'

MALE = [
    'Praves Tasing', 'Anucha Taowkaen', 'Aphichat Saengpheng',
    'Nuttapon Comsoi', 'Pheeraphon Phothakhan', 'Prida Sodsrithong',
    'Suphavit Kaewwong', 'Sarunyu Kaosaoy', 'Autapon Nuttayotin',
    'Chidsanupong Karaked', 'Pakin Intalang',
]

FEMALE = [
    'Nalita Meele', 'Thanchanok Buathong', 'Chanannaphat Kosithirantrakul',
    'Jindaporn prombud', 'Jiraporn Daengta', 'Juthatip Mahanan',
    'Narumol Maneechote', 'Pohnchita Khaikaew', 'Kulisara Meesuk',
]

rows = []
with open(EMP_PATH, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    fieldnames = list(reader.fieldnames)
    for r in reader:
        rows.append(r)

print("=" * 75)
print("  Gender Update")
print("=" * 75)
print(f"\n{'ID':>3} | {'Name':<35} | {'Old':>8} | {'New':>8}")
print("-" * 65)

updated = 0
for r in rows:
    name = r['name']
    old = r.get('gender', 'unknown')

    if name in MALE:
        r['gender'] = 'male'
        updated += 1
    elif name in FEMALE:
        r['gender'] = 'female'
        updated += 1
    # else: keep as is (unknown)

    changed = " <<<" if old != r['gender'] else ""
    print(f"{r['id']:>3} | {name:<35} | {old:>8} | {r['gender']:>8}{changed}")

with open(EMP_PATH, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(rows)

# Summary
males = sum(1 for r in rows if r['gender'] == 'male')
females = sum(1 for r in rows if r['gender'] == 'female')
unknown = sum(1 for r in rows if r['gender'] == 'unknown')

print(f"\n{'=' * 75}")
print(f"  Updated: {updated} | Male: {males} | Female: {females} | Unknown: {unknown}")
print(f"{'=' * 75}")
