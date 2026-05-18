import pandas as pd
df = pd.read_csv('cleaned_data/hr_employee_cleaned.csv')
with open('gender_table.md', 'w', encoding='utf-8') as f:
    f.write('# ตารางสรุปเพศของพนักงาน 20 คน\n\n')
    f.write('| ID | ชื่อพนักงาน (Name) | ตำแหน่ง (Job Title) | เพศ (Gender) |\n')
    f.write('|:---:|:---|:---|:---|\n')
    for i, r in df.iterrows():
        gender_th = 'ผู้ชาย (Male)' if r['gender'] == 'male' else 'ผู้หญิง (Female)'
        f.write(f"| **{r['id']}** | {r['name']} | {r['job_title']} | {gender_th} |\n")
