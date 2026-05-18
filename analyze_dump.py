import re
import json
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

dump_path = r"c:\Users\Lenovo\Desktop\page\dump.sql"

tables = {}  # table_name -> { columns, row_count, null_counts, empty_counts, sample_issues }
current_table = None
current_columns = None
current_data = None

print("Scanning dump.sql ...")

with open(dump_path, 'r', encoding='utf-8', errors='replace') as f:
    for line_no, line in enumerate(f, 1):
        # Detect COPY statement
        if line.startswith('COPY public.'):
            match = re.match(r'COPY public\.(\S+)\s+\((.+?)\)\s+FROM stdin;', line)
            if match:
                current_table = match.group(1)
                current_columns = [c.strip().strip('"') for c in match.group(2).split(',')]
                current_data = {
                    'columns': current_columns,
                    'col_count': len(current_columns),
                    'row_count': 0,
                    'null_counts': {c: 0 for c in current_columns},
                    'empty_counts': {c: 0 for c in current_columns},
                    'col_mismatch_rows': 0,
                    'issues': [],
                    'start_line': line_no,
                }
                continue

        # End of COPY data
        if line.strip() == '\\.' and current_table:
            tables[current_table] = current_data
            current_table = None
            current_columns = None
            current_data = None
            continue

        # Process data rows
        if current_table and current_data:
            row = line.rstrip('\n').split('\t')
            current_data['row_count'] += 1

            if len(row) != current_data['col_count']:
                current_data['col_mismatch_rows'] += 1
                if len(current_data['issues']) < 3:
                    current_data['issues'].append(
                        f"Row {current_data['row_count']}: expected {current_data['col_count']} cols, got {len(row)}"
                    )
                continue

            for i, val in enumerate(row):
                col = current_columns[i]
                if val == '\\N':
                    current_data['null_counts'][col] += 1
                elif val.strip() == '':
                    current_data['empty_counts'][col] += 1

        if line_no % 50000 == 0:
            print(f"  ... processed {line_no:,} lines")

print(f"Done! Processed {line_no:,} lines total.\n")

# Analysis
empty_tables = []
data_tables = []
tables_with_issues = []
tables_with_high_nulls = []

for tname, tdata in sorted(tables.items()):
    if tdata['row_count'] == 0:
        empty_tables.append(tname)
    else:
        data_tables.append((tname, tdata))
        
        if tdata['col_mismatch_rows'] > 0:
            tables_with_issues.append((tname, tdata))

        # Check for high null rates
        for col, null_count in tdata['null_counts'].items():
            if tdata['row_count'] > 0:
                null_pct = null_count / tdata['row_count'] * 100
                if null_pct > 50 and null_count > 0:
                    tables_with_high_nulls.append((tname, col, null_count, tdata['row_count'], null_pct))

# Output results
print("=" * 80)
print(f"TOTAL TABLES: {len(tables)}")
print(f"TABLES WITH DATA: {len(data_tables)}")
print(f"EMPTY TABLES: {len(empty_tables)}")
print(f"TABLES WITH COLUMN MISMATCHES: {len(tables_with_issues)}")
print("=" * 80)

# Tables with data - summary
print(f"\n{'='*80}")
print("TABLES WITH DATA (sorted by row count)")
print(f"{'='*80}")
print(f"{'Table':<55} {'Rows':>8} {'Cols':>5} {'Nulls':>8} {'Empty':>8}")
print("-" * 88)
for tname, tdata in sorted(data_tables, key=lambda x: x[1]['row_count'], reverse=True):
    total_nulls = sum(tdata['null_counts'].values())
    total_empty = sum(tdata['empty_counts'].values())
    print(f"{tname:<55} {tdata['row_count']:>8} {tdata['col_count']:>5} {total_nulls:>8} {total_empty:>8}")

# Column mismatch issues
if tables_with_issues:
    print(f"\n{'='*80}")
    print("TABLES WITH COLUMN MISMATCH ISSUES")
    print(f"{'='*80}")
    for tname, tdata in tables_with_issues:
        print(f"\n  {tname}: {tdata['col_mismatch_rows']} rows with wrong column count")
        for issue in tdata['issues']:
            print(f"    - {issue}")

# High null columns (only for HR tables)
print(f"\n{'='*80}")
print("HR TABLES: COLUMNS WITH >50% NULL VALUES")
print(f"{'='*80}")
print(f"{'Table':<35} {'Column':<30} {'Nulls':>6} {'Total':>6} {'Null%':>7}")
print("-" * 86)
for tname, col, null_count, total, pct in sorted(tables_with_high_nulls, key=lambda x: x[4], reverse=True):
    if tname.startswith('hr_') or tname.startswith('payroll_'):
        print(f"{tname:<35} {col:<30} {null_count:>6} {total:>6} {pct:>6.1f}%")

# Empty tables list
print(f"\n{'='*80}")
print(f"EMPTY TABLES ({len(empty_tables)} tables)")
print(f"{'='*80}")
for i, t in enumerate(empty_tables):
    print(f"  {i+1:>3}. {t}")

# Detailed HR table analysis
print(f"\n{'='*80}")
print("DETAILED HR TABLE NULL/EMPTY ANALYSIS")
print(f"{'='*80}")
hr_tables = ['hr_employee', 'hr_attendance', 'hr_contract', 'hr_department', 'hr_leave', 'hr_overtime', 'hr_payslip', 'hr_job']
for tname in hr_tables:
    if tname in tables:
        tdata = tables[tname]
        print(f"\n--- {tname} ({tdata['row_count']} rows, {tdata['col_count']} columns) ---")
        print(f"  {'Column':<35} {'Nulls':>6} {'Empty':>6} {'Filled':>6} {'Null%':>7}")
        print(f"  {'-'*62}")
        for col in tdata['columns']:
            nc = tdata['null_counts'][col]
            ec = tdata['empty_counts'][col]
            filled = tdata['row_count'] - nc - ec
            pct = nc / tdata['row_count'] * 100 if tdata['row_count'] > 0 else 0
            flag = " ⚠️" if pct > 50 else (" ⚡" if pct > 0 and pct <= 50 else " ✅")
            print(f"  {col:<35} {nc:>6} {ec:>6} {filled:>6} {pct:>6.1f}%{flag}")
