import pandas as pd

df = pd.read_csv('cleaned_data/hr_employee_cleaned.csv')

# Ensure new columns exist
if 'distance_from_home' not in df.columns:
    df['distance_from_home'] = None
if 'transport_mode' not in df.columns:
    df['transport_mode'] = None

# 1. Nalita Meele
df.loc[df['name'] == 'Nalita Meele', ['distance_from_home', 'transport_mode']] = [13, 'รถยนต์']

# 2. Anucha Taowkaen
df.loc[df['name'] == 'Anucha Taowkaen', ['distance_from_home', 'transport_mode']] = [15, 'รถยนต์']

# 3. Prida Sodsrithong (2543 = 2000)
df.loc[df['name'] == 'Prida Sodsrithong', ['birthday', 'distance_from_home', 'transport_mode']] = ['2000-06-11', 5, 'รถมอเตอร์ไซค์']

# 4. Thanchanok Buathong
df.loc[df['name'] == 'Thanchanok Buathong', ['distance_from_home', 'transport_mode']] = [3, 'มีคนรับ-ส่ง']

# 5. Chanannaphat Kosithirantrakul
df.loc[df['name'] == 'Chanannaphat Kosithirantrakul', ['distance_from_home', 'transport_mode']] = [18, 'รถมอเตอร์ไซค์']

# 6. Pohnchita Khaikaew
df.loc[df['name'] == 'Pohnchita Khaikaew', ['distance_from_home', 'transport_mode']] = [15, 'มีคนรับ-ส่ง']

# 7. Sarunyu Kaosaoy (2541 = 1998)
df.loc[df['name'] == 'Sarunyu Kaosaoy', ['birthday', 'distance_from_home', 'transport_mode']] = ['1998-09-17', 10, 'รถมอเตอร์ไซค์']

# Save back
df.to_csv('cleaned_data/hr_employee_cleaned.csv', index=False, encoding='utf-8-sig')

# Display
updated_names = [
    'Nalita Meele', 'Anucha Taowkaen', 'Prida Sodsrithong', 
    'Thanchanok Buathong', 'Chanannaphat Kosithirantrakul', 
    'Pohnchita Khaikaew', 'Sarunyu Kaosaoy'
]
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)
print("--- Updated Records ---")
print(df[df['name'].isin(updated_names)][['name', 'birthday', 'distance_from_home', 'transport_mode']].to_string(index=False))
