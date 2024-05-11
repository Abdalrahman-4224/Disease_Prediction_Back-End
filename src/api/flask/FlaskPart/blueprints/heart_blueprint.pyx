from flask import Blueprint, jsonify, request
import joblib
import numpy as np

heart_blueprint = Blueprint('heart', __name__)

try:
    model = joblib.load('../models/Heart_Trained_Model.pkl')
except FileNotFoundError:
    print("Model file not found. Please check the file path.")
    model = None
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    model = None

@heart_blueprint.route('/heart_predict', methods=['POST'])
def heart_predict():
    if model is None:
        return jsonify({'error': 'Model not available'}), 500
    
    try:
        data = request.json
        
        features = np.array([data['cp'], data['trestbps'], data['chol'], data['restecg'], 
                             data['thalach'], data['exang'], data['oldpeak'], data['slope'], 
                             data['ca'], data['thal']]).reshape(1, -1)
        
        prediction = model.predict(features)
        
        return jsonify({'prediction': prediction.tolist()}), 200
    except KeyError:
        return jsonify({'error': 'Required fields are missing in the input data'}), 400
    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'}), 500
