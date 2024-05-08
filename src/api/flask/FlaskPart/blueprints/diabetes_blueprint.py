from flask import Blueprint, jsonify, request
import joblib
import numpy as np

diabetes_blueprint = Blueprint('diabetes', __name__)

try:
    model = joblib.load('../models/Diabetes_Trained_Model.pkl')
except FileNotFoundError:
    print("Model file not found. Please check the file path.")
    model = None
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    model = None

@diabetes_blueprint.route('/diabetes_predict', methods=['POST'])
def diabetes_predict():
    if model is None:
        return jsonify({'error': 'Model not available'}), 500
    
    try:
        data = request.json
        print("data")
        print(data)
        data = request.json
        
        features = np.array([data['HbA1c'], data['Chol'], data['TG'],data['BMI']]).reshape(1, -1)
        
        prediction = model.predict(features)
        
        return jsonify({'prediction': prediction.tolist()}), 200
    except KeyError:
        return jsonify({'error': 'Required fields are missing in the input data'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500
