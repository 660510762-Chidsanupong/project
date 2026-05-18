import pandas as pd
from datetime import datetime

df = pd.read_csv('cleaned_data/hr_employee_cleaned.csv')

with open('tenure_table.md', 'w', encoding='utf-8') as f:
    f.write('# ตารางสรุปอายุงานพนักงาน 20 คน\n\n')
    f.write('| ID | ชื่อพนักงาน (Name) | ตำแหน่ง (Job Title) | วันเริ่มงาน (Start Date) | อายุงาน (Tenure) |\n')
    f.write('|:---:|:---|:---|:---:|:---|\n')
    
    df['tenure_months'] = df['tenure_months'].fillna(0)
    df = df.sort_values('tenure_months', ascending=False)
    
    for i, r in df.iterrows():
        start_date = r['first_contract_date']
        if pd.isna(start_date):
            start_date_str = "-"
            tenure_str = "ผู้บริหาร (ไม่ระบุ)"
        else:
            start_date_str = str(start_date).split(' ')[0]
            months = int(r['tenure_months'])
            years = months // 12
            rem_months = months % 12
            
            if years > 0 and rem_months > 0:
                tenure_str = f"{years} ปี {rem_months} เดือน"
            elif years > 0:
                tenure_str = f"{years} ปี"
            else:
                tenure_str = f"{rem_months} เดือน"
                
        f.write(f"| **{r['id']}** | {r['name']} | {r['job_title']} | {start_date_str} | {tenure_str} |\n")
