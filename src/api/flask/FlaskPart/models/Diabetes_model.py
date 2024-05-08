import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier 
import joblib

# Load your dataset (replace 'your_dataset.csv' with your actual file name)
df = pd.read_csv(r'C:\Users\ASUS\StudioProjects\disease prediction Back_End\FlaskPart\assets\dataset\diabetes (no p,n,y version).csv')

# Selecting only the specified features
selected_features = ['HbA1c', 'Chol', 'TG','BMI']
X = df[selected_features]

# Assuming 'y' is your target variable
y = df['CLASS']

# Split the data into training and testing sets
#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest model using only the selected features
model = DecisionTreeClassifier()
model.fit(X, y)

# Save the trained model to a file
joblib.dump(model, 'diabetes_trained_model.pkl')
