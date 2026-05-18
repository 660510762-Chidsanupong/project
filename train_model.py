import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

def main():
    print("===========================================")
    print("  PredictaHR: Model Training Started")
    print("===========================================\n")
    
    print("[1] Loading data...")
    try:
        df = pd.read_csv('Cleaned_HR_Data_10000.csv')
    except Exception as e:
        print(f"Error loading file: {e}")
        return

    # Check class distribution
    print(f"Dataset Shape: {df.shape}")
    print("Attrition Distribution:")
    print(df['Attrition'].value_counts(normalize=True) * 100)
    
    # Features and Target
    X = df.drop('Attrition', axis=1)
    y = df['Attrition']

    print("\n[2] Splitting data (80% Train, 20% Test)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("\n[3] Training Random Forest Model...")
    # class_weight='balanced' helps with the imbalanced attrition dataset
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced', max_depth=10)
    rf_model.fit(X_train, y_train)

    print("\n[4] Model Evaluation on Test Data:")
    y_pred = rf_model.predict(X_test)
    
    print("\n--- Confusion Matrix ---")
    print(confusion_matrix(y_test, y_pred))
    
    print("\n--- Classification Report ---")
    print(classification_report(y_test, y_pred))

    print("\n[5] Extracting Feature Importances (Top 10):")
    importances = rf_model.feature_importances_
    feature_imp = pd.DataFrame({'Feature': X.columns, 'Importance': importances})
    feature_imp = feature_imp.sort_values(by='Importance', ascending=False).head(10)
    
    for idx, row in feature_imp.iterrows():
        print(f"- {row['Feature']}: {row['Importance']:.4f}")
        
    print("\nTraining completed successfully! Model is ready for integration.")

if __name__ == '__main__':
    main()
