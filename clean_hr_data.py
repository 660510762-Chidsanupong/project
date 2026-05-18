"""
Data Cleaning Script for HR Attrition Prediction Project
=========================================================
ดึงข้อมูลจาก dump.sql → ทำความสะอาด → Export เป็น CSV

ตารางที่ดึง (11 ตาราง):
  hr_employee, hr_attendance, hr_leave, hr_overtime,
  hr_contract, hr_department, hr_job, hr_leave_type,
  hr_attendance_overtime, hr_departure_reason, hr_contract_type
"""

import re
import csv
import os
import sys
import io
from datetime import datetime, timedelta
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ============================================================
# CONFIG
# ============================================================
DUMP_PATH = r"c:\Users\Lenovo\Desktop\page\dump.sql"
OUTPUT_DIR = r"c:\Users\Lenovo\Desktop\page\cleaned_data"

# ตารางที่ต้องการดึง
TARGET_TABLES = [
    'hr_employee', 'hr_attendance', 'hr_leave', 'hr_overtime',
    'hr_contract', 'hr_department', 'hr_job', 'hr_leave_type',
    'hr_attendance_overtime', 'hr_departure_reason', 'hr_contract_type',
]

# ============================================================
# STEP 1: Extract raw data from dump.sql
# ============================================================
def extract_tables(dump_path, target_tables):
    """อ่าน dump.sql แล้วดึงเฉพาะตารางที่ต้องการ"""
    tables = {}
    current_table = None
    current_columns = None
    current_rows = None

    print(f"[STEP 1] Extracting {len(target_tables)} tables from dump.sql ...")

    with open(dump_path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            if line.startswith('COPY public.'):
                match = re.match(r'COPY public\.(\S+)\s+\((.+?)\)\s+FROM stdin;', line)
                if match:
                    tname = match.group(1)
                    if tname in target_tables:
                        current_table = tname
                        current_columns = [c.strip().strip('"') for c in match.group(2).split(',')]
                        current_rows = []
                    else:
                        current_table = None
                continue

            if line.strip() == '\\.' and current_table:
                tables[current_table] = {
                    'columns': current_columns,
                    'rows': current_rows
                }
                print(f"  ✓ {current_table}: {len(current_rows)} rows, {len(current_columns)} cols")
                current_table = None
                continue

            if current_table and current_rows is not None:
                row = line.rstrip('\n').split('\t')
                # แปลง \N เป็น None
                row = [None if v == '\\N' else v for v in row]
                current_rows.append(row)

    return tables


# ============================================================
# STEP 2: Data Cleaning Functions
# ============================================================

def clean_hr_employee(data):
    """ทำความสะอาด hr_employee"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    # คอลัมน์สำคัญที่ต้อง keep
    keep_cols = [
        'id', 'name', 'job_title', 'department_id', 'job_id',
        'work_email', 'work_phone', 'mobile_phone',
        'gender', 'marital', 'birthday', 'certificate',
        'employee_type', 'active', 'departure_date', 'departure_reason_id',
        'first_contract_date', 'contract_id', 'children',
        'country_id', 'study_field', 'study_school',
        'create_date', 'write_date',
        'last_check_in', 'last_check_out',
        'probation_start_date', 'probation_end_date', 'probation_result',
        'hourly_cost', 'is_payroll_active', 'provident_fund_rate',
    ]

    col_idx = {c: i for i, c in enumerate(cols)}
    available_cols = [c for c in keep_cols if c in col_idx]

    for row in rows:
        if len(row) != len(cols):
            continue

        new_row = {}
        for c in available_cols:
            val = row[col_idx[c]]
            new_row[c] = val

        # --- CLEANING ---

        # 1. active: แปลงเป็น boolean
        if 'active' in new_row:
            new_row['active'] = 1 if new_row['active'] == 't' else 0

        # 2. gender: ถ้า null → 'unknown'
        if 'gender' in new_row and new_row['gender'] is None:
            new_row['gender'] = 'unknown'

        # 3. birthday: ตรวจสอบรูปแบบวันที่
        if 'birthday' in new_row and new_row['birthday']:
            try:
                datetime.strptime(new_row['birthday'], '%Y-%m-%d')
            except ValueError:
                new_row['birthday'] = None

        # 4. employee_type: standardize
        if 'employee_type' in new_row:
            etype = new_row['employee_type']
            if etype in ('student', 'intern'):
                new_row['employee_type'] = 'intern'

        # 5. คำนวณอายุงาน (เดือน)
        if 'first_contract_date' in new_row and new_row['first_contract_date']:
            try:
                start = datetime.strptime(new_row['first_contract_date'], '%Y-%m-%d')
                end_date = datetime.now()
                if new_row.get('departure_date'):
                    try:
                        end_date = datetime.strptime(new_row['departure_date'], '%Y-%m-%d')
                    except ValueError:
                        pass
                tenure = (end_date - start).days / 30.44
                new_row['tenure_months'] = round(tenure, 1)
            except ValueError:
                new_row['tenure_months'] = None
        else:
            new_row['tenure_months'] = None

        # 6. is_departed: สร้าง target variable
        new_row['is_departed'] = 1 if new_row.get('departure_date') else 0

        # 7. marital: standardize
        if 'marital' in new_row and new_row['marital'] is None:
            new_row['marital'] = 'unknown'

        # 8. children: null → 0
        if 'children' in new_row:
            try:
                new_row['children'] = int(new_row['children']) if new_row['children'] else 0
            except (ValueError, TypeError):
                new_row['children'] = 0

        # 9. hourly_cost: แปลงเป็น float
        if 'hourly_cost' in new_row:
            try:
                new_row['hourly_cost'] = float(new_row['hourly_cost']) if new_row['hourly_cost'] else 0.0
            except (ValueError, TypeError):
                new_row['hourly_cost'] = 0.0

        # 10. probation: สร้าง flag
        if 'probation_result' in new_row:
            new_row['probation_passed'] = 1 if new_row['probation_result'] == 'passed' else 0

        cleaned.append(new_row)

    # เพิ่ม tenure_months ลงใน available_cols
    output_cols = available_cols + ['tenure_months', 'is_departed', 'probation_passed']
    return output_cols, cleaned


def clean_hr_attendance(data):
    """ทำความสะอาด hr_attendance"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    keep_cols = [
        'id', 'employee_id', 'overtime_status', 'in_mode',
        'check_in', 'check_out', 'worked_hours', 'overtime_hours',
        'validated_overtime_hours', 'expected_hours',
        'late_minutes', 'deduction_amount', 'display_late_minutes'
    ]

    col_idx = {c: i for i, c in enumerate(cols)}
    available_cols = [c for c in keep_cols if c in col_idx]

    anomaly_count = 0

    for row in rows:
        if len(row) != len(cols):
            continue

        new_row = {}
        for c in available_cols:
            new_row[c] = row[col_idx[c]]

        # --- CLEANING ---

        # 1. worked_hours: แปลง float, ตรวจค่าผิดปกติ
        try:
            wh = float(new_row.get('worked_hours', 0) or 0)
        except (ValueError, TypeError):
            wh = 0.0
        
        # ค่าผิดปกติ: ทำงาน 0 หรือมากกว่า 24 ชม.
        if wh < 0:
            wh = 0.0
            anomaly_count += 1
        elif wh > 24:
            wh = 24.0
            anomaly_count += 1
        new_row['worked_hours'] = round(wh, 4)

        # 2. overtime_hours: แปลง float
        try:
            ot = float(new_row.get('overtime_hours', 0) or 0)
        except (ValueError, TypeError):
            ot = 0.0
        new_row['overtime_hours'] = round(ot, 4)

        # 3. late_minutes: แปลง int
        try:
            new_row['late_minutes'] = int(float(new_row.get('late_minutes', 0) or 0))
        except (ValueError, TypeError):
            new_row['late_minutes'] = 0

        # 4. is_late flag
        new_row['is_late'] = 1 if new_row['late_minutes'] > 0 else 0

        # 5. check_out: ถ้า null → flag
        new_row['missing_checkout'] = 1 if new_row.get('check_out') is None else 0

        # 6. ดึงวันที่จาก check_in
        if new_row.get('check_in'):
            try:
                ci = datetime.strptime(new_row['check_in'][:19], '%Y-%m-%d %H:%M:%S')
                new_row['check_date'] = ci.strftime('%Y-%m-%d')
                new_row['check_in_hour'] = ci.hour + ci.minute / 60.0
                new_row['day_of_week'] = ci.weekday()  # 0=Mon, 6=Sun
            except ValueError:
                new_row['check_date'] = None
                new_row['check_in_hour'] = None
                new_row['day_of_week'] = None

        # 7. expected_hours: แปลง float
        try:
            new_row['expected_hours'] = float(new_row.get('expected_hours', 8) or 8)
        except (ValueError, TypeError):
            new_row['expected_hours'] = 8.0

        cleaned.append(new_row)

    output_cols = available_cols + ['is_late', 'missing_checkout', 'check_date', 'check_in_hour', 'day_of_week']

    if anomaly_count > 0:
        print(f"    ⚠ {anomaly_count} anomalies found in worked_hours (capped to 0-24)")

    return output_cols, cleaned


def clean_hr_leave(data):
    """ทำความสะอาด hr_leave"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    keep_cols = [
        'id', 'employee_id', 'holiday_status_id', 'department_id',
        'state', 'request_date_from', 'request_date_to',
        'number_of_days', 'number_of_hours',
    ]

    col_idx = {c: i for i, c in enumerate(cols)}
    available_cols = [c for c in keep_cols if c in col_idx]

    for row in rows:
        if len(row) != len(cols):
            continue

        new_row = {}
        for c in available_cols:
            new_row[c] = row[col_idx[c]]

        # --- CLEANING ---

        # 1. number_of_days: float
        try:
            new_row['number_of_days'] = float(new_row.get('number_of_days', 0) or 0)
        except (ValueError, TypeError):
            new_row['number_of_days'] = 0.0

        # 2. number_of_hours: float
        try:
            new_row['number_of_hours'] = float(new_row.get('number_of_hours', 0) or 0)
        except (ValueError, TypeError):
            new_row['number_of_hours'] = 0.0

        # 3. is_approved flag
        new_row['is_approved'] = 1 if new_row.get('state') in ('validate', 'validate1') else 0

        cleaned.append(new_row)

    output_cols = available_cols + ['is_approved']
    return output_cols, cleaned


def clean_hr_overtime(data):
    """ทำความสะอาด hr_overtime"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    keep_cols = [
        'id', 'employee_id', 'state', 'type', 'duration_type',
        'date_from', 'date_to', 'days_no_tmp',
        'ot_rate', 'day_type',
    ]

    col_idx = {c: i for i, c in enumerate(cols)}
    available_cols = [c for c in keep_cols if c in col_idx]

    for row in rows:
        if len(row) != len(cols):
            continue

        new_row = {}
        for c in available_cols:
            new_row[c] = row[col_idx[c]]

        # days_no_tmp: float
        try:
            new_row['days_no_tmp'] = float(new_row.get('days_no_tmp', 0) or 0)
        except (ValueError, TypeError):
            new_row['days_no_tmp'] = 0.0

        # ot_rate: float
        try:
            new_row['ot_rate'] = float(new_row.get('ot_rate', 0) or 0)
        except (ValueError, TypeError):
            new_row['ot_rate'] = 0.0

        # is_approved
        new_row['is_approved'] = 1 if new_row.get('state') in ('validate', 'approved') else 0

        cleaned.append(new_row)

    output_cols = available_cols + ['is_approved']
    return output_cols, cleaned


def clean_hr_contract(data):
    """ทำความสะอาด hr_contract"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    keep_cols = [
        'id', 'employee_id', 'department_id', 'job_id',
        'name', 'state', 'date_start', 'date_end',
        'wage', 'active',
        'hra', 'travel_allowance', 'da', 'meal_allowance',
        'medical_allowance', 'other_allowance', 'position_allowance',
        'over_hour', 'over_day', 'wage_type', 'schedule_pay',
    ]

    col_idx = {c: i for i, c in enumerate(cols)}
    available_cols = [c for c in keep_cols if c in col_idx]

    for row in rows:
        if len(row) != len(cols):
            continue

        new_row = {}
        for c in available_cols:
            new_row[c] = row[col_idx[c]]

        # --- CLEANING ---

        # 1. wage: float
        try:
            new_row['wage'] = float(new_row.get('wage', 0) or 0)
        except (ValueError, TypeError):
            new_row['wage'] = 0.0

        # 2. allowances: แปลง float, null → 0
        for ac in ['hra', 'travel_allowance', 'da', 'meal_allowance',
                    'medical_allowance', 'other_allowance', 'position_allowance']:
            if ac in new_row:
                try:
                    new_row[ac] = float(new_row[ac]) if new_row[ac] else 0.0
                except (ValueError, TypeError):
                    new_row[ac] = 0.0

        # 3. total_allowance: คำนวณรวม
        allowance_cols = ['hra', 'travel_allowance', 'da', 'meal_allowance',
                          'medical_allowance', 'other_allowance', 'position_allowance']
        new_row['total_allowance'] = sum(new_row.get(ac, 0) for ac in allowance_cols)

        # 4. total_compensation
        new_row['total_compensation'] = new_row['wage'] + new_row['total_allowance']

        # 5. active: boolean
        new_row['active'] = 1 if new_row.get('active') == 't' else 0

        cleaned.append(new_row)

    output_cols = available_cols + ['total_allowance', 'total_compensation']
    return output_cols, cleaned


def clean_simple_table(data, keep_cols=None):
    """ทำความสะอาดตารางง่ายๆ (department, job, leave_type, etc.)"""
    cols = data['columns']
    rows = data['rows']
    cleaned = []

    if keep_cols is None:
        available_cols = cols
    else:
        col_idx = {c: i for i, c in enumerate(cols)}
        available_cols = [c for c in keep_cols if c in col_idx]

    col_idx = {c: i for i, c in enumerate(cols)}

    for row in rows:
        if len(row) != len(cols):
            continue
        new_row = {}
        for c in available_cols:
            val = row[col_idx[c]]
            # jsonb fields: ดึงค่า en_US
            if val and val.startswith('{') and 'en_US' in val:
                try:
                    import json
                    j = json.loads(val)
                    val = j.get('en_US', j.get('th_TH', val))
                except:
                    pass
            new_row[c] = val
        cleaned.append(new_row)

    return available_cols, cleaned


# ============================================================
# STEP 3: Export to CSV
# ============================================================
def export_csv(output_dir, table_name, columns, rows):
    """Export cleaned data to CSV"""
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{table_name}_cleaned.csv")

    with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        for row in rows:
            # แปลง None เป็น empty string
            clean_row = {k: ('' if v is None else v) for k, v in row.items()}
            writer.writerow(clean_row)

    return filepath


# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 60)
    print("  HR Data Cleaning Pipeline")
    print("  สำหรับโปรเจค: วิเคราะห์ปัจจัยการลาออก")
    print("=" * 60)

    # Step 1: Extract
    raw_data = extract_tables(DUMP_PATH, TARGET_TABLES)

    if not raw_data:
        print("ERROR: No tables extracted!")
        return

    print(f"\n[STEP 2] Cleaning data ...\n")

    results = {}

    # Clean each table
    if 'hr_employee' in raw_data:
        cols, rows = clean_hr_employee(raw_data['hr_employee'])
        results['hr_employee'] = (cols, rows)
        print(f"  ✓ hr_employee: {len(rows)} rows → {len(cols)} cols (cleaned)")

    if 'hr_attendance' in raw_data:
        cols, rows = clean_hr_attendance(raw_data['hr_attendance'])
        results['hr_attendance'] = (cols, rows)
        print(f"  ✓ hr_attendance: {len(rows)} rows → {len(cols)} cols (cleaned)")

    if 'hr_leave' in raw_data:
        cols, rows = clean_hr_leave(raw_data['hr_leave'])
        results['hr_leave'] = (cols, rows)
        print(f"  ✓ hr_leave: {len(rows)} rows → {len(cols)} cols (cleaned)")

    if 'hr_overtime' in raw_data:
        cols, rows = clean_hr_overtime(raw_data['hr_overtime'])
        results['hr_overtime'] = (cols, rows)
        print(f"  ✓ hr_overtime: {len(rows)} rows → {len(cols)} cols (cleaned)")

    if 'hr_contract' in raw_data:
        cols, rows = clean_hr_contract(raw_data['hr_contract'])
        results['hr_contract'] = (cols, rows)
        print(f"  ✓ hr_contract: {len(rows)} rows → {len(cols)} cols (cleaned)")

    # Simple tables
    simple_configs = {
        'hr_department': ['id', 'company_id', 'parent_id', 'manager_id', 'complete_name', 'name', 'active'],
        'hr_job': ['id', 'department_id', 'company_id', 'name', 'no_of_employee', 'active'],
        'hr_leave_type': ['id', 'name', 'active', 'create_date'],
        'hr_departure_reason': ['id', 'name', 'reason_code'],
        'hr_contract_type': ['id', 'name'],
        'hr_attendance_overtime': None,  # keep all
    }

    for tname, keep in simple_configs.items():
        if tname in raw_data:
            cols, rows = clean_simple_table(raw_data[tname], keep)
            results[tname] = (cols, rows)
            print(f"  ✓ {tname}: {len(rows)} rows → {len(cols)} cols")

    # Step 3: Export
    print(f"\n[STEP 3] Exporting to CSV → {OUTPUT_DIR}\n")

    for tname, (cols, rows) in results.items():
        filepath = export_csv(OUTPUT_DIR, tname, cols, rows)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"  ✓ {os.path.basename(filepath):<45} {len(rows):>6} rows  {size_kb:>8.1f} KB")

    # Summary
    print(f"\n{'=' * 60}")
    print(f"  DONE! {len(results)} files exported to:")
    print(f"  {OUTPUT_DIR}")
    print(f"{'=' * 60}")

    # Data Quality Summary
    print(f"\n[STEP 4] Data Quality Summary:\n")

    if 'hr_employee' in results:
        _, emp_rows = results['hr_employee']
        active = sum(1 for r in emp_rows if r.get('active') == 1)
        departed = sum(1 for r in emp_rows if r.get('is_departed') == 1)
        gender_known = sum(1 for r in emp_rows if r.get('gender') != 'unknown')
        bday_known = sum(1 for r in emp_rows if r.get('birthday'))
        print(f"  hr_employee:")
        print(f"    Total: {len(emp_rows)} | Active: {active} | Departed: {departed}")
        print(f"    Gender filled: {gender_known}/{len(emp_rows)}")
        print(f"    Birthday filled: {bday_known}/{len(emp_rows)}")
        print(f"    Tenure: computed for all with first_contract_date")

    if 'hr_attendance' in results:
        _, att_rows = results['hr_attendance']
        late_count = sum(1 for r in att_rows if r.get('is_late') == 1)
        missing_co = sum(1 for r in att_rows if r.get('missing_checkout') == 1)
        print(f"\n  hr_attendance:")
        print(f"    Total: {len(att_rows)} | Late days: {late_count} | Missing checkout: {missing_co}")

    if 'hr_leave' in results:
        _, leave_rows = results['hr_leave']
        approved = sum(1 for r in leave_rows if r.get('is_approved') == 1)
        print(f"\n  hr_leave:")
        print(f"    Total: {len(leave_rows)} | Approved: {approved}")

    if 'hr_contract' in results:
        _, con_rows = results['hr_contract']
        wages = [r['wage'] for r in con_rows if r.get('wage', 0) > 0]
        if wages:
            print(f"\n  hr_contract:")
            print(f"    Total: {len(con_rows)}")
            print(f"    Wage range: {min(wages):,.0f} - {max(wages):,.0f} THB")
            print(f"    Avg wage: {sum(wages)/len(wages):,.0f} THB")


if __name__ == '__main__':
    main()
