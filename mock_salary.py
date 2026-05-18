"""
Update Job Titles + Re-mock Salary
===================================
อัพเดทตำแหน่งตามที่ user กำหนดใหม่ แล้ว mock เงินเดือนใหม่
"""
import csv, sys, io, random
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
random.seed(42)

EMP_PATH = r'c:\Users\Lenovo\Desktop\page\cleaned_data\hr_employee_cleaned.csv'
CON_PATH = r'c:\Users\Lenovo\Desktop\page\cleaned_data\hr_contract_cleaned.csv'

# ============================================================
# ตำแหน่งใหม่ตามที่ user กำหนด (key = employee name)
# ============================================================
JOB_TITLE_UPDATE = {
    # === Programmer Team ===
    'Nuttapon Comsoi':      'Junior Programmer',
    'Prida Sodsrithong':    'Junior Programmer',
    'Suphavit Kaewwong':    'Junior Programmer',
    'Thanchanok Buathong':  'Junior Programmer',

    'Anucha Taowkaen':      'Senior Programmer',
    'Aphichat Saengpheng':  'Senior Programmer',
    'Nalita Meele':         'Senior Programmer',
    'admin':                'Senior Programmer',

    'Nuttakorn Buajarern':  'Programmer',
    'Siwakorn Maneesak':    'Programmer',

    'Pheeraphon Phothakhan': 'Hybrid Programmer',

    # === Management Team ===
    'Chanannaphat Kosithirantrakul': 'System Analyst',
    'Jiraporn Daengta':              'System Analyst',

    'Jindaporn prombud':    'Tester',
    'Sarunyu Kaosaoy':      'Tester',

    'Narumol Maneechote':   'Project Manager',
    'Juthatip Mahanan':     'Project Manager',

    'Pohnchita Khaikaew':   'UX/UI Design',

    'Praves Tasing':        'Managing Director',

    # === Outsource Team ===
    'Nattawat Srijindawan':     'Outsource',
    'Ploytawan Pinmas':         'Outsource',
    'Krisana Wataninyanon':     'Outsource',
    'Santipart Manowong':       'Outsource',
    'Sorrawit Sompan':          'Outsource',
    'Kanit Jungsakulrujirek':   'Outsource',
    'Padungrak Apichai':        'Outsource',
    'Taiwit pimsen':            'Outsource',
}

# ============================================================
# เงินเดือนตามตำแหน่ง
# ============================================================
SALARY_RANGES = {
    # Intern — ไม่ใส่เงินเดือน
    'Intern Programmer':       0,
    'Intern Business Analyst': 0,

    # Junior: 15,000 - 20,000
    'Junior Programmer':       (15000, 20000),

    # System Analyst: 35,000 - 40,000 (เพิ่มขึ้น 20,000)
    'System Analyst':          (35000, 40000),

    # Tester: 15,000 - 22,000
    'Tester':                  (15000, 22000),

    # Outsource: 18,000 - 25,000
    'Outsource':               (18000, 25000),

    # UX/UI Design: 20,000 - 30,000
    'UX/UI Design':            (20000, 30000),

    # Programmer: 25,000 - 35,000
    'Programmer':              (25000, 35000),

    # Hybrid Programmer: 35,000 - 45,000
    'Hybrid Programmer':       (35000, 45000),

    # Project Manager: 50,000 - 65,000
    'Project Manager':         (50000, 65000),

    # Senior Programmer: 80,000 - 90,000 (ปรับตามคำขอ)
    'Senior Programmer':       (80000, 90000),

    # Managing Director (CEO): 100,000 - 150,000
    'Managing Director':       (100000, 150000),
}


def get_salary(job_title):
    val = SALARY_RANGES.get(job_title)
    if val is None:
        return 15000
    if isinstance(val, tuple):
        return random.randint(val[0] // 1000, val[1] // 1000) * 1000
    return val


def main():
    # ============================================================
    # 1. อ่าน + อัพเดท hr_employee_cleaned.csv
    # ============================================================
    rows = []
    with open(EMP_PATH, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames)
        for r in reader:
            rows.append(r)

    # เพิ่ม mock_salary ถ้ายังไม่มี
    if 'mock_salary' not in fieldnames:
        fieldnames.append('mock_salary')

    print("=" * 80)
    print("  Job Title Update + Salary Mock")
    print("=" * 80)

    # header
    print(f"\n{'ID':>3} | {'Name':<35} | {'Old Title':<25} | {'New Title':<25} | {'Salary':>8}")
    print("-" * 105)

    salary_map = {}  # employee_id -> salary
    new_rows = []

    for r in rows:
        name = r['name']
        old_title = r['job_title']

        # ลบทิ้งพนักงานและตำแหน่ง Programmer, Outsource, admin
        if name in ['Nuttakorn Buajarern', 'Siwakorn Maneesak', 'admin'] or old_title in ['Programmer', 'Outsource']:
            continue

        # อัพเดทตำแหน่ง
        if name in JOB_TITLE_UPDATE:
            r['job_title'] = JOB_TITLE_UPDATE[name]

        new_title = r['job_title']
        if new_title in ['Programmer', 'Outsource']:
            continue
            
        salary = get_salary(new_title)
        r['mock_salary'] = salary
        salary_map[r['id']] = salary

        changed = " <<< CHANGED" if old_title != new_title else ""
        sal_str = f"{salary:>8,}" if salary > 0 else "       0"
        print(f"{r['id']:>3} | {name:<35} | {old_title:<25} | {new_title:<25} | {sal_str}{changed}")
        
        new_rows.append(r)

    rows = new_rows

    # บันทึก
    with open(EMP_PATH, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n  -> Saved hr_employee_cleaned.csv")

    # ============================================================
    # 2. อัพเดท hr_contract_cleaned.csv
    # ============================================================
    con_rows = []
    updated = 0
    with open(CON_PATH, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        con_fields = list(reader.fieldnames)
        for r in reader:
            con_rows.append(r)

    for r in con_rows:
        emp_id = r.get('employee_id', '')
        if emp_id in salary_map:
            new_salary = salary_map[emp_id]
            r['wage'] = new_salary

            if new_salary > 0:
                r['meal_allowance'] = 1000 if new_salary >= 15000 else 0
                r['travel_allowance'] = 1500 if new_salary >= 20000 else 500
                r['medical_allowance'] = 2000 if new_salary >= 25000 else 1000

                total_allow = sum(float(r.get(a, 0) or 0) for a in
                    ['hra','travel_allowance','da','meal_allowance',
                     'medical_allowance','other_allowance','position_allowance'])
                r['total_allowance'] = total_allow
                r['total_compensation'] = new_salary + total_allow
                r['over_hour'] = round(new_salary / 240, 2)
                r['over_day'] = round(new_salary / 30, 2)
            else:
                r['total_allowance'] = 0
                r['total_compensation'] = 0
                r['over_hour'] = 0
                r['over_day'] = 0

            updated += 1

    with open(CON_PATH, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=con_fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(con_rows)

    print(f"  -> Updated {updated} contracts")

    # ============================================================
    # Summary
    # ============================================================
    salaries = [s for s in salary_map.values() if s > 0]
    changes = sum(1 for name in JOB_TITLE_UPDATE)

    print(f"\n{'=' * 80}")
    print(f"  SUMMARY")
    print(f"{'=' * 80}")
    print(f"  Job titles updated:  {changes}")
    print(f"  With salary:         {len(salaries)} / {len(salary_map)}")
    print(f"  Interns (salary=0):  {len(salary_map) - len(salaries)}")
    print(f"  Min salary:          {min(salaries):>10,} THB")
    print(f"  Max salary:          {max(salaries):>10,} THB")
    print(f"  Avg salary:          {sum(salaries)//len(salaries):>10,} THB")

    # แยกตามตำแหน่ง
    by_title = {}
    for r in rows:
        t = r['job_title']
        s = int(r['mock_salary'])
        if t not in by_title:
            by_title[t] = []
        by_title[t].append(s)

    print(f"\n  {'Position':<25} | {'Count':>5} | {'Min':>8} | {'Max':>8} | {'Avg':>8}")
    print(f"  {'-'*65}")
    for t in sorted(by_title.keys()):
        sals = by_title[t]
        non_zero = [s for s in sals if s > 0]
        if non_zero:
            print(f"  {t:<25} | {len(sals):>5} | {min(non_zero):>8,} | {max(non_zero):>8,} | {sum(non_zero)//len(non_zero):>8,}")
        else:
            print(f"  {t:<25} | {len(sals):>5} |        0 |        0 |        0")
    print(f"{'=' * 80}")


if __name__ == '__main__':
    main()
